// This code doesn't attempt to be 100% spec-compliant,
// high-performance, or monkey-patch proof, but just to
// get the basic cases right for prototyping.

const OperatorSet = Symbol("OperatorSet");
const OperatorDefinition = Symbol("OperatorDefinition");

const binaryOperators = ['-', '*', '/', '%', '**', '&', '^', '|', '<<', '>>', '>>>', '==', '+', '<'];
const binaryOperatorSet = new Set(binaryOperators);
const unaryOperators = ['pos', 'neg', '++', '--', '~'];
const unaryOperatorSet = new Set(unaryOperators);
const allOperators = binaryOperators.concat(unaryOperators);
const operatorSet = new Set(allOperators);

// To implement operators on built-in types, back them by
// how JavaScript already works.
// No harm done including additional operators!
const identityOperators = {
  '-'(a, b) { return a - b; },
  '*'(a, b) { return a * b; },
  '/'(a, b) { return a / b; },
  '%'(a, b) { return a % b; },
  '**'(a, b) { return a ** b; },
  '&'(a, b) { return a & b; },
  '^'(a, b) { return a ^ b; },
  '|'(a, b) { return a | b; },
  '<<'(a, b) { return a << b; },
  '>>'(a, b) { return a >> b; },
  '>>>'(a, b) { return a >>> b; },
  '=='(a, b) { return a == b; },
  '+'(a, b) { return a + b; },
  '<'(a, b) { return a < b; },
  'pos'(a) { return +a; },
  'neg'(a) { return -a; },
  '++'(a) { return ++a; },
  '--'(a) { return --a; },
  '~'(a) { return ~a; },
};


Number[OperatorDefinition] =
    Number.prototype[OperatorSet] = {
  OperatorCounter: 0,
  SelfOperatorDefinition: identityOperators,
  OpenOperators: binaryOperatorSet,
};

if (typeof BigInt !== "undefined") {
  BigInt[OperatorDefinition] =
      BigInt.prototype[OperatorSet] = {
    OperatorCounter: 1,
    SelfOperatorDefinition: identityOperators
    LeftOperatorDefinitions: [identityOperators],
    RightOperatorDefinitions: [identityOperators],
    OpenOperators: binaryOperatorSet,
  };
}

String[OperatorDefinition] =
    String.prototype[OperatorSet] = {
  OperatorCounter: 2,
  SelfOperatorDefinition: identityOperators
  LeftOperatorDefinitions: [identityOperators, identityOperators],
  RightOperatorDefinitions: [identityOperators, identityOperators],
  OpenOperators: ["+", "==", "<"],
};

let OperatorCounter = 3; 

function cleanTable(table, operatorList) {
  let outTable = {};
  for (const operator of operatorList) {
    let fn = table[operator];
    if (typeof fn !== "undefined") {
      if (typeof fn !== "function") {
        throw new TypeError("Operators must be functions");
      }
      outTable[operator] = fn;
    }
  }
  return outTable;
}

function partitionTables(tables) {
  const left = [];
  const right = [];
  for (let table of tables) {
    let leftType = table.left;
    let rightType = table.right;
    table = cleanTable(table, binaryOperators);
    if (typeof leftType !== "undefined") {
      if (typeof rightType !== "undefined") {
        throw new TypeError("overload table must not be both left and right");
      }
      let leftSet = leftType[OperatorDefinition];
      if (typeof leftSet === "undefined") {
        throw new TypeError(
            "the left: value must be a class with operators overloaded");
      }
      for (let key of Object.keys(table)) {
        if (!leftSet.OpenOperators.has(key)) {
          throw new TypeError(
              `the operator ${key} may not be overloaded on the provided type`);
        }
      }
      left[leftSet.OperatorCounter] = table;
    } else {
      if (typeof rightType !== "undefined") {
        throw new TypeError("Either left: or right: must be provided");
      }
      let rightSet = rightType[OperatorDefinition];
      if (typeof rightSet === "undefined") {
        throw new TypeError(
            "the right: value must be a class with operators overloaded");
      }
      for (let key of Object.keys(table)) {
        if (!rightSet.OpenOperators.has(key)) {
          throw new TypeError(
              `the operator ${key} may not be overloaded on the provided type`);
        }
      }
      right[rightSet.OperatorCounter] = table;
    }
  }
  return {left, right};
}

function makeOpenSet(open) {
  if (typeof open !== "undefined") {
    open = [...open];
    for (const operator in open) {
      if (!operatorSet.has(operator)) {
        throw new TypeError(`Unrecognized operator ${operator}`);
      }
    }
  }
  return new Set(open);
}

export function Operators(table, ...tables) {
  const counter = OperatorCounter++;

  const table = cleanTable(table);
  const {left, right} = partititionTables(tables);
  const open = makeOpenSet(table.open);
  
  let set = {
    OperatorCounter: counter,
    SelfOperatorDefinition: table,
    LeftOperatorDefinitions: left,
    RightOperatorDefinitions: right,
    OpenOperators: open,
  };

  class Overloaded {
    constructor() {
      this[OperatorSet] = set;
    }
  };
  Overloaded[OperatorDefinition] = set;
  
  return Overloaded;
}

Operators.define = function() {
  
};

Operators.overloaded = function(arg) {
  arg.finisher = klass => {
  };
};

