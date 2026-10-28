(() => {
  const speeds = { slow: 1050, normal: 620, fast: 300 };
  class HanoiControls {
    constructor(state, visualizer) { this.s = state; this.v = visualizer; this.busy = false; this.pauseRequested = false; this.bind(); }
    bind() {
      document.querySelector("#playBtn").addEventListener("click", () => {
        if (this.s.playing) {
          this.pauseRequested = true;
          const button=document.querySelector("#playBtn"); button.querySelector("span").textContent="Pausing…";
          button.setAttribute("aria-label","Pause requested");
          document.querySelector("#statusText").textContent="Pausing…";
        } else { if(this.s.index>=this.s.moves.length)this.reset(); this.play(); }
      });
      document.querySelector("#nextBtn").addEventListener("click", () => this.step(1));
      document.querySelector("#previousBtn").addEventListener("click", () => this.step(-1));
      document.querySelector("#resetBtn").addEventListener("click", () => this.reset());
      document.querySelector("#restartBtn").addEventListener("click", () => this.play());
      const discRange = document.querySelector("#discRange");
      discRange.addEventListener("input", e => { const n=Number(e.target.value), total=HanoiAlgorithm.minimumMoves(n); document.querySelector("#discValue").textContent=n; document.querySelector("#statTotal").textContent=total; document.querySelector("#moveCount").textContent=`${total} MOVES`; });
      discRange.addEventListener("change", e => this.changeCount(Number(e.target.value)));
      document.querySelector("#speedSelect").addEventListener("change", e => this.v.setSpeed(speeds[e.target.value]));
      document.querySelector("#moveList").addEventListener("click", e => { const row=e.target.closest("[data-index]"); if(row) this.inspect(Number(row.dataset.index)); });
      document.querySelector("#moveList").addEventListener("keydown", e => { const row=e.target.closest("[data-index]"); if(row&&(e.key==="Enter"||e.key===" ")){e.preventDefault();this.inspect(Number(row.dataset.index));} });
    }
    setPlaying(on, label = on ? "Solving" : "Paused") { this.s.playing = on; document.querySelector("#statusText").textContent = label; document.querySelector("#stateLabel").textContent = label; const button=document.querySelector("#playBtn"); button.querySelector("span").textContent=on?"Pause":(label==="Solved"?"Play again":(this.s.index?"Resume":"Play")); button.setAttribute("aria-label",on?"Pause solution":(label==="Solved"?"Play solution again":(this.s.index?"Resume solution":"Play solution"))); button.setAttribute("aria-pressed",String(on)); }
    async play() {
      if (this.busy || this.s.index >= this.s.moves.length) return;
      this.pauseRequested = false; this.setPlaying(true); this.busy = true;
      try { while (this.s.index < this.s.moves.length && !this.pauseRequested) { const ok=await this.v.animateNext(this.s.moves[this.s.index]); if(!ok) break; if(this.s.index===this.s.moves.length) this.complete(); if(this.pauseRequested && this.s.index<this.s.moves.length){this.setPlaying(false,"Paused");break;} } }
      catch(error) { console.error(error); this.setPlaying(false,"Error"); document.querySelector("#moveDescription").textContent=error.message; }
      finally { this.busy=false; }
    }
    async step(delta) {
      if (this.busy) return;
      if (delta < 0) { if(this.s.index===0)return; this.v.seek(this.s.index-1); this.afterSeek(); return; }
      if (this.s.index >= this.s.moves.length) return;
      this.busy=true; this.pauseRequested=true; this.setPlaying(false,"Stepping");
      try { await this.v.animateNext(this.s.moves[this.s.index]); if(this.s.index===this.s.moves.length)this.complete(); else this.setPlaying(false,"Paused"); }
      catch(error) { console.error(error); } finally { this.busy=false; }
    }
    inspect(rowIndex) { if(this.busy)return; const target=rowIndex+1; if(target<0||target>this.s.moves.length)return; this.v.seek(target); this.setPlaying(false,target?"Paused":"Ready"); this.afterSeek(); }
    afterSeek() { document.querySelector("#successBanner").hidden=true; document.querySelector("#moveCaption").textContent=this.s.index?"LAST COMPLETED MOVE":"READY TO BEGIN"; document.querySelector("#moveDescription").textContent=this.s.index?this.describe(this.s.moves[this.s.index-1]):"Choose Play to start the solution"; this.update(); }
    reset() { this.pauseRequested=true; this.setPlaying(false,"Ready"); this.s.moves=HanoiAlgorithm.solveHanoi(this.s.count,"A","B","C"); this.v.reset(this.s.count); document.querySelector("#successBanner").hidden=true; document.querySelector("#moveCaption").textContent="READY TO BEGIN"; document.querySelector("#moveDescription").textContent="Choose Play to start the solution"; this.update(); }
    changeCount(count) { if(!Number.isInteger(count)||count<1||count>10)return; if(count===this.s.count)return; if((this.s.playing||this.s.index>0)&&!window.confirm("Changing the disc count will restart the current puzzle. Continue?")){document.querySelector("#discRange").value=this.s.count;document.querySelector("#discValue").textContent=this.s.count;document.querySelector("#statTotal").textContent=this.s.moves.length;document.querySelector("#moveCount").textContent=`${this.s.moves.length} MOVES`;return;} this.s.count=count; document.querySelector("#discValue").textContent=count; this.s.moves=HanoiAlgorithm.solveHanoi(count,"A","B","C"); document.querySelector("#moveCount").textContent=`${this.s.moves.length} MOVES`; this.setPlaying(false,"Ready"); this.v.reset(count); document.querySelector("#successBanner").hidden=true; document.querySelector("#moveCaption").textContent="READY TO BEGIN"; document.querySelector("#moveDescription").textContent="Choose Play to start the solution"; this.update(); }
    describe(m) { return `Move disc ${m.disk} from ${m.from} to ${m.to}`; }
    complete() { if(!this.v.solved())throw new Error("Completion check failed: discs are not all on rod C."); this.setPlaying(false,"Solved"); document.querySelector("#successBanner").hidden=false; document.querySelector("#successCopy").textContent=`Solved in ${this.s.moves.length} moves. All discs reached rod C.`; document.querySelector("#moveCaption").textContent="SOLUTION COMPLETE"; document.querySelector("#moveDescription").textContent="Every disc is on the destination rod."; }
    update() {
      const n=this.s.count,total=this.s.moves.length,index=this.s.index,pct=total?Math.round(index/total*100):0;
      document.querySelector("#statDiscs").textContent=n; document.querySelector("#statTotal").textContent=total; document.querySelector("#statDone").textContent=index; document.querySelector("#statRemaining").textContent=total-index; document.querySelector("#statPercent").textContent=`${pct}%`; document.querySelector("#miniProgress").style.width=`${pct}%`;
      document.querySelector("#progressText").textContent=`${index} of ${total} moves`; document.querySelector(".progress-track").setAttribute("aria-valuenow",pct); document.querySelector("#progressBar").style.width=`${pct}%`; document.querySelector("#moveIndex").textContent=String(index).padStart(2,"0");
      const list=document.querySelector("#moveList"),active=index===0?0:index-1,oldTop=list.scrollTop;
      list.innerHTML=this.s.moves.map((m,i)=>`<div class="move-row ${i<index?"completed":""} ${i===active&&index>0?"current":""}" data-index="${i}" tabindex="0" role="button" aria-label="Move ${i+1}: disc ${m.disk} from ${m.from} to ${m.to}"><span class="row-num">${String(i+1).padStart(2,"0")}</span><span><span class="row-disc">Disc ${m.disk}</span><span class="row-route">${m.from} <span class="row-arrow">→</span> ${m.to}</span></span><span class="row-state">${i<index?"Done":i===active&&index>0?"Last":"Next"}</span></div>`).join("");
      if(index>0){ const row=list.querySelector(`[data-index="${active}"]`); if(row){const r=row.getBoundingClientRect(),lr=list.getBoundingClientRect(); if(r.top<lr.top||r.bottom>lr.bottom)row.scrollIntoView({block:"nearest"});} } else list.scrollTop=oldTop;
    }
  }
  window.HanoiControls = HanoiControls;
})();
