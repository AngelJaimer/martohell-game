// Dialogue trees. Each node: an NPC line + the player's response options.
// `to` -> next node ('end' closes). `set` raises a flag; `give` grants an item;
// `if`/`ifNot` gate visibility; `once` hides after use.
// NOTE: the bitmap font has no apostrophe (') — keep display text without it.
export interface Opt {
  text: string;
  to: string;
  set?: string;
  give?: string;
  if?: string;
  ifNot?: string;
  once?: boolean;
}
export interface DialogueNode {
  npc: string;
  options: Opt[];
}
export type Dialogue = Record<string, DialogueNode>;

// ---- El Congui (spirit) — wants something to jog his memory (a porro) ----
export const CONGUI_DIALOGUE: Dialogue = {
  start: {
    npc: 'Hombreee, mira quién ha resucitao. Anoche te encontré potando en el parque del Pont del Diable, hecho un cristo.',
    options: [
      { text: '¿Tú quién eres?', to: 'quien', once: true },
      { text: '¿Qué hacías tú allí anoche?', to: 'quehacias' },
      { text: '¿Te dije algo importante?', to: 'dije' },
      { text: 'Luego te veo. (Salir)', to: 'end' },
    ],
  },
  quien: {
    npc: 'El Congui, noi. Bueno... lo que queda de mí. Ahora hago de espíritu, que el alquiler en el otro barrio está imposible.',
    options: [{ text: 'Encantado, supongo.', to: 'start' }],
  },
  quehacias: {
    npc: 'Buscar chustas de porro, qué va a ser. Uno recicla lo que puede. Y entonces apareciste tú, blanco como yo ahora, diciendo no sé qué.',
    options: [{ text: '¿Y qué decía yo?', to: 'dije' }, { text: '(Salir)', to: 'end' }],
  },
  dije: {
    npc: 'Ahí está el tema: no me acuerdo. Tengo la memoria como un colador. Necesito algo que me la refresque... algo de fumar, ya me entiendes. Tráeme eso y te lo cuento todo.',
    options: [
      { text: '¿Un porro te refrescaría la memoria?', to: 'porro' },
      { text: 'Veré qué encuentro.', to: 'end', set: 'goal_porro' },
    ],
  },
  porro: {
    npc: 'A mí me lo vas a contar. Es medicina espiritual, casi literal. Búscate uno y volvemos a hablar, máquina.',
    options: [{ text: 'Voy a por ello.', to: 'end', set: 'goal_porro' }],
  },
};

// ---- El frutero — gives you oranges, hints at the roaming spirit ----
export const FRUTERO_DIALOGUE: Dialogue = {
  start: {
    npc: 'Anda, si eres el del numerito de anoche. Toma, llévate unas naranjas, que ibas finísimo. Vitamina C para la resaca, invita la casa.',
    options: [
      { text: 'Gracias, cojo las naranjas.', to: 'tomadas', give: 'naranjas', set: 'has_naranjas', once: true, ifNot: 'has_naranjas' },
      { text: '¿Viste algo raro anoche?', to: 'anoche' },
      { text: '¿Hay un espíritu por aquí?', to: 'espiritu' },
      { text: 'Gracias, sigo. (Salir)', to: 'end' },
    ],
  },
  tomadas: {
    npc: 'A cuidarse, machote. Y menos Godot entre semana, que luego pasa lo que pasa.',
    options: [{ text: '¿El Godot?', to: 'godot' }, { text: 'Je. Gracias.', to: 'end' }],
  },
  anoche: {
    npc: 'Vaya si te vi. Pasaste por aquí dando tumbos y hablando solo de no sé qué luces en el Godot. Ibas pasadísimo, chaval.',
    options: [{ text: '¿El Godot?', to: 'godot' }, { text: '(Salir)', to: 'end' }],
  },
  godot: {
    npc: 'La disco de toda la vida, la de la carretera. Tú venías de allí cuando te derrumbaste. Pregúntale al Congui, que andaba por el parque esa noche.',
    options: [{ text: 'Lo haré.', to: 'end' }],
  },
  espiritu: {
    npc: 'Uf, sí. Hay un espíritu rondando la plaza, uno bajito y flaco. Da cosa, pero parece buena gente. Buen muerto, quiero decir.',
    options: [{ text: 'Interesante...', to: 'start' }, { text: '(Salir)', to: 'end' }],
  },
};

