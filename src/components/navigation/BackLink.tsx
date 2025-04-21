import Link from "next/link";
import { useRouter } from "next/router";
import { FC } from "react";

// Define las props con TypeScript
interface BackLinkProps {
  previous?: { path: string }; // Ruta previa opcional
  className?: string; // Clases CSS opcionales
  children: React.ReactNode; // Contenido del enlace
}

const BackLink: FC<BackLinkProps> = ({ previous, className, children }) => {
  const router = useRouter();

  // Maneja el clic si no hay una ruta previa
  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!previous?.path) {
      e.preventDefault(); // Previene la navegación si no hay ruta previa
      router.back(); // Llama a router.back() para ir a la página anterior
    }
  };

  return (
    <Link
      href={previous?.path || "#"} // Si no hay `previous.path`, usa un enlace genérico
      onClick={handleBack} // Maneja el clic dinámicamente
      className={className}
    >
      {children}
    </Link>
  );
};

export default BackLink;
