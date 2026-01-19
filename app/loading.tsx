import { Container, Section } from "@/components/craft";
import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <Section>
      <Container className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Container>
    </Section>
  );
}
