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
  card?: string[]; // show an ending/transition card when chosen (end an episode in dialogue)
  goto?: string;   // room to travel to after the card (absent = terminal)
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
    npc: 'No me llames Congui, que lo odio. El Petit Pulmó, para servirte. Bueno... lo que queda de mí: ahora hago de espíritu, que el alquiler en el otro barrio está imposible.',
    options: [{ text: 'Perdona... Petit Pulmó.', to: 'start' }],
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
    npc: 'El antro ese de los heavies, en la carretera. De ahí venías cuando te derrumbaste. Pregúntale al espíritu del Congui, que rondaba el parque esa noche.',
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

// ================= EPISODE 2: El Godot =================

// El Marcos — at the Godot door and at the bar (same tree; the cervezas accept
// on the bar instance delivers the lore reveal).
export const MARCOS_DIALOGUE: Dialogue = {
  start: {
    npc: 'Ssshhh, baja la voz. Al Godot no se entra hoy, ha pasado algo gordo ahí dentro. Y nosotros con la última birra... mira, vacía.',
    options: [
      { text: '¿Qué ha pasado en el Godot?', to: 'godot' },
      { text: '¿Me visteis anoche?', to: 'anoche' },
      { text: '¿Tú quién eres?', to: 'quien', once: true },
      { text: 'Os invito a una birra y me contáis. (Salir)', to: 'end' },
    ],
  },
  godot: {
    npc: 'Ni idea, tío, pero el ambiente está cargado. Cosa de espíritus, te lo digo yo, que soy medio demoño.',
    options: [{ text: '¿Medio demoño?', to: 'demono' }, { text: '(Salir)', to: 'end' }],
  },
  demono: {
    npc: 'Nací con los pies del revés, mirando para adentro. Mi madre dijo que era cosa del diablo y se me quedó el mote. El Markitos te lo confirma.',
    options: [{ text: 'Ya...', to: 'start' }],
  },
  anoche: {
    npc: 'Vaya si te vimos. Pasaste blanco como la cera, murmurando cosas raras. Parecías haber visto un muerto. O varios.',
    options: [{ text: '¿Y qué decía?', to: 'decia' }, { text: '(Salir)', to: 'end' }],
  },
  decia: {
    npc: 'Con una birra en el cuerpo igual nos acordamos mejor. Llévanos al Gato Negro y lo hablamos, anda.',
    options: [{ text: 'Vamos para allá.', to: 'end' }],
  },
  quien: {
    npc: 'El Marcos, coleguita. Y este es el Markitos. Veteranos de la noche de Martorell, de cuando el Godot molaba.',
    options: [{ text: 'Encantado.', to: 'start' }],
  },
};

export const MARKITOS_DIALOGUE: Dialogue = {
  start: {
    npc: 'Yo no suelto prenda hasta que haya birra. Pero lo del demoño del Marcos... los pies del revés sí los tiene, eso es verdad.',
    options: [
      { text: '¿Y lo de los espíritus?', to: 'esp' },
      { text: 'Nada. (Salir)', to: 'end' },
    ],
  },
  esp: {
    npc: 'Anoche ibas diciendo que habías visto fantasmas saliendo del Godot. Yo de ti me tomaba algo y me calmaba, chaval.',
    options: [{ text: 'Eso intento.', to: 'end' }],
  },
};

// La Ana — the waitress; will NOT give you credit, points you to the DJ.
export const ANA_DIALOGUE: Dialogue = {
  start: {
    npc: 'Soy la Ana, la que aguanta esta barra. ¿Qué va a ser?',
    options: [
      { text: '¿Me fías unas cervezas?', to: 'fia' },
      { text: 'Solo miro. (Salir)', to: 'end' },
    ],
  },
  fia: {
    npc: 'Ni de broma, guapo. Aquí se fía al que paga, y tú anoche te largaste sin pagar la última. Habla con el Angel si quieres algo gratis, que hoy está sembrado.',
    options: [{ text: 'Lo pillo.', to: 'end' }],
  },
};

