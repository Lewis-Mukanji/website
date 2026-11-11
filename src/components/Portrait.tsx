import Image from "next/image";

const photos = {
  coat: {
    src: "/images/mitchell-portrait.png",
    alt: "Mitchell, nutritionist, smiling in a white coat with a stethoscope",
    aspect: "aspect-[1194/1317]",
  },
  scrubs: {
    src: "/images/mitchell-scrubs.png",
    alt: "Mitchell smiling in teal scrubs and a surgical cap with a stethoscope",
    aspect: "aspect-[1024/1536]",
  },
};

/** Mitchell's cut-out portrait sitting on pure black, with a green spotlight behind
 *  and a fade at the bottom so it dissolves into the page. */
export default function Portrait({
  photo = "coat",
  priority = false,
  className = "",
}: {
  photo?: keyof typeof photos;
  priority?: boolean;
  className?: string;
}) {
  const p = photos[photo];
  return (
    <div className={`relative w-full ${p.aspect} ${className}`}>
      <div className="glow-green breathe pointer-events-none absolute left-1/2 top-[38%] h-[110%] w-[110%] -translate-x-1/2 -translate-y-1/2" />
      <div className="glow-gold pointer-events-none absolute left-[55%] top-[20%] h-[50%] w-[50%] -translate-x-1/2 opacity-60" />
      <Image
        src={p.src}
        alt={p.alt}
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
