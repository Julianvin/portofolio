import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import CountUp from 'react-countup';
import {
  FiEye, FiUsers, FiMousePointer, FiGlobe, FiBarChart2
} from 'react-icons/fi';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';
import useDocumentTitle from '../hooks/useDocumentTitle';

// ── Umami API Config ───────────────────────────────────────────────
const WEBSITE_ID = '5ae69996-a62b-4876-8751-9134600ede67';
const API_BASE = 'https://api.umami.is/v1/websites';
const UMAMI_API_KEY = 'api_4s46jF7NMRtPyoEvqzNof0mPxSIRDMWo';

const headers = {
  'x-umami-api-key': UMAMI_API_KEY,
  Accept: 'application/json',
};

// ── 6-month timeframe ──────────────────────────────────────────────
const END_AT = Date.now();
const START_AT = END_AT - 180 * 24 * 60 * 60 * 1000;

// ── Custom Tooltip ─────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/90 backdrop-blur-lg px-4 py-3 shadow-2xl shadow-black/50">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 mb-2.5">
        {label}
      </p>
      {payload.map((entry) => (
        <div key={entry.dataKey} className="flex items-center gap-2.5 text-sm py-0.5">
          <span
            className="w-2 h-2 rounded-full ring-2 ring-offset-1 ring-offset-zinc-900"
            style={{ backgroundColor: entry.color, ringColor: entry.color }}
          />
          <span className="text-zinc-400 capitalize text-xs">{entry.dataKey}</span>
          <span className="ml-auto font-mono font-bold text-blue-300 text-sm">
            {entry.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}

// ── Animated Stat Number ───────────────────────────────────────────
function AnimatedNumber({ value }) {
  return (
    <CountUp
      end={value}
      duration={2.2}
      separator=","
      useEasing
      enableScrollSpy
      scrollSpyOnce
    />
  );
}

// ── Stat card definitions ──────────────────────────────────────────
const STAT_CARDS = [
  { key: 'pageviews', icon: FiEye, accentColor: '#3b82f6' },
  { key: 'visitors', icon: FiUsers, accentColor: '#06b6d4' },
  { key: 'visits', icon: FiMousePointer, accentColor: '#8b5cf6' },
  { key: 'countries', icon: FiGlobe, accentColor: '#f59e0b' },
];

// ── Animation variants ─────────────────────────────────────────────
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 25, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 260, damping: 24 },
  },
};

// ── Helpers ────────────────────────────────────────────────────────
function formatXAxisDate(dateStr) {
  // dateStr will be like "Aug 15" or "2024-08-15" — handle both
  const d = new Date(dateStr);
  if (!isNaN(d)) {
    return d.toLocaleDateString('en-US', { month: 'short' });
  }
  return dateStr;
}

