import React, { useState } from 'react';
import { format } from 'date-fns';
import { Search, Filter, MoreHorizontal } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';

export const Reservations = () => {
  const { reservations, tables, updateReservationStatus } = useRestaurant();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  const filteredReservations = reservations.filter(r => {
    const matchesSearch = r.guestName.toLowerCase().includes(searchTerm.toLowerCase()) || r.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || r.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Confirmed': return <Badge variant="default" className="bg-blue-500 text-white hover:bg-blue-600">Confirmed</Badge>;
      case 'Seated': return <Badge variant="success">Seated</Badge>;
      case 'Completed': return <Badge variant="secondary">Completed</Badge>;
      case 'Canceled': return <Badge variant="destructive">Canceled</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-serif font-medium tracking-tight mb-2">Reservations Ledger</h1>
        <p className="text-muted-foreground">Manage all dining reservations, seating, and history.</p>
      </div>

      <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b flex flex-col sm:flex-row justify-between items-center gap-4 bg-muted/20">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search guest or ID..." 
              className="pl-9 bg-background"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Filter className="h-4 w-4 text-muted-foreground hidden sm:block" />
            <Select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full sm:w-40 bg-background"
            >
              <option value="All">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Seated">Seated</option>
              <option value="Completed">Completed</option>
              <option value="Canceled">Canceled</option>
            </Select>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead>Res ID</TableHead>
              <TableHead>Guest Name</TableHead>
              <TableHead>Party Size</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Table</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[140px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredReservations.map((reservation) => {
              const table = tables.find(t => t.id === reservation.tableId);
              return (
                <TableRow key={reservation.id}>
                  <TableCell className="font-medium font-mono text-xs">{reservation.id}</TableCell>
                  <TableCell>
                    <div className="font-medium">{reservation.guestName}</div>
                  </TableCell>
                  <TableCell>{reservation.partySize}</TableCell>
                  <TableCell>{format(new Date(reservation.date), 'MMM dd, yyyy')}</TableCell>
                  <TableCell className="font-medium">{reservation.time}</TableCell>
                  <TableCell>
                    {table ? (
                      <div>
                        <div className="font-medium">T{table.number}</div>
                        <div className="text-[10px] text-muted-foreground">{table.location}</div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground italic text-xs">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>{getStatusBadge(reservation.status)}</TableCell>
                  <TableCell>
                    <div className="flex items-center justify-end gap-2">
                      {reservation.status === 'Confirmed' && (
                        <Button variant="outline" size="sm" onClick={() => updateReservationStatus(reservation.id, 'Seated')} className="h-8">
                          Seat
                        </Button>
                      )}
                      {reservation.status === 'Seated' && (
                        <Button variant="outline" size="sm" onClick={() => updateReservationStatus(reservation.id, 'Completed')} className="h-8">
                          Clear
                        </Button>
                      )}
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {filteredReservations.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                  No reservations found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