// ---- El Zerry — sick of his own burgers; swaps one for fruit ----
export const ZERRY_DIALOGUE: Dialogue = {
  start: {
    npc: '¡Hamburguesas! ¡A la rica hamburguesa del Zerry! Soy el dueño, ¿eh? Reparto muestras para sacar más ventas: con el crío que tengo, los pañales no se pagan solos.',
    options: [
      { text: '¿Me cambias una hamburguesa por algo?', to: 'cambio' },
      { text: '¿Tienes tu propia hamburguesería?', to: 'negocio' },
      { text: 'Nada, gracias. (Salir)', to: 'end' },
    ],
  },
  cambio: {
    npc: 'Por algo que no sea carne picada, lo que sea. Yo ya ni las pruebo. Dame algo fresco y te doy una burger bien cargada.',
    options: [{ text: 'A ver qué llevo...', to: 'end' }],
  },
  negocio: {
    npc: 'La Hamburguesería del Zerry, mi criatura. La segunda, vaya: la primera me tiene sin dormir y sin un duro. Todo es biberones, pañales y más pañales.',
    options: [{ text: 'Te entiendo, colega.', to: 'end' }],
  },
};

// ---- El Joan — hungry lifeguard; trades a joint for food ----
export const JOAN_DIALOGUE: Dialogue = {
  start: {
    npc: '(da una calada) Buenas. Socorrista del municipal, aunque hoy vigilo más el porro que la piscina. Oye... ¿no llevarás algo de comer? Me muero de hambre.',
    options: [
      { text: 'Igual te consigo algo.', to: 'algo' },
      { text: '¿Por qué no comes?', to: 'hambre' },
      { text: 'Nada, suerte. (Salir)', to: 'end' },
    ],
  },
  hambre: {
    npc: 'Me he dejado el táper en casa y aquí no hay ni un mísero chiringuito. Llevo desde las ocho soplando el silbato con el estómago vacío.',
    options: [{ text: 'Te traeré algo.', to: 'end', set: 'goal_comida' }],
  },
  algo: {
    npc: 'Si me traes algo de comer, te doy lo que quieras. Hasta de mi tabaco de liar, fíjate lo que te digo. Trato hecho.',
    options: [{ text: 'Vuelvo enseguida.', to: 'end', set: 'goal_comida' }],
  },
};

// ---- Los viejos — lore about the trapped spirit ----
export const VIEJOS_DIALOGUE: Dialogue = {
  start: {
    npc: 'Te lo digo yo, Paco: últimamente se aparece el espíritu del Congui por las plazas. Igual que cuando vivía, pero más transparente.',
    options: [
      { text: '¿El espíritu del Congui?', to: 'congui' },
      { text: '¿Y qué busca?', to: 'busca' },
      { text: 'Disculpen. (Salir)', to: 'end' },
    ],
  },
  congui: {
    npc: 'El mismo. Pobre hombre. Dicen que está atrapado en este mundo, que no descansa porque dejó algo a medias antes de palmarla.',
    options: [{ text: '¿El qué?', to: 'busca' }, { text: '(Salir)', to: 'end' }],
  },
  busca: {
    npc: 'Eso nadie lo sabe. Anda perdido, igual que tú esta mañana, muchacho. Habla con él, a ver si os ayudáis el uno al otro.',
    options: [{ text: 'Gracias, señores.', to: 'end' }],
  },
};
