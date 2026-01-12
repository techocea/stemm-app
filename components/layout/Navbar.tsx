import WaitingListModal from "../shared/WaitingListModal";
import Image from "next/image";

const Navbar = () => {
    return (
        <nav className="sticky top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="mx-auto flex h-20 lg:max-w-5xl sm:w-full items-center justify-between px-2 sm:px-6">
                <div className="flex items-center gap-2 shrink-0">
                    <Image
                        src="/logo.png"
                        width={36} // Slightly smaller for better mobile fit
                        height={36}
                        alt="SmpleyLearnIt Logo"
                        className="object-contain"
                    />
                    <span className="text-lg sm:text-xl @max-xs:text-xs font-bold tracking-tight text-slate-800">
                        SmpleyLearn<span className="text-indigo-600">It</span>
                    </span>
                </div>

                <div className="hidden md:flex items-center gap-8 text-slate-600 font-medium">
                    <a
                        href="#preview"
                        className="hover:text-indigo-600 transition-colors"
                    >
                        How it Works
                    </a>
                    <a
                        href="#features"
                        className="hover:text-indigo-600 transition-colors"
                    >
                        Features
                    </a>
                </div>
                <div className="flex items-center">
                    <WaitingListModal text="join waitlist" icon={false} />
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
