
import { JobPosting } from "@/data/types";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ClipboardList } from "lucide-react";

interface JobProcessInfoProps {
  job: JobPosting | undefined;
}

export function JobProcessInfo({ job }: JobProcessInfoProps) {
  if (!job) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Proceso</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Proceso no encontrado</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Proceso</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">{job.titulo}</h3>
          <div>
            <p className="text-sm text-gray-500">Tipo</p>
            <p>{job.tipo === "publico" ? "Proceso público" : "Proceso interno"}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Grupo destinatario</p>
            <p>{job.grupoDestinatario}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Fechas</p>
            <p>
              {new Date(job.fechaInicio).toLocaleDateString()} al{" "}
              {new Date(job.fechaFin).toLocaleDateString()}
            </p>
          </div>
          <Button variant="outline" className="w-full" asChild>
            <Link to={`/procesos/${job.id}`}>
              <ClipboardList className="mr-2 h-4 w-4" /> Ver proceso completo
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
