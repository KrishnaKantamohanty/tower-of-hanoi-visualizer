(() => {
  const COLORS = ["#48e5dc", "#3cc5eb", "#37a9e8", "#398ee0", "#477be0", "#38d8c4", "#24bfd5", "#4eb6f0", "#5795e8", "#4de1ef"];
  class HanoiVisualizer {
    constructor(state, onChange) { this.state = state; this.onChange = onChange; this.token = 0; this.activeAnimations = []; this.currentDuration = state.duration; this.stage = document.querySelector("#stage"); this.layer = document.querySelector("#flyingLayer"); }
    discElement(disk, flying = false) {
      const el = document.createElement("div"); el.className = flying ? "disc flying-disc" : "disc"; el.dataset.disk = disk; el.textContent = disk;
      const max = Math.max(1, this.state.count); const width = Math.min(42 + (disk / max) * 103, this.stage.clientWidth / 3 - 15); el.style.width = `${width}px`; el.style.background = `linear-gradient(135deg,${COLORS[(disk - 1) % COLORS.length]},${COLORS[(disk - 1) % COLORS.length]}bb)`; return el;
    }
    render() {
      for (const rod of ["A", "B", "C"]) {
        const stack = document.querySelector(`#stack-${rod}`); stack.replaceChildren();
        this.state.rods[rod].snapshot().forEach(disk => stack.append(this.discElement(disk)));
      }
      this.onChange();
    }
    async animateNext(move) {
      const token = this.token, sourceStack = document.querySelector(`#stack-${move.from}`), sourceEl = sourceStack.lastElementChild;
      if (!sourceEl || Number(sourceEl.dataset.disk) !== move.disk) throw new Error("Visual and stack state became inconsistent.");
      const stageRect = this.stage.getBoundingClientRect(), fromRect = sourceEl.getBoundingClientRect();
      const x0 = fromRect.left - stageRect.left, y0 = fromRect.top - stageRect.top;
      const flying = this.discElement(move.disk, true); flying.style.left = `${x0}px`; flying.style.top = `${y0}px`; flying.style.width = `${fromRect.width}px`; flying.style.height = `${fromRect.height}px`;
      this.layer.append(flying); sourceEl.style.visibility = "hidden";
      const toRod = document.querySelector(`#stack-${move.to}`), rodRect = toRod.getBoundingClientRect();
      const toCount = this.state.rods[move.to].size();
      const x1 = rodRect.left - stageRect.left + (rodRect.width - fromRect.width) / 2;
      const y1 = rodRect.bottom - stageRect.top - fromRect.height * (toCount + 1) - 3 * toCount;
      const liftY = Math.max(4, y0 - 62), speed = this.state.duration;
      const segments = [
        [{ transform: `translate(0,0)` }, { transform: `translate(0,${liftY-y0}px)` }],
        [{ transform: `translate(0,${liftY-y0}px)` }, { transform: `translate(${x1-x0}px,${liftY-y0}px)` }],
        [{ transform: `translate(${x1-x0}px,${liftY-y0}px)` }, { transform: `translate(${x1-x0}px,${y1-y0}px)` }]
      ];
      try {
        for (const frames of segments) {
          if (token !== this.token) return false;
          const animation = flying.animate(frames, { duration: speed / 3, easing: "ease-in-out", fill: "forwards" }); this.activeAnimations.push(animation);
          await animation.finished;
        }
      } catch (error) { if (error.name !== "AbortError") throw error; return false; }
      if (token !== this.token) return false;
      this.activeAnimations = []; this.layer.replaceChildren(); sourceEl.style.visibility = "";
      const moved = this.state.rods[move.from].pop();
      if (moved !== move.disk) throw new Error("Move sequence and source stack disagree.");
      this.state.rods[move.to].push(moved); this.state.index++;
      this.render(); return true;
    }
    setSpeed(duration) { const rate = this.currentDuration / duration; this.state.duration = duration; this.currentDuration = duration; this.activeAnimations.forEach(a => { a.playbackRate *= rate; }); }
    cancel() { this.token++; this.activeAnimations.forEach(a => a.cancel()); this.activeAnimations = []; this.layer.replaceChildren(); }
    reset(count) { this.cancel(); this.state.count = count; this.state.rods = { A: new HanoiStack.DiscStack("A"), B: new HanoiStack.DiscStack("B"), C: new HanoiStack.DiscStack("C") }; for (let disk = count; disk >= 1; disk--) this.state.rods.A.push(disk); this.state.index = 0; this.render(); }
    seek(index) { this.cancel(); this.state.rods = { A: new HanoiStack.DiscStack("A"), B: new HanoiStack.DiscStack("B"), C: new HanoiStack.DiscStack("C") }; for (let d=this.state.count;d>=1;d--)this.state.rods.A.push(d); for(let i=0;i<index;i++){const m=this.state.moves[i],d=this.state.rods[m.from].pop();if(d!==m.disk)throw new Error("Invalid generated sequence.");this.state.rods[m.to].push(d);}this.state.index=index;this.render(); }
    solved() { return this.state.rods.A.isEmpty() && this.state.rods.B.isEmpty() && this.state.rods.C.size() === this.state.count; }
  }
  window.HanoiVisualizer = HanoiVisualizer;
})();
