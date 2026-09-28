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

// 6 ideas por cada clase de materials (36 en total). Las primeras 2 de cada
// clase ya existían; las restantes 4 son nuevas. Cada título es único por
// material para poder deduplicar de forma segura.
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
    materialName: "biodegradable",
    title: "Maceta biodegradable de cáscara de huevo",
    description:
      "Aprovecha mitades de cáscara de huevo como pequeñas macetas para semilleros.",
    difficulty: "Fácil",
    steps: [
      "Lava y parte los huevos por la mitad sin romper el fondo",
      "Perfora un pequeño drenaje en cada cáscara",
      "Llena con tierra y siembra la semilla",
      "Trasplanta el brote cuando crezca",
    ],
  },
  {
    materialName: "biodegradable",
    title: "Abono líquido con café usado",
    description:
      "Convierte el café que ya usaste en un abono líquido de uso sencillo.",
    difficulty: "Fácil",
    steps: [
      "Conserva el café usado y sécalo al sol",
      "Mezcla dos cucharadas con un litro de agua",
      "Deja reposar 24 horas y cuela",
      "Riega tus plantas con la mezcla cada dos semanas",
    ],
  },
  {
    materialName: "biodegradable",
    title: "Composta en balde para espacios pequeños",
    description:
      "Monta una composta compacta dentro de un balde, ideal para departamentos.",
    difficulty: "Media",
    steps: [
      "Perfora el balde para permitir la ventilación",
      "Alterna capas de restos secos y húmedos",
      "Remueve cada tres días con una pala",
      "Espera 5 a 6 semanas para obtener el abono",
    ],
  },
  {
    materialName: "biodegradable",
    title: "Té de compost casero",
    description:
      "Prepara un té nutritivo remojando abono maduro en agua para regar.",
    difficulty: "Media",
    steps: [
      "Coloca abono maduro dentro de una bolsa de tela",
      "Remójala en 5 litros de agua durante 48 horas",
      "Retira la bolsa y airea el líquido",
      "Riega usando el té diluido al 10% en agua",
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
    materialName: "cardboard",
    title: "Caja de regalo forrada con cartón",
    description:
      "Crea cajas de regalo resistentes con cartón y retazos de papel.",
    difficulty: "Fácil",
    steps: [
      "Corta seis planchas de cartón según el tamaño deseado",
      "Une las paredes con pegamento caliente",
      "Forra el exterior con papel decorativo",
      "Agrega una tapa removible con respaldo de cartón",
    ],
  },
  {
    materialName: "cardboard",
    title: "Rompecabezas de cartón para niños",
    description:
      "Convierte láminas de cartón en un rompecabezas colorido.",
    difficulty: "Fácil",
    steps: [
      "Dibuja un dibujo grande sobre la lámina de cartón",
      "Coloréalo junto con los niños",
      "Corta piezas de formas irregulares",
      "Mezcla las piezas y arma el rompecabezas",
    ],
  },
  {
    materialName: "cardboard",
    title: "Portarretratos de cartón reciclado",
    description:
      "Arma marcos de fotos con cajas de cereal y cuerda.",
    difficulty: "Media",
    steps: [
      "Recorta el marco del ancho de tu foto",
      "Une varias capas para dar grosor",
      "Forra con tela o papel decorativo",
      "Pega un soporte trasero de cartón",
    ],
  },
  {
    materialName: "cardboard",
    title: "Perchero de pared con tubos de cartón",
    description:
      "Reutiliza tubos de cartón como ganchos para colgar accesorios.",
    difficulty: "Difícil",
    steps: [
      "Corta tubos de cartón en secciones de 10 cm",
      "Píntalos y barnízalos para sellarlos",
      "Fíjalos a una base de madera en fila",
      "Ancla la base a la pared con tornillos",
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
    materialName: "glass",
    title: "Frasco especiero reutilizado",
    description:
      "Da una segunda vida a los frascos para ordenar tus especias.",
    difficulty: "Fácil",
    steps: [
      "Lava y seca bien los frascos",
      "Escribe el nombre de cada especia en la tapa",
      "Decora con etiquetas reutilizadas",
      "Ordénalos en una repisa o cajón",
    ],
  },
  {
    materialName: "glass",
    title: "Botellero decorativo con envases de vidrio",
    description:
      "Reutiliza botellas con forma para decorar y organizar la cocina.",
    difficulty: "Fácil",
    steps: [
      "Limpia y retira las etiquetas de las botellas",
      "Píntalas con pintura para vidrio",
      "Úsalas para guardar semillas o macarrones",
      "Colócalas en una bandeja ordenada",
    ],
  },
  {
    materialName: "glass",
    title: "Velero decorativo con botella de vidrio",
    description:
      "Construye un pequeño velero dentro de una botella como adorno.",
    difficulty: "Media",
    steps: [
      "Limpia la botella y sécala por completo",
      "Arma un mástil de alambre con su vela",
      "Introduce el velero con pinzas largas",
      "Fija la base y sella la botella",
    ],
  },
  {
    materialName: "glass",
    title: "Mosaico de vidrio para macetero",
    description:
      "Decora la base de un macetero con fragmentos de vidrio de colores.",
    difficulty: "Difícil",
    steps: [
      "Recolecta vidrio plano de colores y lávalo",
      "Corta o rompe el vidrio en teselas pequeñas",
      "Pega las teselas sobre la superficie",
      "Rellena las juntas con masilla blanca",
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
    materialName: "metal",
    title: "Organizador de herramientas con latas",
    description:
      "Aprovecha latas grandes para ordenar tornillos y herramientas pequeñas.",
    difficulty: "Media",
    steps: [
      "Limpia las latas y retira las etiquetas",
      "Únelas con remaches o pegamento a una tabla",
      "Píntalas con pintura anticorrosiva",
      "Fija la tabla en la pared del taller",
    ],
  },
  {
    materialName: "metal",
    title: "Alcancía de lata con tapa sellada",
    description:
      "Convierte una lata con tapa en una alcancía segura y decorativa.",
    difficulty: "Fácil",
    steps: [
      "Lava la lata y seca su interior",
      "Recorta una ranura en la tapa",
      "Decórala con pintura o tela",
      "Sella la tapa con cinta para evitar robos",
    ],
  },
  {
    materialName: "metal",
    title: "Campana de viento con latas y tapas",
    description:
      "Crea una campana que suena con el viento usando latas pequeñas.",
    difficulty: "Fácil",
    steps: [
      "Perfora un hoyo en el centro de cada tapa",
      "Une latas y tapas con alambre a un aro",
      "Ajusta las distancias para que choquen",
      "Cuélgala en el patio o balcón",
    ],
  },
  {
    materialName: "metal",
    title: "Portaespecias de tapas metálicas",
    description:
      "Usa tapas con imán para etiquetar y colgar frascos en el refrigerador.",
    difficulty: "Difícil",
    steps: [
      "Pega un imán en cada tapa metálica",
      "Escribe el nombre de la especia en la tapa",
      "Llena frascos pequeños con cada especia",
      "Colócalos en la puerta del refrigerador",
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
    materialName: "paper",
    title: "Papel de regalo con hojas de revista",
    description:
      "Envuelve tus regalos con estilo usando páginas de revista o periódico.",
    difficulty: "Fácil",
    steps: [
      "Selecciona páginas grandes de revista",
      "Dobla el papel alrededor del obsequio",
      "Dobla los extremos y pega las uniones",
      "Decora con cinta y una tarjeta",
    ],
  },
  {
    materialName: "paper",
    title: "Flores de papel para decoración",
    description:
      "Crea flores duraderas enrollando tiras de papel de colores.",
    difficulty: "Fácil",
    steps: [
      "Corta tiras largas de papel de colores",
      "Enróllalas en espiral y pega el extremo",
      "Forma los pétalos al abrir la espiral",
      "Une varias flores a un tallo de alambre",
    ],
  },
  {
    materialName: "paper",
    title: "Marco de fotos con tiras de papel enrollado",
    description:
      "Decora un marco con la técnica de rollitos de papel.",
    difficulty: "Media",
    steps: [
      "Enrolla tiras de papel en tubitos firmes",
      "Pégalos sobre el borde de un marco base",
      "Píntalos con un tono uniforme",
      "Barniza el marco para protegerlo",
    ],
  },
  {
    materialName: "paper",
    title: "Canasta de periódico tejido",
    description:
      "Teje una canasta resistente con tubitos de papel periódico.",
    difficulty: "Difícil",
    steps: [
      "Enrolla hojas de periódico en tubitos",
      "Cruza los tubitos para formar la base",
      "Teje las paredes alternando los tubitos",
      "Dobla y remata el borde con pegamento",
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
  {
    materialName: "plastic",
    title: "Regadera casera con botella PET",
    description:
      "Convierte una botella en una regadera para plantas pequeñas.",
    difficulty: "Fácil",
    steps: [
      "Perfora hoyos pequeños en la tapa",
      "Llena la botella con agua",
      "Riega con presión suave sobre las plantas",
      "Guarda la botella con la tapa puesta",
    ],
  },
  {
    materialName: "plastic",
    title: "Organizador de bolsas con envase plástico",
    description:
      "Guarda bolsas de plástico ordenadas dentro de un envase reutilizado.",
    difficulty: "Fácil",
    steps: [
      "Limpia y corta la parte superior del envase",
      "Introduce las bolsas dobladas o enrolladas",
      "Perfora una abertura para sacarlas una a una",
      "Decora el envase con cinta o pintura",
    ],
  },
  {
    materialName: "plastic",
    title: "Jardinera colgante con botellas cortadas",
    description:
      "Arma una jardinera vertical con botellas PET cortadas por la mitad.",
    difficulty: "Media",
    steps: [
      "Corta las botellas y perfóralas en la base",
      "Une las mitades con alambre a una cuerda",
      "Llena con sustrato y siembra",
      "Cuélgala en una pared soleada",
    ],
  },
  {
    materialName: "plastic",
    title: "Escoba de botellas PET",
    description:
      "Fabrica una escoba resistente con botellas plásticas cortadas en tiras.",
    difficulty: "Difícil",
    steps: [
      "Corta cada botella en tiras verticales sin separar el cuello",
      "Apila las botellas cortadas sobre un palo",
      "Asegura con alambre o tornillos",
      "Recorta las tiras a una altura pareja",
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

    // Dedup por material_id + title exacto para evitar reinsertar lo existente.
    const existing = await pool.query<{ material_id: number; title: string }>(
      "SELECT material_id, title FROM reuse_ideas",
    );
    const existingKeys = new Set(
      existing.rows.map((row) => `${row.material_id}:${row.title}`),
    );

    let inserted = 0;
    let skipped = 0;

    for (const idea of IDEAS) {
      const materialId = materialIdByName.get(idea.materialName);
      if (materialId === undefined) {
        console.warn(
          `  Skip "${idea.title}": material "${idea.materialName}" not found in materials.`,
        );
        continue;
      }

      if (existingKeys.has(`${materialId}:${idea.title}`)) {
        console.warn(
          `  Skip "${idea.title}": already present for material "${idea.materialName}".`,
        );
        skipped += 1;
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

    console.log(
      `Seed: inserted ${inserted} new reuse idea(s), skipped ${skipped} existing.`,
    );
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