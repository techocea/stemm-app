import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-slate-50 py-20 w-full border-t border-slate-100">
      <div className="mx-auto w-full px-6">
        <div className="flex flex-col items-center justify-between gap-4 w-full">
          <p className="text-slate-600">
            Built with passion for your support ❤️.
          </p>
          <p className="text-slate-600">
            Follow on{" "}
            <span className="underline hover:text-indigo-600 transition-colors hover:font-semibold">
              <Link href="https://www.linkedin.com/in/brightly-dunsford">
                LinkedIn
              </Link>
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
