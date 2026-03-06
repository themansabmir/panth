import {
  Users,
  Activity,
  CalendarDays,
  TrendingUp,
} from "lucide-react";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto p-6 lg:p-8 space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Welcome back, Admin!</h2>
          <p className="text-(--muted-foreground) mt-1">Here is your clinical data and patient management overview.</p>
        </div>
      </div>

      {/* DASHBOARD STATS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* STAT 1 */}
        <div className="bg-(--card) border border-(--border) p-6 rounded-2xl shadow-xs flex flex-col justify-between h-32">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-(--muted-foreground) text-sm font-medium">Total Patients</p>
              <h4 className="text-3xl font-bold mt-1 text-(--foreground)">1,248</h4>
            </div>
            <div className="w-10 h-10 rounded-full bg-(--primary) flex items-center justify-center text-(--primary-foreground)">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm font-medium text-(--action) flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>+12% this month</span>
          </div>
        </div>

        {/* STAT 2 */}
        <div className="bg-(--card) border border-(--border) p-6 rounded-2xl shadow-xs flex flex-col justify-between h-32">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-(--muted-foreground) text-sm font-medium">New Enrollments</p>
              <h4 className="text-3xl font-bold mt-1 text-(--foreground)">42</h4>
            </div>
            <div className="w-10 h-10 rounded-full bg-(--action) flex items-center justify-center text-(--action-foreground)">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm font-medium text-(--action) flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>+5% since last week</span>
          </div>
        </div>

        {/* STAT 3 */}
        <div className="bg-(--card) border border-(--border) p-6 rounded-2xl shadow-xs flex flex-col justify-between h-32">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-(--muted-foreground) text-sm font-medium">Avg. VAS Score</p>
              <h4 className="text-3xl font-bold mt-1 text-(--foreground)">6.8</h4>
            </div>
            <div className="w-10 h-10 rounded-full bg-(--data) flex items-center justify-center text-(--data-foreground)">
              <Activity className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm font-medium text-(--muted-foreground) flex items-center gap-1">
            <span>Stable over 30 days</span>
          </div>
        </div>

        {/* STAT 4 */}
        <div className="bg-(--card) border border-(--border) p-6 rounded-2xl shadow-xs flex flex-col justify-between h-32">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-(--muted-foreground) text-sm font-medium">Active Cases</p>
              <h4 className="text-3xl font-bold mt-1 text-(--foreground)">891</h4>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-800 dark:bg-slate-200 flex items-center justify-center text-white dark:text-slate-800">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="text-sm font-medium text-(--muted-foreground) flex items-center gap-1">
            <span>Currently under observation</span>
          </div>
        </div>

      </div>

      {/* CLINICAL SNAPSHOT */}
      <section className="bg-(--card) p-6 rounded-2xl shadow-xs border border-(--border)">
        <h3 className="text-lg font-bold text-(--foreground)">Clinical Snapshot</h3>
        <p className="text-sm text-(--muted-foreground) mb-6 mt-1">Visual overview of headache severity & metrics</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Metric 1 */}
          <div className="flex flex-col items-center bg-(--muted)/20 p-6 rounded-xl border border-(--border)">
            <div className="text-4xl font-black text-(--action) mb-2">6.8<span className="text-lg text-(--muted-foreground) font-medium">/10</span></div>
            <div className="w-full bg-(--border) rounded-full h-3 mb-4">
              <div className="bg-(--action) h-3 rounded-full" style={{ width: '68%' }}></div>
            </div>
            <strong className="text-sm font-semibold text-(--foreground)">Average VAS Score</strong>
          </div>

          {/* Metric 2 */}
          <div className="flex flex-col items-center bg-(--muted)/20 p-6 rounded-xl border border-(--border)">
            <div className="text-4xl font-black text-(--data) mb-2">14<span className="text-lg text-(--muted-foreground) font-medium"> days</span></div>
            <div className="w-full bg-(--border) rounded-full h-3 mb-4">
              <div className="bg-(--data) h-3 rounded-full" style={{ width: '47%' }}></div>
            </div>
            <strong className="text-sm font-semibold text-(--foreground)">Monthly Frequency</strong>
          </div>

          {/* Metric 3 */}
          <div className="flex flex-col items-center bg-(--muted)/20 p-6 rounded-xl border border-(--border)">
            <div className="text-4xl font-black text-(--primary) mb-2">62<span className="text-lg text-(--muted-foreground) font-medium">%</span></div>
            <div className="w-full bg-(--border) rounded-full h-3 mb-4">
              <div className="bg-(--primary) h-3 rounded-full" style={{ width: '62%' }}></div>
            </div>
            <strong className="text-sm font-semibold text-(--foreground)">Migraine Burden</strong>
          </div>
        </div>
      </section>

    </div>
  );
}
