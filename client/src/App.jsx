import {
  BrowserRouter,
  HashRouter,
  Routes,
  Route,
  Link,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Importing pages
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import ProfileForm from "./pages/ProfileForm";

// ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">กำลังโหลด...</p>
        </div>
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

// Production Mode App Content Component (ที่ใช้ useAuth)
const ProductionMode = () => {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginPage />
        }
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <ProfileForm />
          </ProtectedRoute>
        }
      />
      <Route
        path="*"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/"} replace />}
      />
    </Routes>
  );
};

// Development Mode App Content Component with Enhanced UI Menu for Easy Routing
const DevelopmentMode = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      {/* Enhanced Menu for Routing */}
      <nav className="bg-white shadow-md rounded-xl mx-auto w-full justify-center py-2 flex gap-8 items-center">
        <Link
          to="/"
          className="text-blue-700 font-semibold hover:bg-blue-100 px-4 py-2 rounded transition"
        >
          Login
        </Link>
        <Link
          to="/dashboard"
          className="text-blue-700 font-semibold hover:bg-blue-100 px-4 py-2 rounded transition"
        >
          Dashboard
        </Link>
        <Link
          to="/profile"
          className="text-blue-700 font-semibold hover:bg-blue-100 px-4 py-2 rounded transition"
        >
          Profile
        </Link>
      </nav>
      <div className="border-t border-gray-200 max-w-full mx-auto bg-white rounded-xl shadow-lg">
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/profile" element={<ProfileForm />} />
        </Routes>
      </div>
    </div>
  );
};

//
const AppContent = () => {
  // Check if the application is running in development mode
  if (import.meta.env.VITE_NODE_ENV === "development") {
    return (
      <AuthProvider>
        <DevelopmentMode />
      </AuthProvider>
    );
  }

  // If in production mode, use the ProductionMode component
  return (
    <AuthProvider>
      <ProductionMode />
    </AuthProvider>
  );
};

// Main App Component
function App() {
  const isDev = import.meta.env.VITE_NODE_ENV === "development";
  const Router = isDev ? BrowserRouter : HashRouter;
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
