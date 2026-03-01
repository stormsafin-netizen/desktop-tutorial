const { add, subtract, multiply, divide, modulo, power } = require("./calculator");

describe("add", () => {
  test("adds two positive numbers", () => {
    expect(add(2, 3)).toBe(5);
  });

  test("adds a positive and a negative number", () => {
    expect(add(5, -3)).toBe(2);
  });

  test("adds two negative numbers", () => {
    expect(add(-4, -6)).toBe(-10);
  });

  test("adds zero to a number", () => {
    expect(add(7, 0)).toBe(7);
  });

  test("adds floating point numbers", () => {
    expect(add(0.1, 0.2)).toBeCloseTo(0.3);
  });
});

describe("subtract", () => {
  test("subtracts two positive numbers", () => {
    expect(subtract(10, 4)).toBe(6);
  });

  test("subtracts a larger number from a smaller one", () => {
    expect(subtract(3, 8)).toBe(-5);
  });

  test("subtracts a negative number", () => {
    expect(subtract(5, -3)).toBe(8);
  });

  test("subtracts zero", () => {
    expect(subtract(9, 0)).toBe(9);
  });
});

describe("multiply", () => {
  test("multiplies two positive numbers", () => {
    expect(multiply(3, 4)).toBe(12);
  });

  test("multiplies by zero", () => {
    expect(multiply(5, 0)).toBe(0);
  });

  test("multiplies two negative numbers", () => {
    expect(multiply(-3, -4)).toBe(12);
  });

  test("multiplies a positive and a negative number", () => {
    expect(multiply(6, -2)).toBe(-12);
  });

  test("multiplies by one", () => {
    expect(multiply(7, 1)).toBe(7);
  });
});

describe("divide", () => {
  test("divides two positive numbers", () => {
    expect(divide(10, 2)).toBe(5);
  });

  test("divides resulting in a decimal", () => {
    expect(divide(7, 2)).toBe(3.5);
  });

  test("divides a negative number", () => {
    expect(divide(-12, 3)).toBe(-4);
  });

  test("divides zero by a number", () => {
    expect(divide(0, 5)).toBe(0);
  });

  test("throws an error when dividing by zero", () => {
    expect(() => divide(10, 0)).toThrow("Cannot divide by zero");
  });
});

describe("modulo", () => {
  test("returns remainder of division", () => {
    expect(modulo(10, 3)).toBe(1);
  });

  test("returns zero when evenly divisible", () => {
    expect(modulo(12, 4)).toBe(0);
  });

  test("works with negative dividend", () => {
    expect(modulo(-7, 3)).toBe(-1);
  });

  test("throws an error when modulo by zero", () => {
    expect(() => modulo(10, 0)).toThrow("Cannot modulo by zero");
  });
});

describe("power", () => {
  test("raises a number to a positive exponent", () => {
    expect(power(2, 10)).toBe(1024);
  });

  test("raises a number to the power of zero", () => {
    expect(power(5, 0)).toBe(1);
  });

  test("raises a number to the power of one", () => {
    expect(power(8, 1)).toBe(8);
  });

  test("raises a number to a negative exponent", () => {
    expect(power(2, -2)).toBe(0.25);
  });

  test("handles a base of zero", () => {
    expect(power(0, 5)).toBe(0);
  });
});