// ── Main Component ─────────────────────────────────────────────────
export default function Dashboard() {
  useDocumentTitle(`Statistik | Delvin Julian`);

  const [stats, setStats] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hiddenSeries, setHiddenSeries] = useState({
    sessions: false,
    pageviews: false,
  });

  useEffect(() => {
    const params = `startAt=${START_AT}&endAt=${END_AT}`;

    const statsUrl = `${API_BASE}/${WEBSITE_ID}/stats?${params}`;
    const metricsUrl = `${API_BASE}/${WEBSITE_ID}/metrics?type=country&${params}`;
    const pageviewsUrl = `${API_BASE}/${WEBSITE_ID}/pageviews?unit=month&${params}`;

    Promise.all([
      fetch(statsUrl, { headers }).then((r) => {
        if (!r.ok) throw new Error(`Stats: ${r.status}`);
        return r.json();
      }),
      fetch(metricsUrl, { headers }).then((r) => {
        if (!r.ok) throw new Error(`Metrics: ${r.status}`);
        return r.json();
      }),
      fetch(pageviewsUrl, { headers }).then((r) => {
        if (!r.ok) throw new Error(`Pageviews: ${r.status}`);
        return r.json();
      }),
    ])
      .then(([statsData, countriesData, pageviewsData]) => {
        setStats({
          ...statsData,
          countries: Array.isArray(countriesData) ? countriesData.length : 0,
        });

        const pvArr = pageviewsData?.pageviews || [];
        const sessArr = pageviewsData?.sessions || [];
        const merged = pvArr.map((pv, i) => {
          const date = new Date(pv.x);
          const label = date.toLocaleDateString('en-US', {
            month: 'short',
          });
          return {
            date: label,
            pageviews: pv.y ?? 0,
            sessions: sessArr[i]?.y ?? 0,
          };
        });
        setChartData(merged);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Umami fetch failed:', err);
        setError(err.message);
        setLoading(false);
        setStats({
          pageviews: { value: 1247 },
          visitors: { value: 386 },
          visits: { value: 524 },
          countries: 12,
        });
        // Fallback: 6-month demo data
        const months = ['Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb'];
        setChartData(
          months.map((m) => ({
            date: m,
            sessions: Math.floor(Math.random() * 250 + 50),
            pageviews: Math.floor(Math.random() * 600 + 100),
          }))
        );
      });
  }, []);

  const getStatValue = (key) => {
    if (!stats) return 0;
    if (key === 'countries') return stats.countries ?? 0;
    const val = stats[key];
    if (typeof val === 'object' && val !== null) return val.value ?? 0;
    return val ?? 0;
  };

  const toggleSeries = useCallback((dataKey) => {
    setHiddenSeries((prev) => ({ ...prev, [dataKey]: !prev[dataKey] }));
  }, []);

  return (
    <div className="w-full min-h-[80vh] px-2 md:px-8 py-8 md:py-12">
      {/* ── Header ────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center">
            <FiBarChart2 className="w-5 h-5 text-blue-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#0d1117] dark:text-[#e6edf3]">
            Statistik Pengunjung
          </h1>
        </div>
        <p className="text-[#656d76] dark:text-[#7d8590] text-lg max-w-2xl leading-relaxed">
          Ikhtisar performa portofolio dan interaksi pengunjung.
        </p>

        {error && (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/20 text-amber-400 mt-4">
            Mode Demo (Gagal terhubung ke API)
          </span>
        )}
      </motion.div>

      {/* ── Stats Cards Grid ──────────────────────────────── */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10"
      >
        {STAT_CARDS.map((card) => {
          const numericValue = getStatValue(card.key);
          return (
            <motion.div
              key={card.key}
              variants={cardVariants}
              className="relative group rounded-2xl bg-[#f6f8fa] dark:bg-zinc-900/50 border border-[#d0d7de] dark:border-zinc-800 p-5 overflow-hidden transition-colors hover:border-zinc-600 dark:hover:border-zinc-700"
            >
              {/* Subtle glow on hover */}
              <div
                className="absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-0 group-hover:opacity-20 transition-opacity duration-500"
                style={{ backgroundColor: card.accentColor }}
              />

              <div className="relative z-10">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium uppercase tracking-wider text-[#656d76] dark:text-zinc-400">
                    {{
                      pageviews: 'Tampilan Halaman',
                      visitors: 'Pengunjung Unik',
                      visits: 'Kunjungan',
                      countries: 'Negara',
                    }[card.key]}
                  </span>
                  <card.icon
                    className="w-4 h-4"
                    style={{ color: card.accentColor }}
                  />
                </div>
                {loading ? (
                  <div className="h-9 w-20 rounded-lg bg-zinc-800/50 animate-pulse" />
                ) : (
                  <p
                    className="text-3xl font-bold tracking-tight"
                    style={{ color: card.accentColor }}
                  >
                    <AnimatedNumber value={numericValue} />
                  </p>
                )}
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* ── Bar Chart Section ─────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 30, delay: 0.35 }}
        className="rounded-2xl bg-[#f6f8fa] dark:bg-zinc-900/50 border border-[#d0d7de] dark:border-zinc-800 p-5 md:p-8"
      >
        {/* Chart header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-8">
          <div>
            <h2 className="text-lg font-bold text-[#0d1117] dark:text-[#e6edf3]">
              Tren Pengunjung
            </h2>
            <p className="text-sm text-[#656d76] dark:text-zinc-500 mt-0.5">
              Statistik tampilan halaman & sesi per bulan.
            </p>
          </div>
          {/* Interactive Legend */}
          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={() => toggleSeries('sessions')}
              className={`flex items-center gap-2 cursor-pointer transition-opacity duration-200 ${
                hiddenSeries.sessions ? 'opacity-40 line-through' : 'opacity-100'
              }`}
            >
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#1e3a8a' }} />
              <span className="text-xs text-zinc-400">Sesi</span>
            </button>
            <button
              type="button"
              onClick={() => toggleSeries('pageviews')}
              className={`flex items-center gap-2 cursor-pointer transition-opacity duration-200 ${
                hiddenSeries.pageviews ? 'opacity-40 line-through' : 'opacity-100'
              }`}
            >
              <span className="w-3 h-3 rounded-sm" style={{ backgroundColor: '#3b82f6' }} />
              <span className="text-xs text-zinc-400">Tampilan Halaman</span>
            </button>
          </div>
        </div>

        {/* Chart */}
        {loading ? (
          <div className="h-[400px] flex items-center justify-center">
            <div className="w-10 h-10 rounded-full border-2 border-zinc-700 border-t-blue-500 animate-spin" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={400}>
            <BarChart data={chartData} barCategoryGap="20%">
              <defs>
                <linearGradient id="barGradientSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1e40af" />
                  <stop offset="100%" stopColor="#1e3a8a" />
                </linearGradient>
                <linearGradient id="barGradientPageviews" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#60a5fa" />
                  <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#27272a"
                strokeOpacity={0.4}
                vertical={false}
              />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#71717a', fontWeight: 500 }}
                dy={10}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: '#52525b' }}
                dx={-10}
                width={45}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: 'rgba(59, 130, 246, 0.04)', radius: 8 }}
              />
              <Bar
                dataKey="sessions"
                stackId="stack"
                fill="url(#barGradientSessions)"
                radius={[0, 0, 0, 0]}
                maxBarSize={48}
                hide={hiddenSeries.sessions}
              />
              <Bar
                dataKey="pageviews"
                stackId="stack"
                fill="url(#barGradientPageviews)"
                radius={[4, 4, 0, 0]}
                maxBarSize={48}
                hide={hiddenSeries.pageviews}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </motion.div>

      {/* ── Footer ────────────────────────────────────────── */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="mt-6 text-center text-xs text-[#656d76] dark:text-[#484f58]"
      >
        Ditenagai oleh Umami Analytics
      </motion.p>
    </div>
  );
}
