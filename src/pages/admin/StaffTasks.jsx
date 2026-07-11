import React from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { CheckCircle2, Flame, BellRing } from 'lucide-react';

export const StaffTasks = () => {
  const { tables, updateTableStatus } = useRestaurant();

  // Tables that need bussing/cleaning
  const tablesToBus = tables.filter(t => t.status === 'Dirty');
  
  // Kitchen Orders (Mock data for the pivot)
  const kitchenOrders = [
    { id: 'K1', table: 'T2', items: ['2x Wagyu Beef Tartare'], status: 'Cooking', time: '10m ago', priority: 'Normal' },
    { id: 'K2', table: 'T7', items: ['1x Dry-Aged Ribeye', '1x Mushroom Risotto'], status: 'Plating', time: '25m ago', priority: 'High' },
    { id: 'K3', table: 'T10', items: ['4x Dark Chocolate Tart'], status: 'New', time: '2m ago', priority: 'Normal' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight mb-2">Staff Tasks & Kitchen</h1>
          <p className="text-muted-foreground">Manage active orders and front-of-house tasks.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Kitchen Orders Lane */}
        <Card className="bg-red-50/50 dark:bg-red-950/10 border-red-100 dark:border-red-900 shadow-sm">
          <CardHeader className="pb-3 border-b border-red-100 dark:border-red-900 bg-red-50 dark:bg-red-900/20">
            <CardTitle className="text-red-800 dark:text-red-400 flex items-center gap-2">
              <Flame className="h-5 w-5" /> Kitchen Active Tickets
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {kitchenOrders.map(order => (
              <div key={order.id} className={`bg-background border rounded-lg p-4 shadow-sm flex flex-col transition-colors ${order.priority === 'High' ? 'border-red-300' : ''}`}>
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-lg font-bold block leading-none">Table {order.table.replace('T', '')}</span>
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{order.time}</span>
                  </div>
                  <Badge variant={order.status === 'Plating' ? 'success' : order.status === 'New' ? 'default' : 'secondary'}>
                    {order.status}
                  </Badge>
                </div>
                <div className="py-2 border-t border-b mb-3">
                  <ul className="text-sm space-y-1">
                    {order.items.map((item, idx) => <li key={idx}>• {item}</li>)}
                  </ul>
                </div>
                <div className="flex gap-2 mt-auto">
                  <Button size="sm" variant="outline" className="w-full">
                     Bump Ticket
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Front of House Tasks Lane */}
        <Card className="bg-amber-50/50 dark:bg-amber-950/10 border-amber-100 dark:border-amber-900 shadow-sm">
          <CardHeader className="pb-3 border-b border-amber-100 dark:border-amber-900 bg-amber-50 dark:bg-amber-900/20">
            <CardTitle className="text-amber-800 dark:text-amber-400 flex items-center gap-2">
              <BellRing className="h-5 w-5" /> Tables to Bus
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            {tablesToBus.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No tables currently need bussing.</p>
            ) : (
              tablesToBus.map(table => (
                <div key={table.id} className="bg-background border rounded-lg p-4 shadow-sm flex flex-col hover:border-amber-300 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <span className="text-lg font-bold block leading-none">Table {table.number}</span>
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{table.location}</span>
                    </div>
                    <Badge variant="outline" className="border-amber-200 text-amber-700 bg-amber-50">Needs Bussing</Badge>
                  </div>
                  <div className="flex gap-2 mt-auto pt-3 border-t">
                    <Button size="sm" variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50" onClick={() => updateTableStatus(table.id, 'Available')}>
                      <CheckCircle2 className="h-4 w-4 mr-2" /> Mark Ready
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
