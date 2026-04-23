import { Navigate, Route, Routes } from "react-router-dom";
import { AppLayout } from "./layouts/app-layout";
import { ProtectedRoute } from "./components/protected-route";
import { LoginPage } from "./pages/login-page";
import { RegisterPage } from "./pages/register-page";
import { DashboardPage } from "./pages/dashboard-page";

const App = () => {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route index element={<DashboardPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>
  );
};

export default App;
