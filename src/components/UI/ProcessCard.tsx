
import { Link } from "react-router-dom";
import { JobPosting } from "@/data/jobTypes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Briefcase } from "lucide-react";

type ProcessCardProps = {
  process: JobPosting;
  showApplyLink?: boolean;
}

export const ProcessCard = ({ process, showApplyLink = true }: ProcessCardProps) => {
  const isActive = () => {
    const now = new Date().toISOString().split('T')[0];
    return process.fechaInicio <= now && process.fechaFin >= now;
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold text-gray-900">{process.titulo}</h3>
        <div className="flex space-x-2">
          <Badge variant={process.tipo === "publico" ? "default" : "secondary"}>
            {process.tipo === "publico" ? "Público" : "Interno"}
          </Badge>
          <Badge variant={isActive() ? "outline" : "destructive"}>
            {isActive() ? "Activo" : "Cerrado"}
          </Badge>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 line-clamp-2">{process.descripcion}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 my-4">
        <div className="flex items-center">
          <Briefcase className="h-4 w-4 mr-2 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Puesto</p>
            <p className="font-medium">{process.grupoDestinatario}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Calendar className="h-4 w-4 mr-2 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Publicación</p>
            <p className="font-medium">{new Date(process.fechaInicio).toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="flex items-center">
          <Clock className="h-4 w-4 mr-2 text-gray-500" />
          <div>
            <p className="text-sm text-gray-500">Cierre</p>
            <p className="font-medium">{new Date(process.fechaFin).toLocaleDateString()}</p>
          </div>
        </div>
        
        {process.ubicacion && (
          <div className="flex items-center">
            <MapPin className="h-4 w-4 mr-2 text-gray-500" />
            <div>
              <p className="text-sm text-gray-500">Ubicación</p>
              <p className="font-medium">{process.ubicacion}</p>
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {process.requisitos.slice(0, 3).map((req, index) => (
          <Badge key={index} variant="outline" className="bg-gray-50">
            {req}
          </Badge>
        ))}
        {process.requisitos.length > 3 && (
          <Badge variant="outline" className="bg-gray-50">
            +{process.requisitos.length - 3} más
          </Badge>
        )}
      </div>

      <div className="flex justify-end">
        <Link to={`/procesos/${process.id}`}>
          <Button variant="outline" className="mr-2">Ver detalles</Button>
        </Link>
        {showApplyLink && isActive() && (
          <Link to={`/aplicar/${process.id}`}>
            <Button>Postular</Button>
          </Link>
        )}
      </div>
    </div>
  );
};
