import os
import py_compile
import boto3

import cv2
import numpy as np
import requests
import torch
from fairseq.models.transformer import TransformerModel
from flask import Flask, request
from flask_cors import CORS
from torch import nn
from PIL import Image, ImageDraw
import datetime
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate
from langchain.chains import LLMChain
import requests


app = Flask(__name__)
CORS(app)

bifi_model = None
bifi_vocab = set()


def load_bifi_model():
    global bifi_model
    global bifi_vocab
    bifi_model = TransformerModel.from_pretrained(
        "./", checkpoint_file="bifi_model.pt", data_name_or_path="./"
    )

    # Original line below
    # bifi_model = TransformerModel.from_pretrained(
    #     "./", checkpoint_file="bifi_model.pt", data_name_or_path="./", is_gpu=True
    # ).cuda()
    with open("dict.good.txt") as f:
        for line in f:
            tokens = line.split()
            bifi_vocab.add(tokens[0])
    print("LOADED BIFI MODEL")


CLASSIFIER_NAME = "emnistbalanced_mathsymbols_custom"
MATH_SYMBOLS = ["gt", "lt", "(", ")", "[", "]", "=", "-", "+"]
CUSTOM_SYMBOLS = ["colon", "decimal", "multiply", "divide", "comma"]
CLASS_NAMES = []
if "mnist" in CLASSIFIER_NAME:
    CLASS_NAMES += [str(num) for num in range(10)]
if "emnist" in CLASSIFIER_NAME:
    CLASS_NAMES += [chr(capital) for capital in range(ord("A"), ord("Z") + 1)]
    CLASS_NAMES += [chr(lower) for lower in range(ord("a"), ord("z") + 1)]
if "balanced" in CLASSIFIER_NAME:
    CLASS_NAMES = [
        x
        for x in CLASS_NAMES
        if x not in {"c", "i", "j", "k", "l", "m", "o", "p", "s", "u", "v", "w", "x", "y", "z"}
    ]
if "symbols" in CLASSIFIER_NAME:
    CLASS_NAMES += MATH_SYMBOLS
if "custom" in CLASSIFIER_NAME:
    CLASS_NAMES += CUSTOM_SYMBOLS
N_CLASSES = len(CLASS_NAMES)
CLASS_NAMES_MAP = {
    "gt": ">",
    "lt": "<",
    "colon": ":",
    "decimal": ".",
    "multiply": "*",
    "divide": "/",
    "comma": ",",
}

client = boto3.client('textract',region_name='us-east-1',aws_access_key_id='AKIARPSPOJU3NC33CWVB',aws_secret_access_key='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')

current_date = datetime.datetime.now().date()
# Define the date after which the model should be set to "gpt-3.5-turbo"
target_date = datetime.date(2024, 6, 12)

class CNN(nn.Module):
    def __init__(self):
        super().__init__()
        self.features = nn.Sequential(
            nn.Conv2d(in_channels=1, out_channels=32, kernel_size=3),
            nn.ReLU(),
            nn.BatchNorm2d(num_features=32),
            nn.Conv2d(in_channels=32, out_channels=32, kernel_size=3),
            nn.ReLU(),
            nn.BatchNorm2d(num_features=32),
            nn.Conv2d(in_channels=32, out_channels=32, kernel_size=5, stride=1, padding="same"),
            nn.ReLU(),
            nn.BatchNorm2d(num_features=32),
            nn.Dropout(p=0.1),
            nn.Conv2d(in_channels=32, out_channels=64, kernel_size=3),
            nn.ReLU(),
            nn.BatchNorm2d(num_features=64),
            nn.Conv2d(in_channels=64, out_channels=64, kernel_size=3),
            nn.ReLU(),
            nn.BatchNorm2d(num_features=64),
            nn.Conv2d(in_channels=64, out_channels=64, kernel_size=5, stride=1, padding="same"),
            nn.ReLU(),
            nn.BatchNorm2d(num_features=64),
        )
        self.classifier = nn.Sequential(
            nn.Dropout(p=0.1),
            nn.Linear(in_features=64 * 20 * 20, out_features=128),
            nn.ReLU(),
            nn.BatchNorm1d(num_features=128),
            nn.Dropout(p=0.1),
            nn.Linear(in_features=128, out_features=N_CLASSES),
        )

    def forward(self, x):
        out = self.features(x)
        out = out.view(out.size(0), -1)
        out = self.classifier(out)
        return out


