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

const tokenize = (expr = '') => {
  const tokens = [''];
  const SIGNS = Object.values(OPERATOR_TO_SIGN_PAIRS);
  for (let i = 0; i < expr.length; i++) {
    const char = expr.charAt(i);

    if (!isNaN(char) || char === '.' || char === 'e') {
      SIGNS.includes(tokens[tokens.length - 1]) ? tokens.push(char) : (tokens[tokens.length - 1] += char);
    } else if (SIGNS.includes(char)) {
      tokens.push(char);
    } else if (char === '(') {
      const closeIndex = expr.indexOf(')', i + 1);
      tokens.push(expr.slice(i + 1, closeIndex));
      i = closeIndex;
    }
  }

  if (SIGNS.includes(tokens[tokens.length - 1])) tokens.pop();

  return tokens;
};

const calculateExpression = (tokens) => {
  const toNumber = (s) => parseFloat(s);

  let i = 0;
  while (i < tokens.length) {
    if (tokens[i] === '%') {
      const B = toNumber(tokens[i - 1]);
      const prevOp = tokens[i - 2];
      const next = tokens[i + 1];

      let value;

      if (prevOp === OPERATOR_TO_SIGN_PAIRS.addition || prevOp === OPERATOR_TO_SIGN_PAIRS.subtraction) {
        if (next === OPERATOR_TO_SIGN_PAIRS.multiplication || next === OPERATOR_TO_SIGN_PAIRS.division) {
          const C = toNumber(tokens[i + 2]);
          value = (B / 100) * C;
          tokens.splice(i - 1, 4, value.toString());
          i = 0;
          continue;
        } else if (next && !isNaN(toNumber(next))) {
          const C = toNumber(next);
          value = (B / 100) * C * C;
          tokens.splice(i - 1, 2, value.toString());
          i = 0;
          continue;
        } else {
          const A = toNumber(tokens[i - 3]);
          value = (A * B) / 100;
          tokens.splice(i - 1, 2, value.toString());
          i = 0;
          continue;
        }
      } else if (prevOp === OPERATOR_TO_SIGN_PAIRS.multiplication || prevOp === OPERATOR_TO_SIGN_PAIRS.division) {
        value = B / 100;
        tokens.splice(i - 1, 2, value.toString());
        i = 0;
        continue;
      } else {
        value = B / 100;
        tokens.splice(i - 1, 2, value.toString());
        i = 0;
        continue;
      }
    }
    i++;
  }

  i = 0;
  while (i < tokens.length) {
    if (tokens[i] === OPERATOR_TO_SIGN_PAIRS.multiplication || tokens[i] === OPERATOR_TO_SIGN_PAIRS.division) {
      const a = toNumber(tokens[i - 1]);
      const b = toNumber(tokens[i + 1]);
      const result = tokens[i] === OPERATOR_TO_SIGN_PAIRS.multiplication ? a * b : a / b;
      tokens.splice(i - 1, 3, result.toString());
      i = 0; // restart
    } else {
      i++;
    }
  }

  let result = toNumber(tokens[0]);
  i = 1;
  while (i < tokens.length) {
    const op = tokens[i];
    const num = toNumber(tokens[i + 1]);
    if (op === OPERATOR_TO_SIGN_PAIRS.addition) result += num;
    if (op === OPERATOR_TO_SIGN_PAIRS.subtraction) result -= num;
    i += 2;
  }

  return result;
};

export const calculate = (expression) => {
  const tokens = tokenize(expression);
  const result = calculateExpression(tokens);

  return formatNumber(result);
};
