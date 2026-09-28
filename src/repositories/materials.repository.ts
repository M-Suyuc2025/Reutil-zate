import { getPool } from "../config/database";
import type { ReuseIdea } from "../types/waste";

export class UnknownMaterialError extends Error {
  constructor(material: string) {
    super(`No points mapping defined for material: "${material}".`);
    this.name = "UnknownMaterialError";
  }
}

interface MaterialRow {
  id: number;
  points_per_unit: number;
}

// Consulta id y puntos de un material por nombre. Devuelve null si no existe.
async function findMaterialByName(name: string): Promise<MaterialRow | null> {
  const result = await getPool().query<MaterialRow>(
    "SELECT id, points_per_unit FROM materials WHERE name = $1",
    [name],
  );

  return result.rows[0] ?? null;
}

// Consulta los puntos por unidad del material en la tabla materials.
export async function getPointsForMaterial(material: string): Promise<number> {
  const row = await findMaterialByName(material);
  if (!row) {
    throw new UnknownMaterialError(material);
  }

  return row.points_per_unit;
}

// Consulta el id del material para registrar reciclajes (recycling_records).
export async function getMaterialIdByName(name: string): Promise<number> {
  const row = await findMaterialByName(name);
  if (!row) {
    throw new UnknownMaterialError(name);
  }

  return row.id;
}

interface ReuseIdeaRow {
  title: string;
  description: string;
  difficulty: string;
  steps: unknown;
}

// Consulta las ideas de reutilización de un material por su nombre.
// El material inexistente o sin ideas devuelve un arreglo vacío (contenido
// complementario, no debe romper el flujo de clasificación).
export async function getReuseIdeasByMaterialName(
  materialName: string,
): Promise<ReuseIdea[]> {
  const material = await findMaterialByName(materialName);
  if (!material) {
    return [];
  }

  const result = await getPool().query<ReuseIdeaRow>(
    `SELECT title, description, difficulty, steps
     FROM reuse_ideas
     WHERE material_id = $1`,
    [material.id],
  );

  return result.rows.map((row) => ({
    title: row.title,
    description: row.description,
    difficulty: row.difficulty,
    steps: Array.isArray(row.steps)
      ? row.steps.filter((step) => typeof step === "string")
      : [],
  }));
}