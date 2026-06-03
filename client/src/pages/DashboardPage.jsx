import { useFetch } from '../hooks/useFetch';
import * as api from '../services/api';
import StatCard from '../components/common/StatCard';
import { formatPackage, formatDate } from '../utils/helpers';
import {
  HiUserGroup,
  HiBriefcase,
  HiAcademicCap,
  HiChartBar,
  HiBanknotes,
} from 'react-icons/hi2';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const CHART_COLORS = ['#0066cc', '#34c759', '#5856d6', '#ff9500', '#ff2d55', '#30b0c7', '#af52de', '#ff3b30'];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="glass-card p-3 shadow-md border border-apple-hairline bg-white/95 backdrop-blur-md">
      <p className="text-apple-ink font-semibold text-sm mb-1">{label}</p>
      {payload.map((entry, idx) => (
        <p key={idx} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value}
        </p>
      ))}
    </div>
  );
};

const PieTooltip = ({ active, payload }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="glass-card p-3 shadow-md border border-apple-hairline bg-white/95 backdrop-blur-md">
      <p className="text-apple-ink font-semibold text-sm">{payload[0].name}</p>
      <p className="text-sm text-apple-blue">{payload[0].value} students</p>
    </div>
  );
};

const SkeletonCard = () => (
  <div className="glass-card p-6 animate-pulse">
    <div className="flex items-center justify-between mb-4">
      <div className="h-4 bg-apple-divider rounded w-24" />
      <div className="w-10 h-10 bg-apple-divider rounded-xl" />
    </div>
    <div className="h-8 bg-apple-divider rounded w-16" />
  </div>
);

const SkeletonChart = () => (
  <div className="glass-card p-6 animate-pulse">
    <div className="h-5 bg-apple-divider rounded w-48 mb-6" />
    <div className="h-64 bg-apple-parchment rounded-xl" />
  </div>
);

export default function DashboardPage() {
  const { data: stats, loading: statsLoading } = useFetch(api.getStats);
  const { data: companyStats, loading: companyLoading } = useFetch(api.getCompanyStats);
  const { data: branchStats, loading: branchLoading } = useFetch(api.getBranchStats);

  const statsData = stats?.data || stats || {};
  const companyData = companyStats?.data || companyStats || [];
  const branchData = branchStats?.data || branchStats || [];

  const statCards = [
    {
      title: 'Total Students',
      value: statsData.totalStudents || 0,
      icon: HiUserGroup,
      color: 'indigo',
    },
    {
      title: 'Placed Students',
      value: statsData.placedStudents || 0,
      icon: HiBriefcase,
      color: 'emerald',
    },
    {
      title: 'Higher Studies',
      value: statsData.higherStudies || 0,
      icon: HiAcademicCap,
      color: 'blue',
    },
    {
      title: 'Placement %',
      value: statsData.placementPercentage || 0,
      icon: HiChartBar,
      color: 'amber',
      suffix: '%',
    },
    {
      title: 'Avg Package',
      value: statsData.avgPackage || 0,
      icon: HiBanknotes,
      color: 'rose',
      prefix: '₹',
      suffix: ' LPA',
    },
  ];

  const recentPlacements = statsData.recentPlacements || [];

  return (
    <div className="page-enter space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
        {statsLoading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : statCards.map((card) => (
              <StatCard
                key={card.title}
                title={card.title}
                value={card.value}
                icon={card.icon}
                color={card.color}
                prefix={card.prefix}
                suffix={card.suffix}
              />
            ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart — Company-wise Placements */}
        {companyLoading ? (
          <SkeletonChart />
        ) : (
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-apple-ink mb-6 flex items-center gap-2">
              <HiBriefcase className="w-5 h-5 text-apple-blue" />
              Company-wise Placements
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={Array.isArray(companyData) ? companyData.slice(0, 8) : []}
                  margin={{ top: 5, right: 10, left: -10, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="company"
                    tick={{ fill: '#7a7a7a', fontSize: 12 }}
                    axisLine={{ stroke: '#e0e0e0' }}
                    tickLine={false}
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis
                    tick={{ fill: '#7a7a7a', fontSize: 12 }}
                    axisLine={{ stroke: '#e0e0e0' }}
                    tickLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,102,204,0.04)' }} />
                  <Bar
                    dataKey="count"
                    name="Students"
                    fill="#0066cc"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={50}
                  >
                    {(Array.isArray(companyData) ? companyData.slice(0, 8) : []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {/* Pie Chart — Branch-wise Distribution */}
        {branchLoading ? (
          <SkeletonChart />
        ) : (
          <div className="glass-card p-6">
            <h3 className="text-lg font-semibold text-apple-ink mb-6 flex items-center gap-2">
              <HiAcademicCap className="w-5 h-5 text-apple-blue" />
              Branch-wise Distribution
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={Array.isArray(branchData) ? branchData : []}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={3}
                    dataKey="count"
                    nameKey="branch"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                    labelLine={{ stroke: '#e0e0e0' }}
                  >
                    {(Array.isArray(branchData) ? branchData : []).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                  <Legend
                    wrapperStyle={{ fontSize: '12px', color: '#7a7a7a' }}
                    iconType="circle"
                    iconSize={8}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      {/* Recent Placements */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-apple-ink mb-4 flex items-center gap-2">
          <HiChartBar className="w-5 h-5 text-apple-blue" />
          Recent Placements
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-apple-divider bg-apple-parchment/50">
                <th className="pb-3 pt-3 pl-4 text-xs font-semibold text-apple-ink-48 uppercase tracking-wider">Student</th>
                <th className="pb-3 pt-3 text-xs font-semibold text-apple-ink-48 uppercase tracking-wider">Company</th>
                <th className="pb-3 pt-3 text-xs font-semibold text-apple-ink-48 uppercase tracking-wider">Role</th>
                <th className="pb-3 pt-3 text-xs font-semibold text-apple-ink-48 uppercase tracking-wider">Package</th>
                <th className="pb-3 pt-3 pr-4 text-xs font-semibold text-apple-ink-48 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-apple-divider">
              {recentPlacements.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-8 text-center text-apple-ink-48">
                    No recent placements found
                  </td>
                </tr>
              ) : (
                recentPlacements.slice(0, 5).map((p, idx) => (
                  <tr key={p._id || idx} className="hover:bg-apple-parchment/60 transition-colors">
                    <td className="py-3 pl-4 text-sm text-apple-ink font-medium">
                      {p.studentId?.name || p.studentName || '—'}
                    </td>
                    <td className="py-3 text-sm text-apple-ink-80">{p.company}</td>
                    <td className="py-3 text-sm text-apple-ink-80">{p.role}</td>
                    <td className="py-3 text-sm">
                      <span
                        className={`font-semibold ${
                          p.package >= 20
                            ? 'text-emerald-600'
                            : p.package >= 10
                            ? 'text-apple-blue'
                            : 'text-apple-ink-80'
                        }`}
                      >
                        {formatPackage(p.package)}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-sm text-apple-ink-48">{formatDate(p.placementDate)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
