import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#070504] px-6 text-center text-[#f4eadc]">
      <p className="eyebrow">Digital Dining</p>
      <div className="gold-rule-center mt-4" />
      <h1 className="font-heading mt-5 text-5xl leading-none">
        This table
        <br />
        has been cleared.
      </h1>
      <p className="serif-italic mt-4 text-lg text-[#f4eadc]/70">
        The room you asked for is no longer on the floor.
      </p>
      <Link
        href="/"
        className="gold-fill mt-8 inline-flex h-12 items-center rounded-full px-6 text-sm tracking-[0.16em] uppercase"
      >
        Return to the house
      </Link>
    </div>
  );
}
