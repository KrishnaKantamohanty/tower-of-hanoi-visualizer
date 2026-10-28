/* Standard recursive solution. Recursion depth is n; generated moves are 2^n - 1. */
(() => {
  function solveHanoi(n, source, auxiliary, destination, moves = []) {
    if (!Number.isInteger(n) || n < 0) throw new RangeError("Disc count must be a non-negative integer.");
    if (n === 0) return moves;
    solveHanoi(n - 1, source, destination, auxiliary, moves);
    moves.push({ disk: n, from: source, to: destination });
    solveHanoi(n - 1, auxiliary, source, destination, moves);
    return moves;
  }
  function minimumMoves(n) { return (2 ** n) - 1; }
  window.HanoiAlgorithm = { solveHanoi, minimumMoves };
})();
