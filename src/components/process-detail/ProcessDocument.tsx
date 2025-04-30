
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface ProcessDocumentProps {
  pdfBase?: string;
}

export function ProcessDocument({ pdfBase }: ProcessDocumentProps) {
  if (!pdfBase) return null;
  
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Bases del proceso</h2>
        <Button variant="outline" className="w-full" asChild>
          <a href={pdfBase} target="_blank" rel="noopener noreferrer">
            <FileText className="mr-2 h-4 w-4" /> Ver bases del proceso (PDF)
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
