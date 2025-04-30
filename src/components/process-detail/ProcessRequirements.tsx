
import { Card, CardContent } from "@/components/ui/card";

interface ProcessRequirementsProps {
  requirements: string[];
}

export function ProcessRequirements({ requirements }: ProcessRequirementsProps) {
  return (
    <Card>
      <CardContent className="pt-6">
        <h2 className="text-xl font-semibold mb-4">Requisitos</h2>
        <ul className="list-disc pl-6 space-y-2">
          {requirements.map((req, index) => (
            <li key={index}>{req}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
