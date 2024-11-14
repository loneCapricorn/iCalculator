import { OPERATOR_SIGNS } from './constants/index.js';

/**
 * Retrieves an element from the DOM by its ID.
 *
 * @param {string} id - The ID of the element to retrieve.
 * @returns {HTMLElement | null} The element with the specified ID, or null if no such element exists.
 */
export const getElementById = (id) => document.getElementById(id);

/**
 * Retrieves the key of the given value from an object.
 *
 * @param {Object} obj - The object to search through.
 * @param {*} val - The value to find the corresponding key for.
 * @returns {string|undefined} - The key associated with the given value, or undefined if not found.
 */
export const getKeyByValue = (obj, val) => Object.keys(obj).find((key) => obj[key] === val);

/**
 * Adds an event listener to a specified element.
 *
 * @param {Element} element - The DOM element to which the event listener will be added.
 * @param {string} event - The event type to listen for (e.g., 'click', 'mouseover').
 * @param {Function} callback - The function to be called when the event is triggered.
 */
export const addEvent = (element, event, callback) => {
  if (element.addEventListener) {
    element.addEventListener(event, callback);
  } else {
    element.attachEvent(`on${event}`, callback);
  }
};

/**
 * Removes an event listener from a specified element.
 *
 * @param {Element} element - The DOM element from which the event listener will be removed.
 * @param {string} event - The event type to remove (e.g., 'click', 'mouseover').
 * @param {Function} callback - The callback function that was originally added as the event listener.
 */
export const removeEvent = (element, event, callback) => {
  if (element.removeEventListener) {
    element.removeEventListener(event, callback);
  } else {
    element.detachEvent(`on${event}`, callback);
  }
};

/**
 * Performs a calculation based on the provided operands and operator.
 *
 * @param {number} firstOperand - The first operand in the calculation.
 * @param {string} operator - The operator to apply. Must be one of the values in OPERATOR_SIGNS.
 * @param {number} secondOperand - The second operand in the calculation.
 * @returns {number|string} The result of the calculation, or 'Error' if division by zero is attempted.
 * @throws {Error} If an invalid operator is provided.
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
