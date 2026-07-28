import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/layout/Layout";
import LoginPage from "./pages/auth/LoginPage";
import RegisterPage from "./pages/auth/RegisterPage";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ExplorePage from "./pages/ExplorePage";
import PostDetailPage from "./pages/PostDetailPage";

import AdminDashboard from "./pages/dashboard/AdminDashboard/AdminDashboard";
import ManageUsers from "./pages/dashboard/AdminDashboard/ManageUsers";
import ViewResults from "./pages/dashboard/AdminDashboard/ViewResults";
import Analytics from "./pages/dashboard/AdminDashboard/Analytics";
import Complaints from "./pages/dashboard/AdminDashboard/Complaints";

import UserDashboard from "./pages/dashboard/UsersDashboard/UserDashboard";
import MyProfile from "./pages/dashboard/UsersDashboard/MyProfile";
import MyPosts from "./pages/dashboard/UsersDashboard/MyPosts";
import Following from "./pages/dashboard/UsersDashboard/Following";
import type { JSX } from "react/jsx-runtime";

const AppRoutes = () => {
  const { user, loading } = useAuth();

  const AdminRoute = ({ children }: { children: JSX.Element }) => {
    if (loading) return <div>Loading...</div>;
    return user?.role === 'admin' ? children : <Navigate to="/login" replace />;
  };

  const UserRoute = ({ children }: { children: JSX.Element }) => {
    if (loading) return <div>Loading...</div>;
    return user?.role === 'user' ? children : <Navigate to="/login" replace />;
  };

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        { index: true, element: <HomePage /> },
        { path: "profile/:userId", element: <ProfilePage /> },
        { path: "explore", element: <ExplorePage /> },
        { path: "post/:postId", element: <PostDetailPage /> },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/admin",
      element: (
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      ),
      children: [
        { path: "manage-users", element: <ManageUsers /> },
        { path: "view-results", element: <ViewResults /> },
        { path: "analytics", element: <Analytics /> },
        { path: "complaints", element: <Complaints /> },
        { index: true, element: <Navigate to="manage-users" replace /> },
      ],
    },
    {
      path: "/dashboard",
      element: (
        <UserRoute>
          <UserDashboard />
        </UserRoute>
      ),
      children: [
        { path: "profile", element: <MyProfile /> },
        { path: "posts", element: <MyPosts /> },
        { path: "following", element: <Following /> },
        { index: true, element: <Navigate to="profile" replace /> },
      ],
    },
    {
      path: "*",
      element: <div>404 Not Found</div>,
    },
  ]);

  return <RouterProvider router={router} />;
};

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;