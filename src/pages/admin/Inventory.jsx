import React from 'react';
import { Package, AlertCircle, TrendingUp, ArrowDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';

const inventoryItems = [
  { id: 1, name: 'A5 Wagyu Beef', category: 'Meat', stock: 12, unit: 'kg', threshold: 15, status: 'Low', lastRestocked: '2023-10-24' },
  { id: 2, name: 'Black Truffles', category: 'Produce', stock: 0.5, unit: 'kg', threshold: 1, status: 'Critical', lastRestocked: '2023-10-20' },
  { id: 3, name: 'Dom Perignon 2012', category: 'Wine', stock: 24, unit: 'bottles', threshold: 12, status: 'Good', lastRestocked: '2023-10-01' },
  { id: 4, name: 'Saffron', category: 'Spice', stock: 150, unit: 'g', threshold: 50, status: 'Good', lastRestocked: '2023-09-15' },
  { id: 5, name: 'Lobster Tails', category: 'Seafood', stock: 45, unit: 'pcs', threshold: 40, status: 'Low', lastRestocked: '2023-10-25' },
];

export const Inventory = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight mb-2">Inventory Management</h1>
          <p className="text-muted-foreground">Monitor stock levels, set alerts, and manage supplier orders.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Items</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,248</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              Across 12 categories
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Low Stock Alerts</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">8</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              Requires immediate action
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Est. Value</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$42,500</div>
            <p className="text-xs text-muted-foreground mt-1 flex items-center">
              <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
              2% decrease from last week
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Priority Stock Items</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                <tr>
                  <th className="px-6 py-4 rounded-tl-lg font-medium tracking-wider">Item Name</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Category</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Current Stock</th>
                  <th className="px-6 py-4 font-medium tracking-wider">Status</th>
                  <th className="px-6 py-4 rounded-tr-lg font-medium tracking-wider">Last Restocked</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {inventoryItems.map((item) => (
                  <tr key={item.id} className="hover:bg-muted/20 transition-colors">
                    <td className="px-6 py-4 font-medium">{item.name}</td>
                    <td className="px-6 py-4 text-muted-foreground">{item.category}</td>
                    <td className="px-6 py-4 font-mono">
                      {item.stock} <span className="text-muted-foreground text-xs">{item.unit}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        item.status === 'Critical' ? 'bg-destructive/10 text-destructive border-destructive/20' :
                        item.status === 'Low' ? 'bg-orange-500/10 text-orange-500 border-orange-500/20' :
                        'bg-green-500/10 text-green-500 border-green-500/20'
                      }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">{item.lastRestocked}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
