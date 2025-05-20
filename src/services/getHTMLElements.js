import { NUMBER_BTNS_IDS, SPECIAL_BTNS_IDS, DISPLAY_ID } from '../common/constants.js';
import { getElementById } from '../utils.js';

/**
 * Retrieves the display element by its ID.
 *
 * @returns {HTMLElement} The display element.
 */
export const getDisplay = () => getElementById(DISPLAY_ID);

/**
 * Retrieves number button elements by their IDs and returns them in a frozen object.
 *
 * @returns {Object} An object containing the number button elements, with their IDs as keys.
 */
export const getNumBtns = () => {
  const output = {};

  for (const id of NUMBER_BTNS_IDS) {
    output[id] = getElementById(id);
  }

  return Object.freeze(output);
};

/**
 * Retrieves special button elements by their IDs and returns them in a frozen object.
 *
 * @returns {Object} An object containing the special button elements, with their IDs as keys.
 */
export const getSpecialBtns = () => {
  const output = {};

  for (const id of SPECIAL_BTNS_IDS) {
    output[id] = getElementById(id);
  }

  return Object.freeze(output);
};
