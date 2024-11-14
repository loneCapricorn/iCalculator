import { OPERATOR_SIGNS } from './constants/index.js';

/**
 *
 * @param {String} id
 * @returns {HTMLElement | null}
 */
export const getElementById = (id) => document.getElementById(id);

/**
 *
 * @param {HTMLElement} element
 * @param {Event} event
 * @param {Function} callback
 * @returns
 */
export const addEvent = (element, event, callback) => {
  if (element.addEventListener) {
    return element.addEventListener(event, callback);
  }
  return element.attachEvent(`on${event}`, callback);
};

/**
 *
 * @param {HTMLElement} element
 * @param {Event} event
 * @param {Function} callback
 * @returns
 */
export const removeEvent = (element, event, callback) => {
  if (element.removeEventListener) {
    return element.removeEventListener(event, callback);
  }
  return element.detachEvent(`on${event}`, callback);
};

/**
 * Converts an object into a symmetrical enum.
 * @param {Object} object - The object to convert into a symmetrical enum.
 * @returns {Object}
 */
export const makeSymmetricalEnum = (obj) => {
  const newObj = JSON.parse(JSON.stringify(obj));

  Object.keys(newObj).forEach((key) => {
    Object.defineProperty(newObj, newObj[key], {
      value: key,
      enumerable: false,
    });
  });

  return Object.freeze(newObj);
};

/**
 *
 * @param {Number} firstOperand
 * @param {String} operator - (+ | - | * | /)
 * @param {Number} secondOperand
 * @returns {Number}
 */
export const calculate = (firstOperand, operator, secondOperand) => {
  switch (operator) {
    case OPERATOR_SIGNS.addition:
      return firstOperand + secondOperand;
    case OPERATOR_SIGNS.subtraction:
      return firstOperand - secondOperand;
    case OPERATOR_SIGNS.multiplication:
      return firstOperand * secondOperand;
    case OPERATOR_SIGNS.division:
      return secondOperand === 0 ? 'Error' : firstOperand / secondOperand;
    default:
      throw new Error('Invalid operator!');
  }
};
