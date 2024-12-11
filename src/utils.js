import { OPERATOR_TO_SIGN_PAIRS, ERROR } from './common/constants.js';

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
 * @returns {string | undefined} - The key associated with the given value, or undefined if not found.
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
 * Formats a number by removing trailing zeros and rounding to a reasonable precision (up to 9 decimals).
 * If the result is large enough (i.e., >= 1e9), it uses exponential notation.
 *
 * @param {number} num - The number to format.
 * @returns {string} - The formatted number.
 */
const formatNumber = (num) => {
  const absVal = Math.abs(num);

  if (absVal >= 1e9) {
    let [firstPart, secondPart] = num.toExponential(5).split('e+');

    for (let i = firstPart.length - 1; i >= 0; i--) {
      if (firstPart.charAt(i) === '0') { // if the last char is '0'
        firstPart = firstPart.slice(0, i); // remove it
      } else {
        break;
      }
    }

    return firstPart + 'e' + secondPart;
  }

  const numAsStr = absVal.toString();
  let output = absVal === num ? numAsStr : num.toString();

  // handle numbers with large decimal parts i.e. 333333332.6666667
  if (numAsStr.length > 10) {
    const intPartLength = numAsStr.split('.')[0].length;

    // the whole number length should be up to 9 digits
    const decPartLength = 9 - intPartLength;

    // parseFloat removes trailing zeros i.e. 22.4000000, 0.30000000 ...
    output = parseFloat(num.toFixed(decPartLength)).toString();
  }

  return output;
};

/**
 * Performs a calculation based on the provided operands and operator.
 *
 * @param {number} firstOperand - The first operand in the calculation.
 * @param {string} operator - The operator to apply. Must be one of the values in OPERATOR_SIGNS.
 * @param {number} secondOperand - The second operand in the calculation.
 * @returns {string} The result of the calculation, or 'Error'.
 * @throws {Error} If an invalid operator is provided.
 */
export const calculate = (firstOperand, operator, secondOperand) => {
  let result;

  // perform the calculation based on the operator
  switch (operator) {
    case OPERATOR_TO_SIGN_PAIRS.addition:
      result = firstOperand + secondOperand;
      break;
    case OPERATOR_TO_SIGN_PAIRS.subtraction:
      result = firstOperand - secondOperand;
      break;
    case OPERATOR_TO_SIGN_PAIRS.multiplication:
      result = firstOperand * secondOperand;
      break;
    case OPERATOR_TO_SIGN_PAIRS.division:
      result = secondOperand !== 0 ? firstOperand / secondOperand : ERROR;
      break;
    default:
      throw new Error('Invalid operator!');
  }

  // handle division by zero or invalid result
  if (result === ERROR || result === Infinity || result === -Infinity) {
    return ERROR;
  }

  return formatNumber(result);
};
