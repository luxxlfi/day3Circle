import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { setUser, logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ComSidebar } from "@/components/Sidebar";

type User = {
  id: number;
  username: string;
  full_name: string;
  email: string;
  photo_profile?: string;
  bio?: string | null;
};

export const Profile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const token = useSelector((state: RootState) => state.auth.token);
  const [profileUser, setProfileUser] = useState<User | null>(null);

  const getProfile = async () => {
    try {
      const res = await api.get("/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfileUser(res.data.deta);
      dispatch(setUser(res.data.deta));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <>
      <SidebarProvider>
        <ComSidebar />
        <SidebarTrigger />
        <div className="min-h-screen w-full flex">
          <main className="flex-1 p-8">
            <h1>Profile</h1>

            {profileUser ? (
              <div>
                <p>ID: {profileUser.id}</p>
                <p>Username: {profileUser.username}</p>
                <p>full_name: {profileUser.full_name}</p>
                <p>email: {profileUser.email}</p>
                <p>bio: {profileUser.bio}</p>
              </div>
            ) : (
              <p>Loading.....</p>
            )}
          </main>
        </div>
      </SidebarProvider>
      );
    </>
  );
};
