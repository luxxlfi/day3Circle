import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import { api } from "@/services/api";
import { useNavigate, useSearchParams } from "react-router-dom";

import { SidebarProvider } from "@/components/ui/sidebar";
import { ComSidebar } from "@/components/Sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type FollowUser = {
  id: number;
  username: string;
  full_name: string;
  photo_profile: string | null;
  bio: string | null;
};

export const FollowList = () => {
  const token = useSelector((state: RootState) => state.auth.token);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const tab = searchParams.get("tab") || "follower";

  const [follower, setFollower] = useState<FollowUser[]>([]);
  const [following, setFollowing] = useState<FollowUser[]>([]);

  const getFollowList = async () => {
    const res = await api.get("/user/follow", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    setFollower(res.data.data.follower);
    setFollowing(res.data.data.following);
  };

  useEffect(() => {
    if (token) {
      getFollowList();
    }
  }, [token]);

  const list = tab === "following" ? following : follower;

  return (
    <SidebarProvider>
      <ComSidebar />

      <main className="min-h-screen flex-1 bg-slate-50">
        <div className="sticky top-0 z-10 border-b bg-white/80 px-6 py-4 backdrop-blur">
          <h1 className="text-2xl font-bold">Follow List</h1>
        </div>

        <div className="mx-auto max-w-2xl p-6">
          <div className="mb-6 flex gap-3">
            <Button
              variant={tab === "follower" ? "default" : "outline"}
              onClick={() => setSearchParams({ tab: "follower" })}
            >
              Following
            </Button>

            <Button
              variant={tab === "following" ? "default" : "outline"}
              onClick={() => setSearchParams({ tab: "following" })}
            >
              Followers
            </Button>
          </div>

          <div className="space-y-4">
            {list.length > 0 ? (
              list.map((user) => (
                <div
                  key={user.id}
                  onClick={() => navigate(`/user/${user.id}`)}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border bg-white p-4 shadow-sm hover:bg-slate-50"
                >
                  <Avatar className="h-11 w-11">
                    <AvatarImage src={user.photo_profile ?? ""} />
                    <AvatarFallback>
                      {user.username.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div>
                    <p className="font-semibold">
                      {user.full_name || user.username}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      @{user.username}
                    </p>
                    <p className="text-sm text-slate-600">{user.bio || ""}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Belum ada data.</p>
            )}
          </div>
        </div>
      </main>
    </SidebarProvider>
  );
};