// El Angel — the DJ; compliment his music and he stands you the beers.
export const ANGEL_DIALOGUE: Dialogue = {
  start: {
    npc: 'Bienvenido al Gato Negro. Soy el Angel, pincho yo. ¿Te mola lo que suena o te pongo otra cosa?',
    options: [
      { text: 'Me encanta tu música, tío.', to: 'musica', give: 'cervezas', set: 'has_cervezas', once: true, ifNot: 'has_cervezas' },
      { text: '¿Qué pinchas?', to: 'pincha' },
      { text: 'Nada, gracias. (Salir)', to: 'end' },
    ],
  },
  musica: {
    npc: 'Ese es mi hombre. ¡Ana, unas birras para el caballero, que tiene buen oído! Toma, invita la cabina.',
    options: [{ text: 'Gracias, máquina.', to: 'end' }],
  },
  pincha: {
    npc: 'De todo lo bueno: electrónica oscura para que la noche no decaiga. La peña del Godot acababa siempre aquí cuando cerraban allá.',
    options: [{ text: '(Salir)', to: 'end' }],
  },
};

// El Cuco — locked in the toilet; hands over his card even when you say no.
export const CUCO_DIALOGUE: Dialogue = {
  start: {
    npc: '(desde dentro del lavabo) Ocupado. ...¿Querías algo? Tengo de todo, tú pide.',
    options: [
      { text: 'No, gracias, nada.', to: 'nada', give: 'tarjeta', set: 'has_tarjeta', once: true, ifNot: 'has_tarjeta' },
      { text: '¿Espíritus, dicen?', to: 'esp', if: 'has_tarjeta' },
      { text: '(Salir)', to: 'end' },
    ],
  },
  nada: {
    npc: 'Tú mismo. Pero toma mi tarjeta por si cambias de idea: Pou del Merli, vas de parte del Cuco. Eso sí, hoy yo no iría: dicen que se aparecen espíritus por allá. Cosa fina.',
    options: [{ text: 'Gracias... supongo.', to: 'end' }],
  },
  esp: {
    npc: 'Lo que oyes, en el Pou del Merli. Pero con mi tarjeta el vigilante te deja pasar igual. Allá tú con lo que encuentres.',
    options: [{ text: '(Salir)', to: 'end' }],
  },
};

// El vigilante — the bouncer; only lets you in with the Cuco's card.
export const VIGILANTE_DIALOGUE: Dialogue = {
  start: {
    npc: 'Aquí no entra nadie sin invitación. Esto es propiedad privada, ¿estamos?',
    options: [
      { text: '¿Y con una tarjeta del Cuco?', to: 'tarjeta' },
      { text: 'Solo quiero pasar un momento.', to: 'no' },
      { text: '(Salir)', to: 'end' },
    ],
  },
  tarjeta: {
    npc: 'Del Cuco, dices. Pues enséñamela y hablamos. Sin tarjeta, de aquí no pasas.',
    options: [{ text: 'Ahora mismo.', to: 'end' }],
  },
  no: {
    npc: 'Todo el mundo quiere pasar un momento. Sin tarjeta, ni un momento ni medio.',
    options: [{ text: 'Entendido.', to: 'end' }],
  },
};

