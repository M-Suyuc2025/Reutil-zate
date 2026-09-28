import dotenv from "dotenv";
import { getPool } from "../config/database";

dotenv.config();

interface RewardSeed {
  name: string;
  description: string;
  costPoints: number;
  monthlyLimit: number | null;
  totalLimit: number | null;
}

// 12 recompensas de ejemplo con costos escalonados y límites variados.
// monthly_limit: límite de canjes por usuario al mes; total_limit: límite total
// de canjes; ambos NULL = sin límite.
const REWARDS: readonly RewardSeed[] = [
  {
    name: "Café con leche en Reutilízate Café",
    description: "Disfruta un café con leche en nuestro café aliado.",
    costPoints: 50,
    monthlyLimit: 5,
    totalLimit: null,
  },
  {
    name: "Descuento del 10% en tienda eco",
    description: "10% de descuento en productos ecológicos seleccionados.",
    costPoints: 80,
    monthlyLimit: null,
    totalLimit: 30,
  },
  {
    name: "Bolsa reutilizable Reutilízate",
    description: "Bolsa de tela reutilizable con el logo del programa.",
    costPoints: 100,
    monthlyLimit: null,
    totalLimit: 20,
  },
  {
    name: "Termo de acero inoxidable",
    description: "Termo de acero para llevar tu bebida sin plástico.",
    costPoints: 120,
    monthlyLimit: 2,
    totalLimit: null,
  },
  {
    name: "Descuento del 15% en taller de reciclaje",
    description: "15% de descuento en los talleres mensuales del programa.",
    costPoints: 150,
    monthlyLimit: null,
    totalLimit: 10,
  },
  {
    name: "Kit de semillas para huerto",
    description: "Kit con semillas de hortalizas y guía para empezar tu huerto.",
    costPoints: 180,
    monthlyLimit: null,
    totalLimit: null,
  },
  {
    name: "Camiseta Reutilízate",
    description: "Camiseta ecológica de algodón orgánico",
    costPoints: 200,
    monthlyLimit: 3,
    totalLimit: null,
  },
  {
    name: "Cesta de productos ecológicos",
    description: "Cesta con frutas y verduras de productores locales.",
    costPoints: 250,
    monthlyLimit: null,
    totalLimit: null,
  },
  {
    name: "Taller de compostaje presencial",
    description: "Participación en el taller práctico de compostaje.",
    costPoints: 300,
    monthlyLimit: 4,
    totalLimit: null,
  },
  {
    name: "Descuento del 25% en curso de upcycling",
    description: "25% de descuento en cursos de reutilización creativa.",
    costPoints: 350,
    monthlyLimit: null,
    totalLimit: 15,
  },
  {
    name: "Merienda ecológica para dos",
    description: "Merienda saludable con productos locales para dos personas.",
    costPoints: 400,
    monthlyLimit: 2,
    totalLimit: null,
  },
  {
    name: "Bicicleta urbana reacondicionada",
    description: "Bicicleta reacondicionada con piezas recicladas.",
    costPoints: 500,
    monthlyLimit: null,
    totalLimit: 3,
  },
];

async function main(): Promise<void> {
  const pool = getPool();

  try {
    const existing = await pool.query<{ name: string }>(
      "SELECT name FROM rewards",
    );
    const existingNames = new Set(existing.rows.map((row) => row.name));

    let inserted = 0;

    for (const reward of REWARDS) {
      if (existingNames.has(reward.name)) {
        console.warn(`  Skip "${reward.name}": already present in rewards.`);
        continue;
      }

      await pool.query(
        "INSERT INTO rewards (name, description, cost_points, monthly_limit, total_limit) VALUES ($1, $2, $3, $4, $5)",
        [
          reward.name,
          reward.description,
          reward.costPoints,
          reward.monthlyLimit,
          reward.totalLimit,
        ],
      );

      inserted += 1;
    }

    console.log(`Seed: inserted ${inserted} reward(s) into rewards.`);
  } finally {
    await pool.end();
  }
}

main().catch((err) => {
  console.error(
    "[seed] rewards seed failed:",
    err instanceof Error ? err.message : err,
  );
  process.exitCode = 1;
});