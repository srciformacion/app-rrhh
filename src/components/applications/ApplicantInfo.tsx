
import { User } from "@/data/mockData";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Calendar, Mail, Phone, User as UserIcon } from "lucide-react";

interface ApplicantInfoProps {
  applicant: User | undefined;
  applicationDate: string;
  status: string;
}

export function ApplicantInfo({ applicant, applicationDate, status }: ApplicantInfoProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Información del candidato</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applicant ? (
            <>
              <div className="space-y-4">
                <div className="flex items-center">
                  {applicant.avatarUrl ? (
                    <img 
                      src={applicant.avatarUrl} 
                      alt={applicant.nombre} 
                      className="h-16 w-16 rounded-full mr-4"
                    />
                  ) : (
                    <div className="h-16 w-16 bg-gray-200 rounded-full flex items-center justify-center mr-4">
                      <UserIcon className="h-8 w-8 text-gray-500" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold">{applicant.nombre}</h3>
                    <p className="text-gray-500">{applicant.rol}</p>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Fecha de solicitud</p>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                    <span>{new Date(applicationDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Estado actual</p>
                  <StatusBadge status={status} />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2 text-gray-600" />
                    <a href={`mailto:${applicant.email}`} className="text-blue-600 hover:underline">
                      {applicant.email}
                    </a>
                  </div>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2 text-gray-600" />
                    <a href={`tel:${applicant.telefono}`} className="text-blue-600 hover:underline">
                      {applicant.telefono}
                    </a>
                  </div>
                </div>
                
                {applicant.fechaNacimiento && (
                  <div>
                    <p className="text-sm text-gray-500">Fecha de nacimiento</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-600" />
                      <span>{new Date(applicant.fechaNacimiento).toLocaleDateString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="col-span-2">
              <p>No se encontró información del candidato</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'aprobado':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-green-100 text-green-800 text-xs font-medium">
          Aprobado
        </span>
      );
    case 'rechazado':
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-red-100 text-red-800 text-xs font-medium">
          Rechazado
        </span>
      );
    case 'pendiente':
    default:
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md bg-yellow-100 text-yellow-800 text-xs font-medium">
          Pendiente
        </span>
      );
  }
}
