import Image from "next/image";
import FeedbackModal from "./FeedbackModal";

const Navbar = () => {
  return (
    <header className="bg-transparent p-4 border-b border-gray-300">
      <div className="lg:max-w-4xl xl:max-w-5xl mx-auto flex items-center justify-between w-full">
        <div className="flex items-center justify-center gap-2">
          <Image src="/logo.png" alt="logo" width={40} height={40} />
          <h1 className="font-bold text-lg">SimplyLearn.it</h1>
        </div>
        <div>
          {/* on click open feedback modal */}
          <FeedbackModal />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
