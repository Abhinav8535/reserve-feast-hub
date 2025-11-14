import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { MenuCard } from "@/components/MenuCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Trash2 } from "lucide-react";
import food1 from "@/assets/food-1.jpg";
import food2 from "@/assets/food-2.jpg";
import food3 from "@/assets/food-3.jpg";

const Menu = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    checkUser();
    fetchMenuItems();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    setUser(session?.user);
  };

  const fetchMenuItems = async () => {
    const { data } = await supabase
      .from("menu_items")
      .select("*")
      .eq("is_available", true);

    if (data && data.length === 0) {
      const sampleItems = [
        { name: "Gourmet Burger", description: "Juicy burger with premium beef", price: 15.99, category: "Main Course", image_url: food1 },
        { name: "Fresh Salad Bowl", description: "Mixed greens with grilled chicken", price: 12.99, category: "Salads", image_url: food2 },
        { name: "Pasta Special", description: "Homemade pasta with herbs", price: 14.99, category: "Main Course", image_url: food3 },
      ];
      setMenuItems(sampleItems);
    } else {
      setMenuItems(data || []);
    }
  };

  const addToCart = (item: any) => {
    setCart([...cart, item]);
    toast({ title: "Added to cart", description: `${item.name} added successfully` });
  };

  const removeFromCart = (index: number) => {
    const newCart = cart.filter((_, i) => i !== index);
    setCart(newCart);
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price, 0).toFixed(2);
  };

  const placeOrder = async () => {
    if (!user) {
      toast({ title: "Please login", description: "You must be logged in to place an order", variant: "destructive" });
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      toast({ title: "Empty cart", description: "Please add items to cart", variant: "destructive" });
      return;
    }

    const tokenNumber = Math.floor(Math.random() * 9000) + 1000;
    
    const { error } = await supabase
      .from("orders")
      .insert({
        customer_id: user.id,
        token_number: tokenNumber,
        total_amount: parseFloat(calculateTotal()),
        status: "pending",
      });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Order placed!", description: `Your token number is #${tokenNumber}` });
      setCart([]);
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Pre-Order Food</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {menuItems.map((item, index) => (
                <MenuCard
                  key={index}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  category={item.category}
                  imageUrl={item.image_url}
                  onAddToCart={() => addToCart(item)}
                />
              ))}
            </div>
          </div>

          <div className="lg:col-span-1">
            <Card className="shadow-card sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-primary" />
                  Your Cart
                </CardTitle>
              </CardHeader>
              <CardContent>
                {cart.length === 0 ? (
                  <p className="text-muted-foreground">Cart is empty</p>
                ) : (
                  <>
                    <div className="space-y-2 mb-4">
                      {cart.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-2 border rounded">
                          <div>
                            <p className="font-medium">{item.name}</p>
                            <p className="text-sm text-muted-foreground">${item.price}</p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeFromCart(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-4">
                      <div className="flex items-center justify-between mb-4">
                        <span className="font-bold text-lg">Total:</span>
                        <span className="font-bold text-lg text-primary">${calculateTotal()}</span>
                      </div>
                      <Button onClick={placeOrder} className="w-full">
                        Place Order
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Menu;
