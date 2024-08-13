import React, { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./components/AdminDashboard/AdminDashboard";
import FacultyDashboard from "./components/FacultyDashboard/FacultyDashboard";
import StudentMainContentPart1 from "./components/Studentdashobard/StudentMainContentPart1"; // Updated import path
import Timetable from "./components/Studentdashobard/Timetable"; // Updated import path
import DashboardLayout from "./components/Studentdashobard/DashboardLayout"; // Updated import path
import DashboardLayoutf from "./components/FacultyDashboard/DashboardLayout"; // Updated import path
import StudentProfile from "./components/Studentdashobard/StudentProfile"; // Updated import path
import Users from "./components/FacultyDashboard/user"; // Updated import path
import Survey from "./components/FacultyDashboard/FacultySurvey";
import Surveyf from "./components/FacultyDashboard/SurveyForm";
import Facultyimetable from "./components/FacultyDashboard/StudentTable";
import Surveystu from "./components/Studentdashobard/Survey";
import Feedback from "./components/Studentdashobard/Stufeedback";
import "./App.css"; // Ensure your CSS file is included
import FacultyAddSchedule from "./components/FacultyDashboard/FacultyAddSchedule";
import FacultyPooostTimetable from "./components/FacultyDashboard/FacultyPostTimetable";
import FacultyFeedback from "./components/FacultyDashboard/FacultyFeedback";
import Antiragging from "./components/Studentdashobard/Antiragging";
import Adashboard from "./components/AdminDashboard/dashboard";

const AuthRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return !token ? children : <Navigate to="/student-dashboard" />;
};

const ProtectedRoute = ({ children, allowedRoles }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to={`/${role}-dashboard`} />;
  }

  return children;
};

function App() {
  useEffect(() => {
    const appContainer = document.querySelector(".app-container");
    if (appContainer) {
      appContainer.style.width = "80%";
      appContainer.style.height = "80%";
      appContainer.style.margin = "0 auto";
      appContainer.style.display = "flex";
      appContainer.style.flexDirection = "column";
      appContainer.style.position = "relative";
      appContainer.style.top = "20px"; // Adjust as needed
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route
            path="/login"
            element={
              <AuthRoute>
                <Login />
              </AuthRoute>
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard>
                  <Routes>
                    <Route path="" element={<Adashboard />} />
                  </Routes>
                </AdminDashboard>
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculty-dashboard/*"
            element={
              <ProtectedRoute allowedRoles={["faculty"]}>
                <DashboardLayoutf>
                  <Routes>
                    <Route path="" element={<StudentMainContentPart1 />} />
                    <Route path="users" element={<Users />} />
                    <Route path="Survey" element={<Survey />} />
                    <Route path="Surveyform" element={<Surveyf />} />
                    <Route path="Feedback" element={<FacultyFeedback />} />
                    <Route
                      path="faculty-timetable"
                      element={<FacultyPooostTimetable />}
                    />
                    {/* Add more routes as needed */}
                  </Routes>
                </DashboardLayoutf>
              </ProtectedRoute>
            }
          />
          <Route
            path="/student-dashboard/*"
            element={
              <ProtectedRoute allowedRoles={["student"]}>
                <DashboardLayout>
                  <Routes>
                    <Route path="" element={<StudentMainContentPart1 />} />
                    <Route path="timetable" element={<Timetable />} />{" "}
                    <Route path="profile" element={<StudentProfile />} />
                    <Route path="Surveystu" element={<Surveystu />} />
                    <Route path="Feedback" element={<Feedback />} />
                    <Route path="Antiragging" element={<Antiragging />} />
                  </Routes>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
