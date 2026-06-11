import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { getAllUsers } from "@/features/auth/userSlice";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { api } from "@/services/api";

export const RightSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();

  const token = useSelector((state: RootState) => state.auth.token);
  const { users } = useSelector((state: RootState) => state.users);
  console.log("USERS REDUX:", users);

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (token) {
      dispatch(getAllUsers(token));
    }
  }, [token, dispatch]);

  const filteredUsers = users.filter((user: any) => {
    const username = user.username?.toLowerCase() || "";
    const fullName = user.full_name?.toLowerCase() || "";

    return (
      username.includes(search.toLowerCase()) ||
      fullName.includes(search.toLowerCase())
    );
  });

  const handleFollow = async (userId: number) => {
    if (!token) return;

    await api.post(
      `/user/follow/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    dispatch(getAllUsers(token));
  };

  return (
    <aside className="sticky top-0 hidden h-screen w-80 shrink-0   bg-slate-50 p-5 lg:block">
      <Input
        placeholder="Search user..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 rounded-full bg-white"
      />

      <div className="h-[50vh] overflow-y-auto rounded-2xl border bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-lg font-bold">Suggested Users</h2>

        <div className="space-y-3">
          {filteredUsers.map((user: any) => (
            <div
              key={user.id}
              className="flex items-center justify-between gap-3"
            >
              <div className="flex min-w-0 items-center gap-3">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={user.photo_profile ?? ""} />
                  <AvatarFallback className="text-xs">
                    {user.username?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 leading-tight">
                  <p className="truncate text-sm font-semibold">
                    {user.full_name || user.username}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    @{user.username}
                  </p>
                </div>
              </div>

              <Button
                onClick={() => handleFollow(user.id)}
                variant={user.isFollowing ? "outline" : "default"}
                className="h-8 rounded-full px-4 text-xs"
              >
                {user.isFollowing ? "Following" : "Follow"}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};
