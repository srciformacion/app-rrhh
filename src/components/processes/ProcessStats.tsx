import { Card, CardContent } from "@/components/ui/card";
import { JobApplication } from "@/data/types";

interface ProcessStatsProps {
  allApplications: JobApplication[];
  pendingApplications: JobApplication[];
  approvedApplications: JobApplication[];
  rejectedApplications: JobApplication[];
}

export function ProcessStats({ 
  allApplications, 
  pendingApplications, 
  approvedApplications, 
  rejectedApplications 
}: ProcessStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">Total candidatos</p>
            <h3 className="text-3xl font-bold">{allApplications.length}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">Pendientes</p>
            <h3 className="text-3xl font-bold text-yellow-500">{pendingApplications.length}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">Aprobados</p>
            <h3 className="text-3xl font-bold text-green-500">{approvedApplications.length}</h3>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="text-center">
            <p className="text-sm text-gray-500">Rechazados</p>
            <h3 className="text-3xl font-bold text-red-500">{rejectedApplications.length}</h3>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
