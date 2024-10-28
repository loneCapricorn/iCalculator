import {
  NUMBER_BTNS_IDS,
  SPECIAL_BTNS_IDS,
  DISPLAY_ID,
} from '../constants/index.js';
import { getElementById } from '../utils.js';

/**
 *
 * @returns {HTMLElement} - div element with id "display".
 */
export const getDisplay = () => getElementById(DISPLAY_ID);

/**
 *
 * @returns {Object}
 */
export const getNumBtns = () => {
  const output = {};

  for (const id of NUMBER_BTNS_IDS) {
    output[id] = getElementById(id);
  }

  return Object.freeze(output);
};

/**
 *
 * @returns {Object}
 */
export const getSpecialBtns = () => {
  const output = {};

  for (const id of SPECIAL_BTNS_IDS) {
    output[id] = getElementById(id);
  }

  return Object.freeze(output);
};
