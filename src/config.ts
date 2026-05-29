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

  // --- Per-scene music (themes defined in src/audio/engine.ts) ---
  roomTheme: {
    pont: 'flamenco', vila: 'rumba', esglesia: 'rumba', piscina: 'carrer',
    godot: 'godot', gatonegro: 'gatonegro', poumerli: 'poumerli',
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
