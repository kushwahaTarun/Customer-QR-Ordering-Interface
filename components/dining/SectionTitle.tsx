export function SectionTitle({
  eyebrow,
  title,
  align = "left",
}: {
  eyebrow?: string;
  title: string;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "text-center" : undefined}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <div
        className={
          align === "center" ? "gold-rule-center mt-3" : "gold-rule mt-3"
        }
      />
      <h2 className="font-heading mt-3 text-[2rem] leading-none">{title}</h2>
    </div>
  );
}
