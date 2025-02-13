import Link from "next/link"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Spotify Gym Splits</h1>
      <p className="text-xl mb-8">Create your perfect workout playlist with timed intervals</p>
      <Link href="/workout" className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded">
        Start Workout
      </Link>
    </main>
  )
}

