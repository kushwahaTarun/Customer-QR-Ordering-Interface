import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#16080C] px-6 text-center text-[#f7efe6]">
      <div className="relative size-16 overflow-hidden rounded-full ring-1 ring-[#d4a85a]/40">
        <Image
          src="/brands/shagun-logo.jpg"
          alt="Shagun"
          fill
          sizes="64px"
          className="object-cover"
        />
      </div>
      <p className="eyebrow mt-5">Shagun</p>
      <div className="gold-rule-center mt-4" />
      <h1 className="font-heading mt-5 text-5xl leading-none">Page not found</h1>
      <p className="mt-4 max-w-sm text-base leading-7 text-[#f7efe6]/72">
        Please scan the QR on your Shagun table again.
      </p>
      <Link
        href="/"
        className="gold-fill mt-8 inline-flex h-12 items-center rounded-full px-6 text-sm tracking-[0.16em] uppercase"
      >
        Back
      </Link>
    </div>
  );
}
