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