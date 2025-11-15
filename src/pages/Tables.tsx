import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { TableCard } from "@/components/TableCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

const Tables = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [tables, setTables] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [selectedTable, setSelectedTable] = useState<any>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [guests, setGuests] = useState(2);
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    checkUser();
    fetchTables();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user);
  };

  const fetchTables = async () => {
    const { data, error } = await supabase
      .from("tables")
      .select("*")
      .order("table_number");
    
    if (error) {
      toast({
        title: "Error loading tables",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setTables(data || []);
    }
  };

  const handleBookTable = (table: any) => {
    if (!user) {
      toast({ title: "Please login", description: "You must be logged in to book a table", variant: "destructive" });
      navigate("/login");
      return;
    }
    setSelectedTable(table);
    setDialogOpen(true);
  };

  const confirmBooking = async () => {
    if (!bookingDate || !bookingTime) {
      toast({ title: "Missing information", description: "Please fill in all fields", variant: "destructive" });
      return;
    }

    // Resolve a valid UUID for table_id even if UI holds a numeric/string placeholder
    let tableId: string | null = selectedTable?.id ?? null;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    if (!tableId || !uuidRegex.test(String(tableId))) {
      const { data: tableRow, error: tableLookupError } = await supabase
        .from("tables")
        .select("id")
        .eq("table_number", selectedTable?.table_number)
        .maybeSingle();

      if (tableLookupError) {
        toast({ title: "Error", description: tableLookupError.message, variant: "destructive" });
        return;
      }

      tableId = tableRow?.id ?? null;
    }

    if (!tableId) {
      toast({ title: "Error", description: "Unable to resolve selected table.", variant: "destructive" });
      return;
    }

    const { error } = await supabase.from("bookings").insert({
      customer_id: user.id,
      table_id: tableId,
      booking_date: bookingDate,
      booking_time: bookingTime,
      number_of_guests: guests,
      status: "pending",
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Booking submitted!", description: "Waiting for owner approval" });
      setDialogOpen(false);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Book a Table</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tables.map((table) => (
            <TableCard
              key={table.id}
              tableNumber={table.table_number}
              capacity={table.capacity}
              isAvailable={table.is_available}
              onBook={() => handleBookTable(table)}
            />
          ))}
        </div>

        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Book Table {selectedTable?.table_number}</DialogTitle>
              <DialogDescription>Choose date, time, and number of guests.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="date">Date</Label>
                <Input
                  id="date"
                  type="date"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={bookingTime}
                  onChange={(e) => setBookingTime(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="guests">Number of Guests</Label>
                <Input
                  id="guests"
                  type="number"
                  min="1"
                  max={selectedTable?.capacity}
                  value={Number.isNaN(guests as unknown as number) ? 1 : guests}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    setGuests(Number.isNaN(v) ? 1 : v);
                  }}
                />
              </div>
              <Button onClick={confirmBooking} className="w-full">
                Confirm Booking
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <Footer />
    </div>
  );
};

export default Tables;
