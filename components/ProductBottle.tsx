import Image from "next/image";

interface ProductBottleProps {
  className?: string;
  priority?: boolean;
}

// Foto real del producto (original 1500px, fondo eliminado y nitidez mejorada
// con scripts/process-product-image.py)
export function ProductBottle({ className, priority = false }: ProductBottleProps) {
  return (
    <Image
      src="/product/zma-bottle.png"
      alt="Bote de Bodyathlon ZMA, 120 cápsulas"
      width={596}
      height={1059}
      priority={priority}
      className={className}
    />
  );
}
