import React, { useState } from 'react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Dialog, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/Dialog';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { User, Settings, Info, Utensils } from 'lucide-react';

export const TableMatrix = () => {
  const { tables, reservations, updateTableStatus } = useRestaurant();
  const [selectedTable, setSelectedTable] = useState(null);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return 'bg-green-100 border-green-200 text-green-800 dark:bg-green-900/30 dark:border-green-800 dark:text-green-400';
      case 'Seated': return 'bg-red-100 border-red-200 text-red-800 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400';
      case 'Dirty': return 'bg-amber-100 border-amber-200 text-amber-800 dark:bg-amber-900/30 dark:border-amber-800 dark:text-amber-400';
      default: return 'bg-gray-100 border-gray-200 text-gray-800';
    }
  };

  const locations = [...new Set(tables.map(t => t.location))].sort();

  const handleStatusChange = (newStatus) => {
    if (selectedTable) {
      updateTableStatus(selectedTable.id, newStatus);
      setSelectedTable({ ...selectedTable, status: newStatus });
    }
  };

  const activeReservation = selectedTable?.status === 'Seated' 
    ? reservations.find(r => r.tableId === selectedTable.id && r.status === 'Seated')
    : null;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-serif font-medium tracking-tight mb-2">Table Matrix</h1>
          <p className="text-muted-foreground">Live overview of the restaurant floor and table statuses.</p>
        </div>
        <div className="flex gap-4 text-sm bg-card px-4 py-2 rounded-full border shadow-sm">
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-500"></div> Available</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> Seated</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-amber-500"></div> Dirty</div>
        </div>
      </div>

      <div className="space-y-8">
        {locations.map(location => (
          <div key={location} className="bg-card border rounded-xl p-6 shadow-sm">
            <h2 className="text-lg font-medium mb-4 flex items-center gap-2 border-b pb-2">
              <Utensils className="h-5 w-5 text-muted-foreground" /> {location}
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
              {tables.filter(t => t.location === location).map(table => (
                <button
                  key={table.id}
                  onClick={() => setSelectedTable(table)}
                  className={`relative flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all hover:scale-[1.03] ${getStatusColor(table.status)} shadow-sm`}
                >
                  <span className="text-2xl font-bold mb-1">T{table.number}</span>
                  <span className="text-[10px] font-medium uppercase tracking-wider">{table.type} ({table.capacity})</span>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedTable} onOpenChange={(open) => !open && setSelectedTable(null)}>
        {selectedTable && (
          <div>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-serif text-2xl">
                Table {selectedTable.number} <Badge variant="outline">{selectedTable.type}</Badge>
              </DialogTitle>
              <DialogDescription>
                Manage table status and view seated guests.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="flex flex-col gap-3">
                <h4 className="text-sm font-medium flex items-center gap-2">
                  <Settings className="h-4 w-4 text-muted-foreground" /> Change Status
                </h4>
                <div className="grid grid-cols-3 gap-2">
                  <Button 
                    variant={selectedTable.status === 'Available' ? 'default' : 'outline'} 
                    onClick={() => handleStatusChange('Available')}
                    className={selectedTable.status === 'Available' ? 'bg-green-600 hover:bg-green-700 text-white border-transparent' : 'border-green-200 text-green-700 hover:bg-green-50'}
                  >
                    Available
                  </Button>
                  <Button 
                    variant={selectedTable.status === 'Seated' ? 'default' : 'outline'} 
                    onClick={() => handleStatusChange('Seated')}
                    className={selectedTable.status === 'Seated' ? 'bg-red-600 hover:bg-red-700 text-white border-transparent' : 'border-red-200 text-red-700 hover:bg-red-50'}
                  >
                    Seated
                  </Button>
                  <Button 
                    variant={selectedTable.status === 'Dirty' ? 'default' : 'outline'} 
                    onClick={() => handleStatusChange('Dirty')}
                    className={selectedTable.status === 'Dirty' ? 'bg-amber-600 hover:bg-amber-700 text-white border-transparent' : 'border-amber-200 text-amber-700 hover:bg-amber-50'}
                  >
                    Dirty
                  </Button>
                </div>
              </div>

              {activeReservation ? (
                <div className="bg-muted/50 p-4 rounded-lg space-y-3 border">
                  <h4 className="text-sm font-medium flex items-center gap-2 border-b pb-2">
                    <User className="h-4 w-4 text-primary" /> Seated Guests
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Name</div>
                      <div className="font-medium">{activeReservation.guestName}</div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Party Size</div>
                      <div className="font-medium">{activeReservation.partySize} People</div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-muted/30 p-4 rounded-lg flex items-center gap-3 text-sm text-muted-foreground border border-dashed">
                  <Info className="h-5 w-5 opacity-50" />
                  <span>No active reservation seated at this table.</span>
                </div>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};
