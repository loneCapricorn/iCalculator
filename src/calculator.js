import { calculate } from './utils.js';
import { OPERATOR_TO_SIGN_PAIRS, ERROR } from './common/constants.js';
import { getDisplay, getNumBtns, getSpecialBtns } from './services/getHTMLElements.js';

const initCalculator = function () {
  const display = getDisplay();
  const numBtns = getNumBtns();
  const specialBtns = getSpecialBtns();
  let isEqualsActive = false;

  // attach listeners to number buttons
  const handleDigitClick = function (event) {
    if (isEqualsActive || display.textContent === '0') {
      isEqualsActive = false;

      specialBtns.clear.textContent = 'C';
      display.textContent = event.target.textContent;
    } else {
      display.textContent += event.target.textContent;
    }
  };

  Object.values(numBtns).forEach((el) => { el.onclick = handleDigitClick; });

  // attach listeners to special buttons
  const handleOperationClick = function (event) {
    if (display.textContent === ERROR) return;

    const lastChar = display.textContent.slice(-1);

    if (Object.values(OPERATOR_TO_SIGN_PAIRS).includes(lastChar) && lastChar !== '%') {
      display.textContent = display.textContent.slice(0, display.textContent.length - 1) + event.target.textContent;
    } else {
      display.textContent += event.target.textContent;
    }

    isEqualsActive = false;
  };

  Object.keys(OPERATOR_TO_SIGN_PAIRS).forEach((op) => {
    if (op === 'percent') return;
    specialBtns[op].onclick = handleOperationClick;
  });

  specialBtns.dot.onclick = function (event) {
    if (isEqualsActive || Object.values(OPERATOR_TO_SIGN_PAIRS).includes(display.textContent.slice(-1))) {
      isEqualsActive = false;

      display.textContent = `0${event.target.textContent}`;
    } else if (display.textContent.slice(-1) !== event.target.textContent) {
      display.textContent += event.target.textContent;
    }

    specialBtns.clear.textContent = 'C';
  };

  specialBtns.percent.onclick = function (event) {
    if (display.textContent === ERROR) return;

    if (Object.values(OPERATOR_TO_SIGN_PAIRS).includes(display.textContent.slice(-1))) {
      display.textContent = display.textContent.slice(0, display.textContent.length - 1) + event.target.textContent;
    } else {
      display.textContent += '%';
    }
  };

  specialBtns.plusMinus.onclick = function () {
    if (display.textContent === ERROR || Object.values(OPERATOR_TO_SIGN_PAIRS).includes(display.textContent.slice(-1)))
      return;

    for (let i = display.textContent.length - 1; i >= 0; i--) {
      const char = display.textContent[i];

      if (Object.values(OPERATOR_TO_SIGN_PAIRS).includes(char)) {
        if (char === OPERATOR_TO_SIGN_PAIRS.subtraction && display.textContent[i - 1] === '(') {
          display.textContent =
            display.textContent.slice(0, i - 1) + display.textContent.slice(i + 1, display.textContent.length - 1);
        } else {
          display.textContent = `${display.textContent.slice(0, i + 1)}(-${display.textContent.slice(i + 1)})`;
        }

        break;
      }
    }
  };

  specialBtns.equals.onclick = function () {
    // if Error occurs -> exit
    if (display.textContent === ERROR) return;

    display.textContent = calculate(display.textContent);

    isEqualsActive = true;
  };

  specialBtns.clear.onclick = function (event) {
    if (event.target.textContent === 'AC' || isEqualsActive) {
      display.textContent = '0';

      isEqualsActive = false;

      specialBtns.clear.textContent = 'AC';
    } else if (event.target.textContent === 'C') {
      display.textContent = '0';
      specialBtns.clear.textContent = 'AC';
    }
  };
};

export default initCalculator;
