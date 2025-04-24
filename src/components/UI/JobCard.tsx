
import { Link } from "react-router-dom";
import { JobPosting } from "@/data/mockData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type JobCardProps = {
  job: JobPosting;
  showApplyLink?: boolean;
}

export const JobCard = ({ job, showApplyLink = true }: JobCardProps) => {
  const isActive = () => {
    const now = new Date().toISOString().split('T')[0];
    return job.fechaInicio <= now && job.fechaFin >= now;
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6 hover:shadow-md transition-shadow animate-fade-in">
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-xl font-bold text-gray-900">{job.titulo}</h3>
        <div className="flex space-x-2">
          <Badge variant={job.tipo === "publico" ? "default" : "secondary"}>
            {job.tipo === "publico" ? "Público" : "Interno"}
          </Badge>
          <Badge variant={isActive() ? "outline" : "destructive"}>
            {isActive() ? "Activo" : "Cerrado"}
          </Badge>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-600 line-clamp-2">{job.descripcion}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
        <div>
          <p className="text-gray-500">Grupo</p>
          <p className="font-medium">{job.grupoDestinatario}</p>
        </div>
        <div>
          <p className="text-gray-500">Fecha de cierre</p>
          <p className="font-medium">{new Date(job.fechaFin).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-gray-500 text-sm mb-1">Requisitos</p>
        <div className="flex flex-wrap gap-2">
          {job.requisitos.map((req, index) => (
            <Badge key={index} variant="outline" className="bg-gray-50">
              {req}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Link to={`/portal-empleo/oferta/${job.id}`}>
          <Button variant="outline" className="mr-2">Ver detalles</Button>
        </Link>
        {showApplyLink && isActive() && (
          <Link to={`/portal-empleo/aplicar/${job.id}`}>
            <Button>Postular</Button>
          </Link>
        )}
      </div>
    </div>
  );
};
