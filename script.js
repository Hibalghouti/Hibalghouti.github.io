document.addEventListener('DOMContentLoaded', () => {
  const expressionInput = document.getElementById('expression-input');
  const resultText = document.getElementById('result-text');
  const stackContainer = document.getElementById('stackContainer');
  const darkModeToggle = document.getElementById('darkModeToggle');

  // Button Selectors
  const prefixButton = document.getElementById('btn-prefix');
  const postfixButton = document.getElementById('btn-postfix');
  const clearButton = document.getElementById('btn-clear');
  const clearResultButton = document.getElementById('btn-clear-result');
  const resetButton = document.getElementById('btn-reset');

  // Numeric and operator buttons
  const numberButtons = document.querySelectorAll('[id^="btn-"]:not([id="btn-clear"], [id="btn-clear-result"], [id="btn-reset"], [id="btn-prefix"], [id="btn-postfix"], [id="btn-space"])');
  const operatorButtons = document.querySelectorAll('#btn-add, #btn-subtract, #btn-multiply, #btn-divide');
  const spaceButton = document.getElementById('btn-space'); // Add space button

  // Toggle Dark Mode
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkModeToggle.textContent = document.body.classList.contains('dark-mode')
      ? 'Switch to Light Mode'
      : 'Switch to Dark Mode';
  });

  // Evaluate Prefix
  prefixButton.addEventListener('click', () => {
    console.log('Prefix button clicked');
    const expression = expressionInput.value.trim();
    if (!expression) {
      resultText.textContent = 'Please enter a valid expression.';
      return;
    }
    const result = evaluatePrefix(expression);
    resultText.textContent = `Prefix Result: ${result}`;
  });

  // Evaluate Postfix
  postfixButton.addEventListener('click', () => {
    console.log('Postfix button clicked');
    const expression = expressionInput.value.trim();
    if (!expression) {
      resultText.textContent = 'Please enter a valid expression.';
      return;
    }
    const result = evaluatePostfix(expression);
    resultText.textContent = `Postfix Result: ${result}`;
  });

  // Clear Input
  clearButton.addEventListener('click', () => {
    console.log('Clear button clicked');
    expressionInput.value = '';
    stackContainer.innerHTML = '';
  });

  // Clear Result
  clearResultButton.addEventListener('click', () => {
    console.log('Clear Result button clicked');
    resultText.textContent = '';
  });

  // Reset Calculator
  resetButton.addEventListener('click', () => {
    console.log('Reset button clicked');
    expressionInput.value = '';
    resultText.textContent = 'Result will appear here';
    stackContainer.innerHTML = '';
  });

  // Attach event listeners to number and operator buttons
  numberButtons.forEach(button => {
    button.addEventListener('click', () => {
      expressionInput.value += button.textContent.trim();
    });
  });

  operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
      const lastChar = expressionInput.value.trim().slice(-1);
      const currentOperator = button.textContent.trim();
      if (!['+', '-', '*', '/'].includes(lastChar)) {
        expressionInput.value += ` ${currentOperator} `;
      } else {
        resultText.textContent = 'Error: Consecutive operators are not allowed.';
      }
    });
  });

  // Correct the Space Button functionality
  spaceButton.addEventListener('click', () => {
    console.log('Space button clicked');
    expressionInput.value += ' '; // Adds a space character to the input field
  });

  // Evaluate Prefix Expression
  function evaluatePrefix(expression) {
    const tokens = expression.trim().split(/\s+/).reverse();
    const stack = [];
    for (let token of tokens) {
      if (isOperator(token)) {
        const a = stack.pop();
        const b = stack.pop();
        if (!isValidOperands(a, b)) return 'Invalid Expression';
        stack.push(applyOperator(token, a, b));
      } else if (isNumber(token)) {
        stack.push(parseFloat(token));
      } else {
        return 'Invalid Input';
      }
      updateStackVisualization(stack);
    }
    return stack.length === 1 ? stack[0] : 'Invalid Expression';
  }

  // Evaluate Postfix Expression
  function evaluatePostfix(expression) {
    const tokens = expression.trim().split(/\s+/);
    const stack = [];
    for (let token of tokens) {
      if (isOperator(token)) {
        const b = stack.pop();
        const a = stack.pop();
        if (!isValidOperands(a, b)) return 'Invalid Expression';
        stack.push(applyOperator(token, a, b));
      } else if (isNumber(token)) {
        stack.push(parseFloat(token));
      } else {
        return 'Invalid Input';
      }
      updateStackVisualization(stack);
    }
    return stack.length === 1 ? stack[0] : 'Invalid Expression';
  }

  function isOperator(token) {
    return ['+', '-', '*', '/'].includes(token);
  }

  function applyOperator(operator, a, b) {
    switch (operator) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b === 0 ? 'Division by Zero' : a / b;
      default: return 'Invalid Operator';
    }
  }

  function isNumber(token) {
    return !isNaN(parseFloat(token)) && isFinite(token);
  }

  function isValidOperands(a, b) {
    return a !== undefined && b !== undefined;
  }

  function updateStackVisualization(stack) {
    stackContainer.innerHTML = '';
    stack.forEach((item, index) => {
      const stackElement = document.createElement('div');
      stackElement.className = 'stack-element';
      stackElement.textContent = item;
      stackElement.style.animationDelay = `${index * 100}ms`;
      stackContainer.appendChild(stackElement);
    });
  }
});
