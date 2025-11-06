/**
 * Kaprekar's Routine Utility Functions
 * Implements the 6174 constant algorithm
 */

/**
 * Validates if a number is valid for Kaprekar's routine
 * @param {number|string} num - The number to validate
 * @returns {object} - {valid: boolean, error: string}
 */
export function validateInput(num) {
  const str = String(num).padStart(4, '0');
  
  if (str.length !== 4) {
    return { valid: false, error: 'Must be a 4-digit number' };
  }
  
  if (!/^\d{4}$/.test(str)) {
    return { valid: false, error: 'Must contain only digits' };
  }
  
  // Check if all digits are the same
  if (new Set(str).size === 1) {
    return { valid: false, error: 'All digits cannot be identical' };
  }
  
  return { valid: true, error: null, normalized: str };
}

/**
 * Sorts digits in descending order
 * @param {string} numStr - 4-digit string
 * @returns {string} - Sorted digits (largest)
 */
export function sortDescending(numStr) {
  return numStr.split('').sort((a, b) => b - a).join('');
}

/**
 * Sorts digits in ascending order
 * @param {string} numStr - 4-digit string
 * @returns {string} - Sorted digits (smallest)
 */
export function sortAscending(numStr) {
  return numStr.split('').sort((a, b) => a - b).join('');
}

/**
 * Performs one iteration of Kaprekar's routine
 * @param {string} numStr - 4-digit string
 * @returns {object} - Step details
 */
export function kaprekarStep(numStr) {
  const largest = sortDescending(numStr);
  const smallest = sortAscending(numStr);
  const result = parseInt(largest) - parseInt(smallest);
  const resultStr = String(result).padStart(4, '0');
  
  return {
    input: numStr,
    largest: largest,
    smallest: smallest,
    result: resultStr,
    largestNum: parseInt(largest),
    smallestNum: parseInt(smallest),
    resultNum: result
  };
}

/**
 * Runs the complete Kaprekar sequence until reaching 6174
 * @param {string|number} startNum - Starting number
 * @param {number} maxIterations - Safety limit (default 10)
 * @returns {object} - Complete sequence and metadata
 */
export function kaprekarSequence(startNum, maxIterations = 10) {
  const validation = validateInput(startNum);
  
  if (!validation.valid) {
    return {
      success: false,
      error: validation.error,
      steps: []
    };
  }
  
  const steps = [];
  let current = validation.normalized;
  let iterations = 0;
  
  while (current !== '6174' && iterations < maxIterations) {
    const step = kaprekarStep(current);
    steps.push(step);
    current = step.result;
    iterations++;
  }
  
  return {
    success: true,
    steps: steps,
    iterations: iterations,
    converged: current === '6174'
  };
}

/**
 * Gets individual digit array from number string
 * @param {string} numStr - Number string
 * @returns {array} - Array of digit objects with positions
 */
export function getDigits(numStr) {
  return numStr.split('').map((digit, index) => ({
    value: digit,
    position: index,
    id: `${digit}-${index}-${Math.random()}`
  }));
}
