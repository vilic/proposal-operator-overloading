const runtime = require("../../build/runtime.js");

describe("Operators without overloading registered", () => {
  const operators = runtime._declareOperators();
  it('addition on Numbers works as usual', () => {
    expect(runtime._additionOperator(1, 2, operators)).toBe(3);
  });
  it('addition on BigInt works as usual', () => {
    expect(runtime._additionOperator(1n, 2n, operators)).toBe(3n);
  });
  it('addition on Strings works as usual', () => {
    expect(runtime._additionOperator("ab", "cd", operators)).toBe("abcd");
  });
  it('addition between String and Number', () => {
    expect(runtime._additionOperator("ab", 1, operators)).toBe("ab1");
    expect(runtime._additionOperator(1, "ab", operators)).toBe("1ab");
  });
  it('addition between String and BigInt', () => {
    expect(runtime._additionOperator("ab", 1n, operators)).toBe("ab1");
    expect(runtime._additionOperator(1n, "ab", operators)).toBe("1ab");
  });
  it('== works as usual', () => {
    expect(runtime._abstractEqualityComparison(1, 2, operators)).toBe(false);
    expect(runtime._abstractEqualityComparison(1, 2n, operators)).toBe(false);
    expect(runtime._abstractEqualityComparison(1, 1, operators)).toBe(true);
    expect(runtime._abstractEqualityComparison(1, 1n, operators)).toBe(true);
    expect(runtime._abstractEqualityComparison(1, true, operators)).toBe(true);
    expect(runtime._abstractEqualityComparison(1, false, operators)).toBe(false);
    expect(runtime._abstractEqualityComparison(0, false, operators)).toBe(true);
    expect(runtime._abstractEqualityComparison(1, "1", operators)).toBe(true);
    expect(runtime._abstractEqualityComparison("1", "1", operators)).toBe(true);
    expect(runtime._abstractEqualityComparison("1", "2", operators)).toBe(false);
    expect(runtime._abstractEqualityComparison("1", true, operators)).toBe(true);
    expect(runtime._abstractEqualityComparison(null, undefined, operators)).toBe(true);
    expect(runtime._abstractEqualityComparison(undefined, null, operators)).toBe(true);
    expect(runtime._abstractEqualityComparison(undefined, 0, operators)).toBe(false);
    expect(runtime._abstractEqualityComparison(undefined, NaN, operators)).toBe(false);
    expect(runtime._abstractEqualityComparison(null, NaN, operators)).toBe(false);
    expect(runtime._abstractEqualityComparison(null, 0, operators)).toBe(false);
  });
  it('== works with object wrappers', () => {
    expect(runtime._abstractEqualityComparison(Object(1), 2, operators)).toBe(false);
    expect(runtime._abstractEqualityComparison(Object(1), 2n, operators)).toBe(false);
    expect(runtime._abstractEqualityComparison(Object(1), 1, operators)).toBe(true);
    expect(runtime._abstractEqualityComparison(Object(1), 1n, operators)).toBe(true);
    expect(runtime._abstractEqualityComparison(Object(1), true, operators)).toBe(true);
    expect(runtime._abstractEqualityComparison(Object(1), false, operators)).toBe(false);
    expect(runtime._abstractEqualityComparison(Object(0), false, operators)).toBe(true);
    expect(runtime._abstractEqualityComparison(Object(1), "1", operators)).toBe(true);
    expect(runtime._abstractEqualityComparison(Object("1"), "1", operators)).toBe(true);
    expect(runtime._abstractEqualityComparison(Object("1"), "2", operators)).toBe(false);
    expect(runtime._abstractEqualityComparison(Object("1"), true, operators)).toBe(true);
  });
  it('< works on primitives', () => {
    expect(runtime._abstractRelationalComparison('<', 1, 2, operators)).toBe(true);
    expect(runtime._abstractRelationalComparison('<', 2, 2, operators)).toBe(false);
    expect(runtime._abstractRelationalComparison('<', 3, 2, operators)).toBe(false);
    expect(runtime._abstractRelationalComparison('<', 1n, 2, operators)).toBe(true);
    expect(runtime._abstractRelationalComparison('<', 2n, 2, operators)).toBe(false);
    expect(runtime._abstractRelationalComparison('<', 3n, 2n, operators)).toBe(false);
    expect(runtime._abstractRelationalComparison('<', 1n, 2n, operators)).toBe(true);
    expect(runtime._abstractRelationalComparison('<', 2n, 2n, operators)).toBe(false);
    expect(runtime._abstractRelationalComparison('<', 3n, 2, operators)).toBe(false);
    expect(runtime._abstractRelationalComparison('<', "1", 2, operators)).toBe(true);
    expect(runtime._abstractRelationalComparison('<', "2", 2, operators)).toBe(false);
    expect(runtime._abstractRelationalComparison('<', "3", 2, operators)).toBe(false);
    expect(runtime._abstractRelationalComparison('<', "100", 11, operators)).toBe(false);
    expect(runtime._abstractRelationalComparison('<', "100", "11", operators)).toBe(true);
  });
  it('< works on with object wrappers', () => {
    expect(runtime._abstractRelationalComparison('<', Object(1), 2, operators)).toBe(true);
    expect(runtime._abstractRelationalComparison('<', Object(2), 2, operators)).toBe(false);
    expect(runtime._abstractRelationalComparison('<', Object(3), 2, operators)).toBe(false);
    expect(runtime._abstractRelationalComparison('<', Object(1n), 2, operators)).toBe(true);
    expect(runtime._abstractRelationalComparison('<', Object(2n), 2, operators)).toBe(false);
    expect(runtime._abstractRelationalComparison('<', Object(3n), 2n, operators)).toBe(false);
    expect(runtime._abstractRelationalComparison('<', Object(1n), 2n, operators)).toBe(true);
    expect(runtime._abstractRelationalComparison('<', Object(2n), 2n, operators)).toBe(false);
    expect(runtime._abstractRelationalComparison('<', Object(3n), 2, operators)).toBe(false);
    expect(runtime._abstractRelationalComparison('<', Object("1"), 2, operators)).toBe(true);
    expect(runtime._abstractRelationalComparison('<', Object("2"), 2, operators)).toBe(false);
    expect(runtime._abstractRelationalComparison('<', Object("3"), 2, operators)).toBe(false);
    expect(runtime._abstractRelationalComparison('<', Object("100"), 11, operators)).toBe(false);
    expect(runtime._abstractRelationalComparison('<', Object("100"), "11", operators)).toBe(true);
  });
  it('> >= <= also work', () => {
    expect(runtime._abstractRelationalComparison('>', 1, 2, operators)).toBe(false);
    expect(runtime._abstractRelationalComparison('>', 2, 2, operators)).toBe(false);
    expect(runtime._abstractRelationalComparison('>', 3, 2, operators)).toBe(true);
    expect(runtime._abstractRelationalComparison('<=', 1, 2, operators)).toBe(true);
    expect(runtime._abstractRelationalComparison('<=', 2, 2, operators)).toBe(true);
    expect(runtime._abstractRelationalComparison('<=', 3, 2, operators)).toBe(false);
    expect(runtime._abstractRelationalComparison('>=', 1, 2, operators)).toBe(false);
    expect(runtime._abstractRelationalComparison('>=', 2, 2, operators)).toBe(true);
    expect(runtime._abstractRelationalComparison('>=', 3, 2, operators)).toBe(true);
  });
  it('* works', () => {
    expect(runtime._numericBinaryOperate('*', 2, 3, operators)).toBe(6);
    expect(runtime._numericBinaryOperate('*', "2", 3, operators)).toBe(6);
    expect(runtime._numericBinaryOperate('*', "2", "3", operators)).toBe(6);
    expect(runtime._numericBinaryOperate('*', 2n, 3n, operators)).toBe(6n);
    expect(runtime._numericBinaryOperate('*', Object(2), 3, operators)).toBe(6);
    expect(runtime._numericBinaryOperate('*', Object("2"), 3, operators)).toBe(6);
    expect(runtime._numericBinaryOperate('*', Object("2"), "3", operators)).toBe(6);
    expect(runtime._numericBinaryOperate('*', Object(2n), 3n, operators)).toBe(6n);
  });
  it('++ works', () => {
    expect(runtime._numericUnaryOperate('++', 2, operators)).toBe(3);
    expect(runtime._numericUnaryOperate('++', "2", operators)).toBe(3);
    expect(runtime._numericUnaryOperate('++', 2n,  operators)).toBe(3n);
    expect(runtime._numericUnaryOperate('++', Object(2), operators)).toBe(3);
    expect(runtime._numericUnaryOperate('++', Object("2"), operators)).toBe(3);
    expect(runtime._numericUnaryOperate('++', Object(2n), operators)).toBe(3n);
  });
});

