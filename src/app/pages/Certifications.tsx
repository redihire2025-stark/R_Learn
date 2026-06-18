import { useState, useEffect, useRef } from "react";
import { Award, Download, Share2, Lock, BookOpen, CheckCircle2, Clock, X, Sparkles, GraduationCap } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";
import { Skeleton } from "../components/ui/skeleton";
import { getCourseLogoUrl, getCourseAccentColor } from "../lib/utils";

const TEST_UNLOCK_ALL = false;

// ─── Types ──────────────────────────────────────────────────────────────────
interface Course { id: string; title: string; description: string; category: string; difficulty: string; }
interface CourseWithProgress extends Course { progress: number; totalLessons: number; completedLessons: number; }
interface CertRecord { courseId: string; verificationId: string; issuedAt: string; }

// ─── Helpers ─────────────────────────────────────────────────────────────────
function genCertId(userId: string, courseId: string): string {
  let h = 0;
  for (const ch of userId + courseId) { h = Math.imul(31, h) + ch.charCodeAt(0) | 0; }
  const hex = Math.abs(h).toString(16).toUpperCase().padStart(8, "0");
  return `RLCERT-${hex.slice(0, 4)}-${hex.slice(4)}`;
}

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

const diffConfig: Record<string, string> = {
  Beginner:     "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/30",
  Intermediate: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-500/30",
  Advanced:     "bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-500/30",
};

