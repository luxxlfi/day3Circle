import { useState } from "react";
import { Heart, MessageCircle } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/services/api";

type ThreadCardProps = {
  id: number;
  content: string;
  createdAt?: string;
  likesCount?: number;
  commentsCount?: number;
  token: string | null;
  author: {
    username: string;
    full_name?: string;
    photo_profile?: string | null;
  };
};

export const ThreadCard = ({
  id,
  content,
  createdAt,
  likesCount = 0,
  commentsCount = 0,
  token,
  author,
}: ThreadCardProps) => {
  const [liked, setLiked] = useState(false);
  const [likeTotal, setLikeTotal] = useState(likesCount);

  const handleLike = async () => {
    try {
      const res = await api.post(
        `/thread/${id}/like`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setLiked(res.data.liked);
      setLikeTotal((prev) => (res.data.liked ? prev + 1 : prev - 1));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm transition-all hover:shadow-md">
      <div className="flex gap-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={author.photo_profile ?? ""} />
          <AvatarFallback>
            {author.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-semibold">
              {author.full_name || author.username}
            </p>
            <p className="text-sm text-muted-foreground">@{author.username}</p>
          </div>

          {createdAt && (
            <p className="text-xs text-muted-foreground">
              {new Date(createdAt).toLocaleDateString()}
            </p>
          )}

          <p className="mt-2 text-sm leading-6 text-slate-800">{content}</p>

          <div className="mt-4 flex items-center gap-8 text-muted-foreground">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition-colors ${
                liked ? "text-red-500" : "hover:text-red-500"
              }`}
            >
              <Heart size={18} fill={liked ? "currentColor" : "none"} />
              <span className="text-sm">{likeTotal}</span>
            </button>

            <button className="flex items-center gap-2 transition-colors hover:text-blue-500">
              <MessageCircle size={18} />
              <span className="text-sm">{commentsCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
