import { addEvent, calculate, getKeyByValue } from '../utils.js';
import { CLICK_EVENT, OPERATOR_TO_SIGN_PAIRS, ERROR, INTERVAL_TIME_IN_MS } from '../common/constants.js';
import { getDisplay, getCurrentTime, getNumBtns, getSpecialBtns } from '../services/getHTMLElements.js';

class Calculator {
  #displayElement; // HTMLElement
  #currentTime; // HTMLElement

  #numBtns; // { string: HTMLElement ... }
  #specialBtns; // { string: HTMLElement ... }

  #firstOperand;
  #operator;
  #secondOperand;

  // this field is mainly used to reset the display content
  // it is also utilized in percent and equals logic
  #isEqualsActive = false;

  // this field is used to reset the display content
  #isOperatorActive = false;

  constructor() {
    this.#displayElement = getDisplay();
    this.#currentTime = getCurrentTime();

    this.#numBtns = getNumBtns();
    this.#specialBtns = getSpecialBtns();

    this.#attachListenersToNumBtns();
    this.#attachListenersToSpecialBtns();

    this.#updateCurrentTime();
    setInterval(this.#updateCurrentTime, INTERVAL_TIME_IN_MS);
  }

  // this getter help us to access and manipulate the element inside of the setInterval
  get currentTime() {
    return this.#currentTime;
  }

  #focusActiveOperatorBtn() {
    const activeOperator = getKeyByValue(OPERATOR_TO_SIGN_PAIRS, this.#operator);
    // gets the HTMLElement from specialBtns with the key activeOperator and focuses it
    this.#specialBtns[activeOperator].focus();
  }

  #attachListenersToNumBtns() {
    const cb = (event) => {
      if (this.#isEqualsActive || this.#isOperatorActive || this.#displayElement.textContent === '0') {
        this.#isEqualsActive = false;
        this.#isOperatorActive = false;
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

  #attachListenersToSpecialBtns() {
    const cb = (event) => {
      if (this.#displayElement.textContent === ERROR) return;

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

      this.#specialBtns.clear.textContent = 'C';
    });

    addEvent(this.#specialBtns.percent, CLICK_EVENT, () => {
      if (this.#displayElement.textContent === ERROR) return;

      if (
        this.#operator === OPERATOR_TO_SIGN_PAIRS.multiplication ||
        this.#operator === OPERATOR_TO_SIGN_PAIRS.division ||
        this.#isEqualsActive ||
        !this.#operator
      ) {
        this.#displayElement.textContent = Number(this.#displayElement.textContent) / 100;
      } else {
        // handle cases when operator is '+' or '-'
        this.#displayElement.textContent = (Number(this.#firstOperand) * Number(this.#displayElement.textContent)) / 100;
      }
    });

    addEvent(this.#specialBtns.plusMinus, CLICK_EVENT, () => {
      if (this.#displayElement.textContent === ERROR) return;

      if (this.#displayElement.textContent[0] !== OPERATOR_TO_SIGN_PAIRS.subtraction) {
        this.#displayElement.textContent = OPERATOR_TO_SIGN_PAIRS.subtraction + this.#displayElement.textContent;
      } else {
        this.#displayElement.textContent = this.#displayElement.textContent.slice(1);
      }
    });

    addEvent(this.#specialBtns.equals, CLICK_EVENT, () => {
      // if operator is missing or Error occurs -> exit
      if (!this.#operator || (this.#displayElement.textContent === ERROR)) return;

      // the reason for this check is that if the equals button is clicked repeatedly, it stores the second operand and applies it to the result with the selected operator
      if (this.#isEqualsActive) {
        this.#firstOperand = this.#displayElement.textContent;
      } else {
        this.#secondOperand = this.#displayElement.textContent;
      }

      this.#displayElement.textContent = calculate(
        Number(this.#firstOperand),
        this.#operator,
        Number(this.#secondOperand)
      );

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

        if (this.#operator) this.#focusActiveOperatorBtn();
      }
    });
  }

  #updateCurrentTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');

    this.currentTime.textContent = `${hours}:${minutes}`;
  }
}

export default Calculator;