def intersects(a, b, min_area_percent=0):
    x1, y1, x2, y2 = a
    x3, y3, x4, y4 = b
    x_overlap = max(0, min(x2, x4) - max(x1, x3))
    y_overlap = max(0, min(y2, y4) - max(y1, y3))
    overlap_area = x_overlap * y_overlap
    area1 = (x2 - x1) * (y2 - y1)
    area2 = (x4 - x3) * (y4 - y3)
    return overlap_area > min_area_percent * min(area1, area2)


def merge(a, b):
    x1 = min(a[0], b[0])
    y1 = min(a[1], b[1])
    x2 = max(a[2], b[2])
    y2 = max(a[3], b[3])
    return (x1, y1, x2, y2)


def merge_all(rects, min_area_percent=0):
    hasMerge = True
    while hasMerge:
        hasMerge = False
        i = 0
        while i < len(rects) - 1:
            j = i + 1
            while j < len(rects):
                if intersects(rects[i], rects[j], min_area_percent):
                    hasMerge = True
                    rects[i] = merge(rects[i], rects[j])
                    del rects[j]
                else:
                    j += 1
            i += 1


def merge_noncontinuous(rects):
    avg_width = sum(x2 - x1 for (x1, y1, x2, y2) in rects) / len(rects)
    avg_height = sum(y2 - y1 for (x1, y1, x2, y2) in rects) / len(rects)
    avg_dst = np.sqrt(avg_width**2 + avg_height**2)

    hasMerge = True
    while hasMerge:
        hasMerge = False
        i = 0
        while i < len(rects) - 1:
            x1, y1, x2, y2 = rects[i]
            cx1 = (x1 + x2) / 2
            cy1 = (y1 + y2) / 2
            j = i + 1
            while j < len(rects):
                x3, y3, x4, y4 = rects[j]
                cx2 = (x3 + x4) / 2
                cy2 = (y3 + y4) / 2
                dst = np.sqrt((cx1 - cx2) ** 2 + (cy1 - cy2) ** 2)
                if ((y2 < y3) or (y4 < y1)) and dst < 1.0 * avg_dst:
                    hasMerge = True
                    rects[i] = merge(rects[i], rects[j])
                    del rects[j]
                else:
                    j += 1
            i += 1


def filter_rects(rects, min_area, max_area):
    filtered = []
    for x1, y1, x2, y2 in rects:
        w = x2 - x1
        h = y2 - y1
        a = w * h
        if a < min_area or a > max_area:
            continue
        filtered.append((x1, y1, x2, y2))
    return filtered


def fix_token(tokens, token):
    # Possibly mistaken plus sign with letter 't'
    if token == "t":
        found = False
        for t in tokens:
            if t == "=" or t == ">" or t == "<":
                found = True
                break
        if found:
            token = "+"

    if len(token) > 1:
        temp = token

        # Possibly mistaken letter 't' with plus sign
        temp = temp.replace("+", "t")
        if temp in bifi_vocab:
            token = temp

        # Possibly mistaken letter 'o' with number 0
        temp = temp.replace("0", "o")
        if temp in bifi_vocab:
            token = temp

        # Possibly mistaken letter 's' with number 5
        temp = temp.replace("5", "s")
        if temp in bifi_vocab:
            token = temp

        # Possibly mistaken letter 'l' with left parenthesis
        temp = temp.replace("(", "l")
        if temp in bifi_vocab:
            token = temp

        # Possibly mistaken letter 'l' with right parenthesis
        temp = temp.replace(")", "l")
        if temp in bifi_vocab:
            token = temp

        # Possibly mistaken letter 'i' with letter 'j'
        temp = temp.replace("j", "i")
        if temp in bifi_vocab:
            token = temp

    # True/False are capitalized
    if token == "true":
        token = "True"
    elif token == "false":
        token = "False"

    return token


