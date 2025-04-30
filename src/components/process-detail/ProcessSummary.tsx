
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { JobPosting } from "@/data/jobTypes";

interface ProcessSummaryProps {
  process: JobPosting;
  isActive: boolean;
  canApply: boolean;
  isAuthenticated: boolean;
  currentUserRole?: string;
}

export function ProcessSummary({ 
  process, 
  isActive, 
  canApply, 
  isAuthenticated,
  currentUserRole
}: ProcessSummaryProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Resumen</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-700">Tipo de proceso</h3>
            <p>{process.tipo === "publico" ? "Proceso público" : "Proceso interno"}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Puesto</h3>
            <p>{process.grupoDestinatario}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Fecha de cierre</h3>
            <p>{new Date(process.fechaFin).toLocaleDateString()}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Estado</h3>
            <p>{isActive ? "Activo" : "Cerrado"}</p>
          </div>
          {process.entidadConvocante && (
            <div>
              <h3 className="font-medium text-gray-700">Entidad convocante</h3>
              <p>{process.entidadConvocante}</p>
            </div>
          )}
        </div>
        
        {canApply && (
          <div className="mt-6">
            <Link to={`/aplicar/${process.id}`}>
              <Button className="w-full">Postularme a este proceso</Button>
            </Link>
          </div>
        )}
        
        {!isAuthenticated && (
          <div className="mt-6">
            <Link to="/login">
              <Button variant="outline" className="w-full">Iniciar sesión para postular</Button>
            </Link>
          </div>
        )}
        
        {isAuthenticated && !canApply && process.tipo === 'interno' && currentUserRole === 'solicitante' && (
          <div className="mt-6">
            <p className="text-sm text-gray-500 text-center">
              Este es un proceso interno solo para empleados activos
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
