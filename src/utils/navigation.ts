import fs from "fs";
import path from "path";

interface PageNode {
  name: string;
  path: string;
  children?: PageNode[];
}

/**
 * Obtiene un árbol de páginas desde la carpeta "pages".
 * Se ejecuta SOLO en el servidor.
 */
export const getPagesTree = (dir: string = "src/pages", basePath: string = ""): PageNode[] => {
  const pagesDir = path.join(process.cwd(), dir);

  if (!fs.existsSync(pagesDir)) {
    console.error(`❌ La carpeta '${dir}/' no existe.`);
    return [];
  }

  const entries = fs.readdirSync(pagesDir, { withFileTypes: true });

  return entries
    .filter((entry) => !entry.name.startsWith("_") && !entry.name.startsWith("[") && entry.name !== "index.tsx")
    .map((entry) => {
      const fullPath = path.join(dir, entry.name);
      const routePath = path.join(basePath, entry.name.replace(".tsx", "")).replace(/\\/g, "/");

      if (entry.isDirectory()) {
        return { name: entry.name, path: "/"+routePath, children: getPagesTree(fullPath, routePath) };
      } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
        return { name: entry.name.replace(".tsx", ""), path: "/"+routePath };
      }
    })
    .filter(Boolean) as PageNode[];
};
