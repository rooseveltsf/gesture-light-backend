function soma(a, b) {
  return a + b;
}

test('Se eu somar 4 e 5 tem que retornar 9', () => {
  const result = soma(4, 5);

  expect(result).toBe(9);
});