// ─── Certificate Modal ────────────────────────────────────────────────────────
function CertificateModal({
  course, cert, userName, onClose,
}: {
  course: CourseWithProgress;
  cert: CertRecord;
  userName: string;
  onClose: () => void;
}) {
  const accent = getCourseAccentColor(course.title);
  const certRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  async function handleDownload() {
    if (downloading) return;
    setDownloading(true);
    try {
      const W = 1587, H = 1122;
      const cv = document.createElement("canvas");
      cv.width = W; cv.height = H;
      const c = cv.getContext("2d")!;

      // Background
      c.fillStyle = "#ffffff";
      c.fillRect(0, 0, W, H);

      // Border
      c.strokeStyle = accent; c.lineWidth = 5;
      c.strokeRect(2.5, 2.5, W - 5, H - 5);

      // Top stripe
      const tg = c.createLinearGradient(0, 0, W, 0);
      tg.addColorStop(0, accent); tg.addColorStop(0.5, accent + "80"); tg.addColorStop(1, accent + "20");
      c.fillStyle = tg; c.fillRect(0, 0, W, 16);

      // Bottom stripe
      const bg = c.createLinearGradient(0, 0, W, 0);
      bg.addColorStop(0, accent + "20"); bg.addColorStop(0.5, accent + "80"); bg.addColorStop(1, accent);
      c.fillStyle = bg; c.fillRect(0, H - 16, W, 16);

      // Corner ornaments
      [[50, 50, 1, 1], [W - 50, 50, -1, 1], [50, H - 50, 1, -1], [W - 50, H - 50, -1, -1]].forEach(([x, y, sx, sy]) => {
        c.save(); c.translate(x, y); c.scale(sx, sy);
        c.beginPath(); c.moveTo(0, 0); c.lineTo(40, 0); c.lineTo(0, 40); c.closePath();
        c.fillStyle = accent + "30"; c.fill();
        c.strokeStyle = accent; c.lineWidth = 3; c.lineCap = "round";
        c.beginPath(); c.moveTo(0, 0); c.lineTo(32, 0); c.stroke();
        c.beginPath(); c.moveTo(0, 0); c.lineTo(0, 32); c.stroke();
        c.beginPath(); c.arc(0, 0, 4, 0, Math.PI * 2); c.fillStyle = accent; c.fill();
        c.restore();
      });

      // Try loading logo (don't block on failure)
      let logo: HTMLImageElement | null = null;
      try {
        logo = new Image(); logo.crossOrigin = "anonymous";
        await Promise.race([
          new Promise<void>((res, rej) => { logo!.onload = () => res(); logo!.onerror = rej; logo!.src = getCourseLogoUrl(course.title); }),
          new Promise<void>((_, rej) => setTimeout(rej, 2500)),
        ]);
      } catch { logo = null; }

      const cx = W / 2;
      c.textAlign = "center";

      // Header
      if (logo) c.drawImage(logo, cx - 90, 68, 36, 36);
      c.fillStyle = accent; c.font = "bold 16px Arial, sans-serif";
      c.fillText("R-LEARN PLATFORM", logo ? cx - 10 : cx, 90);
      c.fillStyle = "#9ca3af"; c.font = "13px Arial, sans-serif";
      c.fillText("DEVELOPER CERTIFICATION", logo ? cx - 10 : cx, 112);

      // Divider
      const dg = c.createLinearGradient(cx - 220, 0, cx + 220, 0);
      dg.addColorStop(0, "transparent"); dg.addColorStop(0.5, accent); dg.addColorStop(1, "transparent");
      c.strokeStyle = dg; c.lineWidth = 1.5;
      c.beginPath(); c.moveTo(cx - 220, 155); c.lineTo(cx + 220, 155); c.stroke();

      // Subtitle
      c.fillStyle = "#9ca3af"; c.font = "bold 15px Arial, sans-serif";
      c.fillText("CERTIFICATE OF COMPLETION", cx, 210);
      c.font = "14px Arial, sans-serif";
      c.fillText("This is to certify that", cx, 248);

      // Name
      c.fillStyle = "#111827"; c.font = "bold 58px Georgia, serif";
      c.fillText(userName, cx, 340);
      const nw = c.measureText(userName).width * 0.75;
      const ug = c.createLinearGradient(cx - nw / 2, 0, cx + nw / 2, 0);
      ug.addColorStop(0, "transparent"); ug.addColorStop(0.5, accent); ug.addColorStop(1, "transparent");
      c.strokeStyle = ug; c.lineWidth = 2;
      c.beginPath(); c.moveTo(cx - nw / 2, 356); c.lineTo(cx + nw / 2, 356); c.stroke();

      c.fillStyle = "#9ca3af"; c.font = "14px Arial, sans-serif";
      c.fillText("has successfully completed the course", cx, 400);

      // Course title
      c.fillStyle = accent; c.font = "bold 40px Georgia, serif";
      c.fillText(course.title, cx, 474);
      c.fillStyle = "#9ca3af"; c.font = "14px Arial, sans-serif";
      c.fillText(`${course.category} · ${course.difficulty}`, cx, 510);

      // Footer
      const fy = H - 88;
      c.textAlign = "left"; c.fillStyle = "#9ca3af"; c.font = "11px Arial, sans-serif";
      c.fillText("ISSUE DATE", 180, fy - 22);
      c.fillStyle = "#374151"; c.font = "bold 14px Arial, sans-serif";
      c.fillText(fmtDate(cert.issuedAt), 180, fy);

      // Seal
      c.beginPath(); c.arc(cx, fy - 14, 38, 0, Math.PI * 2);
      c.fillStyle = accent + "15"; c.fill();
      c.beginPath(); c.arc(cx, fy - 14, 38, 0, Math.PI * 2);
      c.strokeStyle = accent + "50"; c.lineWidth = 2; c.stroke();
      c.fillStyle = accent; c.font = "bold 32px Arial"; c.textAlign = "center";
      c.fillText("✓", cx, fy - 3);

      // Cert ID
      c.textAlign = "right"; c.fillStyle = "#9ca3af"; c.font = "11px Arial, sans-serif";
      c.fillText("CERTIFICATE ID", W - 180, fy - 22);
      c.fillStyle = "#6b7280"; c.font = "bold 12px monospace";
      c.fillText(cert.verificationId, W - 180, fy);

      // Download
      const link = document.createElement("a");
      link.download = `${course.title.replace(/\s+/g, "-")}-Certificate.png`;
      link.href = cv.toDataURL("image/png");
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } finally {
      setDownloading(false);
    }
  }

  function handleShare() {
    navigator.clipboard.writeText(cert.verificationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose}>
      <div className="relative w-full max-w-3xl" onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button onClick={onClose} className="absolute -top-10 right-0 text-white/70 hover:text-white flex items-center gap-1.5 text-sm">
          <X className="w-4 h-4" /> Close
        </button>

        {/* Action buttons */}
        <div className="flex gap-2 justify-end mb-3">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copied ? "Copied!" : "Copy ID"}
          </button>
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg text-black font-semibold transition-all disabled:opacity-60"
            style={{ background: accent }}
          >
            <Download className="w-3.5 h-3.5" />
            {downloading ? "Generating…" : "Download PNG"}
          </button>
        </div>

        {/* ── The certificate itself ── */}
        <div
          ref={certRef}
          className="relative w-full bg-white overflow-hidden select-none"
          style={{
            aspectRatio: "1.414 / 1",
            border: `3px solid ${accent}`,
            borderRadius: 12,
            boxShadow: `0 0 0 8px ${accent}18, 0 25px 60px rgba(0,0,0,0.4)`,
          }}
        >
          {/* Top accent stripe */}
          <div className="absolute top-0 left-0 right-0 h-2" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}80, ${accent}20)` }} />
          {/* Bottom accent stripe */}
          <div className="absolute bottom-0 left-0 right-0 h-2" style={{ background: `linear-gradient(90deg, ${accent}20, ${accent}80, ${accent})` }} />

          {/* Corner ornaments */}
          {[
            "top-4 left-4",
            "top-4 right-4 scale-x-[-1]",
            "bottom-4 left-4 scale-y-[-1]",
            "bottom-4 right-4 scale-x-[-1] scale-y-[-1]",
          ].map((pos) => (
            <svg key={pos} className={`absolute ${pos} w-12 h-12`} viewBox="0 0 48 48" fill="none">
              <path d="M4 4 L20 4 L4 20 Z" fill={`${accent}30`} />
              <path d="M4 4 L16 4" stroke={accent} strokeWidth="2" strokeLinecap="round" />
              <path d="M4 4 L4 16" stroke={accent} strokeWidth="2" strokeLinecap="round" />
              <circle cx="4" cy="4" r="2" fill={accent} />
            </svg>
          ))}

          {/* Certificate content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-16 py-8 text-center">
            {/* Header */}
            <div className="flex items-center gap-3 mb-3">
              <img src={getCourseLogoUrl(course.title)} alt="" className="w-9 h-9 object-contain" />
              <div className="text-left">
                <div className="text-xs font-black tracking-[0.2em] uppercase" style={{ color: accent }}>R-Learn Platform</div>
                <div className="text-[10px] text-gray-400 tracking-widest uppercase">Developer Certification</div>
              </div>
            </div>

            {/* Divider */}
            <div className="flex items-center gap-3 w-full max-w-sm mb-4">
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, transparent, ${accent})` }} />
              <GraduationCap className="w-5 h-5 flex-shrink-0" style={{ color: accent }} />
              <div className="flex-1 h-px" style={{ background: `linear-gradient(90deg, ${accent}, transparent)` }} />
            </div>

            {/* Main title */}
            <div className="text-[10px] font-bold tracking-[0.35em] uppercase text-gray-400 mb-1">Certificate of Completion</div>
            <div className="text-[9px] tracking-widest text-gray-300 mb-5">This is to certify that</div>

            {/* Name */}
            <div className="relative mb-1">
              <div className="text-3xl font-black text-gray-800 tracking-wide" style={{ fontFamily: "Georgia, serif" }}>
                {userName}
              </div>
              <div className="h-0.5 mt-1 rounded-full mx-auto w-3/4" style={{ background: `linear-gradient(90deg, transparent, ${accent}, transparent)` }} />
            </div>

            <div className="text-[10px] text-gray-400 tracking-widest mb-4">has successfully completed the course</div>

            {/* Course name */}
            <div className="text-xl font-black mb-1" style={{ color: accent, fontFamily: "Georgia, serif" }}>
              {course.title}
            </div>
            <div className="text-[10px] text-gray-400 mb-5">{course.category} · {course.difficulty}</div>

            {/* Footer row */}
            <div className="flex items-end justify-between w-full max-w-md mt-auto">
              <div className="text-left">
                <div className="text-[9px] text-gray-400 uppercase tracking-wider">Issue Date</div>
                <div className="text-[11px] font-bold text-gray-700">{fmtDate(cert.issuedAt)}</div>
              </div>

              {/* Seal */}
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0"
                style={{
                  background: `radial-gradient(circle, ${accent}20, ${accent}08)`,
                  border: `2px solid ${accent}50`,
                  boxShadow: `0 0 0 3px ${accent}20`,
                }}
              >
                <CheckCircle2 className="w-7 h-7" style={{ color: accent }} />
              </div>

              <div className="text-right">
                <div className="text-[9px] text-gray-400 uppercase tracking-wider">Certificate ID</div>
                <div className="text-[9px] font-bold text-gray-500 font-mono">{cert.verificationId}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export function Certifications() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [certMap, setCertMap] = useState<Map<string, CertRecord>>(new Map());
  const [loading, setLoading] = useState(true);
  const [activeCert, setActiveCert] = useState<{ course: CourseWithProgress; cert: CertRecord } | null>(null);

  useEffect(() => { if (user) fetchData(); }, [user]);

  async function fetchData() {
    if (!user) return;
    setLoading(true);

    // 1. All published courses
    const { data: coursesData } = await supabase.from("courses").select("*").eq("is_published", true).order("created_at");
    if (!coursesData) { setLoading(false); return; }

    // 2. All modules for these courses (one query)
    const courseIds = coursesData.map((c) => c.id);
    const { data: allModules } = await supabase.from("modules").select("id, course_id").in("course_id", courseIds);
    const moduleIds = (allModules ?? []).map((m) => m.id);

    // 3. All lessons for these modules (one query)
    const { data: allLessons } = await supabase.from("lessons").select("id, module_id").in("module_id", moduleIds);

    // 4. User's completed lessons (one query)
    const lessonIds = (allLessons ?? []).map((l) => l.id);
    const { data: userProgress } = await supabase
      .from("user_progress")
      .select("lesson_id")
      .eq("user_id", user.id)
      .in("lesson_id", lessonIds);
    const completedSet = new Set((userProgress ?? []).map((p) => p.lesson_id));

    // 5. Build course-level progress
    const modulesByCourse = new Map<string, string[]>();
    (allModules ?? []).forEach((m) => {
      if (!modulesByCourse.has(m.course_id)) modulesByCourse.set(m.course_id, []);
      modulesByCourse.get(m.course_id)!.push(m.id);
    });

    const lessonsByModule = new Map<string, string[]>();
    (allLessons ?? []).forEach((l) => {
      if (!lessonsByModule.has(l.module_id)) lessonsByModule.set(l.module_id, []);
      lessonsByModule.get(l.module_id)!.push(l.id);
    });

    const enriched: CourseWithProgress[] = coursesData.map((course) => {
      const mIds = modulesByCourse.get(course.id) ?? [];
      const lIds = mIds.flatMap((mid) => lessonsByModule.get(mid) ?? []);
      const total = lIds.length;
      const completed = lIds.filter((lid) => completedSet.has(lid)).length;
      const progress = total > 0 ? Math.round((completed / total) * 100) : 0;
      return { ...course, progress, totalLessons: total, completedLessons: completed };
    });

    // 6. Build cert map — deterministic IDs, issue date persisted in localStorage
    const storageKey = `rl_cert_dates_${user.id}`;
    const issuedDates: Record<string, string> = JSON.parse(localStorage.getItem(storageKey) ?? "{}");
    let changed = false;
    const newCertMap = new Map<string, CertRecord>();

    for (const course of enriched) {
      if (TEST_UNLOCK_ALL || course.progress === 100) {
        const vId = genCertId(user.id, course.id);
        if (!issuedDates[course.id]) {
          issuedDates[course.id] = new Date().toISOString();
          changed = true;
        }
        newCertMap.set(course.id, { courseId: course.id, verificationId: vId, issuedAt: issuedDates[course.id] });
      }
    }
    if (changed) localStorage.setItem(storageKey, JSON.stringify(issuedDates));

    setCourses(enriched);
    setCertMap(newCertMap);
    setLoading(false);
  }

  const earned     = TEST_UNLOCK_ALL ? courses : courses.filter((c) => c.progress === 100);
  const inProgress = TEST_UNLOCK_ALL ? [] : courses.filter((c) => c.progress > 0 && c.progress < 100);
  const locked     = TEST_UNLOCK_ALL ? [] : courses.filter((c) => c.progress === 0);

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-10">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-2.5">
            <GraduationCap className="w-8 h-8 text-primary" /> Certifications
          </h1>
          <p className="text-muted-foreground mt-1.5">Complete a course to earn your official digital certificate</p>
        </div>
        {/* Stats */}
        <div className="flex gap-3">
          {[
            { val: earned.length,     label: "Earned",      color: "text-emerald-500" },
            { val: inProgress.length, label: "In Progress", color: "text-amber-500"   },
            { val: locked.length,     label: "Locked",      color: "text-muted-foreground" },
          ].map((s) => (
            <div key={s.label} className="bg-card border border-border rounded-xl px-4 py-3 text-center min-w-[72px]">
              <div className={`text-xl font-black ${s.color}`}>{s.val}</div>
              <div className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-52 rounded-2xl" />)}
        </div>
      ) : (
        <>
          {/* ── Earned certificates ── */}
          {earned.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-yellow-500" /> Earned · {earned.length}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {earned.map((course) => {
                  const accent = getCourseAccentColor(course.title);
                  const cert   = certMap.get(course.id)!;
                  return (
                    <div
                      key={course.id}
                      className="group relative overflow-hidden rounded-2xl border bg-card transition-all duration-300 hover:shadow-xl hover:shadow-black/10 dark:hover:shadow-black/30 hover:-translate-y-0.5 cursor-pointer"
                      style={{ borderColor: `${accent}40` }}
                      onClick={() => setActiveCert({ course, cert })}
                    >
                      {/* Accent top stripe */}
                      <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${accent}, ${accent}50, transparent)` }} />

                      <div className="p-5">
                        {/* Mini certificate preview */}
                        <div
                          className="relative w-full rounded-xl overflow-hidden mb-4 flex items-center justify-center"
                          style={{
                            height: 130,
                            background: `radial-gradient(ellipse at 50% 50%, ${accent}12 0%, transparent 70%), #fafafa`,
                            border: `1px solid ${accent}25`,
                          }}
                        >
                          {/* Decorative corners */}
                          <div className="absolute top-2 left-2 w-5 h-5 border-l-2 border-t-2 rounded-tl-sm" style={{ borderColor: `${accent}60` }} />
                          <div className="absolute top-2 right-2 w-5 h-5 border-r-2 border-t-2 rounded-tr-sm" style={{ borderColor: `${accent}60` }} />
                          <div className="absolute bottom-2 left-2 w-5 h-5 border-l-2 border-b-2 rounded-bl-sm" style={{ borderColor: `${accent}60` }} />
                          <div className="absolute bottom-2 right-2 w-5 h-5 border-r-2 border-b-2 rounded-br-sm" style={{ borderColor: `${accent}60` }} />

                          {/* Content */}
                          <div className="text-center px-6">
                            <div className="text-[8px] tracking-[0.25em] uppercase font-bold mb-1" style={{ color: accent }}>Certificate of Completion</div>
                            <div className="text-gray-800 font-black text-base leading-tight" style={{ fontFamily: "Georgia, serif" }}>
                              {user?.name ?? user?.email?.split("@")[0]}
                            </div>
                            <div className="h-px my-1.5 mx-auto w-24" style={{ background: accent }} />
                            <div className="text-[10px] font-bold text-gray-600 truncate max-w-[200px]">{course.title}</div>
                          </div>
                          {/* Tech logo */}
                          <img src={getCourseLogoUrl(course.title)} alt="" className="absolute bottom-2.5 right-3 w-7 h-7 object-contain opacity-50" />
                          {/* Seal */}
                          <div className="absolute bottom-2.5 left-3 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${accent}15`, border: `1px solid ${accent}30` }}>
                            <CheckCircle2 className="w-4 h-4" style={{ color: accent }} />
                          </div>
                        </div>

                        {/* Card footer */}
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <div className="flex items-center gap-1.5">
                              <Award className="w-3.5 h-3.5 flex-shrink-0" style={{ color: accent }} />
                              <span className="text-sm font-bold text-foreground line-clamp-1">{course.title}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                              <span className="font-mono">{cert.verificationId}</span>
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              Issued {fmtDate(cert.issuedAt)}
                            </div>
                          </div>
                          <div className="flex gap-1.5 flex-shrink-0">
                            <button
                              onClick={(e) => { e.stopPropagation(); navigator.clipboard.writeText(cert.verificationId); }}
                              className="p-1.5 rounded-lg border border-border hover:bg-accent transition-colors"
                              title="Copy ID"
                            >
                              <Share2 className="w-3.5 h-3.5 text-muted-foreground" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setActiveCert({ course, cert }); }}
                              className="flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1.5 rounded-lg text-white transition-all"
                              style={{ background: accent }}
                            >
                              <Download className="w-3 h-3" /> View
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── In Progress ── */}
          {inProgress.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 text-amber-500" /> In Progress · {inProgress.length}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {inProgress.map((course) => {
                  const accent = getCourseAccentColor(course.title);
                  return (
                    <div key={course.id} className="bg-card border border-border rounded-xl p-4 space-y-3 transition-all hover:shadow-md hover:-translate-y-px">
                      <div className="flex items-center gap-3">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 relative bg-slate-100 dark:bg-[#0a0c10] overflow-hidden"
                          style={{ borderWidth: 1, borderStyle: "solid", borderColor: `${accent}35` }}
                        >
                          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${accent}28 0%, transparent 75%)` }} />
                          <img src={getCourseLogoUrl(course.title)} alt="" className="w-7 h-7 object-contain relative z-10" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-sm font-bold text-foreground line-clamp-1">{course.title}</div>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded border font-bold tracking-wider uppercase ${diffConfig[course.difficulty] ?? ""}`}>
                            {course.difficulty}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" />{course.completedLessons}/{course.totalLessons} lessons</span>
                          <span className="font-bold" style={{ color: accent }}>{course.progress}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-muted overflow-hidden">
                          <div className="h-full rounded-full transition-all" style={{ width: `${course.progress}%`, background: accent }} />
                        </div>
                        <div className="text-[10px] text-muted-foreground text-center">
                          {100 - course.progress}% more to unlock certificate
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ── Locked ── */}
          {locked.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-2">
                <Lock className="w-3.5 h-3.5" /> Not Started · {locked.length}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {locked.map((course) => {
                  const accent = getCourseAccentColor(course.title);
                  return (
                    <div key={course.id} className="bg-card border border-border rounded-xl p-3 text-center space-y-2 opacity-60 hover:opacity-80 transition-opacity">
                      <div
                        className="w-10 h-10 rounded-xl mx-auto flex items-center justify-center relative bg-slate-100 dark:bg-[#0a0c10] overflow-hidden"
                        style={{ borderWidth: 1, borderStyle: "solid", borderColor: `${accent}25` }}
                      >
                        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${accent}18 0%, transparent 75%)` }} />
                        <img src={getCourseLogoUrl(course.title)} alt="" className="w-6 h-6 object-contain relative z-10" />
                      </div>
                      <div className="text-[11px] font-semibold text-foreground line-clamp-2 leading-tight">{course.title}</div>
                      <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
                        <Lock className="w-2.5 h-2.5" /> Not started
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Empty state */}
          {courses.length === 0 && (
            <div className="text-center py-20 space-y-3">
              <GraduationCap className="w-12 h-12 mx-auto text-muted-foreground/30" />
              <p className="font-semibold text-muted-foreground">No courses found</p>
              <p className="text-sm text-muted-foreground/60">Start a course to begin earning certificates</p>
            </div>
          )}
        </>
      )}

      {/* ── Certificate Modal ── */}
      {activeCert && (
        <CertificateModal
          course={activeCert.course}
          cert={activeCert.cert}
          userName={user?.name ?? user?.email?.split("@")[0] ?? "Learner"}
          onClose={() => setActiveCert(null)}
        />
      )}
    </div>
  );
}
