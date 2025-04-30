
import { JobPosting } from "@/data/types";
import { 
  Calendar, 
  Users, 
  MapPin, 
  Briefcase,
  FileText,
  Clock
} from "lucide-react";

interface ProcessInfoProps {
  process: JobPosting;
}

export function ProcessInfo({ process }: ProcessInfoProps) {
  return (
    <div className="flex flex-col gap-2 text-gray-500">
      <div className="flex items-center">
        <Briefcase className="h-4 w-4 mr-2" />
        <span>{process.grupoDestinatario}</span>
      </div>
      <div className="flex items-center">
        <Calendar className="h-4 w-4 mr-2" />
        <span>
          Fecha publicación: {new Date(process.fechaInicio).toLocaleDateString()}
        </span>
      </div>
      <div className="flex items-center">
        <Clock className="h-4 w-4 mr-2" />
        <span>
          Fecha fin presentación: {new Date(process.fechaFin).toLocaleDateString()}
        </span>
      </div>
      {process.ubicacion && (
        <div className="flex items-center">
          <MapPin className="h-4 w-4 mr-2" />
          <span>{process.ubicacion}</span>
        </div>
      )}
      {process.codigoInterno && (
        <div className="flex items-center">
          <FileText className="h-4 w-4 mr-2" />
          <span>Código: {process.codigoInterno}</span>
        </div>
      )}
    </div>
  );
}
