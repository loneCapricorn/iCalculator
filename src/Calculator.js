import { addEvent, calculate } from './utils.js';
import {
  getDisplay,
  getNumBtns,
  getSpecialBtns,
} from './services/getHTMLElements.js';

class Calculator {
  #displayElement;

  #firstOperand;
  #secondOperand;
  #operator;
  #isOperatorActive = false;

  constructor() {
    this.#displayElement = getDisplay();
    this.#attachListenersToNumBtns();
    this.#attachListenersToSpecialBtns();
  }

  #attachListenersToNumBtns() {
    const numBtns = getNumBtns();

    const callback = (event) => {
      if (this.#isOperatorActive) {
        this.#displayElement.textContent = '';
        this.#isOperatorActive = false;
      }

      if (this.#displayElement.textContent.length < 10) {
        this.#displayElement.textContent += event.target.textContent;
      }
    };

    for (const element of Object.values(numBtns)) {
      addEvent(element, 'click', callback);
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

    const callback = (event) => {
      this.#firstOperand = this.#displayElement.textContent;
      this.#operator = event.target.textContent;
      this.#isOperatorActive = true;
    };

    addEvent(addition, 'click', callback);
    addEvent(subtraction, 'click', callback);
    addEvent(multiplication, 'click', callback);
    addEvent(division, 'click', callback);

    addEvent(equals, 'click', () => {
      this.#displayElement.textContent = calculate(
        Number(this.#firstOperand),
        this.#operator,
        Number(this.#displayElement.textContent)
      );
    });
  }
}

export default Calculator;
