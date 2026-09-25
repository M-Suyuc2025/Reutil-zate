// ============================================================================
// TEMPORAL: reemplazar por consulta real a la tabla materials cuando exista
// la conexión a la base de datos. La firma de la función no debe cambiar.
// ============================================================================

// Valores provisionales de ejemplo (no definitivos).
const MATERIAL_POINTS: Readonly<Record<string, number>> = {
  biodegradable: 5,
  cardboard: 10,
  glass: 15,
  metal: 20,
  paper: 8,
  plastic: 12,
};

export class UnknownMaterialError extends Error {
  constructor(material: string) {
    super(`No points mapping defined for material: "${material}".`);
    this.name = "UnknownMaterialError";
  }
}

export function getPointsForMaterial(material: string): number {
  const points = MATERIAL_POINTS[material];
  if (points === undefined) {
    throw new UnknownMaterialError(material);
  }
  return points;
}