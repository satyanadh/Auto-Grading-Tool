import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Register from "./components/register";
import Dashboard from "./components/dashboard";
import Enroll from "./components/enroll";
import Course from "./components/course";
import Assignments from "./components/assignments";
import Quizzes from "./components/quizzes";
import Grades from "./components/grades";
import Attempt from "./components/attempt";
import Submissions from "./components/submissions";
import Submission from "./components/submission";
import CreateCourse from "./components/create-course";
import CreateAssignmentQuiz from "./components/create-assignment-quiz";
import GradeAssignmentQuiz from "./components/grade-assignment-quiz";
import GradeSubmission from "./components/grade-submission";
import GradeQuestion from "./components/grade-question";
import NotFound from "./components/not-found";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/enroll" element={<Enroll />} />
        <Route path="/course" element={<Course />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/quizzes" element={<Quizzes />} />
        <Route path="/grades" element={<Grades />} />
        <Route path="/attempt" element={<Attempt />} />
        <Route path="/submissions" element={<Submissions />} />
        <Route path="/submission" element={<Submission />} />
        <Route path="/create-course" element={<CreateCourse />} />
        <Route path="/create-assignment-quiz" element={<CreateAssignmentQuiz />} />
        <Route path="/grade-assignment-quiz" element={<GradeAssignmentQuiz />} />
        <Route path="/grade-submission" element={<GradeSubmission />} />
        <Route path="/grade-question" element={<GradeQuestion />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