// La Caledonia — the spirit with the stolen key; the nota's code proves you own
// the Godot (the accept rule grants the key + ends the episode).
export const CALEDONIA_DIALOGUE: Dialogue = {
  start: {
    npc: '(al Curro) ¡Que la llave del Godot es MÍA, pesado! ...Vaya. ¿Y este vivo tan apuesto de dónde sale?',
    options: [
      { text: '(Darle un beso)', to: 'beso', give: 'llave_godot', set: 'beso_caledonia', once: true, ifNot: 'beso_caledonia' },
      { text: '¿Por qué discutís?', to: 'discuten' },
      { text: '(Salir)', to: 'end' },
    ],
  },
  beso: {
    npc: '¡Huy, huy! (se derrite un poco, y eso que es un fantasma) Hacía siglos que un vivo no me besaba. Toma la llave del Godot, granuja. Pero el Curro no te dejará salir con ella así como así: tendrás que convencerle a él.',
    options: [{ text: 'A ver qué le digo al Curro...', to: 'end' }],
  },
  discuten: {
    npc: 'Cogí la llave para que nadie abra esa puerta: hay cosas ahí dentro mejor encerradas. Y el Curro la quiere para tapar lo suyo. A mí, en cambio, se me ablanda con bien poco... un detalle de nada.',
    options: [{ text: '¿Un detalle?', to: 'start' }, { text: '(Salir)', to: 'end' }],
  },
};

// El Curro — the corrupt old cop spirit; lore/colour.
export const CURRO_DIALOGUE: Dialogue = {
  start: {
    npc: 'Agente Curro, aunque ya nadie me paga. Esa llave del Godot es una prueba y la quiero de vuelta. ¿Y tú qué pintas aquí?',
    options: [
      { text: 'Soy el dueño del Godot, por eso estaba ahí ayer.', to: 'dueno', if: 'beso_caledonia' },
      { text: '¿Para qué quieres la llave?', to: 'porque' },
      { text: '¿Eras policía?', to: 'poli' },
      { text: '(Salir)', to: 'end' },
    ],
  },
  dueno: {
    npc: 'Tú, el dueño. Ya. No me lo trago ni de lejos... pero estoy muerto, cansado y sin jurisdicción. Lárgate con la dichosa llave, anda. Pero esto no acaba aquí, te lo digo yo.',
    options: [
      { text: 'Me voy con la llave. (Salir)', to: 'end', set: 'tiene_llave_godot', goto: 'godot', card: ['EPISODIO 2 COMPLETADO', '', 'El Curro refunfuña, pero te deja marchar', 'con la llave del Godot en el bolsillo.', '', '"Esto no acaba aquí", gruñe a tu espalda.', '', 'Vuelves al Godot, llave en mano...', '', 'CONTINUARÁ... Episodio 3: La llave del Godot'] },
    ],
  },
  porque: {
    npc: 'Digamos que en ese local hay papeles, deudas y nombres. Cosas mías que preferiría que no salieran a la luz.',
    options: [{ text: 'Corrupto hasta muerto, vaya.', to: 'corrupto' }, { text: '(Salir)', to: 'end' }],
  },
  corrupto: {
    npc: 'Cuida esa boca, chaval. Pero sí: la placa pesaba menos que los sobres. Ahora ni placa ni sobres, solo este purgatorio de chalet.',
    options: [{ text: '(Salir)', to: 'end' }],
  },
  poli: {
    npc: 'El más temido de Martorell, en mis tiempos. Ahora asusto palomas y poco más.',
    options: [{ text: '(Salir)', to: 'end' }],
  },
};

// ================= EPISODE 3: La llave del Godot =================

// El Carmona — collector at the Godot door; trades fixing the lock for a Mazinger.
export const CARMONA_DIALOGUE: Dialogue = {
  start: {
    npc: 'Eh, tú. ¿No habrás visto por ahí los muñecos nuevos del Mazinger Z, edición limitada? Llevo semanas detrás. Dificilísimos de pillar.',
    options: [
      { text: 'Necesito abrir esta puerta.', to: 'puerta' },
      { text: '¿Para qué los quieres?', to: 'porque' },
      { text: '¿Quién eres?', to: 'quien', once: true },
      { text: 'Ahora vuelvo. (Salir)', to: 'end' },
    ],
  },
  puerta: {
    npc: 'La cerradura del Godot está más oxidada que mis rodillas. Tienes la llave, pero así no gira ni de broma. Yo te la arreglo en un momento... a cambio de un Mazinger. Tú verás.',
    options: [{ text: 'Veré qué encuentro.', to: 'end', set: 'goal_mazinger' }],
  },
  porque: {
    npc: 'Coleccionista de toda la vida, chaval. Por un Mazinger de esos haría CUALQUIER cosa. Hasta arreglarte esa cerradura infame.',
    options: [{ text: 'Tomo nota...', to: 'puerta' }, { text: '(Salir)', to: 'end' }],
  },
  quien: {
    npc: 'El Carmona. Manitas, cerrajero aficionado y esclavo del plástico articulado. Un placer.',
    options: [{ text: 'Igualmente.', to: 'start' }],
  },
};

