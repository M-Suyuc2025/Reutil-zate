export class HttpError extends Error {
  readonly statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.name = "HttpError";
    this.statusCode = statusCode;
  }
}

// Variables de entorno ausentes o inválidas: 500 genérico al cliente,
// el detalle queda en el log del servidor.
export class RoboflowConfigError extends HttpError {
  constructor(message = "Roboflow service is not configured.") {
    super(500, message);
    this.name = "RoboflowConfigError";
  }
}

export class RoboflowUpstreamError extends HttpError {
  constructor(message = "Roboflow returned an error response.") {
    super(502, message);
    this.name = "RoboflowUpstreamError";
  }
}

export class RoboflowTimeoutError extends HttpError {
  constructor(message = "Roboflow request timed out.") {
    super(504, message);
    this.name = "RoboflowTimeoutError";
  }
}

export class LowConfidenceError extends HttpError {
  readonly confidence: number;

  constructor(confidence: number) {
    super(422, "Image not recognized: confidence below the minimum threshold.");
    this.name = "LowConfidenceError";
    this.confidence = confidence;
  }
}

// Autenticación: email inexistente o contraseña incorrecta.
export class InvalidCredentialsError extends Error {
  constructor() {
    super("Invalid credentials.");
    this.name = "InvalidCredentialsError";
  }
}

// Registro: el email ya existe en la tabla users.
export class EmailAlreadyExistsError extends Error {
  constructor() {
    super("Email already registered.");
    this.name = "EmailAlreadyExistsError";
  }
}

// Recompensas y canjes.
export class RewardNotFoundError extends Error {
  constructor(id: number) {
    super(`Reward #${id} not found or inactive.`);
    this.name = "RewardNotFoundError";
  }
}

export class RewardLimitExceededError extends Error {
  constructor(type: "monthly" | "total", limit: number, count: number) {
    super(`Reward ${type} limit reached (${count}/${limit}).`);
    this.name = "RewardLimitExceededError";
  }
}

export class InsufficientPointsError extends Error {
  constructor(available: number, required: number) {
    super(
      `Insufficient points: ${available} available, ${required} required.`,
    );
    this.name = "InsufficientPointsError";
  }
}

// True si el error proveniente de pg es una violación de constraint UNIQUE.
export function isUniqueViolation(err: unknown): boolean {
  return (
    typeof err === "object" &&
    err !== null &&
    (err as { code?: unknown }).code === "23505"
  );
}