import dotenv from "dotenv";
import { getPool } from "../config/database";

dotenv.config();

interface IdeaSeed {
  materialName: string;
  title: string;
  description: string;
  difficulty: "Fácil" | "Media" | "Difícil";
  steps: string[];
}

// 2 ideas por cada clase de materials (12 en total).
const IDEAS: readonly IdeaSeed[] = [
  {
    materialName: "biodegradable",
    title: "Composta casera con restos de cocina",
    description:
      "Convierte cáscaras, frutas y verduras en abono natural para tus plantas.",
    difficulty: "Fácil",
    steps: [
      "Junta los restos de frutas y verduras en un recipiente con tierra",
      "Mezcla y humedece ligeramente una vez por semana",
      "Espera 3 a 4 semanas hasta obtener abono oscuro y listo",
    ],
  },
  {
    materialName: "biodegradable",
    title: "Biofertilizante de cáscaras de plátano",
    description:
      "Aprovecha las cáscaras de plátano para nutrir tus plantas de forma natural.",
    difficulty: "Fácil",
    steps: [
      "Remoja las cáscaras de plátano en agua durante 3 días",
      "Cuela el agua y desecha las cáscaras",
      "Riega tus plantas con esta mezcla una vez por semana",
    ],
  },
  {
    materialName: "cardboard",
    title: "Organizador de cajones con cartón",
    description:
      "Suma divisiones a tus cajones con cajas de cartón sobrantes.",
    difficulty: "Fácil",
    steps: [
      "Mide tu cajón y corta el cartón a la medida",
      "Une las piezas con cinta para formar las divisiones",
      "Forra o decora el cartón con papel a tu gusto",
    ],
  },
  {
    materialName: "cardboard",
    title: "Mueble modular de cartón",
    description:
      "Construye estantes o separadores resistentes a base de cartón reforzado.",
    difficulty: "Media",
    steps: [
      "Diseña los módulos y corta las láminas de cartón",
      "Refuerza las uniones con pegamento y cinta",
      "Pinta con base y decora la superficie",
      "Barniza el exterior para protegerlo de la humedad",
    ],
  },
  {
    materialName: "glass",
    title: "Macetero colgante con botella",
    description:
      "Reutiliza una botella de vidrio como soporte para una planta.",
    difficulty: "Fácil",
    steps: [
      "Corta la botella por la mitad",
      "Lija los bordes para evitar cortes",
      "Coloca agua y una rama, e inserta la planta",
    ],
  },
  {
    materialName: "glass",
    title: "Lámpara de tarros de vidrio",
    description:
      "Crea una lámpara colgante con tarros de vidrio reutilizados.",
    difficulty: "Difícil",
    steps: [
      "Limpia el tarro y perfora la tapa según el soquet",
      "Instala el cableado y un foco LED de bajo consumo",
      "Fija el tarro a la tapa y prueba la conexión",
    ],
  },
  {
    materialName: "metal",
    title: "Portalápices de lata decorada",
    description:
      "Da una segunda vida a las latas de aluminio como organizador de escritorio.",
    difficulty: "Fácil",
    steps: [
      "Limpia la lata y retira la etiqueta",
      "Pinta con spray o acrílico",
      "Decora y úsala como portalápices",
    ],
  },
  {
    materialName: "metal",
    title: "Maceta vertical de latas",
    description:
      "Convierte varias latas en una jardinera vertical para espacios pequeños.",
    difficulty: "Media",
    steps: [
      "Perfora drenajes en la base de cada lata",
      "Píntalas y fíjalas a una tabla de madera",
      "Coloca sustrato y siembra plantas pequeñas",
    ],
  },
  {
    materialName: "paper",
    title: "Papel reciclado hecho a mano",
    description:
      "Elabora nuevas hojas de papel a partir de papel usado.",
    difficulty: "Media",
    steps: [
      "Tritura el papel usado y remójalo en agua",
      "Licúa con agua hasta formar una pulpa uniforme",
      "Cuela y presiona la pulpa sobre un marco",
      "Déjala secar durante 24 horas",
    ],
  },
  {
    materialName: "paper",
    title: "Cuaderno de notas con hojas usadas",
    description:
      "Aprovecha el reverso en blanco de las hojas impresas.",
    difficulty: "Fácil",
    steps: [
      "Junta las hojas impresas por una sola cara",
      "Ordena y perfora las hojas",
      "Encuaérnalas con un espiral o hilo resistente",
    ],
  },
  {
    materialName: "plastic",
    title: "Macetero de botella PET",
    description:
      "Recicla una botella de plástico como maceta para plantas pequeñas.",
    difficulty: "Fácil",
    steps: [
      "Corta la botella por la mitad",
      "Perfora drenajes en la base",
      "Llena con tierra y siembra tu planta",
    ],
  },
  {
    materialName: "plastic",
    title: "Alcancía de envase plástico",
    description:
      "Convierte un envase de plástico en una alcancía personalizada.",
    difficulty: "Fácil",
    steps: [
      "Limpia y decora el envase",
      "Recorta una ranura para las monedas",
      "Pega la tapa y personaliza la alcancía",
    ],
  },
];

async function main(): Promise<void> {
  const pool = getPool();

  try {
    const materials = await pool.query<{ id: number; name: string }>(
      "SELECT id, name FROM materials",
    );
    const materialIdByName = new Map(
      materials.rows.map((row) => [row.name, row.id]),
    );

    const existing = await pool.query<{ title: string }>(
      "SELECT title FROM reuse_ideas",
    );
    const existingTitles = new Set(existing.rows.map((row) => row.title));

    let inserted = 0;

    for (const idea of IDEAS) {
      const materialId = materialIdByName.get(idea.materialName);
      if (materialId === undefined) {
        console.warn(
          `  Skip "${idea.title}": material "${idea.materialName}" not found in materials.`,
        );
        continue;
      }

      if (existingTitles.has(idea.title)) {
        console.warn(`  Skip "${idea.title}": already present in reuse_ideas.`);
        continue;
      }

      await pool.query(
        "INSERT INTO reuse_ideas (material_id, title, description, difficulty, steps) VALUES ($1, $2, $3, $4, $5::jsonb)",
        [
          materialId,
          idea.title,
          idea.description,
          idea.difficulty,
          JSON.stringify(idea.steps),
        ],
      );

      inserted += 1;
    }

    console.log(`Seed: inserted ${inserted} reuse idea(s) into reuse_ideas.`);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(
    "[seed] reuse ideas seed failed:",
    err instanceof Error ? err.message : err,
  );
  process.exitCode = 1;
});