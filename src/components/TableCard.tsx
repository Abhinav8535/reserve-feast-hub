import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Check } from "lucide-react";

interface TableCardProps {
  tableNumber: number;
  capacity: number;
  isAvailable: boolean;
  onBook?: () => void;
}

export const TableCard = ({ tableNumber, capacity, isAvailable, onBook }: TableCardProps) => {
  return (
    <Card className={`shadow-card transition-all duration-300 ${isAvailable ? 'hover:shadow-card-hover' : 'opacity-60'}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold">Table {tableNumber}</h3>
          {isAvailable ? (
            <Badge className="bg-accent">Available</Badge>
          ) : (
            <Badge variant="secondary">Booked</Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2 text-muted-foreground mb-4">
          <Users className="h-4 w-4" />
          <span>Capacity: {capacity} guests</span>
        </div>

        {onBook && isAvailable && (
          <Button onClick={onBook} className="w-full">
            <Check className="h-4 w-4 mr-2" />
            Book Table
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

const Badge = ({ children, className, variant }: { children: React.ReactNode; className?: string; variant?: string }) => {
  const baseClass = "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold";
  const variantClass = variant === "secondary" ? "bg-secondary text-secondary-foreground" : "bg-accent text-accent-foreground";
  return <span className={`${baseClass} ${variantClass} ${className}`}>{children}</span>;
};
