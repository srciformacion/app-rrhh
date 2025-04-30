
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle
} from "@/components/ui/card";

interface MotivationLetterProps {
  motivacion: string | undefined;
}

export function MotivationLetter({ motivacion }: MotivationLetterProps) {
  if (!motivacion) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Carta de motivación</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="whitespace-pre-line">{motivacion}</p>
      </CardContent>
    </Card>
  );
}
