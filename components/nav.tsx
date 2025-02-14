import ThemeToggle from "./theme-toggle";

export default function Nav() {
  return (
    <nav className="border-b p-4 xl:px-6">
      <div className="flex flex-row items-center justify-between">
        <h1 className="text-3xl font-black">SGS</h1>
        <ThemeToggle />
      </div>
    </nav>
  );
}
