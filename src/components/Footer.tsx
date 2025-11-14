import { UtensilsCrossed } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="border-t bg-secondary/5 mt-20">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 text-xl font-bold text-primary mb-4">
              <UtensilsCrossed className="h-6 w-6" />
              <span>Foodie Hub</span>
            </div>
            <p className="text-muted-foreground">
              Your favorite restaurant for table bookings and food pre-orders.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="/" className="text-muted-foreground hover:text-primary transition-colors">
                  Home
                </a>
              </li>
              <li>
                <a href="/#features" className="text-muted-foreground hover:text-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="/menu" className="text-muted-foreground hover:text-primary transition-colors">
                  Menu
                </a>
              </li>
              <li>
                <a href="/tables" className="text-muted-foreground hover:text-primary transition-colors">
                  Book Table
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Contact</h3>
            <p className="text-muted-foreground">
              Email: info@foodiehub.com<br />
              Phone: (555) 123-4567<br />
              Address: 123 Food Street, Cuisine City
            </p>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-muted-foreground">
          <p>&copy; 2025 Foodie Hub. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