@app.route("/parse", methods=["POST"])
def parse():
    # Get image URL from request body
    json = request.get_json()
    url = json["url"]
    print(url)

    # Get image from S3
    res = requests.get(url, stream=True).raw
    img = np.asarray(bytearray(res.read()), dtype="uint8")
    img = cv2.imdecode(img, cv2.IMREAD_COLOR)
    # img = cv2.imread("sort.jpg")
    image = img

    # Re-encoding the image to a supported format (e.g., JPEG) before sending
    _, encoded_img = cv2.imencode('.jpg', image)
    img_temp = encoded_img.tobytes()
    #img_temp = image.tobytes()

    #img_temp = bytearray(image.read())

    response = client.detect_document_text(
        Document={'Bytes': img_temp}
    )
    response

    text = ""
    for item in response["Blocks"]:
        if item["BlockType"] == "LINE":
            print (item["Text"])
            text = text + "\n"+item["Text"]
    
    # Applying indentation
    #indented_text = apply_indentation(text)
    #print(indented_text)
    
    return text



    # # Grayscale
    # gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # # Canny
    # canny = cv2.Canny(gray, 100, 200)

    # # Contours
    # contours, _ = cv2.findContours(canny, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # # Bounding boxes
    # rects = []
    # for contour in contours:
    #     x, y, w, h = cv2.boundingRect(contour)
    #     x1 = x
    #     y1 = y
    #     x2 = x + w
    #     y2 = y + h
    #     rects.append((x1, y1, x2, y2))

    # # Min area relative to max area found
    # max_a = 0
    # for x1, y1, x2, y2 in rects:
    #     a = (x2 - x1) * (y2 - y1)
    #     max_a = max(max_a, a)
    # min_area = max_a * 0.005
    # max_area = 100000

    # # Merge and clean intersecting rectangles, filter by area, and sort by horizontal position
    # merge_all(rects, min_area_percent=0.0)
    # rects = filter_rects(rects, min_area, max_area)
    # rects.sort(key=lambda rect: rect[0])

    # # Non-continuous characters: i, j, :, and =
    # merge_noncontinuous(rects)

    # # Draw bounding boxes
    # for x1, y1, x2, y2 in rects:
    #     cv2.rectangle(img, (x1, y1), (x2, y2), (0, 255, 0), 2)
    # # cv2.imwrite(f"boxes.jpg", img)

    # # Inference
    # rect_preds = []
    # #Original line below
    # # device = "cuda" if torch.cuda.is_available() else "cpu"

    # device = 'cpu'
    # print(f"DEVICE:", device)
    # model = CNN()
    # model.load_state_dict(torch.load(f"model_{CLASSIFIER_NAME}.pth", map_location=torch.device('cpu')))
    # # model = model.to(device)
    # model.eval()
    # with torch.no_grad():
    #     for i, (x1, y1, x2, y2) in enumerate(rects):
    #         # Get region of interest from grayscale image
    #         roi = gray[y1:y2, x1:x2]

    #         # Flip black and white
    #         flipped = cv2.bitwise_not(roi)

    #         # Ensure black background
    #         flipped[flipped < 85] = 0

    #         # Gaussian blur
    #         blurred = cv2.GaussianBlur(flipped, ksize=(3, 3), sigmaX=1, sigmaY=1)

    #         # Resize, maintain aspect ratio, shrink larger dimension to 24 pixels
    #         resize_size = 24
    #         width = x2 - x1
    #         height = y2 - y1
    #         if width > height:
    #             new_width = resize_size
    #             new_height = int(new_width * (height / width))
    #         else:
    #             new_height = resize_size
    #             new_width = int(new_height * (width / height))
    #         resized = cv2.resize(blurred, (new_width, new_height), interpolation=cv2.INTER_CUBIC)

    #         # Add 2 pixel black padding
    #         pad_size = 28
    #         padded = np.zeros((pad_size, pad_size))
    #         x_start = pad_size // 2 - new_width // 2
    #         x_end = x_start + new_width
    #         y_start = pad_size // 2 - new_height // 2
    #         y_end = y_start + new_height
    #         padded[y_start:y_end, x_start:x_end] = resized

    #         # Normalize
    #         normalized = padded / 255

    #         # Convert to tensor
    #         tensor = (
    #             torch.from_numpy(normalized.astype("float32")).unsqueeze(0).unsqueeze(0).to(device)
    #         )

    #         # Predict
    #         pred = model(tensor).cpu()[0]
    #         idxs = np.argsort(pred)
    #         rect_preds.append((x1, y1, x2, y2, idxs))

    #         # class_name = CLASS_NAMES[idxs[-1]]
    #         # cv2.imwrite(f"preds/{i}_{class_name}.jpg", padded)

    # avg_width = sum(x2 - x1 for (x1, y1, x2, y2, idxs) in rect_preds) / len(rect_preds)
    # avg_height = sum(y2 - y1 for (x1, y1, x2, y2, idxs) in rect_preds) / len(rect_preds)

    # # Split into lines
    # lines = []
    # for rect_pred in rect_preds:
    #     x1, y1, x2, y2, idxs = rect_pred
    #     cy = (y1 + y2) / 2
    #     found = False
    #     for line in lines:
    #         cy_avg = line[0] / (len(line) - 1)
    #         if np.abs(cy - cy_avg) < avg_height:
    #             line[0] += cy
    #             line.append(rect_pred)
    #             found = True
    #             break
    #     if not found:
    #         lines.append([cy, rect_pred])

    # # Sort by ascending average center y
    # lines.sort(key=lambda line: line[0] / (len(line) - 1))

    # # Convert to string with indentation
    # line_strs = []
    # indents = {}
    # cur_indent = 0
    # for i, line in enumerate(lines):
    #     line_str = []

    #     # Indentation
    #     x1 = line[1][0]
    #     if i == 0:
    #         # First line
    #         indents[x1] = 0
    #     else:
    #         # Previous line ends with colon, starting new indent block
    #         prev_line = lines[i - 1]
    #         prev_rect_pred = prev_line[-1]
    #         prev_idxs = prev_rect_pred[-1]
    #         prev_idx = prev_idxs[-1]
    #         prev_class_name = CLASS_NAMES[prev_idx]
    #         if prev_class_name == "colon":
    #             cur_indent += 1
    #             indents[x1] = cur_indent
    #         else:
    #             # Find closest indent
    #             min_dst = float("inf")
    #             for x, indent in indents.items():
    #                 dst = np.abs(x1 - x)
    #                 if dst < min_dst:
    #                     min_dst = dst
    #                     cur_indent = indent

    #     rect_preds = line[1:]

    #     # Spaces and convert class name strings
    #     tokens = []
    #     for i, (x1, y1, x2, y2, idxs) in enumerate(rect_preds):
    #         # Add space
    #         if i > 0:
    #             prev_x2 = rect_preds[i - 1][2]
    #             dx = x1 - prev_x2
    #             if dx > 0.75 * avg_width:
    #                 tokens.append(" ")

    #         # Convert class name if exists
    #         class_name = CLASS_NAMES[idxs[-1]]
    #         if class_name in CLASS_NAMES_MAP:
    #             class_name = CLASS_NAMES_MAP[class_name]

    #         tokens.append(class_name)

    #     # Split into tokens
    #     tokens = "".join(tokens).lower().split(" ")

    #     # Fix basic rules and common mistakes
    #     for i, token in enumerate(tokens):
    #         # Decimals get in the way of fixing, so split on them then rejoin later
    #         if len(token) > 1 and "." in token:
    #             fixed = []
    #             split = token.split(".")
    #             for t in split:
    #                 t_fixed = fix_token(tokens, t)
    #                 fixed.append(t_fixed)

    #             # Add decimals back
    #             token = ".".join(fixed)
    #             if token[0] == ".":
    #                 token = "." + token
    #             if token[-1] == ".":
    #                 token = token + "."
    #         else:
    #             token = fix_token(tokens, token)
    #         tokens[i] = token

    #     # Add indentation and join tokens with space
    #     line_str = ("    " * cur_indent) + " ".join(tokens)
    #     line_strs.append(line_str)

    # # Join all lines into one string
    # final_str = "\n".join(line_strs)
    # print(final_str)

    # return final_str

