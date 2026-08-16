import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#100c09] px-6 text-center text-[#f6efe4]">
      <p className="text-[11px] uppercase tracking-[0.24em] text-[#c9a46a]">
        Not on the floor
      </p>
      <h1 className="font-heading mt-3 text-4xl">This table could not be found.</h1>
      <Link
        href="/"
        className="mt-6 rounded-full bg-[#c9a46a] px-5 py-2.5 text-sm text-[#1a140c]"
      >
        Return to scan
      </Link>
    </div>
  );
}
