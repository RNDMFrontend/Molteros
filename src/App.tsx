import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Boot from "./pages/Boot";
import SyncVault from "./pages/SyncVault";
import Lock from "./pages/Lock";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Insights from "./pages/Insights";
import MarketSetup from "./pages/MarketSetup";
import Probabilities from "./pages/Probabilities";
import Play from "./pages/Play";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Boot />} />
          <Route path="/sync" element={<SyncVault />} />
          <Route path="/lock" element={<Lock />} />
          <Route path="/landing" element={<Landing />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/insights" element={<Insights />} />
          <Route path="/markets" element={<MarketSetup />} />
          <Route path="/probabilities" element={<Probabilities />} />
          <Route path="/play" element={<Play />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
