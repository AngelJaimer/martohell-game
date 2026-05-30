import type { Room } from '../engine/types';
import { PONT } from './pont';
import { VILA } from './vila';
import { ESGLESIA } from './esglesia';
import { PISCINA } from './piscina';
import { GODOT } from './godot';
import { GATONEGRO } from './gatonegro';
import { POUMERLI } from './poumerli';
import { GARAJE } from './garaje';
import { OBRA } from './obra';
import { BARRA } from './barra';
import { BILLAR } from './billar';
import { PORTAL } from './portal';
import { FINAL } from './final';

// Ep1 (pont/vila/esglesia/piscina) + Ep2 (godot/gatonegro/poumerli) + Ep3 (garaje/obra,
// plus godot reused — the tiene_llave_godot flag switches it from heavies to Carmona).
export const ROOMS: Record<string, Room> = {
  pont: PONT,
  vila: VILA,
  esglesia: ESGLESIA,
  piscina: PISCINA,
  godot: GODOT,
  gatonegro: GATONEGRO,
  poumerli: POUMERLI,
  garaje: GARAJE,
  obra: OBRA,
  barra: BARRA,
  billar: BILLAR,
  portal: PORTAL,
  final: FINAL,
};

export const START_ROOM = 'pont';