// El juguetero — old toy shop; laughs at "new" Mazinger, sells a dusty vintage one.
export const JUGUETERO_DIALOGUE: Dialogue = {
  start: {
    npc: 'Bienvenido al Garaje San Cristóbal, la juguetería más antigua de Martorell. ¿Qué buscas?',
    options: [
      { text: '¿Tienes los Mazinger nuevos de edición limitada?', to: 'risa' },
      { text: '¿Qué vendes?', to: 'vende' },
      { text: 'Solo miro. (Salir)', to: 'end' },
    ],
  },
  risa: {
    npc: '(se ríe) ¿Nuevos? Ja. Aquí no entra mercancía desde hace cuarenta años, chaval. ...Aunque, espera: el Mazinger ya tiene cincuenta. Así que alguno polvoriento sí me queda. Cinco monedas y es tuyo.',
    options: [
      { text: '¿Cinco monedas?', to: 'precio' },
      { text: 'Vuelvo con el dinero.', to: 'end', set: 'goal_monedas' },
    ],
  },
  precio: {
    npc: 'Cinco. Es una reliquia, no una chuchería. Cuando las tengas, hablamos.',
    options: [{ text: 'Las conseguiré.', to: 'end', set: 'goal_monedas' }],
  },
  vende: {
    npc: 'Chapas, peonzas, muñecos que ya no fabrica nadie y polvo, mucho polvo. Un museo, pero con caja registradora.',
    options: [{ text: '(Salir)', to: 'end' }],
  },
};

// El Petito — foreman; the Manu overslept, so he pays you to cover the work.
export const PETITO_DIALOGUE: Dialogue = {
  start: {
    npc: 'Buenas. Petito, encargado de la obra. Oye, ¿no querrás echar una mano? El Manu se ha quedado dormido y no ha venido, y voy hasta arriba.',
    options: [
      { text: 'Te ayudo. ¿Qué hago?', to: 'curro', set: 'ayudando' },
      { text: '¿Pagas algo?', to: 'paga' },
      { text: 'Ahora no puedo. (Salir)', to: 'end' },
    ],
  },
  curro: {
    npc: '¡Grande! Mueve esa pila de ladrillos y échale yeso a la pared. Cuando acabes, te suelto unas monedas para el bocata.',
    options: [{ text: 'Marchando.', to: 'end' }],
  },
  paga: {
    npc: 'Unas monedas, lo justo. Pero más que el Manu, que hoy cobra cero por dormilón. Ayúdame y verás.',
    options: [{ text: 'Trato hecho.', to: 'curro', set: 'ayudando' }],
  },
};

// ================= EPISODE 4: Dentro del Godot =================

// El Kilian — stuck inside since last night; show him the nota (via Dar) and he
// opens the back room (the accept lives in the barra room).
export const KILIAN_DIALOGUE: Dialogue = {
  start: {
    npc: '¿Qué hora es? Llevo aquí desde anoche: cerraron con un servidor dentro y el Sopas me ha dado conversación. Oye... he perdido algo, pero no sé ni el qué.',
    options: [
      { text: '¿Qué has perdido?', to: 'perdido' },
      { text: '¿Cerraron contigo dentro?', to: 'cerraron' },
      { text: '(Salir)', to: 'end' },
    ],
  },
  perdido: {
    npc: 'Un papel, creo. Con números raros. Si lo tuviera delante lo reconocería seguro. Si pillas algo así por ahí, enséñamelo, anda.',
    options: [{ text: 'Lo tendré en cuenta.', to: 'end' }],
  },
  cerraron: {
    npc: 'Pregúntale al Sopas, que retiene mejor. Yo, a partir de la décima birra, lo veo borroso. Eso sí: la sala de atrás la cerré yo anoche porque aquello se descontroló del todo. Qué fue exactamente... no me viene. Aún.',
    options: [{ text: '(Salir)', to: 'end' }],
  },
};

