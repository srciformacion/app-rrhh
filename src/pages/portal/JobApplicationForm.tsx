import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { MainLayout } from "@/components/Layout/MainLayout";
import { jobService } from "@/services/jobService";
import { applicationService } from "@/services/jobService";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, Calendar, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { JobPosting } from "@/data/types";

export default function JobApplicationForm() {
  const { processId } = useParams<{ processId: string }>();
  const { isAuthenticated, currentUser } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [applying, setApplying] = useState(false);

  // Cargar los datos del proceso
  const process = processId ? jobService.getJobById(processId) : null;

  // Verificar si el proceso existe
  if (!process) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-3">Proceso no encontrado</h2>
          <p className="text-gray-500 mb-6">El proceso al que intentas aplicar no existe o no está disponible</p>
          <Link to="/portal-empleo">
            <Button>Volver a ofertas</Button>
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
    // If not authenticated, can't apply
    if (!isAuthenticated) return false;

    // If process is not active, can't apply
    if (!isActive()) return false;

    return true;
  };

  // Verificar si la persona puede aplicar
  if (!canApply()) {
    return (
      <MainLayout>
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold mb-3">No puedes aplicar a este proceso</h2>
          {!isAuthenticated ? (
            <>
              <p className="text-gray-500 mb-6">Debes iniciar sesión para postular a este proceso</p>
              <Link to="/login">
                <Button>Iniciar sesión</Button>
              </Link>
            </>
          ) : !isActive() ? (
            <>
              <p className="text-gray-500 mb-6">Este proceso ya no está activo</p>
              <Link to="/portal-empleo">
                <Button>Ver otras ofertas</Button>
              </Link>
            </>
          ) : (
            <p className="text-gray-500 mb-6">No cumples con los requisitos para aplicar a este proceso</p>
          )}
        </div>
      </MainLayout>
    );
  }

  const handleSubmit = async () => {
    setApplying(true);

    try {
      // Enviar la postulación
      await applicationService.submitJobApplication({
        processId: processId || "",
        userId: currentUser?.id,
      });

      // Mostrar mensaje de éxito
      toast({
        title: "¡Postulación enviada con éxito!",
        description: "Hemos recibido tu postulación y la revisaremos en breve.",
        variant: "default",
      });

      // Redirigir a la página de postulaciones
      navigate("/portal-empleo/mis-postulaciones");
    } catch (error) {
      console.error("Error al enviar la postulación:", error);
      toast({
        title: "Error al enviar la postulación",
        description: "Ha ocurrido un error al enviar tu postulación. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setApplying(false);
    }
  };

  return (
    <MainLayout>
      <div className="mb-4">
        <Link to={`/portal-empleo`} className="text-hrm-blue hover:underline text-sm">
          &larr; Volver al portal de empleo
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Confirmar postulación</h1>
        <p className="text-gray-500">Estás a punto de postular al siguiente proceso:</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Confirmación de postulación</CardTitle>
              <CardDescription>Revisa los detalles del proceso antes de confirmar tu postulación</CardDescription>
            </CardHeader>

            <CardContent>
              <div className="space-y-6">
                <p>
                  Al confirmar tu postulación, tu información de perfil será enviada al equipo de selección
                  para ser considerada en este proceso.
                </p>

                <p>
                  Asegúrate de que tu información de contacto esté actualizada en tu perfil.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Resumen del proceso</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold mb-2">{process.titulo}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant={process.tipo === "publico" ? "default" : "secondary"}>
                      {process.tipo === "publico" ? "Proceso público" : "Proceso interno"}
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center text-gray-600">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <span>{process.grupoDestinatario}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Publicado: {new Date(process.fechaInicio).toLocaleDateString()}</span>
                </div>

                <div className="flex items-center text-gray-600">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Cierre: {new Date(process.fechaFin).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Button
            className="w-full mt-4"
            onClick={handleSubmit}
            disabled={applying}
          >
            {applying ? "Postulando..." : "Confirmar postulación"}
          </Button>
        </div>
      </div>
    </MainLayout>
  );
}
