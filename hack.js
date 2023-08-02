const code =
  "T4 l16 _36 510 _27 s26 _11 320 414 {6 }39 C2 T0 m28 317 y35 d31 F1 m22 g19 d38 z34 423 l15 329 c12 ;37 19 h13 _30 F5 t7 C3 325 z33 _21 h8 n18 132 k24";

const codeSpliced = code.split(" ");

console.log(codeSpliced);

const result = new Array(50).fill("*");

console.log(result);

codeSpliced.map((code) => {
  const char = code[0];
  const index = parseInt(code.slice(1));
  console.log(char, index);
  result[index] = char;

  printResult(result);
});

function printResult(s) {
  console.log(s.join(" "));
}

printResult(result);
