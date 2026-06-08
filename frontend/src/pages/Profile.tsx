import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../app/store";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { setUser, logout } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { ComSidebar } from "@/components/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ThreadCard } from "@/components/ThreadCard";

type Thread = {
  id: number;
  content: string | null;
  image: string | null;
  created_at: string;
  isLiked: boolean;
  likes: unknown[];
  thread: unknown[];
  author: {
    id: number;
    username: string;
    full_name: string;
    photo_profile: string | null;
  };
};

type User = {
  id: number;
  username: string;
  full_name: string;
  email: string;
  photo_profile?: string | null;
  bio?: string | null;
  threads: Thread[];
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

        <main className="min-h-screen flex-1 bg-slate-50">
          <div className="sticky top-0 z-10 flex items-center gap-4 border-b bg-white/80 px-6 py-4 backdrop-blur">
            <h1 className="text-2xl font-bold">
              {profileUser ? `@${profileUser.username}` : "Profile"}
            </h1>
          </div>

          <div className="mx-auto max-w-2xl p-6">
            {profileUser ? (
              <Card className="overflow-hidden">
                <div className="h-32" />

                <CardContent className="relative p-6">
                  <Avatar className="-mt-16 h-28 w-28 border-4 border-white">
                    <AvatarImage src={profileUser.photo_profile ?? ""} />
                    <AvatarFallback className="text-3xl font-bold">
                      {profileUser.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="mt-4 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold">
                        {profileUser.full_name}
                      </h2>
                      <p className="text-muted-foreground">
                        @{profileUser.username}
                      </p>
                    </div>

                    <Button variant="outline">Edit Profile</Button>
                  </div>

                  <p className="mt-4 text-sm text-slate-700">
                    {profileUser.bio || "-"}
                  </p>

                  <Separator className="my-6" />

                  <div className="grid grid-cols-3 text-center">
                    <div>
                      <p className="text-xl font-bold">
                        {profileUser.threads.length}
                      </p>
                      <p className="text-sm text-muted-foreground">Threads</p>
                    </div>

                    <div>
                      <p className="text-xl font-bold">0</p>
                      <p className="text-sm text-muted-foreground">Followers</p>
                    </div>

                    <div>
                      <p className="text-xl font-bold">0</p>
                      <p className="text-sm text-muted-foreground">Following</p>
                    </div>
                  </div>

                  <Separator className="my-6" />

                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{profileUser.email}</p>
                  </div>

                  <div className="mt-6 space-y-4">
                    <h2 className="text-xl font-bold">My Threads</h2>

                    {profileUser.threads.length > 0 ? (
                      profileUser.threads.map((thread) => (
                        <ThreadCard
                          key={thread.id}
                          id={thread.id}
                          content={thread.content ?? ""}
                          image={thread.image}
                          createdAt={thread.created_at}
                          author={thread.author}
                          likesCount={thread.likes.length}
                          commentsCount={thread.thread.length}
                          isLiked={thread.isLiked}
                          token={token}
                        />
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Belum ada thread.
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ) : (
              <p>Loading...</p>
            )}
          </div>
        </main>
      </SidebarProvider>
    </>
  );
};
