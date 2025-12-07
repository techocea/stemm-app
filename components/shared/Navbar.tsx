import Image from "next/image";

const Navbar = () => {
  return (
    <header className="bg-transparent border-b border-gray-300">
      <div className="lg:max-w-4xl xl:max-w-5xl mx-auto flex items-center justify-center w-full p-4">
        <div className="flex items-center justify-center w-full gap-2">
          <Image src="/logo.png"
                 alt="logo"
                 width={40}
                 height={40}
                 className="object-cover max-sm:w-8"/>
          <h1 className="font-bold lg:text-lg md:flex">SimplyLearn.it</h1>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
