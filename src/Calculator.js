import { addEvent, calculate } from './utils.js';
import {
  getDisplay,
  getNumBtns,
  getSpecialBtns,
} from './services/getHTMLElements.js';

class Calculator {
  #displayElement;

  #firstOperand;
  #operator;
  #secondOperand;

  #isEqualsActive = false;
  #isOperatorActive = false;

  constructor() {
    this.#displayElement = getDisplay();
    this.#attachListenersToNumBtns();
    this.#attachListenersToSpecialBtns();
  }

  #attachListenersToNumBtns() {
    const numBtns = getNumBtns();

    const cb = (event) => {
      if (
        this.#isOperatorActive ||
        this.#isEqualsActive ||
        this.#displayElement.textContent === '0'
      ) {
        this.#isEqualsActive = false;
        this.#isOperatorActive = false;
        this.#displayElement.textContent = event.target.textContent;
      } else if (this.#displayElement.textContent.length < 10) {
        this.#displayElement.textContent += event.target.textContent;
      }
    };

    for (const element of Object.values(numBtns)) {
      addEvent(element, 'click', cb);
    }
  }

  #attachListenersToSpecialBtns() {
    const {
      clear,
      plusMinus,
      percent,
      division,
      multiplication,
      subtraction,
      addition,
      dot,
      equals,
    } = getSpecialBtns();

    const cb = (event) => {
      this.#firstOperand = this.#displayElement.textContent;
      this.#operator = event.target.textContent;
      this.#isOperatorActive = true;
      this.#isEqualsActive = false;
    };

    addEvent(addition, 'click', cb);
    addEvent(subtraction, 'click', cb);
    addEvent(multiplication, 'click', cb);
    addEvent(division, 'click', cb);

    addEvent(dot, 'click', () => {
      if (this.#isEqualsActive) {
        this.#displayElement.textContent = '0.';
      } else if (!this.#displayElement.textContent.includes('.')) {
        this.#displayElement.textContent += '.';
      }
    });

    addEvent(percent, 'click', () => {
      if (this.#firstOperand) {
        this.#displayElement.textContent =
          (Number(this.#firstOperand) *
            Number(this.#displayElement.textContent)) /
          100;
      } else {
        this.#displayElement.textContent =
          Number(this.#displayElement.textContent) / 100;
      }
    });

    addEvent(plusMinus, 'click', () => {
      if (this.#displayElement.textContent[0] !== '-') {
        this.#displayElement.textContent =
          '-' + this.#displayElement.textContent;
      } else {
        this.#displayElement.textContent =
          this.#displayElement.textContent.slice(1);
      }
    });

    addEvent(equals, 'click', () => {
      this.#secondOperand = this.#displayElement.textContent;

      this.#displayElement.textContent = calculate(
        Number(this.#firstOperand),
        this.#operator,
        Number(this.#secondOperand)
      );

      this.#isEqualsActive = true;
    });
  }
}

export default Calculator;
