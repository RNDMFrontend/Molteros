import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Nav */}
      <header className="flex items-center justify-between px-6 sm:px-10 py-6">
        <span className="text-sm font-semibold text-foreground tracking-tight">
          Molter<span className="text-primary"> OS</span>
        </span>
        <Link to="/dashboard">
          <Button size="sm" className="text-xs px-5 py-2 h-auto gap-1.5">
            Get Started <ArrowRight className="w-3 h-3" />
          </Button>
        </Link>
      </header>

      {/* Hero */}
      <main className="flex-1 flex flex-col justify-center items-center px-6 sm:px-10 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h1 className="text-foreground font-extrabold text-[clamp(2.5rem,8vw,6rem)] leading-[0.95] tracking-[-0.03em]">
            Molter<span className="text-primary"> OS</span>
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base mt-4 max-w-md mx-auto">
            Autonomous trading intelligence running on a Raspberry Pi 5.
            <br />
            Always on. Always watching.
          </p>
        </motion.div>

        {/* Launch Video */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-md rounded-2xl overflow-hidden border border-border bg-card"
        >
          <video
            className="w-full aspect-video object-cover"
            autoPlay
            muted
            loop
            playsInline
            poster=""
          >
            {/* Replace src with your uploaded video path */}
            <source src="/launch-video.mp4" type="video/mp4" />
            <div className="w-full aspect-video bg-card flex items-center justify-center text-muted-foreground text-xs">
              Launch video
            </div>
          </video>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8"
        >
          <Link to="/dashboard">
            <Button size="lg" className="gap-2">
              Enter Dashboard <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="flex items-center justify-between px-6 sm:px-10 py-6 text-xs text-muted-foreground">
        <span>Raspberry Pi 5 · Local Device</span>
        <span className="text-primary/60 text-[10px] uppercase tracking-widest">Restricted Access</span>
      </footer>
    </div>
  );
};

export default Landing;
