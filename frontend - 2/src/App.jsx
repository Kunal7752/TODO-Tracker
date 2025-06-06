import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import useAuthUser from "./hooks/UseAuthUser";
import PageLoader from "./components/PageLoader";

const App = () => {
  const { isLoading, authUser } = useAuthUser();
  const isAuthenticated = Boolean(authUser);
  if (isLoading) return <PageLoader />;
  return (
    <div>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <HomePage />
            ) : (
              <Navigate to= "/login" />
            )
          }
        />
        <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to={ "/" } />} />
        <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to={ "/" } />} />
      </Routes>
    </div>
  );
};

export default App;
