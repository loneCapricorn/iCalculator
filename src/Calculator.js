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
  #isOperatorActive = false;

  constructor() {
    this.#displayElement = getDisplay();
    this.#attachListenersToNumBtns();
    this.#attachListenersToSpecialBtns();
  }

  #attachListenersToNumBtns() {
    const numBtns = getNumBtns();

    const cb = (event) => {
      if (this.#isOperatorActive) {
        this.#isOperatorActive = false;
        this.#displayElement.textContent = '';
      }

      if (this.#displayElement.textContent.length < 10) {
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
    };

    addEvent(addition, 'click', cb);
    addEvent(subtraction, 'click', cb);
    addEvent(multiplication, 'click', cb);
    addEvent(division, 'click', cb);

    addEvent(dot, 'click', () => {
      if (!this.#displayElement.textContent.includes('.')) {
        this.#displayElement.textContent += '.';
      }
    });

    addEvent(equals, 'click', () => {
      this.#secondOperand = this.#displayElement.textContent;

      this.#displayElement.textContent = calculate(
        Number(this.#firstOperand),
        this.#operator,
        Number(this.#secondOperand)
      );
    });
  }
}

export default Calculator;
