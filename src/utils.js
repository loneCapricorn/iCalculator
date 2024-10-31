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
 *
 * @param {Number} firstOperand
 * @param {String} operator - (+ | - | * | /)
 * @param {Number} secondOperand
 * @returns {Number}
 */
export const calculate = (firstOperand, operator, secondOperand) => {
  switch (operator) {
    case '+':
      return firstOperand + secondOperand;
    case '-':
      return firstOperand - secondOperand;
    case 'x':
      return firstOperand * secondOperand;
    case '÷':
      return firstOperand / secondOperand;
    default:
      throw new Error('Invalid operator!');
  }
};
