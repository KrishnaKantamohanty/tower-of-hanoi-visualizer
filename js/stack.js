/* A rod is a LIFO stack stored bottom-to-top. Disc 1 is smallest. */
(() => {
  class DiscStack {
    constructor(label) { this.label = label; this.discs = []; }
    push(disc) {
      const top = this.peek();
      if (top !== undefined && top < disc) throw new Error(`Illegal move: disc ${disc} cannot sit on disc ${top} on rod ${this.label}.`);
      this.discs.push(disc); return disc;
    }
    pop() { if (this.isEmpty()) throw new Error(`Rod ${this.label} is empty.`); return this.discs.pop(); }
    peek() { return this.discs[this.discs.length - 1]; }
    isEmpty() { return this.discs.length === 0; }
    size() { return this.discs.length; }
    snapshot() { return this.discs.slice(); }
  }
  window.HanoiStack = { DiscStack };
})();
