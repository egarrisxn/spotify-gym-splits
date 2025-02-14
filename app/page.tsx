import Link from "next/link";
import { Glow, GlowArea } from "@/components/ui/glow-area";
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
    <GlowArea className="mx-auto grid min-h-screen place-items-center pb-40">
      <Glow color="green" className="rounded-xl">
        <Card className="w-full max-w-2xl border p-12 shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="mb-4 text-4xl font-bold">
              Spotify Gym Splits
            </CardTitle>
            <CardDescription>
              Create your perfect workout playlist with timed intervals
            </CardDescription>
          </CardHeader>
          <CardContent className="mx-auto flex items-center justify-center">
            <Button asChild>
              <Link href="/workout">Start Workout</Link>
            </Button>
          </CardContent>
        </Card>
      </Glow>
    </GlowArea>
  );
}
