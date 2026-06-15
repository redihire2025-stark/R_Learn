import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { Award, Download, Share2, CheckCircle, Lock, Calendar, Trophy } from "lucide-react";
import { supabase, Certification, UserCertification } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import { Link } from "react-router-dom";

type CertWithStatus = Certification & {
  earned?: UserCertification;
  challengeProgress: number;
  isLocked: boolean;
};

export function Certifications() {
  const { user } = useAuth();
  const [certs, setCerts] = useState<CertWithStatus[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadCerts();
  }, [user?.id]);

  async function loadCerts() {
    setLoading(true);
    try {
      const [{ data: certData }, { data: userCertData }, { data: subData }] = await Promise.all([
        supabase.from("certifications").select("*").order("order_index"),
        supabase.from("user_certifications").select("*").eq("user_id", user!.id),
        supabase
          .from("challenge_submissions")
          .select("challenge_id")
          .eq("user_id", user!.id)
          .eq("passed", true),
      ]);

      const earnedMap: Record<string, UserCertification> = {};
      (userCertData as UserCertification[] ?? []).forEach((uc) => {
        earnedMap[uc.cert_id] = uc;
      });

      const solvedCount = new Set((subData ?? []).map((s) => s.challenge_id)).size;
      const earnedCount = (userCertData?.length ?? 0);

      const withStatus: CertWithStatus[] = (certData as Certification[] ?? []).map((cert, i) => {
        const earned = earnedMap[cert.id];
        const challengeProgress = Math.min(100, Math.round((solvedCount / Math.max(cert.required_challenge_count, 1)) * 100));
        // Lock if requires prior certs (simple: require earnedCount >= order_index - 1 for later certs)
        const isLocked = !earned && cert.order_index > 3 && earnedCount < cert.order_index - 2;
        return { ...cert, earned, challengeProgress, isLocked };
      });

      setCerts(withStatus);
    } finally {
      setLoading(false);
    }
  }

  const earned = certs.filter((c) => c.earned);
  const available = certs.filter((c) => !c.earned && !c.isLocked);
  const locked = certs.filter((c) => !c.earned && c.isLocked);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Certifications</h1>
        <p className="text-muted-foreground mt-1">Earn professional certifications to showcase your skills</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Certificates Earned</CardTitle>
            <Award className="w-4 h-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : (
              <><div className="text-2xl font-bold">{earned.length}</div>
              <p className="text-xs text-muted-foreground">{available.length} available to earn</p></>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
            <Trophy className="w-4 h-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : (
              <><div className="text-2xl font-bold">{available.filter((c) => c.challengeProgress > 0).length}</div>
              <p className="text-xs text-muted-foreground">Keep going!</p></>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completion Rate</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-500" />
          </CardHeader>
          <CardContent>
            {loading ? <Skeleton className="h-8 w-16" /> : (
              <><div className="text-2xl font-bold">
                {certs.length > 0 ? Math.round((earned.length / certs.length) * 100) : 0}%
              </div>
              <p className="text-xs text-muted-foreground">Of total available</p></>
            )}
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => <Skeleton key={i} className="h-56 w-full" />)}
        </div>
      ) : (
        <>
          {/* Earned */}
          {earned.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Your Certificates</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {earned.map((cert) => (
                  <Card key={cert.id} className="bg-gradient-to-br from-yellow-500/10 to-amber-500/5 border-yellow-500/20">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                          <Award className="w-6 h-6 text-yellow-500" />
                        </div>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      </div>
                      <CardTitle className="text-lg">{cert.title}</CardTitle>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        Issued {new Date(cert.earned!.issued_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex flex-wrap gap-1">
                        {cert.skills.map((s) => <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>)}
                      </div>
                      <div className="p-2 bg-muted rounded text-xs font-mono text-center break-all">
                        {cert.earned!.verification_id}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Download className="w-4 h-4 mr-2" />Download
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Share2 className="w-4 h-4 mr-2" />Share
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Available */}
          {available.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold">Available Certifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {available.map((cert) => (
                  <Card key={cert.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <Award className="w-6 h-6 text-primary" />
                        </div>
                        {cert.challengeProgress > 0 && (
                          <Badge variant="secondary">{cert.challengeProgress}% complete</Badge>
                        )}
                      </div>
                      <CardTitle className="text-lg">{cert.title}</CardTitle>
                      <p className="text-sm text-muted-foreground">{cert.description}</p>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium">Requirements:</p>
                        <ul className="space-y-1.5 text-sm">
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">Solve {cert.required_challenge_count} coding challenges</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <CheckCircle className="w-4 h-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                            <span className="text-muted-foreground">Pass quiz with {cert.required_quiz_pass_score}%+ score</span>
                          </li>
                        </ul>
                      </div>
                      {cert.challengeProgress > 0 && (
                        <div>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-muted-foreground">Challenge Progress</span>
                            <span className="font-medium">{cert.challengeProgress}%</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary transition-all" style={{ width: `${cert.challengeProgress}%` }} />
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Link to="/challenges" className="flex-1">
                          <Button className="w-full" size="sm">
                            {cert.challengeProgress > 0 ? "Continue" : "Start Learning"}
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Locked */}
          {locked.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-muted-foreground">Locked</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {locked.map((cert) => (
                  <Card key={cert.id} className="opacity-60">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                          <Lock className="w-6 h-6 text-muted-foreground" />
                        </div>
                      </div>
                      <CardTitle className="text-lg">{cert.title}</CardTitle>
                      {cert.unlock_requirement && (
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          {cert.unlock_requirement}
                        </p>
                      )}
                    </CardHeader>
                    <CardContent>
                      <Button className="w-full" disabled variant="outline">Locked</Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
