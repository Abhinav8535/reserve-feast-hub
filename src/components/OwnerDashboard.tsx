import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { LayoutGrid, CalendarCheck, ShoppingBag, Check, X } from "lucide-react";

interface OwnerDashboardProps {
  profile: any;
}

const OwnerDashboard = ({ profile }: OwnerDashboardProps) => {
  const { toast } = useToast();
  const [stats, setStats] = useState({ total: 0, available: 0, booked: 0 });
  const [bookings, setBookings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: tables } = await supabase.from("tables").select("*");
    const available = tables?.filter(t => t.is_available).length || 0;
    setStats({
      total: tables?.length || 0,
      available,
      booked: (tables?.length || 0) - available,
    });

    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*, tables(*), profiles(*)")
      .order("created_at", { ascending: false });

    const { data: ordersData } = await supabase
      .from("orders")
      .select("*, profiles(*)")
      .order("created_at", { ascending: false });

    setBookings(bookingsData || []);
    setOrders(ordersData || []);
  };

  const updateBookingStatus = async (bookingId: string, status: 'approved' | 'declined' | 'pending') => {
    const { error } = await supabase
      .from("bookings")
      .update({ status })
      .eq("id", bookingId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Booking ${status}` });
      fetchData();
    }
  };

  const updateOrderStatus = async (orderId: string, status: 'pending' | 'preparing' | 'ready' | 'completed') => {
    const { error } = await supabase
      .from("orders")
      .update({ status })
      .eq("id", orderId);

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Success", description: `Order status updated to ${status}` });
      fetchData();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Owner Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-primary" />
              Total Tables
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-accent">
              <Check className="h-4 w-4" />
              Available
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{stats.available}</div>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2 text-destructive">
              <X className="h-4 w-4" />
              Booked
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-destructive">{stats.booked}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5 text-primary" />
              Booking Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-muted-foreground">No bookings</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">{booking.profiles?.full_name}</span>
                      <Badge variant={
                        booking.status === 'approved' ? 'default' :
                        booking.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {booking.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Table {booking.tables?.table_number} • {new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}
                    </p>
                    {booking.status === 'pending' && (
                      <div className="flex gap-2 mt-3">
                        <Button size="sm" onClick={() => updateBookingStatus(booking.id, 'approved')}>
                          <Check className="h-4 w-4 mr-1" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => updateBookingStatus(booking.id, 'declined')}>
                          <X className="h-4 w-4 mr-1" /> Decline
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              Food Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-muted-foreground">No orders</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Token #{order.token_number}</span>
                      <Badge>{order.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {order.profiles?.full_name} • ${order.total_amount}
                    </p>
                    {order.status !== 'completed' && (
                      <div className="flex gap-2 mt-3 flex-wrap">
                        {order.status === 'pending' && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, 'preparing')}>
                            Start Preparing
                          </Button>
                        )}
                        {order.status === 'preparing' && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, 'ready')}>
                            Mark Ready
                          </Button>
                        )}
                        {order.status === 'ready' && (
                          <Button size="sm" onClick={() => updateOrderStatus(order.id, 'completed')}>
                            Complete
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default OwnerDashboard;
