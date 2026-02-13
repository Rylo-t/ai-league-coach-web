import Link from "next/link";

export function Navbar() {
  return (
    <nav className="border-b border-border bg-card">
      <div className="container mx-auto px-4 h-14 flex items-center gap-6">
        <Link href="/" className="font-bold text-lg text-primary">
          AI League Coach
        </Link>
        <div className="flex gap-4 text-sm">
          <Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">
            Player Lookup
          </Link>
          <Link href="/pregame" className="text-muted-foreground hover:text-foreground transition-colors">
            Pre-Game
          </Link>
          <Link href="/matches" className="text-muted-foreground hover:text-foreground transition-colors">
            Matches
          </Link>
        </div>
      </div>
    </nav>
  );
}
