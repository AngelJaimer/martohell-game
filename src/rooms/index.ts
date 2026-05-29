import type { Room } from '../engine/types';
import { PONT } from './pont';
import { VILA } from './vila';
import { ESGLESIA } from './esglesia';
import { PISCINA } from './piscina';

// Episode 1 rooms. Exits reference these ids.
export const ROOMS: Record<string, Room> = {
  pont: PONT,
  vila: VILA,
  esglesia: ESGLESIA,
  piscina: PISCINA,
};

export const START_ROOM = 'pont';
