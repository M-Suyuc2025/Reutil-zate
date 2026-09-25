import { getPointsForMaterial } from "../repositories/materials.repository";

// Punto de extensión: cualquier regla de negocio adicional sobre los puntos
// (por ejemplo bonificaciones) se agregaría aquí, sin tocar el repositorio.
export function calculatePointsForMaterial(material: string): number {
  return getPointsForMaterial(material);
}