@app.route("/repair", methods=["POST"])
def repair():

     # Get code from request body
    json = request.get_json()
    code = json["code"]
    print("BEFORE:")
    print(code)

    current_date = datetime.datetime.now().date()

    # Define the date after which the model should be set to "gpt-3.5-turbo"
    target_date = datetime.date(2024, 6, 12)

    #Set the model variable based on the current date
    if current_date > target_date:
        llm_model = "gpt-3.5-turbo"
    else:
        llm_model = "gpt-3.5-turbo-0301"

    os.environ["OPENAI_API_KEY"] = "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"

    llm = ChatOpenAI(temperature=0.9, model=llm_model)

    # Define prompts for generating content
    repair_prompt = ChatPromptTemplate.from_template(
      "correct the indentation of the python code and also correct the errors in the code and give and an feedback on the code in 4 to 5 lines mentioning the errors in teh code {theme}."
   )

    # Create LLM Chains for each content type
    repair_prompt_chain = LLMChain(llm=llm, prompt=repair_prompt)

    #Generate and display creative content
    generated_repair_prompt = repair_prompt_chain.run(theme=code)

    print(generated_repair_prompt)


    # # Get code from request body
    # json = request.get_json()
    # code = json["code"]
    # print("BEFORE:")
    # print(code)

    # # Write temporary file
    # temp_file = "temp.py"
    # with open(temp_file, "w") as f:
    #     f.write(code)

    # try:
    #     # Try compiling
    #     py_compile.compile(temp_file, doraise=True)

    #     # Already valid, don't need to do anything
    #     print("VALID")

    #     final_code = code
    # except py_compile.PyCompileError:
    #     # Invalid, try Break-It-Fix-It
    #     print("INVALID")

    #     # Add space around special symbols
    #     special_symbols = [
    #         ".",
    #         ",",
    #         "(",
    #         ")",
    #         "[",
    #         "]",
    #         ":",
    #         "=",
    #         "+",
    #         "-",
    #         "*",
    #         "/",
    #         "!",
    #         "<",
    #         ">",
    #     ]
    #     for symbol in special_symbols:
    #         code = code.replace(symbol, f" {symbol} ")

    #     # Convert raw code input to BIFI tokens: <NEWLINE> <INDENT> <DEDENT>
    #     lines = code.split("\n")
    #     preprocessed_tokens = []
    #     indent = 0

    #     for i, line in enumerate(lines):
    #         # New line
    #         if i > 0:
    #             preprocessed_tokens.append("<NEWLINE>")

    #         # Count spaces to calculate line indent
    #         space_count = 0
    #         for char in line:
    #             if char != " ":
    #                 break
    #             space_count += 1
    #         line_indent = space_count // 4

    #         # Add <INDENT> or <DEDENT>s
    #         if line_indent > indent:
    #             preprocessed_tokens.append("<INDENT>")
    #             indent = line_indent
    #         elif line_indent < indent:
    #             indent_dif = indent - line_indent
    #             for _ in range(indent_dif):
    #                 preprocessed_tokens.append("<DEDENT>")
    #             indent = line_indent

    #         # Add rest of line
    #         preprocessed_tokens.append(line[space_count:])

    #     preprocessed = " ".join(preprocessed_tokens)

    #     print("PREPROCESSED:")
    #     print(preprocessed)

    #     # Keep track of unknown tokens to replace <unk> later
    #     unknown_tokens = []
    #     code_tokens = preprocessed.split()
    #     for token in code_tokens:
    #         if token not in bifi_vocab:
    #             unknown_tokens.append(token)

    #     # BIFI inference
    #     repaired_raw = bifi_model.translate(preprocessed)

    #     print("REPAIRED RAW:")
    #     print(repaired_raw)

    #     # Convert raw output back to normal code tokens
    #     raw_tokens = repaired_raw.split()
    #     repaired_tokens = []
    #     indent = 0
    #     unknown_idx = 0

    #     for token in raw_tokens:
    #         if token == "<NEWLINE>":
    #             repaired_tokens.append("\n")
    #             for _ in range(indent):
    #                 repaired_tokens.append("    ")
    #         elif token == "<INDENT>":
    #             indent += 1
    #             repaired_tokens.append("    ")
    #         elif token == "<DEDENT>":
    #             indent -= 1
    #             repaired_tokens.pop()
    #         else:
    #             if (
    #                 repaired_tokens
    #                 and repaired_tokens[-1][-1] != " "
    #                 and repaired_tokens[-1] != "\n"
    #             ):
    #                 repaired_tokens.append(" ")
    #             if token == "<unk>":
    #                 unknown_token = unknown_tokens[unknown_idx]
    #                 unknown_idx += 1
    #                 repaired_tokens.append(unknown_token)
    #             else:
    #                 repaired_tokens.append(token)

    #     final_code = "".join(repaired_tokens)
    #     final_code = final_code.replace(" . ", ".")
    #     final_code = final_code.replace(" , ", ", ")
    #     final_code = final_code.replace(" ( ", "(")
    #     final_code = final_code.replace(" )", ")")
    #     final_code = final_code.replace("[ ", "[")
    #     final_code = final_code.replace(" ]", "]")
    #     final_code = final_code.replace(" :", ":")

    # # Delete temporary file
    # os.remove(temp_file)

    # print("AFTER:")
    #print(final_code)
    return generated_repair_prompt


