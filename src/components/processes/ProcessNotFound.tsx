
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function ProcessNotFound() {
  return (
    <div className="text-center py-16">
      <h2 className="text-2xl font-bold mb-3">Proceso no encontrado</h2>
      <p className="text-gray-500 mb-6">El proceso que buscas no existe o no está disponible</p>
      <Link to="/rrhh/procesos">
        <Button>Volver a procesos</Button>
      </Link>
    </div>
  );
}
