import { test, expect } from '@playwright/test';

test('Calculator', async ({ page }) => {
  const signToLocatorMap = {
    display: page.locator('div#display'),
    0: page.locator('div#zero'),
    1: page.locator('div#one'),
    2: page.locator('div#two'),
    3: page.locator('div#three'),
    4: page.locator('div#four'),
    5: page.locator('div#five'),
    6: page.locator('div#six'),
    7: page.locator('div#seven'),
    8: page.locator('div#eight'),
    9: page.locator('div#nine'),
    x: page.locator('div#multiplication'),
    '÷': page.locator('div#division'),
    '+': page.locator('div#addition'),
    '-': page.locator('div#subtraction'),
    '=': page.locator('div#equals'),
    '.': page.locator('div#dot'),
    '%': page.locator('div#percent'),
    '+/-': page.locator('div#plusMinus'),
    AC: page.locator('div#clear'),
  };

  const expressionToResultMap = {
    '10%-5': '-4.9',
    '9x(-2)+5': '-13',
    '9+5x3': '24',
    '12+(-90)x2': '-168',
    '10+5%x3': '10.15',
    '10+5%+3': '13.5',
    '10+5%+3x': '13.5',
    '2.5x5': '12.5',
    '3+5%10': '8',
  };

  await page.goto('/', { waitUntil: 'load' });

  for (const expression in expressionToResultMap) {
    const result = expressionToResultMap[expression];

    for (let i = 0; i < expression.length; i++) {
      const char = expression[i];

      if (char === '(') {
        if (expression[i + 1] === '-') {
          i++;
          continue;
        }
        throw new Error(`Invalid expression: ${expression}`);
      } else if (char === ')') {
        await signToLocatorMap['+/-'].click();
        continue;
      }

      await signToLocatorMap[char].click();
    }

    await signToLocatorMap['='].click();
    await expect(signToLocatorMap.display).toHaveText(result);

    await signToLocatorMap.AC.click();
    await expect(signToLocatorMap.display).toHaveText('0');
  }
});
