import { sum_to_n_a, sum_to_n_b, sum_to_n_c } from './problem1';

let passed = 0;
let failed = 0;

function test(label: string, actual: number, expected: number): void {
  if (actual === expected) {
    console.log(`  PASS  ${label}`);
    passed++;
  } else {
    console.error(`  FAIL  ${label} — expected ${expected}, got ${actual}`);
    failed++;
  }
}

function describe(label: string, fn: () => void): void {
  console.log(`\n${label}`);
  fn();
}

describe('sum_to_n_a (iterative loop)', () => {
  test('sum_to_n_a(0) === 0', sum_to_n_a(0), 0);
  test('sum_to_n_a(1) === 1', sum_to_n_a(1), 1);
  test('sum_to_n_a(5) === 15', sum_to_n_a(5), 15);
  test('sum_to_n_a(10) === 55', sum_to_n_a(10), 55);
  test('sum_to_n_a(100) === 5050', sum_to_n_a(100), 5050);
});

describe('sum_to_n_b (formula)', () => {
  test('sum_to_n_b(0) === 0', sum_to_n_b(0), 0);
  test('sum_to_n_b(1) === 1', sum_to_n_b(1), 1);
  test('sum_to_n_b(5) === 15', sum_to_n_b(5), 15);
  test('sum_to_n_b(10) === 55', sum_to_n_b(10), 55);
  test('sum_to_n_b(100) === 5050', sum_to_n_b(100), 5050);
});

describe('sum_to_n_c (recursive)', () => {
  test('sum_to_n_c(0) === 0', sum_to_n_c(0), 0);
  test('sum_to_n_c(1) === 1', sum_to_n_c(1), 1);
  test('sum_to_n_c(5) === 15', sum_to_n_c(5), 15);
  test('sum_to_n_c(10) === 55', sum_to_n_c(10), 55);
  test('sum_to_n_c(100) === 5050', sum_to_n_c(100), 5050);
});

console.log(`\n${passed} passed, ${failed} failed`);
