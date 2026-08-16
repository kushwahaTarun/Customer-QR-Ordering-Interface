import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#16080C] px-6 text-center text-[#f7efe6]">
      <div className="relative size-20 overflow-hidden rounded-full ring-1 ring-[#d4a85a]/40">
        <Image
          src="/brands/shagun-logo.jpg"
          alt="Shagun"
          fill
          sizes="80px"
          className="object-cover"
          priority
        />
      </div>
      <p className="eyebrow mt-6">Shagun</p>
      <div className="gold-rule-center mt-4" />
      <h1 className="font-heading mt-6 max-w-md text-5xl leading-[0.9]">
        Scan the QR on your table
      </h1>
      <p className="mx-auto mt-5 max-w-sm text-base leading-7 text-[#f7efe6]/72">
        This page does not open a restaurant by itself. Please scan the QR code
        kept on your Shagun table. Your table number is inside that QR.
      </p>
      <Link
        href="/demo"
        className="mt-10 text-sm tracking-[0.14em] text-[#d4a85a] uppercase underline-offset-4 hover:underline"
      >
        Demo: show table QRs
      </Link>
    </div>
  );
}
