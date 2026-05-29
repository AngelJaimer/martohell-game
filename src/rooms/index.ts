import type { Room } from '../engine/types';
import { PONT } from './pont';
import { VILA } from './vila';
import { ESGLESIA } from './esglesia';
import { PISCINA } from './piscina';
import { GODOT } from './godot';
import { GATONEGRO } from './gatonegro';
import { POUMERLI } from './poumerli';

// Episode 1 (pont/vila/esglesia/piscina) + Episode 2 (godot/gatonegro/poumerli).
export const ROOMS: Record<string, Room> = {
  pont: PONT,
  vila: VILA,
  esglesia: ESGLESIA,
  piscina: PISCINA,
  godot: GODOT,
  gatonegro: GATONEGRO,
  poumerli: POUMERLI,
};

export const START_ROOM = 'pont';
