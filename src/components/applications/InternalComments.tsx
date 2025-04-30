
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { notificationService } from "@/services/notificationService";

interface InternalCommentsProps {
  initialComments: string | undefined;
  applicantName: string | undefined;
}

export function InternalComments({ initialComments, applicantName }: InternalCommentsProps) {
  const [comments, setComments] = useState(initialComments || "");
  const { toast } = useToast();
  
  const handleSaveComments = () => {
    // In a real application, this would send comments to the server
    toast({
      title: "Comentarios guardados",
      description: "Los comentarios han sido guardados correctamente."
    });
    
    notificationService.createNotification(
      "Comentarios guardados", 
      `Has actualizado los comentarios para la candidatura de ${applicantName || "un candidato"}`,
      "info"
    );
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Comentarios internos</CardTitle>
        <CardDescription>
          Estos comentarios son solo visibles para el equipo de RRHH
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          placeholder="Escribe tus comentarios sobre este candidato..."
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={5}
        />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSaveComments}>Guardar comentarios</Button>
      </CardFooter>
    </Card>
  );
}
