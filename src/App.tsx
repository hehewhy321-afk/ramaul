import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import SmoothScrollProvider from "@/components/SmoothScrollProvider";
import Index from "./pages/Index";
import News from "./pages/News";
import Events from "./pages/Events";
import BudgetPage from "./pages/BudgetPage";
import Gallery from "./pages/Gallery";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import About from "./pages/About";
import Auth from "./pages/Auth";
import Issues from "./pages/Issues";
import Donate from "./pages/Donate";
import Admin from "./pages/Admin";
import Discussions from "./pages/Discussions";
import Documents from "./pages/Documents";
import Notices from "./pages/Notices";
import Elections from "./pages/Elections";
import NotFound from "./pages/NotFound";
import Stats from "./pages/Stats";
import Emergency from "./pages/Emergency";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SmoothScrollProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/news" element={<News />} />
              <Route path="/events" element={<Events />} />
              <Route path="/budget" element={<BudgetPage />} />
              <Route path="/gallery" element={<Gallery />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/about" element={<About />} />
              <Route path="/auth" element={<Auth />} />
              <Route path="/issues" element={<Issues />} />
              <Route path="/donate" element={<Donate />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="/discussions" element={<Discussions />} />
              <Route path="/documents" element={<Documents />} />
              <Route path="/notices" element={<Notices />} />
              <Route path="/elections" element={<Elections />} />
              <Route path="/stats" element={<Stats />} />
              <Route path="/emergency" element={<Emergency />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </SmoothScrollProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
