/**
 * Expression Class (Guard Pattern)
 */
class Expressions {

  /**
   * Execute a callback when the condition is True
   * @param {()=>Boolean} condition Expression to Check
   * @param {()=>void} callback Function to execute if the condition is True
   */
  whenTrue(condition, callback) {
    if (condition) {
      callback();
    }
  }

  /**
   * Execute a callback when the condition is False
   * @param {()=>Boolean} condition Expression to Check
   * @param {()=>void} callback Function to execute if the condition is False
   */
  whenFalse(expression, callback) {
    if (!expression) {
      callback();
    }
  }
}

module.exports = Expressions;