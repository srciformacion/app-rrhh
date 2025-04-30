
import { Card, CardContent } from "@/components/ui/card";

interface ProcessDescriptionProps {
  description: string;
}

export function ProcessDescription({ description }: ProcessDescriptionProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Descripción</h2>
        <p className="whitespace-pre-line">{description}</p>
      </CardContent>
    </Card>
  );
}
