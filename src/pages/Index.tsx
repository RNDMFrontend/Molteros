import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 sm:px-10 py-6">
        <span className="text-sm font-semibold text-foreground tracking-tight">
          Companion OS
        </span>
        <Button size="sm" className="text-xs px-5 py-2 h-auto">
          Get Started
        </Button>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col justify-center px-6 sm:px-10 pb-8">
        <div className="max-w-full">
          <h1 className="text-headline text-[clamp(3rem,10vw,9rem)] leading-[0.95]">
            Your Personal AI
          </h1>
          <h1 className="text-headline-muted text-[clamp(3rem,10vw,9rem)] leading-[0.95] text-right mt-2 sm:mt-4">
            Operating System
          </h1>
        </div>

        {/* Bottom descriptions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mt-16 sm:mt-24 gap-8">
          <p className="text-body-subtle text-sm max-w-[220px]">
            A private computer for your AI
            <br />
            companion to live and grow.
            <br />
            Always on, always yours.
          </p>
          <p className="text-body-subtle text-sm max-w-[260px] sm:text-right">
            We handle the servers, storage, and
            <br />
            infrastructure so you don't have to.
          </p>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between px-6 sm:px-10 py-6 text-xs text-muted-foreground">
        <span>© 2026 Companion, Inc.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
        </div>
      </footer>
    </div>
  );
};

export default Index;
