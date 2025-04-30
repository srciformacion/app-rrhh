
import { Link } from "react-router-dom";
import { JobPosting } from "@/data/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface ProcessHeaderProps {
  process: JobPosting;
  isActive: boolean;
  handleShare: () => void;
  canApply: boolean;
  isAuthenticated: boolean;
}

export function ProcessHeader({ process, isActive, handleShare, canApply, isAuthenticated }: ProcessHeaderProps) {
  return (
    <>
      <div className="mb-4">
        <Link to="/procesos" className="text-hrm-blue hover:underline text-sm">
          &larr; Volver a procesos
        </Link>
      </div>
      
      <div className="mb-6 flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant={process.tipo === "publico" ? "default" : "secondary"}>
              {process.tipo === "publico" ? "Proceso público" : "Proceso interno"}
            </Badge>
            <Badge variant={isActive ? "outline" : "destructive"}>
              {isActive ? "Activo" : "Cerrado"}
            </Badge>
          </div>
          <h1 className="text-3xl font-bold mb-2">{process.titulo}</h1>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleShare}>
            Compartir
          </Button>
          {canApply ? (
            <Link to={`/aplicar/${process.id}`}>
              <Button>Postularme</Button>
            </Link>
          ) : !isAuthenticated ? (
            <Link to="/login">
              <Button>Iniciar sesión para postular</Button>
            </Link>
          ) : null}
        </div>
      </div>
    </>
  );
}
