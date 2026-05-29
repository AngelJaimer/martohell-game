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
};

export const START_ROOM = 'pont';
