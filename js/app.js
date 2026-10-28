(() => {
  const count = 4;
  const state = { count, rods: {}, moves: HanoiAlgorithm.solveHanoi(count,"A","B","C"), index: 0, playing: false, duration: 620 };
  const visualizer = new HanoiVisualizer(state, () => { if(window.controls)controls.update(); });
  window.controls = new HanoiControls(state, visualizer);
  visualizer.reset(count); document.querySelector("#moveCount").textContent=`${state.moves.length} MOVES`;
  state.moves=HanoiAlgorithm.solveHanoi(3,"A","B","C");
  document.querySelector("#exampleMoves").innerHTML=state.moves.map((m,i)=>`<li>Move ${i+1}: disc ${m.disk}, ${m.from} → ${m.to}</li>`).join("");
  state.moves=HanoiAlgorithm.solveHanoi(count,"A","B","C");
  window.controls.update();
})();
