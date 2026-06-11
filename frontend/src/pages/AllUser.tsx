import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { getAllUsers } from "@/features/auth/userSlice";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export const AllUsers = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const token = useSelector((state: RootState) => state.auth.token);
  const { users, loading } = useSelector((state: RootState) => state.users);

  useEffect(() => {
    if (token) {
      dispatch(getAllUsers(token));
    }
  }, [token, dispatch]);
  
  if (loading) return <p>Loading...</p>;

  return (
    <div className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-2xl font-bold">All Users</h1>

      {users.map((user: any) => (
        <div
          key={user.id}
          onClick={() => navigate(`/user/${user.id}`)}
          className="flex cursor-pointer items-center gap-4 rounded-lg border bg-white p-4 hover:bg-slate-50"
        >
          <Avatar>
            <AvatarImage src={user.photo_profile ?? ""} />
            <AvatarFallback>
              {user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          <div>
            <p className="font-bold">{user.full_name}</p>
            <p className="text-sm text-muted-foreground">@{user.username}</p>
          </div>
        </div>
      ))}
    </div>
  );
};
