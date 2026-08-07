import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function AdminUsersPage() {
  const [users, entryCounts] = await Promise.all([
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      select: { id: true, name: true, email: true, createdAt: true },
    }),
    prisma.entry.groupBy({
      by: ["userId"],
      where: { deletedAt: null },
      _count: { id: true },
    }),
  ]);

  const countByUserId = new Map(entryCounts.map((c) => [c.userId, c._count.id]));

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-1">Users</h1>
      <p className="text-sm mb-6" style={{ color: "var(--text-muted)" }}>
        {users.length} {users.length === 1 ? "user" : "users"}
      </p>

      <div className="rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: "var(--bg-elevated)" }}>
              <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--text-muted)" }}>Name</th>
              <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--text-muted)" }}>Email</th>
              <th className="text-left px-4 py-3 font-semibold" style={{ color: "var(--text-muted)" }}>Joined</th>
              <th className="text-right px-4 py-3 font-semibold" style={{ color: "var(--text-muted)" }}>Entries</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t" style={{ borderColor: "var(--border)" }}>
                <td className="px-4 py-3">
                  <Link href={`/admin/users/${user.id}`} className="font-medium hover:underline" style={{ color: "var(--text-primary)" }}>
                    {user.name || "—"}
                  </Link>
                </td>
                <td className="px-4 py-3" style={{ color: "var(--text-secondary)" }}>{user.email}</td>
                <td className="px-4 py-3" style={{ color: "var(--text-muted)" }}>
                  {user.createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                </td>
                <td className="px-4 py-3 text-right font-medium" style={{ color: "var(--text-primary)" }}>
                  {countByUserId.get(user.id) ?? 0}
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center" style={{ color: "var(--text-muted)" }}>
                  No users yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
