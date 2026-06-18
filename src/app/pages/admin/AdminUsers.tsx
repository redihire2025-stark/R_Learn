import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Badge } from "../../components/ui/badge";
import { Skeleton } from "../../components/ui/skeleton";
import { supabase } from "../../lib/supabase";
import { sendApprovalEmail } from "../../lib/emailService";
import { Search, CheckCircle, X, UserCheck, Users, ShieldCheck, Clock } from "lucide-react";

interface Profile {
  id: string;
  full_name: string;
  email: string;
  department: string;
  role: string;
  is_approved: boolean;
  xp: number;
  streak: number;
  created_at: string;
}

export function AdminUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "active">("all");

  useEffect(() => { fetchUsers(); }, []);

  async function fetchUsers() {
    setLoading(true);
    const { data } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    setUsers(data ?? []);
    setLoading(false);
  }

  async function approveUser(id: string) {
    const approved = users.find((u) => u.id === id);
    await supabase.from("profiles").update({ is_approved: true }).eq("id", id);
    if (approved) {
      await sendApprovalEmail({ name: approved.full_name, email: approved.email });
    }
    fetchUsers();
  }

  async function rejectUser(id: string) {
    await supabase.from("profiles").delete().eq("id", id);
    fetchUsers();
  }

  async function changeRole(id: string, role: string) {
    await supabase.from("profiles").update({ role }).eq("id", id);
    fetchUsers();
  }

  function timeAgo(ts: string) {
    const diff = Date.now() - new Date(ts).getTime();
    const h = Math.floor(diff / 3600000);
    if (h < 1) return "Just now";
    if (h < 24) return `${h}h ago`;
    return `${Math.floor(h / 24)}d ago`;
  }

  const filtered = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = u.full_name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.department.toLowerCase().includes(q);
    const matchFilter = filter === "all" || (filter === "pending" && !u.is_approved) || (filter === "active" && u.is_approved);
    return matchSearch && matchFilter;
  });

  const pendingCount = users.filter((u) => !u.is_approved).length;
  const activeCount = users.filter((u) => u.is_approved).length;

  const roleColors: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700 border-purple-200",
    mentor: "bg-blue-100 text-blue-700 border-blue-200",
    employee: "bg-gray-100 text-gray-700 border-gray-200",
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-muted-foreground mt-1">Manage platform users, approvals, and roles</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setFilter("all")}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 bg-blue-100 rounded-lg"><Users className="w-5 h-5 text-blue-600" /></div>
            <div><p className="text-2xl font-bold">{users.length}</p><p className="text-xs text-muted-foreground">Total Users</p></div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setFilter("active")}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 bg-green-100 rounded-lg"><ShieldCheck className="w-5 h-5 text-green-600" /></div>
            <div><p className="text-2xl font-bold">{activeCount}</p><p className="text-xs text-muted-foreground">Active Users</p></div>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:border-primary transition-colors" onClick={() => setFilter("pending")}>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="p-2 bg-orange-100 rounded-lg"><Clock className="w-5 h-5 text-orange-600" /></div>
            <div><p className="text-2xl font-bold">{pendingCount}</p><p className="text-xs text-muted-foreground">Pending Approval</p></div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row gap-3 items-start md:items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              {filter === "pending" ? "Pending Approvals" : filter === "active" ? "Active Users" : "All Users"}
              {pendingCount > 0 && filter !== "active" && (
                <Badge variant="destructive" className="ml-1">{pendingCount} pending</Badge>
              )}
            </CardTitle>
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search by name, email, department..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">{Array(5).fill(0).map((_, i) => <Skeleton key={i} className="h-16 rounded-lg" />)}</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Users className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p>No users found</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((u) => (
                <div key={u.id} className="flex items-center gap-4 p-4 border border-border rounded-lg hover:bg-accent/30 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-bold flex-shrink-0">
                    {u.full_name.split(" ").map((n) => n[0]).join("").substring(0, 2).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-sm font-semibold">{u.full_name}</p>
                      <span className={`text-xs px-2 py-0.5 rounded border font-medium ${roleColors[u.role] ?? ""}`}>{u.role}</span>
                      <span className={`text-xs px-2 py-0.5 rounded font-medium ${u.is_approved ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                        {u.is_approved ? "Active" : "Pending"}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{u.email} · {u.department} · Joined {timeAgo(u.created_at)}</p>
                    {u.is_approved && <p className="text-xs text-muted-foreground">{u.xp} XP · {u.streak} day streak</p>}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {!u.is_approved ? (
                      <>
                        <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700 text-xs" onClick={() => approveUser(u.id)}>
                          <CheckCircle className="w-3.5 h-3.5 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="outline" className="h-8 text-xs text-red-600 border-red-200 hover:bg-red-50" onClick={() => rejectUser(u.id)}>
                          <X className="w-3.5 h-3.5 mr-1" /> Reject
                        </Button>
                      </>
                    ) : (
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value)}
                        className="text-xs border border-border rounded-md px-2 py-1.5 bg-background cursor-pointer"
                      >
                        <option value="employee">Employee</option>
                        <option value="mentor">Mentor</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
