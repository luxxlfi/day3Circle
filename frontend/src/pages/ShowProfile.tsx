import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/app/store";
import { useParams } from "react-router-dom";
import { getUserById } from "@/features/auth/userSlice";
import { ThreadCard } from "@/components/ThreadCard";

export const UserProfile = () => {
  const { id } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const token = useSelector((state: RootState) => state.auth.token);
  const { selectedUser, loading } = useSelector(
    (state: RootState) => state.users,
  );

  useEffect(() => {
    if (id && token) {
      dispatch(getUserById({ id, token }));
    }
  }, [id, token]);

  if (loading || !selectedUser) return <p>Loading...</p>;

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="text-2xl font-bold">@{selectedUser.username}</h1>

      <div className="mt-6 rounded-lg border bg-white p-6">
        <h2 className="text-xl font-bold">{selectedUser.full_name}</h2>
        <p className="text-muted-foreground">@{selectedUser.username}</p>
        <p className="mt-4">{selectedUser.bio || "-"}</p>

        <div className="mt-6 space-y-4">
          <h2 className="text-xl font-bold">Threads</h2>

          {selectedUser.threads.length > 0 ? (
            selectedUser.threads.map((thread: any) => (
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
              User ini belum punya thread.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
