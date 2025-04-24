
import { Badge } from "@/components/ui/badge";
import { ApplicationStatus } from "@/data/mockData";

type StatusBadgeProps = {
  status: ApplicationStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  switch (status) {
    case 'aprobado':
      return (
        <Badge variant="default" className="bg-hrm-green hover:bg-hrm-green/80">
          Aprobado
        </Badge>
      );
    case 'rechazado':
      return (
        <Badge variant="destructive">
          Rechazado
        </Badge>
      );
    case 'pendiente':
    default:
      return (
        <Badge variant="outline" className="bg-hrm-yellow/20 text-hrm-yellow border-hrm-yellow hover:bg-hrm-yellow/30">
          Pendiente
        </Badge>
      );
  }
};
