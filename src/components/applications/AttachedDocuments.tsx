
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AttachedDocumentsProps {
  documents: string[] | undefined;
}

export function AttachedDocuments({ documents }: AttachedDocumentsProps) {
  const { toast } = useToast();
  
  if (!documents || documents.length === 0) return null;
  
  const handleExportCV = () => {
    toast({
      title: "Descargando documento",
      description: "El CV se está descargando"
    });
    // In a real app, this would download the document
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Documentos adjuntos</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {documents.map((archivo, index) => (
            <Button key={index} variant="outline" className="w-full justify-start" onClick={handleExportCV}>
              <Download className="mr-2 h-4 w-4" /> {archivo}
            </Button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
