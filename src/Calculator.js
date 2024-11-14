import { addEvent, calculate, getKeyByValue } from './utils.js';
import { CLICK_EVENT, OPERATOR_TO_SIGN_PAIRS } from './constants/index.js';
import {
  getDisplay,
  getNumBtns,
  getSpecialBtns,
} from './services/getHTMLElements.js';

class Calculator {
  #displayElement; // HTMLElement
  #specialBtns; // { string: HTMLElement ... }
  #numBtns; // { string: HTMLElement ... }

  #firstOperand;
  #operator;
  #secondOperand;

  #isEqualsActive = false;
  #isOperatorActive = false;

  constructor() {
    this.#numBtns = getNumBtns();
    this.#displayElement = getDisplay();
    this.#specialBtns = getSpecialBtns();

    this.#attachListenersToNumBtns();
    this.#attachListenersToSpecialBtns();
  }

  #focusActiveOperatorBtn() {
    const activeOperator = getKeyByValue(OPERATOR_TO_SIGN_PAIRS, this.#operator);

    if (activeOperator) {
      this.#specialBtns[activeOperator].focus();
    }
  }

  #attachListenersToNumBtns() {
    const cb = (event) => {
      if (this.#isEqualsActive || this.#isOperatorActive || this.#displayElement.textContent === '0') {
        this.#isEqualsActive = false;
        this.#isOperatorActive = false;
        this.#specialBtns.clear.textContent = 'C';
        this.#displayElement.textContent = event.target.textContent;
      } else if (this.#displayElement.textContent.length < 10) {
        this.#displayElement.textContent += event.target.textContent;
      }
    };

    for (const element of Object.values(this.#numBtns)) {
      addEvent(element, CLICK_EVENT, cb);
    }
  }

  #attachListenersToSpecialBtns() {
    const cb = (event) => {
      this.#firstOperand = this.#displayElement.textContent;
      this.#operator = event.target.textContent;
      this.#isOperatorActive = true;
      this.#isEqualsActive = false;
    };

    // attach event listeners to operator buttons
    for (const operator of Object.keys(OPERATOR_TO_SIGN_PAIRS)) {
      addEvent(this.#specialBtns[operator], CLICK_EVENT, cb);
    }

    addEvent(this.#specialBtns.dot, CLICK_EVENT, () => {
      if (this.#isEqualsActive || this.#isOperatorActive) {
        this.#isEqualsActive = false;
        this.#isOperatorActive = false;
        this.#displayElement.textContent = '0.';
      } else if (!this.#displayElement.textContent.includes('.')) {
        this.#displayElement.textContent += '.';
      }

      if (this.#specialBtns.clear.textContent !== 'C') {
        this.#specialBtns.clear.textContent = 'C';
      }
    });

    addEvent(this.#specialBtns.percent, CLICK_EVENT, () => {
      if (
        this.#operator === OPERATOR_TO_SIGN_PAIRS.multiplication ||
        this.#operator === OPERATOR_TO_SIGN_PAIRS.division ||
        this.#isEqualsActive ||
        !this.#operator
      ) {
        this.#displayElement.textContent = Number(this.#displayElement.textContent) / 100;
      } else if (this.#operator === OPERATOR_TO_SIGN_PAIRS.addition || this.#operator === OPERATOR_TO_SIGN_PAIRS.subtraction) {
        this.#displayElement.textContent = (Number(this.#firstOperand) * Number(this.#displayElement.textContent)) / 100;
      }
    });

    addEvent(this.#specialBtns.plusMinus, CLICK_EVENT, () => {
      if (this.#displayElement.textContent[0] !== OPERATOR_TO_SIGN_PAIRS.subtraction) {
        this.#displayElement.textContent = OPERATOR_TO_SIGN_PAIRS.subtraction + this.#displayElement.textContent;
      } else {
        this.#displayElement.textContent = this.#displayElement.textContent.slice(1);
      }
    });

    addEvent(this.#specialBtns.equals, CLICK_EVENT, () => {
      if (!this.#operator) return;

      // the reason for this check is that if the equals button is clicked repeatedly, it stores the second operand and applies it to the result with the selected operator
      if (this.#isEqualsActive) {
        this.#firstOperand = this.#displayElement.textContent;

        this.#displayElement.textContent = calculate(
          Number(this.#firstOperand),
          this.#operator,
          Number(this.#secondOperand)
        );
      } else {
        this.#secondOperand = this.#displayElement.textContent;

        this.#displayElement.textContent = calculate(
          Number(this.#firstOperand),
          this.#operator,
          Number(this.#secondOperand)
        );
      }

      this.#isEqualsActive = true;
    });

    addEvent(this.#specialBtns.clear, CLICK_EVENT, (event) => {
      if (event.target.textContent === 'AC' || this.#isEqualsActive) {
        this.#displayElement.textContent = '0';

        this.#firstOperand = null;
        this.#operator = null;
        this.#secondOperand = null;

        this.#isEqualsActive = false;
        this.#isOperatorActive = false;

        this.#specialBtns.clear.textContent = 'AC';
      } else if (event.target.textContent === 'C') {
        this.#displayElement.textContent = '0';
        this.#specialBtns.clear.textContent = 'AC';
        this.#focusActiveOperatorBtn();
      }
    });
  }
}

export default Calculator;
