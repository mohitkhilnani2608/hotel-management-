import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, CreditCard, Utensils, ArrowUpRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { useRestaurant } from '../../context/RestaurantContext';

const revenueData = [
  { name: 'Mon', total: 4200 },
  { name: 'Tue', total: 3100 },
  { name: 'Wed', total: 4800 },
  { name: 'Thu', total: 5400 },
  { name: 'Fri', total: 9200 },
  { name: 'Sat', total: 11100 },
  { name: 'Sun', total: 8800 },
];

export const Dashboard = () => {
  const { tables, reservations } = useRestaurant();

  const totalTables = tables.length;
  const occupiedTables = tables.filter(t => t.status === 'Seated').length;
  const occupancyRate = Math.round((occupiedTables / totalTables) * 100);

  const pendingReservations = reservations.filter(r => r.status === 'Confirmed').length;
  
  // Mock today's covers (total guests seated or expected)
  const todayCovers = reservations
    .filter(r => r.status === 'Seated' || r.status === 'Confirmed' || r.status === 'Completed')
    .reduce((acc, curr) => acc + curr.partySize, 0);

  const todayRevenue = todayCovers * 85; // Average spend per head

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-medium tracking-tight mb-2">Overview</h1>
        <p className="text-muted-foreground">Here's what's happening at AuraDine today.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${Math.round(todayRevenue).toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12.5% from last week
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Table Occupancy</CardTitle>
            <Utensils className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{occupancyRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {occupiedTables} of {totalTables} tables seated
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Reservations</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReservations}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Expected for tonight's service
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Today's Covers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayCovers}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Total guests served or expected
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4">
          <CardHeader>
            <CardTitle>Revenue Overview</CardTitle>
          </CardHeader>
          <CardContent className="pl-0">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="name" 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                  />
                  <YAxis 
                    stroke="hsl(var(--muted-foreground))" 
                    fontSize={12} 
                    tickLine={false} 
                    axisLine={false} 
                    tickFormatter={(value) => `$${value}`} 
                  />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))' }}
                    itemStyle={{ color: 'hsl(var(--foreground))' }}
                  />
                  <Area type="monotone" dataKey="total" stroke="hsl(var(--primary))" strokeWidth={2} fillOpacity={1} fill="url(#colorTotal)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-8">
              {reservations.slice(0, 5).map((reservation, i) => (
                <div key={reservation.id} className="flex items-center">
                  <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-medium text-sm">
                    {reservation.guestName.charAt(0)}
                  </span>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{reservation.guestName}</p>
                    <p className="text-sm text-muted-foreground">
                      {reservation.status} • Party of {reservation.partySize}
                    </p>
                  </div>
                  <div className="ml-auto font-medium text-sm text-muted-foreground">
                    {reservation.time}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
