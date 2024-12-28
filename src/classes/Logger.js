// are we running in debug mode?
// noinspection JSUnresolvedVariable
const RUNTIME_DEBUG = typeof DEBUG !== 'undefined' && DEBUG === true;

class Logger {
  #isDebugEnabled;

  constructor() {
    this.#isDebugEnabled = RUNTIME_DEBUG;
  }

  #log(level, msg) {
    if (this.#isDebugEnabled) {
      const style = `color: #fff; font-weight: bold; background-color: ${level === 'DEBUG' ? '#1a5e87' : '#ff0000'}; padding: 3px 6px; border-radius: 3px;`;
      console.log(`%c${level}`, style, ...msg);
    }
  }

  debug(...msg) {
    this.#log('DEBUG', msg);
  }

  error(...msg) {
    this.#log('ERROR', msg);
  }
}

export default Logger;
