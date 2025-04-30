
import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
import { jobService } from "@/services/jobService";
import { LoadingSpinner } from "@/components/UI/LoadingSpinner";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";

// Import refactored components
import { ProcessHeader } from "@/components/process-detail/ProcessHeader";
import { ProcessInfo } from "@/components/process-detail/ProcessInfo";
import { ProcessDescription } from "@/components/process-detail/ProcessDescription";
import { ProcessRequirements } from "@/components/process-detail/ProcessRequirements";
import { ProcessDocument } from "@/components/process-detail/ProcessDocument";
import { ProcessSummary } from "@/components/process-detail/ProcessSummary";

export default function ProcessDetail() {
  const { processId } = useParams<{ processId: string }>();
  const { isAuthenticated, currentUser } = useAuth();
  const { toast } = useToast();
  const [loading] = useState(false);
  
  if (!processId) {
    return <div>ID de proceso no válido</div>;
  }
  
  const process = jobService.getJobById(processId);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!process) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-3">Proceso no encontrado</h2>
          <p className="text-gray-500 mb-6">El proceso que buscas no existe o no está disponible</p>
          <Link to="/procesos">
            <Button>Volver a procesos</Button>
          </Link>
        </div>
      </MainLayout>
    );
  }
  
  const isActive = () => {
    const now = new Date().toISOString().split('T')[0];
    return process.fechaInicio <= now && process.fechaFin >= now;
  };
  
  const canApply = () => {
    // If not authenticated or not active, can't apply
    if (!isAuthenticated || !isActive()) return false;
    
    // If public job, anyone can apply
    if (process.tipo === 'publico') return true;
    
    // If internal job, only workers can apply
    return currentUser?.rol === 'trabajador';
  };
  
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Enlace copiado",
      description: "El enlace a este proceso ha sido copiado al portapapeles"
    });
  };
  
  return (
    <MainLayout>
      <ProcessHeader 
        process={process} 
        isActive={isActive()} 
        handleShare={handleShare} 
        canApply={canApply()}
        isAuthenticated={isAuthenticated}
      />
      
      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          <ProcessDescription description={process.descripcion} />
          <ProcessRequirements requirements={process.requisitos} />
          <ProcessDocument pdfBase={process.pdfBase} />
        </div>
        
        <div>
          <ProcessSummary 
            process={process}
            isActive={isActive()}
            canApply={canApply()}
            isAuthenticated={isAuthenticated}
            currentUserRole={currentUser?.rol}
          />
        </div>
      </div>
    </MainLayout>
  );
}
