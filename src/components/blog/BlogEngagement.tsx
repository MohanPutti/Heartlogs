"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Heart, MessageCircle, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

interface Comment {
  id: string;
  content: string;
  createdAt: string;
  author: { id: string; name: string; image: string | null };
}

interface BlogEngagementProps {
  slug: string;
}

export function BlogEngagement({ slug }: BlogEngagementProps) {
  const { data: session } = useSession();
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  const [comments, setComments] = useState<Comment[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const [draft, setDraft] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/blog/${slug}/like`)
      .then((r) => r.json())
      .then((data) => {
        setLikeCount(data.count ?? 0);
        setLiked(!!data.liked);
      })
      .catch(() => {});

    fetch(`/api/blog/${slug}/comments`)
      .then((r) => r.json())
      .then((data) => setComments(data.comments ?? []))
      .catch(() => {})
      .finally(() => setCommentsLoading(false));
  }, [slug]);

  const toggleLike = async () => {
    if (!session?.user) {
      toast.error("Sign in to like this post");
      return;
    }
    setLikeLoading(true);
    const prevLiked = liked;
    const prevCount = likeCount;
    setLiked(!prevLiked);
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);
    try {
      const res = await fetch(`/api/blog/${slug}/like`, { method: "POST" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setLiked(data.liked);
      setLikeCount(data.count);
    } catch {
      setLiked(prevLiked);
      setLikeCount(prevCount);
      toast.error("Couldn't update like");
    } finally {
      setLikeLoading(false);
    }
  };

  const submitComment = async () => {
    if (!session?.user) {
      toast.error("Sign in to comment");
      return;
    }
    const trimmed = draft.trim();
    if (!trimmed) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/blog/${slug}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: trimmed }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Couldn't post comment");
      }
      const comment = await res.json();
      setComments((prev) => [comment, ...prev]);
      setDraft("");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Couldn't post comment");
    } finally {
      setSubmitting(false);
    }
  };

  const deleteComment = async (commentId: string) => {
    const prev = comments;
    setComments((c) => c.filter((x) => x.id !== commentId));
    try {
      const res = await fetch(`/api/blog/${slug}/comments/${commentId}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
    } catch {
      setComments(prev);
      toast.error("Couldn't delete comment");
    }
  };

  return (
    <div className="mt-10">
      {/* Like button */}
      <button
        onClick={toggleLike}
        disabled={likeLoading}
        className="flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-medium transition-colors disabled:opacity-60"
        style={{
          borderColor: "var(--border)",
          background: liked ? "var(--accent)" : "var(--card-bg)",
          color: liked ? "#fff" : "var(--text-primary)",
        }}
      >
        <Heart size={16} fill={liked ? "currentColor" : "none"} />
        {likeCount > 0 ? likeCount : ""} {likeCount === 1 ? "Like" : "Likes"}
      </button>

      {/* Comments */}
      <div className="mt-8">
        <p className="flex items-center gap-1.5 text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>
          <MessageCircle size={16} />
          Comments {comments.length > 0 && `(${comments.length})`}
        </p>

        {session?.user ? (
          <div className="mb-6">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Share your thoughts..."
              rows={3}
              maxLength={2000}
              className="w-full rounded-xl border p-3 text-sm resize-none focus:outline-none"
              style={{ background: "var(--card-bg)", borderColor: "var(--border)", color: "var(--text-primary)" }}
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={submitComment}
                disabled={submitting || !draft.trim()}
                className="px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {submitting ? "Posting..." : "Post comment"}
              </button>
            </div>
          </div>
        ) : (
          <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
            <Link href="/login" className="underline">Sign in</Link> to join the conversation.
          </p>
        )}

        {commentsLoading ? (
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>Loading comments...</p>
        ) : comments.length === 0 ? (
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>No comments yet. Be the first to share your thoughts.</p>
        ) : (
          <div className="space-y-4">
            {comments.map((c) => (
              <div key={c.id} className="rounded-xl border p-4" style={{ background: "var(--card-bg)", borderColor: "var(--border)" }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{c.author.name}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {new Date(c.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    {session?.user?.id === c.author.id && (
                      <button
                        onClick={() => deleteComment(c.id)}
                        aria-label="Delete comment"
                        className="transition-colors"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: "var(--text-secondary)" }}>{c.content}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
