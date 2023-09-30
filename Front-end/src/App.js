import logo from './logo.svg';
// import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import './App.css';
import { SignUp } from './views/signUp'
import { SignIn } from './views/signIn'
import { ResetPassword } from './views/resetPassword'
import { ResetPassword2 } from './views/resetPassword2'
import {Profile} from './views/profile'
import { MainPage } from './views/mainPage'
import  {OnlineClass}  from './views/onlineclass'
import { CoursePage } from './views/coursePage'
import { ClassPage } from './views/classPage'
import { MaterialPage } from "./views/materialPage";
import { BroadcastPage } from "./views/broadcastPage";
import { UploadMaterial } from "./views/uploadMaterial";
import { UploadUrl } from "./views/uploadUrl";
import { ToastContainer } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.min.css';
import { ModifyMaterial } from "./views/modifyMaterial";
import { ForumPage } from './views/forumPage';
import { UploadPost } from './views/uploadPost';
import { PostPage } from './views/postPage';
import { ModifyPost } from './views/modifyPost';
import { ChatBot } from './views/chatBot';
import { AssignmentPage } from "./views/assignmentPage";
import { Quiz } from "./views/quizPage";
import { AddQuiz } from "./views/addQuiz";
import  {AttemptQuiz} from "./views/attemptQuiz";
import {QuizFeedback} from "./views/quizFeedback"
import {StudentQuiz} from "./views/studentQuiz"
import {MarkQuiz} from "./views/markQuiz"
import { Example } from "./views/examples";
import { GiveMedalPage } from "./views/giveMedalPage";
import { Routes, Route } from "react-router-dom"
import 'antd/dist/reset.css'
import routes from './routes'

  export default function App() {
    return (
      <>
      <ToastContainer />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/SignUp" element={<SignUp />} />
        <Route path="/verifyEmail" element={<ResetPassword />} />
        <Route path="/resetPassword" element={<ResetPassword2 />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/MainPage" element={<MainPage />} />
        <Route path="/OnlineClass/:id" element={<OnlineClass />} />
        <Route path="/course/:id" element={<CoursePage />} />
        <Route path="/classPage/:id/:urlid" element={<ClassPage />} />
        <Route path="/materialPage/:id" element={<MaterialPage />} />
        <Route path="/uploadMaterial/:id" element={<UploadMaterial />} />
        <Route path="/UploadUrl/:courseid/:classid" element={<UploadUrl />} />
        <Route path="/modifyMaterial/:id" element={<ModifyMaterial />} />
        <Route path="/BroadcastPage" element={<BroadcastPage />} />
        <Route path="/chatBot" element={<ChatBot />} />
        <Route path="/assignmentPage/:id" element={<AssignmentPage />} />
        <Route path="/Quiz/:id" element={<Quiz />} />
        <Route path="/AddQuiz/:id/:quizid" element={<AddQuiz />} />
        <Route path="/AttemptQuiz/:courseid/:quizid" element={<AttemptQuiz />} />
        <Route path="/QuizFeedback/:courseid/:quizid" element={<QuizFeedback />} />
        <Route path="/StudentQuiz/:courseid/:quizid" element={<StudentQuiz />} />
        <Route path="/MarkQuiz/:courseid/:quizid/:studentid" element={<MarkQuiz />} />
        <Route path="/forumPage/:id" element={<ForumPage />} />
        <Route path="/uploadPost/:id" element={<UploadPost />} />
        <Route path="/postPage/:tid" element={<PostPage />} />
        <Route path="/modifyPost/:tid" element={<ModifyPost />} />
        <Route path="/giveMedalPage/:zid" element={<GiveMedalPage />} />
      </Routes>
    </>
    );
  }
