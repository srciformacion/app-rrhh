
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";

// Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";

// RRHH Pages
import RRHHDashboard from "./pages/rrhh/Dashboard";
import Processes from "./pages/rrhh/Processes";

// Portal de empleo pages
import JobListings from "./pages/portal/JobListings";
import JobDetail from "./pages/portal/JobDetail";
import JobApplicationForm from "./pages/portal/JobApplicationForm";
import MyApplications from "./pages/portal/MyApplications";

// Worker pages
import WorkerDashboard from "./pages/worker/WorkerDashboard";

// Chat
import ChatPage from "./pages/chat/ChatPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            
            {/* Portal de empleo routes */}
            <Route path="/portal-empleo" element={<JobListings />} />
            <Route path="/portal-empleo/oferta/:jobId" element={<JobDetail />} />
            <Route path="/portal-empleo/aplicar/:jobId" element={<JobApplicationForm />} />
            <Route path="/portal-empleo/mis-postulaciones" element={<MyApplications />} />
            
            {/* RRHH routes */}
            <Route path="/rrhh" element={<RRHHDashboard />} />
            <Route path="/rrhh/procesos" element={<Processes />} />
            
            {/* Worker routes */}
            <Route path="/trabajadores" element={<WorkerDashboard />} />
            
            {/* Chat routes */}
            <Route path="/chat" element={<ChatPage />} />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
