import { addEvent, calculate, getKeyByValue } from '../utils.js';
import { CLICK_EVENT, OPERATOR_TO_SIGN_PAIRS, ERROR } from '../common/constants.js';
import { getDisplay, getNumBtns, getSpecialBtns } from '../services/getHTMLElements.js';

class Calculator {
  static #displayElement; // HTMLElement

  static #numBtns; // { string: HTMLElement ... }
  static #specialBtns; // { string: HTMLElement ... }

  static #firstOperand;
  static #operator;
  static #secondOperand;

  // this field is mainly used to reset the display content
  // it is also utilized in percent and equals logic
  static #isEqualsActive = false;

  static init() {
    this.#displayElement = getDisplay();

    this.#numBtns = getNumBtns();
    this.#specialBtns = getSpecialBtns();

    this.#attachListenersToNumBtns();
    this.#attachListenersToSpecialBtns();
  }

  static #attachListenersToNumBtns() {
    const cb = (event) => {
      if (this.#isEqualsActive || this.#displayElement.textContent === '0') {
        this.#isEqualsActive = false;

        this.#specialBtns.clear.textContent = 'C';
        this.#displayElement.textContent = event.target.textContent;
      } else if (this.#displayElement.textContent.length < 9) {
        this.#displayElement.textContent += event.target.textContent;
      }
    };

    // attach event listeners to number buttons
    for (const element of Object.values(this.#numBtns)) {
      addEvent(element, CLICK_EVENT, cb);
    }
  }

  static #attachListenersToSpecialBtns() {
    const cb = (event) => {
      if (this.#displayElement.textContent === ERROR) return;
      this.#displayElement.textContent += event.target.textContent;
      this.#isEqualsActive = false;
    };

    // attach event listeners to operator buttons
    for (const operator of Object.keys(OPERATOR_TO_SIGN_PAIRS)) {
      addEvent(this.#specialBtns[operator], CLICK_EVENT, cb);
    }

    addEvent(this.#specialBtns.dot, CLICK_EVENT, () => {
      if (
        this.#isEqualsActive ||
        Object.values(OPERATOR_TO_SIGN_PAIRS).includes(this.#displayElement.textContent.slice(-1))
      ) {
        this.#isEqualsActive = false;

        this.#displayElement.textContent = '0,';
      } else if (this.#displayElement.textContent.slice(-1) !== ',') {
        this.#displayElement.textContent += ',';
      }

      this.#specialBtns.clear.textContent = 'C';
    });

    addEvent(this.#specialBtns.percent, CLICK_EVENT, () => {
      if (this.#displayElement.textContent === ERROR) return;

      if (Object.values(OPERATOR_TO_SIGN_PAIRS).includes(this.#displayElement.textContent.slice(-1))) {
        this.#displayElement.textContent[this.#displayElement.textContent.length - 1] = '%';
      } else {
        this.#displayElement.textContent += '%';
      }
    });

    addEvent(this.#specialBtns.plusMinus, CLICK_EVENT, () => {
      if (
        this.#displayElement.textContent === ERROR ||
        Object.values(OPERATOR_TO_SIGN_PAIRS).includes(this.#displayElement.textContent.slice(-1))
      )
        return;

      for (let i = this.#displayElement.textContent.length - 1; i >= 0; i--) {
        const char = this.#displayElement.textContent.charAt(i);

        if (Object.values(OPERATOR_TO_SIGN_PAIRS).includes(char)) {
          if (char === OPERATOR_TO_SIGN_PAIRS.subtraction && this.#displayElement.textContent.charAt(i - 1) === '(') {
            this.#displayElement.textContent =
              this.#displayElement.textContent.slice(0, i - 1) +
              this.#displayElement.textContent.slice(i + 1, this.#displayElement.textContent.length - 1);
          } else {
            this.#displayElement.textContent = `${this.#displayElement.textContent.slice(
              0,
              i + 1
            )}(-${this.#displayElement.textContent.slice(i + 1)})`;
          }

          break;
        }
      }
    });

    addEvent(this.#specialBtns.equals, CLICK_EVENT, () => {
      // if operator is missing or Error occurs -> exit
      if (!this.#operator || this.#displayElement.textContent === ERROR) return;

      // the reason for this check is that if the equals button is clicked repeatedly, it stores the second operand and applies it to the result with the selected operator
      if (this.#isEqualsActive) {
        this.#firstOperand = this.#displayElement.textContent;
      } else {
        this.#secondOperand = this.#displayElement.textContent;
      }

      this.#displayElement.textContent = calculate(Number(this.#firstOperand), this.#operator, Number(this.#secondOperand));

      this.#isEqualsActive = true;
    });

    addEvent(this.#specialBtns.clear, CLICK_EVENT, (event) => {
      if (event.target.textContent === 'AC' || this.#isEqualsActive) {
        this.#displayElement.textContent = '0';

        this.#firstOperand = null;
        this.#operator = null;
        this.#secondOperand = null;

        this.#isEqualsActive = false;

        this.#specialBtns.clear.textContent = 'AC';
      } else if (event.target.textContent === 'C') {
        this.#displayElement.textContent = '0';
        this.#specialBtns.clear.textContent = 'AC';
      }
    });
  }
}

export default Calculator;
