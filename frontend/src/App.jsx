import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LeadList from "./pages/LeadList";
import LeadForm from "./pages/LeadForm";
import ProtectedRoute from "./components/ProtectedRoute";
import "./index.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leads"
          element={
            <ProtectedRoute>
              <LeadList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leads/new"
          element={
            <ProtectedRoute>
              <LeadForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/leads/:id/edit"
          element={
            <ProtectedRoute>
              <LeadForm />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;