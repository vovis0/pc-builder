import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "./store/auth.store";
import LoginPage from "./pages/LoginPage";
import BuilderPage from "./pages/BuilderPage";
import SavedBuildsPage from "./pages/SavedBuildsPage";
import ProfilePage from "./pages/ProfilePage";
import AppLayout from "./components/layout/AppLayout";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const token = useAuthStore((s) => s.token);
  return token ? <>{children}</> : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          }
        >
          <Route index element={<BuilderPage />} />
          <Route path="builds" element={<SavedBuildsPage />} />
          <Route path="profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}