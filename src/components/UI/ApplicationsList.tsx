
import React from "react";
import { Application } from "@/data/mockData";
import { User } from "@/data/mockData";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Calendar, Download, Eye } from "lucide-react";
import { StatusBadge } from "@/components/UI/StatusBadge";
import { Link } from "react-router-dom";

interface ApplicationsListProps {
  applications: Application[];
  users: User[];
  onStatusChange?: (applicationId: string, newStatus: "pendiente" | "aprobado" | "rechazado") => void;
  onExportData?: () => void;
}

export const ApplicationsList = ({ 
  applications, 
  users, 
  onStatusChange,
  onExportData 
}: ApplicationsListProps) => {
  if (!applications.length) {
    return (
      <div className="text-center py-10">
        <Calendar className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-lg font-medium">No hay postulaciones</h3>
        <p className="mt-1 text-sm text-gray-500">
          No se han recibido postulaciones para este proceso.
        </p>
      </div>
    );
  }

  const getUserById = (userId: string): User | undefined => {
    return users.find(user => user.id === userId);
  };

  return (
    <div className="space-y-4">
      {onExportData && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onExportData}>
            <Download className="h-4 w-4 mr-1" /> Exportar datos
          </Button>
        </div>
      )}
      
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Solicitante</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => {
              const user = getUserById(app.userId);
              
              return (
                <TableRow key={app.id}>
                  <TableCell className="font-medium">
                    {user ? (
                      <div className="flex items-center">
                        {user.avatarUrl ? (
                          <img 
                            src={user.avatarUrl} 
                            alt={user.nombre} 
                            className="h-8 w-8 rounded-full mr-2"
                          />
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gray-200 mr-2" />
                        )}
                        <div>
                          <p>{user.nombre}</p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                        </div>
                      </div>
                    ) : (
                      "Usuario no encontrado"
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="text-sm">
                      {new Date(app.fecha).toLocaleDateString()}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={app.estado} />
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Link to={`/rrhh/aplicacion/${app.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4 mr-1" /> Ver
                        </Button>
                      </Link>
                      {app.archivosAdjuntos && app.archivosAdjuntos.length > 0 && (
                        <Button variant="outline" size="sm">
                          <Download className="h-4 w-4 mr-1" /> CV
                        </Button>
                      )}
                      {onStatusChange && (
                        <div className="flex space-x-1">
                          {app.estado !== "aprobado" && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-green-50 text-green-600 border-green-300 hover:bg-green-100"
                              onClick={() => onStatusChange(app.id, "aprobado")}
                            >
                              Aprobar
                            </Button>
                          )}
                          {app.estado !== "rechazado" && (
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="bg-red-50 text-red-600 border-red-300 hover:bg-red-100"
                              onClick={() => onStatusChange(app.id, "rechazado")}
                            >
                              Rechazar
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};