@app.route("/grade", methods=["POST"])
def grade():
    # Get function definition, code, and test cases from request body
    json = request.get_json()
    func_def = json["funcDef"]
    code = json["code"]
    test_cases = json["testCases"]

    # Function definition name
    func_def_name = func_def.split("(")[0]

    # Indent the student code
    indented_code = []
    code_lines = code.split("\n")
    for code_line in code_lines:
        indented_code.append(f"    {code_line}")
    indented_code = "\n".join(indented_code)

    # Run code against test cases
    passed = 0
    failed = 0
    results = []
    for i, test_case in enumerate(test_cases):
        inp = test_case["input"]
        out = test_case["output"]

        # Generate test code
        params = ", ".join([str(x) for x in inp])
        test_code_lines = [
            f"def {func_def}:",
            indented_code,
            "try:",
            f"    res = {func_def_name}({params})",
            "except Exception as e:",
            "    err = str(e)",
        ]
        test_code = "\n".join(test_code_lines)
        print("====================")
        print(test_code)

        # Execute test code and tally results
        local = {}
        result = {"id": i, "input": inp, "expected": out}
        try:
            # Execute test code
            exec(test_code, {}, local)

            # Tally results
            if "res" in local:
                res = local["res"]
                result["output"] = res
                result["error"] = None
                if res == out:
                    passed += 1
                    result["passed"] = True
                else:
                    failed += 1
                    result["passed"] = False
            if "err" in local:
                failed += 1
                result["output"] = None
                result["passed"] = False
                result["error"] = local["err"]

        except Exception as e:
            failed += 1
            result["error"] = str(e)
        results.append(result)

    response = {"passed": passed, "failed": failed, "results": results}
    return response


if __name__ == "__main__":
    # load_bifi_model()
    app.run()
