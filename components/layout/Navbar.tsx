import { Brain } from "lucide-react";
import WaitingListModal from "../shared/WaitingListModal";
import Image from "next/image";

const Navbar = () => {
    return (
        <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="lg:max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {/* <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg">
                        <Brain />
                    </div> */}
                    <Image
                        src="/logo.png"
                        width={40}
                        height={40}
                        alt="AI study assistant,PDF to summary AI,automatic study notes,practice quiz generator,student productivity tool"
                    />
                    <span className="text-xl font-bold tracking-tight text-slate-800">
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
                <WaitingListModal text="join waitlist" icon={false} />
            </div>
        </nav>
    );
};

export default Navbar;
