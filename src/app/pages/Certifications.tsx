import { useState, useEffect } from "react";
import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Award, Download, Share2, CheckCircle, Lock, Clock } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import { Skeleton } from "../components/ui/skeleton";
import { Progress } from "../components/ui/progress";

interface Cert { id: string; title: string; description: string; requirements: Record<string, unknown>; }
interface UserCert { id: string; certification_id: string; verification_id: string; issued_at: string; cert: Cert; }

export function Certifications() {
  const { user } = useAuth();
  const [allCerts, setAllCerts] = useState<Cert[]>([]);
  const [userCerts, setUserCerts] = useState<UserCert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { if (user) fetchData(); }, [user]);

  async function fetchData() {
    setLoading(true);
    const { data: certs } = await supabase.from("certifications").select("*");
    const { data: uCerts } = user ? await supabase.from("user_certifications").select("*, cert:certification_id(*)").eq("user_id", user.id) : { data: [] };
    setAllCerts(certs ?? []);
    setUserCerts((uCerts as unknown as UserCert[]) ?? []);
    setLoading(false);
  }

  const earnedIds = new Set(userCerts.map((uc) => uc.certification_id));

  if (loading) return <div className="p-8 space-y-4"><Skeleton className="h-8 w-64" /><div className="grid grid-cols-2 gap-4">{Array(4).fill(0).map((_, i) => <Skeleton key={i} className="h-48" />)}</div></div>;

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Certifications</h1>
        <p className="text-muted-foreground mt-1">{userCerts.length} earned · {allCerts.length - userCerts.length} remaining</p>
      </div>

      {userCerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-green-700 dark:text-green-400 flex items-center gap-2"><CheckCircle className="w-5 h-5" />Earned Certificates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {userCerts.map((uc) => (
              <div key={uc.id} className="relative bg-gradient-to-br from-primary/5 to-primary/10 border border-primary/20 rounded-xl p-5 overflow-hidden">
                <div className="absolute top-0 left-0 w-1.5 h-full bg-primary rounded-l-xl" />
                <div className="pl-2">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <Award className="w-6 h-6 text-primary mb-1" />
                      <h3 className="font-bold">{uc.cert?.title ?? "Certificate"}</h3>
                      <p className="text-sm text-muted-foreground">{uc.cert?.description}</p>
                    </div>
                    <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  </div>
                  <div className="text-xs text-muted-foreground mt-3 font-mono">{uc.verification_id}</div>
                  <div className="text-xs text-muted-foreground">Issued: {new Date(uc.issued_at).toLocaleDateString()}</div>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="h-7 text-xs"><Download className="w-3 h-3 mr-1" />Download</Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs"><Share2 className="w-3 h-3 mr-1" />Share</Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2"><Clock className="w-5 h-5 text-muted-foreground" />Available Certifications</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {allCerts.filter((c) => !earnedIds.has(c.id)).map((cert) => (
            <div key={cert.id} className="border border-border rounded-xl p-5 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <Lock className="w-5 h-5 text-muted-foreground mb-1" />
                  <h3 className="font-bold">{cert.title}</h3>
                  <p className="text-sm text-muted-foreground">{cert.description}</p>
                </div>
              </div>
              <div className="space-y-1 text-xs text-muted-foreground">
                {Object.entries(cert.requirements).map(([k, v]) => (
                  <div key={k} className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
                    <span>{String(v)}</span>
                  </div>
                ))}
              </div>
              <Progress value={0} className="h-1.5" />
              <div className="text-xs text-muted-foreground">Complete requirements to unlock</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