describe('simple overloading', () => {

  const Ops = runtime.Operators({
    '+'(a, b) {
      return new Vector(a.contents.map((elt, i) => elt + b.contents[i]));
    }
  });

  class Vector extends Ops {
    constructor(contents) { super(); this.contents = contents; }
  }

  const vec = new Vector([1, 2, 3]);

  it('+ throws when not in operator set', () => {
    const operators = runtime._declareOperators();
    expect(() => runtime._additionOperator(vec, vec, operators)).toThrowError(TypeError);
  });

  it('+ is permitted among vectors, banned in interoperation', () => {
    const operators = runtime._declareOperators();
    runtime._withOperatorsFrom(operators, Vector);
    expect(runtime._additionOperator(vec, vec, operators).contents[2]).toBe(6);
    expect(() => runtime._additionOperator(vec, 1, operators)).toThrowError(TypeError);
    expect(() => runtime._additionOperator(1, vec, operators)).toThrowError(TypeError);
    expect(runtime._additionOperator(1, 1, operators)).toBe(2);
  });
});

describe('overloading with interoperation', () => {

  const Ops = runtime.Operators({ }, { left: Number,
    '*'(a, b) {
      return new Vector(b.contents.map(elt => a * elt));
    }
  });

  class Vector extends Ops {
    constructor(contents) { super(); this.contents = contents; }
  }

  const vec = new Vector([1, 2, 3]);

  it('* throws when not in operator set', () => {
    const operators = runtime._declareOperators();
    expect(() => runtime._numericBinaryOperate('*', 2, vec, operators)).toThrowError(TypeError);
  });

  it('Number*Vector is permitted, other combinations banned', () => {
    const operators = runtime._declareOperators();
    runtime._withOperatorsFrom(operators, Vector);
    // The following line fails
    expect(runtime._numericBinaryOperate('*', 2, vec, operators).contents[2]).toBe(6);
    expect(() => runtime._numericBinaryOperate('*', vec, vec, operators)).toThrowError(TypeError);
    expect(() => runtime._numericBinaryOperate('*', vec, 2, operators)).toThrowError(TypeError);
    expect(runtime._numericBinaryOperate('*', 2, 2, operators)).toBe(4);
  });
});
