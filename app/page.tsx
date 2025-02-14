import Link from "next/link";
import { Glow, GlowArea } from "@/components/glow";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <GlowArea className="grid mx-auto place-items-center min-h-screen">
      <Glow color="green" className="rounded-xl">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-4xl font-bold mb-4">
              Spotify Gym Splits
            </CardTitle>
            <CardDescription className="text-lg">
              Create your perfect workout playlist with timed intervals
            </CardDescription>
          </CardHeader>
          <CardContent className="flex mx-auto items-center justify-center">
            <Button asChild>
              <Link href="/workout">Start Workout</Link>
            </Button>
          </CardContent>
        </Card>
      </Glow>
    </GlowArea>
  );
}
