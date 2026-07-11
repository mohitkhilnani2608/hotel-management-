import React from 'react';
import { AreaChart, Area, BarChart, Bar, Cell, PieChart, Pie, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Users, Utensils, Receipt } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useRestaurant } from '../../context/RestaurantContext';

export const OwnerAnalytics = () => {
  const { monthlyRevenueData, topSellingItems } = useRestaurant();

  // Derived metrics from latest month (June)
  const currentMonth = monthlyRevenueData[monthlyRevenueData.length - 1];
  const previousMonth = monthlyRevenueData[monthlyRevenueData.length - 2];

  const calculateGrowth = (current, previous) => {
    return ((current - previous) / previous * 100).toFixed(1);
  };

  const revenueGrowth = calculateGrowth(currentMonth.revenue, previousMonth.revenue);
  const profitGrowth = calculateGrowth(currentMonth.profit, previousMonth.profit);
  
  // Calculate average order value (mock total covers for month = 2100)
  const monthlyCovers = 2100;
  const aov = currentMonth.revenue / monthlyCovers;
  
  // Expenses breakdown for pie chart
  const expensesData = [
    { name: 'Food Cost', value: currentMonth.foodCost, fill: 'hsl(var(--primary) / 0.8)' },
    { name: 'Labor Cost', value: currentMonth.laborCost, fill: 'hsl(var(--primary) / 0.5)' },
    { name: 'Overhead & Other', value: currentMonth.revenue - currentMonth.profit - currentMonth.foodCost - currentMonth.laborCost, fill: 'hsl(var(--muted-foreground) / 0.3)' },
    { name: 'Net Profit', value: currentMonth.profit, fill: 'hsl(var(--primary))' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-medium tracking-tight mb-2">Analytics & Reports</h1>
        <p className="text-muted-foreground">High-level financial performance and business health metrics.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${currentMonth.revenue.toLocaleString()}</div>
            <p className={`text-xs mt-1 flex items-center ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {revenueGrowth >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {revenueGrowth > 0 ? '+' : ''}{revenueGrowth}% from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Net Profit Margin</CardTitle>
            <Receipt className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{((currentMonth.profit / currentMonth.revenue) * 100).toFixed(1)}%</div>
            <p className={`text-xs mt-1 flex items-center ${profitGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profitGrowth >= 0 ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
              {profitGrowth > 0 ? '+' : ''}{profitGrowth}% net growth
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Monthly Covers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{monthlyCovers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total guests served this month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Spend Per Head</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${aov.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Calculated across all covers
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Revenue & Profit Trends (6 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyRevenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorProf" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                    formatter={(value) => [`$${value.toLocaleString()}`]}
                  />
                  <Legend verticalAlign="top" height={36}/>
                  <Area type="monotone" name="Revenue" dataKey="revenue" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" name="Net Profit" dataKey="profit" stroke="hsl(var(--foreground))" strokeWidth={2} fillOpacity={1} fill="url(#colorProf)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Monthly Expense Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {expensesData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => `$${value.toLocaleString()}`}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-4 w-full mt-4">
              {expensesData.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-sm">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.fill }}></div>
                  <span className="text-muted-foreground flex-1">{item.name}</span>
                  <span className="font-medium">{((item.value / currentMonth.revenue) * 100).toFixed(0)}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-2">
          <CardHeader>
            <CardTitle>Top Selling Menu Items (By Revenue)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topSellingItems} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                  <YAxis dataKey="name" type="category" width={140} stroke="hsl(var(--foreground))" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    cursor={{fill: 'hsl(var(--muted)/0.5)'}}
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    formatter={(value, name) => [name === 'revenue' ? `$${value.toLocaleString()}` : value, name === 'revenue' ? 'Revenue' : 'Units Sold']}
                  />
                  <Bar dataKey="revenue" radius={[0, 4, 4, 0]}>
                    {topSellingItems.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
