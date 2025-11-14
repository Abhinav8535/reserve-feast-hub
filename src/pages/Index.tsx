import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { FeatureCard } from "@/components/FeatureCard";
import { Calendar, ShoppingBag, Clock, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Hero Section */}
      <section 
        className="relative h-[600px] flex items-center justify-center text-center bg-cover bg-center"
        style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImage})` }}
      >
        <div className="container mx-auto px-4 z-10">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Welcome to Foodie Hub
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl mx-auto">
            Reserve your table and pre-order delicious meals with ease
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Button size="lg" onClick={() => navigate("/tables")} className="text-lg">
              Book a Table
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/menu")} className="text-lg bg-white/10 backdrop-blur text-white hover:bg-white/20">
              Order Food
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Why Choose Foodie Hub?</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience hassle-free dining with our modern table booking and food pre-ordering system
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <FeatureCard
            icon={Calendar}
            title="Easy Table Booking"
            description="Reserve your favorite table in advance with just a few clicks"
          />
          <FeatureCard
            icon={ShoppingBag}
            title="Pre-Order Food"
            description="Order your meals ahead and skip the wait at the restaurant"
          />
          <FeatureCard
            icon={Clock}
            title="Real-Time Updates"
            description="Track your booking status and order preparation live"
          />
          <FeatureCard
            icon={Award}
            title="Quality Service"
            description="Experience top-notch service with our streamlined system"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join Foodie Hub today and experience the future of dining
          </p>
          <Button size="lg" variant="secondary" onClick={() => navigate("/register")} className="text-lg">
            Create Account
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
