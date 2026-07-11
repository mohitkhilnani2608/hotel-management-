import React from 'react';
import { format } from 'date-fns';
import { Calendar, Users, Clock, Utensils } from 'lucide-react';
import { useRestaurant } from '../../context/RestaurantContext';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Link } from 'react-router-dom';

export const GuestDashboard = () => {
  const { reservations } = useRestaurant();
  
  // Mock current user
  const currentUser = { name: 'Eleanor Vance' };
  
  const userReservations = reservations.filter(r => r.guestName === currentUser.name);
  
  const upcomingReservations = userReservations.filter(r => r.status === 'Confirmed' || r.status === 'Seated');
  const pastReservations = userReservations.filter(r => r.status === 'Completed' || r.status === 'Canceled');

  const ReservationCard = ({ reservation, isPast }) => {
    return (
      <Card className="overflow-hidden p-6 flex flex-col md:flex-row gap-6 items-center shadow-sm hover:shadow-md transition-shadow">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
          <Utensils className="w-6 h-6 text-primary" />
        </div>
        <div className="flex-1 flex flex-col md:flex-row justify-between w-full">
          <div className="space-y-1 mb-4 md:mb-0">
            <div className="flex items-center gap-3">
              <h3 className="font-serif text-xl font-medium">Table Reservation</h3>
              <Badge variant={reservation.status === 'Seated' ? 'success' : reservation.status === 'Canceled' ? 'destructive' : 'default'}>
                {reservation.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">AuraDine Main Dining</p>
          </div>
          
          <div className="flex gap-6 text-sm bg-muted/20 px-4 py-2 rounded-lg">
             <div>
              <span className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Date & Time</span>
              <span className="font-medium flex items-center gap-1">
                <Calendar className="w-3 h-3 text-primary" /> {format(new Date(reservation.date), 'MMM dd, yyyy')} at {reservation.time}
              </span>
            </div>
            <div>
              <span className="block text-[10px] text-muted-foreground uppercase tracking-wider mb-1">Party Size</span>
              <span className="font-medium flex items-center gap-1">
                <Users className="w-3 h-3 text-primary" /> {reservation.partySize} People
              </span>
            </div>
          </div>
        </div>
        
        <div className="shrink-0 flex gap-2 w-full md:w-auto">
          {!isPast && (
            <Button variant="outline" className="w-full" onClick={() => alert('Modification requested. A host will contact you shortly.')}>Modify</Button>
          )}
        </div>
      </Card>
    );
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-muted/10">
      <div className="container mx-auto px-6 max-w-5xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-4">
          <div>
            <h1 className="text-4xl font-serif mb-2">Welcome back, {currentUser.name.split(' ')[0]}</h1>
            <p className="text-muted-foreground">Manage your upcoming reservations and view past dining experiences.</p>
          </div>
          <div className="flex items-center gap-3 bg-card border rounded-full pl-2 pr-4 py-1 shadow-sm">
            <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center font-serif text-xl">
              {currentUser.name.charAt(0)}
            </div>
            <div className="text-sm">
              <span className="block font-medium">{currentUser.name}</span>
              <span className="text-muted-foreground">AuraDine Member</span>
            </div>
          </div>
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-serif mb-6 border-b pb-2">Upcoming Reservations</h2>
            {upcomingReservations.length > 0 ? (
              <div className="space-y-4">
                {upcomingReservations.map(r => <ReservationCard key={r.id} reservation={r} />)}
              </div>
            ) : (
              <div className="text-center py-16 bg-card border border-dashed rounded-xl shadow-sm">
                <Utensils className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No upcoming reservations</h3>
                <p className="text-muted-foreground mb-6 max-w-md mx-auto">You have no upcoming dining reservations at AuraDine.</p>
                <Link to="/booking">
                  <Button size="lg">Book a Table</Button>
                </Link>
              </div>
            )}
          </section>

          <section>
            <h2 className="text-2xl font-serif mb-6 border-b pb-2">Dining History</h2>
            {pastReservations.length > 0 ? (
              <div className="space-y-4 opacity-80">
                {pastReservations.map(r => <ReservationCard key={r.id} reservation={r} isPast />)}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No past dining history found.</p>
            )}
          </section>
        </div>
      </div>
    </div>
  );
};
