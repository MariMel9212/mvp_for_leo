type BlobProps = {
  src: string;
};

export function Blob({ src }: BlobProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- SVG root size is fixed at 246×290
    <img
      src={src}
      alt=""
      width={246}
      height={290}
      draggable={false}
      className="h-[290px] w-[246px] max-w-none shrink-0"
    />
  );
}
