import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import { Login } from "./pages/Login";
import { Register } from "./pages/Register";
import { Profile } from "./pages/Profile";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { Home } from "./pages/Home";
import { CreateThread } from "./pages/CreaeThread";
import { DetailThread } from "./pages/DetailThread";
import { AllUsers } from "./pages/AllUser";
import { EditProfile } from "./pages/EditProfile";
import { FollowList } from "./pages/FollowList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/Register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/Home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        <Route
          path="/follow-list"
          element={
            <ProtectedRoute>
              <FollowList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/AllUser"
          element={
            <ProtectedRoute>
              <AllUsers />
            </ProtectedRoute>
          }
        />

        <Route
          path="/EditProfile"
          element={
            <ProtectedRoute>
              <EditProfile />
            </ProtectedRoute>
          }
        />

        <Route
          path="/CreateThread"
          element={
            <ProtectedRoute>
              <CreateThread />
            </ProtectedRoute>
          }
        />
        <Route
          path="/thread/:threadId"
          element={
            <ProtectedRoute>
              <DetailThread />
            </ProtectedRoute>
          }
        />

        {/* <Route path="/user/:id" element={
          <Prod
          <UserProfile />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
