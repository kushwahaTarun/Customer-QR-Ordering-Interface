import Link from "next/link";

export default function InvalidQrPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center bg-[#16080C] px-6 text-center text-[#f7efe6]">
      <p className="eyebrow">Table QR</p>
      <div className="gold-rule-center mt-4" />
      <h1 className="font-heading mt-6 max-w-md text-5xl leading-[0.9]">
        This QR is not valid
      </h1>
      <p className="mx-auto mt-5 max-w-sm text-base leading-7 text-[#f4eadc]/72">
        The link was changed, typed by hand, or is for another table. Please
        scan the QR on your table again.
      </p>
      <Link
        href="/"
        className="gold-fill mt-8 inline-flex h-12 items-center rounded-full px-6 text-sm tracking-[0.14em] uppercase"
      >
        Back
      </Link>
    </div>
  );
}
