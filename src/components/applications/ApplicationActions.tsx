
import { ApplicationStatus } from "@/data/mockData";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { notificationService } from "@/services/notificationService";

interface ApplicationActionsProps {
  applicationId: string;
  currentStatus: ApplicationStatus;
  applicantName?: string;
  onStatusChange: (applicationId: string, newStatus: ApplicationStatus) => void;
}

export function ApplicationActions({ 
  applicationId, 
  currentStatus, 
  applicantName,
  onStatusChange 
}: ApplicationActionsProps) {
  const { toast } = useToast();
  
  const handleEmailClick = (e: React.MouseEvent) => {
    e.preventDefault();
    toast({
      title: "Función en desarrollo",
      description: "Esta funcionalidad estará disponible próximamente."
    });
    
    notificationService.createNotification(
      "Acción no disponible",
      "Has intentado usar una funcionalidad que está en desarrollo",
      "warning"
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {currentStatus !== "aprobado" && (
            <Button 
              variant="outline"
              className="w-full bg-green-50 text-green-600 border-green-300 hover:bg-green-100"
              onClick={() => onStatusChange(applicationId, "aprobado")}
            >
              Aprobar candidatura
            </Button>
          )}
          
          {currentStatus !== "rechazado" && (
            <Button 
              variant="outline"
              className="w-full bg-red-50 text-red-600 border-red-300 hover:bg-red-100"
              onClick={() => onStatusChange(applicationId, "rechazado")}
            >
              Rechazar candidatura
            </Button>
          )}
          
          {currentStatus !== "pendiente" && (
            <Button 
              variant="outline"
              className="w-full"
              onClick={() => onStatusChange(applicationId, "pendiente")}
            >
              Marcar como pendiente
            </Button>
          )}
          
          <Button 
            variant="outline"
            className="w-full"
            onClick={handleEmailClick}
          >
            <Mail className="mr-2 h-4 w-4" /> 
            Enviar correo al candidato
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
