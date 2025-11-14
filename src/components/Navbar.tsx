import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UtensilsCrossed, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-primary">
            <UtensilsCrossed className="h-6 w-6" />
            <span>Foodie Hub</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-foreground/80 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/#features" className="text-foreground/80 hover:text-primary transition-colors">
              Features
            </Link>
            <Link to="/menu" className="text-foreground/80 hover:text-primary transition-colors">
              Pre-Order
            </Link>
            <Link to="/tables" className="text-foreground/80 hover:text-primary transition-colors">
              Book Table
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button onClick={() => navigate("/dashboard")} variant="outline">
                  Dashboard
                </Button>
                <Button onClick={handleLogout} variant="ghost" size="icon">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button onClick={() => navigate("/login")} variant="outline">
                  Login
                </Button>
                <Button onClick={() => navigate("/register")}>
                  Register
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};
