import Image from "next/image";

/** Mitchell's cut-out portrait sitting on pure black, with a green spotlight behind
 *  and a fade at the bottom so the coat dissolves into the page. */
export default function Portrait({ priority = false, className = "" }: { priority?: boolean; className?: string }) {
  return (
    <div className={`relative aspect-[1194/1317] w-full ${className}`}>
      <div className="glow-green breathe pointer-events-none absolute left-1/2 top-[38%] h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2" />
      <div className="glow-gold pointer-events-none absolute left-[55%] top-[20%] h-[50%] w-[50%] -translate-x-1/2 opacity-60" />
      <Image
        src="/images/mitchell-portrait.png"
        alt="Mitchell, nutritionist, smiling in a white coat with a stethoscope"
        fill
        priority={priority}
        sizes="(min-width: 1024px) 45vw, 90vw"
        className="object-contain object-bottom"
        style={{
          WebkitMaskImage: "linear-gradient(to bottom, #000 62%, transparent 98%)",
          maskImage: "linear-gradient(to bottom, #000 62%, transparent 98%)",
        }}
      />
    </div>
  );
}
