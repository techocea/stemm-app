"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/app/utils/constants";
import Image from "next/image";

const Sidebar = () => {
    const pathname = usePathname();

    return (
        <aside className="hidden lg:flex w-52 h-screen fixed top-0 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex-col transition-all z-50">
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

            <nav className="flex-1 px-4 space-y-1.5">
                {NAV_ITEMS.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${isActive
                                ? "bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 font-bold shadow-sm"
                                : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:text-slate-900 dark:hover:text-slate-200"
                                }`}
                        >
                            <span
                                className={`text-xl transition-transform ${isActive ? "scale-110" : "opacity-70 group-hover:opacity-100"
                                    }`}
                            >
                                {item.icon}
                            </span>
                            <span className="text-sm">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6">
                <div className="bg-slate-900 dark:bg-slate-800 rounded-2xl p-5 text-white overflow-hidden relative shadow-xl shadow-indigo-500/10">
                    <div className="absolute top-0 right-0 w-20 h-20 bg-indigo-500/30 rounded-full blur-2xl -mr-10 -mt-10 animate-pulse"></div>
                    <p className="text-[10px] font-black opacity-60 uppercase tracking-widest mb-1">
                        PRO ACCOUNT
                    </p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black">42</span>
                        <span className="text-indigo-400 text-[10px] font-black tracking-tighter uppercase">
                            Credits Left
                        </span>
                    </div>
                    <button className="w-full mt-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[11px] font-black transition-all hover:shadow-lg hover:shadow-indigo-600/30 uppercase tracking-wider">
                        Upgrade Now
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
