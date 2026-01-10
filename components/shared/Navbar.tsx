"use client";

import { useTheme } from "next-themes";
import { Button } from "../ui/button";
import { Moon, Sun } from "lucide-react";
import { MOCK_USER } from "@/app/utils/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";
import SignInModal from "./SignInModal";

const Navbar = () => {
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const handleToggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const isAuthenticated = false;

  return (
    <header className="h-20 px-8 flex items-center justify-between sticky top-0 z-40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 transition-all">
      <div className="flex-1 max-w-lg">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="logo"
              width={40}
              height={40}
              className="object-cover max-sm:w-8"
            />
            <h1 className="font-bold lg:text-lg md:flex">Lumina</h1>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Button onClick={handleToggleTheme} variant="outline" size="icon">
          {theme === "dark" ? (
            <Sun className="h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          ) : (
            <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          )}

          <span className="sr-only">Toggle theme</span>
        </Button>

        <div className="h-8 w-px bg-slate-200 dark:bg-slate-800" />

        {isAuthenticated ? (
          <div className="flex items-center gap-3 pl-2">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {MOCK_USER.name}
              </p>
              <p className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                Student Tier
              </p>
            </div>
            <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-slate-100 dark:ring-slate-800 ring-offset-2 dark:ring-offset-slate-950">
              <img
                src={MOCK_USER.avatar}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        ) : (
          <SignInModal />
        )}
      </div>
    </header>
  );
};

export default Navbar;
