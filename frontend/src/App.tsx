import { BrowserRouter as Router } from "react-router";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "./contexts/AuthContext/AuthProvider";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <Router>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={true}
        theme="dark"
      />
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;
