"use client";

import Image from "next/image";
import { QRCodeSVG } from "qrcode.react";

export function DemoQrCard({
  value,
  name,
  table,
}: {
  value: string;
  name: string;
  table: string;
}) {
  return (
    <article className="rounded-[1.4rem] border border-[#d4a85a]/20 bg-[#221016] p-4 text-center text-[#f7efe6]">
      <div className="mx-auto w-fit rounded-2xl bg-white p-3">
        <QRCodeSVG value={value} size={148} includeMargin />
      </div>
      <div className="relative mx-auto mt-4 size-10 overflow-hidden rounded-full ring-1 ring-[#d4a85a]/35">
        <Image
          src="/brands/shagun-logo.jpg"
          alt=""
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>
      <h2 className="font-heading mt-3 text-2xl">{name}</h2>
      <p className="mt-1 text-sm text-[#d4a85a]">Table {table}</p>
      <a
        href={value}
        className="mt-3 inline-block text-xs tracking-[0.12em] uppercase underline-offset-4 hover:underline"
      >
        Open this table
      </a>
    </article>
  );
}
