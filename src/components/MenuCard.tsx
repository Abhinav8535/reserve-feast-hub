import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";

interface MenuCardProps {
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  onAddToCart: () => void;
}

export const MenuCard = ({ name, description, price, category, imageUrl, onAddToCart }: MenuCardProps) => {
  return (
    <Card className="overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300">
      <div className="aspect-square overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{name}</h3>
          <Badge variant="secondary">{category}</Badge>
        </div>
        <p className="text-muted-foreground text-sm mb-3">{description}</p>
        <p className="text-primary text-xl font-bold">${price.toFixed(2)}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button onClick={onAddToCart} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
};
