import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ShoppingBag } from "lucide-react";

interface CustomerDashboardProps {
  profile: any;
}

const CustomerDashboard = ({ profile }: CustomerDashboardProps) => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: bookingsData } = await supabase
      .from("bookings")
      .select("*, tables(*)")
      .eq("customer_id", profile.id)
      .order("created_at", { ascending: false });

    const { data: ordersData } = await supabase
      .from("orders")
      .select("*")
      .eq("customer_id", profile.id)
      .order("created_at", { ascending: false });

    setBookings(bookingsData || []);
    setOrders(ordersData || []);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Welcome, {profile.full_name}!</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-primary" />
              My Table Bookings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <p className="text-muted-foreground">No bookings yet</p>
            ) : (
              <div className="space-y-3">
                {bookings.map((booking) => (
                  <div key={booking.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Table {booking.tables?.table_number}</span>
                      <Badge variant={
                        booking.status === 'approved' ? 'default' :
                        booking.status === 'pending' ? 'secondary' : 'destructive'
                      }>
                        {booking.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {new Date(booking.booking_date).toLocaleDateString()} at {booking.booking_time}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Guests: {booking.number_of_guests}
                    </p>
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
              My Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-muted-foreground">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold">Token #{order.token_number}</span>
                      <Badge variant={
                        order.status === 'completed' ? 'default' :
                        order.status === 'ready' ? 'secondary' : 'outline'
                      }>
                        {order.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Total: ${order.total_amount}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
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

export default CustomerDashboard;
