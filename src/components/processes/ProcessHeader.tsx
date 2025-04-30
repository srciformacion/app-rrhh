import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Download, FileText } from "lucide-react";
import { JobPosting } from "@/data/types";

interface ProcessHeaderProps {
  process: JobPosting;
  handleExport: () => void;
}

export function ProcessHeader({ process, handleExport }: ProcessHeaderProps) {
  const isActive = () => {
    const now = new Date().toISOString().split('T')[0];
    return process.fechaInicio <= now && process.fechaFin >= now;
  };

  return (
    <>
      <div className="mb-4">
        <Link to="/rrhh/procesos" className="text-blue-600 hover:underline text-sm inline-flex items-center">
          <ChevronLeft className="h-4 w-4 mr-1" /> Volver a procesos
        </Link>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={process.tipo === "publico" ? "default" : "secondary"}>
              {process.tipo === "publico" ? "Proceso público" : "Proceso interno"}
            </Badge>
            <Badge variant={isActive() ? "outline" : "destructive"}>
              {isActive() ? "Activo" : "Cerrado"}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold mb-1">{process.titulo}</h1>
          <p className="text-gray-500">{process.grupoDestinatario} - {new Date(process.fechaInicio).toLocaleDateString()} al {new Date(process.fechaFin).toLocaleDateString()}</p>
        </div>
        
        <div className="mt-4 md:mt-0 flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" /> Exportar datos
          </Button>
          <Button asChild>
            <Link to={`/rrhh/procesos/${process.id}`}>
              <FileText className="h-4 w-4 mr-2" /> Editar proceso
            </Link>
          </Button>
        </div>
      </div>
    </>
  );
}