// El Sopas — bald punky spirit at the bar; lore.
export const SOPAS_DIALOGUE: Dialogue = {
  start: {
    npc: 'Buenas. El Sopas. Anoche cerraron el Godot y el Kilian se quedó dentro conmigo dándole a la birra. Yo ya no bebo, claro, pero acompaño.',
    options: [
      { text: '¿Tú no estás...?', to: 'muerto', once: true },
      { text: '¿Qué pasó anoche?', to: 'anoche' },
      { text: '(Salir)', to: 'end' },
    ],
  },
  muerto: {
    npc: '¿Muerto? Un poco, sí. Pero un punky no se rinde ni en el más allá. Calvo, fantasma y a mucha honra.',
    options: [{ text: 'Respeto.', to: 'start' }],
  },
  anoche: {
    npc: 'Lo de siempre, hasta que la cosa se torció ahí detrás. Pregunta en la sala de los billares, que hay quien lo vio todo.',
    options: [{ text: '(Salir)', to: 'end' }],
  },
};

// Party spirits in the billiards room.
export const ESPIRITU_DIALOGUE: Dialogue = {
  start: {
    npc: '¡Eeeh, si es el de anoche! Qué alegría volver al Godot. Aquí se está de muerte, nunca mejor dicho. ¡Hay billar y todo!',
    options: [
      { text: '¿Me conocéis?', to: 'conoces' },
      { text: '¿De dónde salís todos?', to: 'puerta' },
      { text: '(Salir)', to: 'end' },
    ],
  },
  conoces: {
    npc: 'Claro, hombre. Estuviste aquí ayer, antes de que se liara todo. Brindamos y to. ¡Buena gente!',
    options: [{ text: '(Salir)', to: 'end' }],
  },
  puerta: {
    npc: 'De esa puerta del fondo no paran de salir colegas. No sabemos de dónde, pero la fiesta lo agradece. Aunque el antiguo dueño anda preocupado, pregúntale a él.',
    options: [{ text: '(Salir)', to: 'end' }],
  },
};

// El antiguo dueño — explains the vomit-portal and how to close it.
export const DUENO_DIALOGUE: Dialogue = {
  start: {
    npc: 'Yo regenté el Godot cuarenta años, y ahora lo regento desde el otro lado. Pero esto se nos va de las manos: por esa puerta del fondo no para de entrar gente del más allá.',
    options: [
      { text: '¿Qué hay tras esa puerta?', to: 'puerta' },
      { text: '¿Cómo se cierra?', to: 'cerrar' },
      { text: '(Salir)', to: 'end' },
    ],
  },
  puerta: {
    npc: 'Un túnel a otra dimensión. Y lo abrió, agárrate, una pota. La de tu amigo el Marcos, el demoño, que anoche vomitó ahí y rasgó el velo entre mundos. El charco sigue ahí, burbujeando.',
    options: [{ text: '¿Y eso cómo se arregla?', to: 'cerrar' }, { text: '(Salir)', to: 'end' }],
  },
  cerrar: {
    npc: 'Limpiando el origen: si friegas esa pota, el portal debería cerrarse. Hay un cubo de fregar aquí mismo, en la sala. Tú que estás vivo y tienes manos, hazme el favor.',
    options: [{ text: 'Voy a por el cubo.', to: 'end', set: 'goal_cubo' }],
  },
};