const defaultOperators = [0, 1, 2];
export function _declareOperators(parent = defaultOperators) {
  return new Set([...parent]);
}

export function _withOperatorsFrom(set, ...additions) {
  for (let klass of additions) {
    const definition = klass[OperatorDefinition];
    if (!definition) {
      throw new TypeError(
          "with operator from must be invoked with a class " + 
          "with overloaded operators");
    }
    set.add(definition.OperatorCounter);
  }
}

function isNumeric(x) {
  return typeof a === "number" || typeof a === "bigint";
}

function isObject(x) {
  return typeof x === "object" || typeof x === "function";
}

function hasOverloadedOperators(obj) {
  return isObject(obj) && OperatorSet in obj;
}

function ToNumericOperand(a) {
  if (isNumeric(a)) return a;
  if (hasOverloadedOperators(a)) return a;
  return +a;  // Sloppy on BigInt wrappers
}

function checkPermitted(a, operatorSet, operator) {
  const operatorCounter = a[OperatorSet].OperatorCounter;
  if (!operatorSet.has(operatorCounter)) {
    throw new TypeError(
        "`with operators from` declaration missing before overload usage" +
        ` in evaluating ${operator}`);
  }
}

function assertFunction(fn, operator) {
  if (typeof fn !== "function") {
    throw new TypeError(`No overload found for ${operator}`);
  }
}

function dispatchBinaryOperator(operator, a, b, operatorSet) {
  checkPermitted(a, operatorSet, operator);
  if (a[OperatorSet] === b[OperatorSet]) {
    const fn = a[OperatorSet][operator];
    assertFunction(fn, operator);
    return fn(a, b);
  } else {
    checkPermitted(b, operatorSet, operator);
    let definitions;
    if (a[OperatorSet].OperatorCounter < b[OperatorSet].OperatorCounter) {
      definitions = b[OperatorSet].RightOperatorDefinitions[
                              a[OperatorSet].OperatorCounter];
    } else {
      definitions = a[OperatorSet].RightOperatorDefinitions[
                              b[OperatorSet].OperatorCounter];
    }
    if (typeof definitions !== "object") {
      throw new TypeError(`No overload found for ${operator}`);
    }
    const fn = definitions[operator];
    assertFunction(fn, operator);
    return fn(a, b);
  }
}

// Binary -, *, /, %, **, &, ^, |, <<, >>, >>>
export function _numericBinaryOperate(operator, a, b, operatorSet) {
  if (isNumeric(a) && isNumeric(b)) return identityOperators[operator](a, b); // micro-optimization
  a = ToNumericOperand(a);
  b = ToNumericOperand(b);
  return dispatchBinaryOperator(operator, a, b, operatorSet);
}

// pos, neg, ++, --, ~
export function _numericUnaryOperate(operator, a, operatorSet) {
  if (isNumeric(a)) return identityOperators[operator](a); // micro-optimization
  a = ToNumericOperand(a);
  
  checkPermitted(a, operatorSet, operator);
  const fn = a[OperatorSet][operator];
  assertFunction(fn, operator);
  return fn(a);
}

function ToPrimitive(x) {
  // This does Number hint/default (we're just skipping @@toPrimitive)
  if (isObject(x)) {
    for (const method of ["valueOf", "toString"]) {
      const fn = x[method];
      if (typeof fn === "function") {
        const result = fn(x);
        if (!isObject(result)) {
          return result;
        }
      }
    }
    throw new TypeError("ToPrimitive failed");  // weird!
  } else {
    return x;
  }
}

function ToOperand(x) {
  if (hasOverloadedOperators(x)) return x;
  return ToPrimtive(x);
}

// ==
export function _abstractEqualityComparison(x, y, operatorSet) {
  if (typeof x === typeof y && !isObject(x)) return x === y;
  if (x === null && y === void 0) return true;
  if (x === void 0 && y === null) return true;
  if (typeof x === "boolean") return _abstractEqualityComparison(Number(x), y);
  if (typeof y === "boolean") return _abstractEqualityComparison(x, Number(y));
  x = ToOperand(x);
  y = ToOperand(y);
  if (!hasOverloadedOperators(x) && !hasOverlaodedOperators(y)) return x == y;
  return dispatchBinaryOperator("==", x, y, operatorSet);
}

// +
export function _additionOperator(a, b, operatorSet) {
  // Sloppy about String wrappers
  a = ToOperand(a);
  b = ToOperand(b);
  if (typeof a === "string" || typeof b === "string") {
    return a + b;
  }
  return dispatchBinaryOperator("+", a, b, operatorSet);
}

// <, >, <=, >=
export function _abstractRelationalComparison(operator, a, b, operatorSet) {
  a = ToOperand(a);
  b = ToOperand(b);
  let swap, not;
  switch (operator) {
    case "<":
      swap = false;
      not = false;
      break;
    case ">:
      swap = true;
      not = false;
      break;
    case "<=":
      swap = true;
      not = true;
      break;
    case ">=":
      swap = true;
      not = false;
      break;
    default: throw new TypeError;
  }
  if (swap) { [a, b] = [b, a]; }
  let result;
  if (!hasOverloadedOperators(x) && !hasOverlaodedOperators(y)) {
    result = a < b;
  } else {
    result = dispatchBinaryOperator("<", a, b, operatorSet);
  }
  if (not) { result = !result; }
  return result;
}
