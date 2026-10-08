import dotenv from "dotenv";
import { getPool } from "../config/database";

dotenv.config();

interface MaterialSeed {
  name: string;
  pointsPerUnit: number;
  description: string;
}

// Los 6 materiales = clases de clasificación de Roboflow.
const MATERIALS: readonly MaterialSeed[] = [
  {
    name: "biodegradable",
    pointsPerUnit: 5,
    description: "Material orgánico que se descompone naturalmente (restos de alimentos, plantas).",
  },
  {
    name: "cardboard",
    pointsPerUnit: 10,
    description: "Cartón corrugado o de embalaje, limpio y seco.",
  },
  {
    name: "glass",
    pointsPerUnit: 15,
    description: "Envases y botellas de vidrio reciclables.",
  },
  {
    name: "metal",
    pointsPerUnit: 20,
    description: "Latas y envases metálicos de aluminio o acero.",
  },
  {
    name: "paper",
    pointsPerUnit: 8,
    description: "Papel de oficina, periódico y cuadernos, limpio y seco.",
  },
  {
    name: "plastic",
    pointsPerUnit: 12,
    description: "Envases plásticos como botellas PET y bolsas reciclables.",
  },
];

async function main(): Promise<void> {
  const pool = getPool();

  try {
    const existing = await pool.query<{ name: string }>("SELECT name FROM materials");
    const existingNames = new Set(existing.rows.map((row) => row.name));

    const toInsert = MATERIALS.filter((material) => !existingNames.has(material.name));

    for (const material of toInsert) {
      await pool.query(
        "INSERT INTO materials (name, points_per_unit, description) VALUES ($1, $2, $3)",
        [material.name, material.pointsPerUnit, material.description],
      );
    }

    console.log(`Seed: inserted ${toInsert.length} material(s) into materials.`);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(
    "[seed] materials seed failed:",
    err instanceof Error ? err.message : err,
  );
  process.exitCode = 1;
});