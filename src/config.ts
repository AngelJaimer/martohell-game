// ============================================================
//  EL SECRETO DE MARTOHELL — game config
//  An original point-and-click adventure set in Martorell.
//  Built on pointclick-kit. Engine code is generic; this file +
//  src/rooms, src/content and src/art hold the game.
// ============================================================

export const CONFIG = {
  // --- Title screen ---
  titleSmall: 'EL SECRETO DE',
  title: 'MARTOHELL',
  subtitle: 'Episodio 1: El despertar',
  credit: 'creado por Angel Jaime',

  // --- Opening card (shown once, when a NEW game starts) ---
  intro: [
    'Despiertas bajo el Pont del Diable.',
    'No recuerdas nada de anoche... nada de nada.',
    '',
    'En el bolsillo, una nota con un código raro...',
    'y la letra ni siquiera parece la tuya.',
    '',
    '¿Por qué la llevas? ¿Qué significa ese código?',
    'Solo hay una forma de averiguarlo.',
  ],

  // --- Per-scene music (themes defined in src/audio/engine.ts) ---
  roomTheme: {
    pont: 'hiphop', vila: 'rumba', esglesia: 'sardana', piscina: 'carrer',
    godot: 'godot', gatonegro: 'gatonegro', poumerli: 'gfunk',
    garaje: 'jazzhop', obra: 'grimehop',
    barra: 'godot', billar: 'godot', portal: 'godot',
    final: 'soulhop',
  } as Record<string, string>,
  defaultTheme: 'rumba',

  // --- Save slot ---
  saveKey: 'martohell_save_v1',

  // --- About / legal panel ---
  aboutTitle: 'MARTOHELL',
  about: [
    'Una aventura gráfica original, homenaje',
    'a Martorell y al point-and-click de los 90.',
    '',
    '(c) 2026 Angel Jaime Ruiz.',
    'Todos los derechos reservados sobre el',
    'código, el arte y la música originales.',
    '',
    'Personajes y trama de ficción, de buen',
    'rollo. Los lugares reales aparecen solo',
    'como inspiración. Juego no oficial, por',
    'afición y sin ánimo de lucro.',
  ],
};
