# Hanoi Lab â€” Interactive Algorithm Visualizer

A browser-based Tower of Hanoi simulator built with semantic HTML, CSS, and vanilla JavaScript. It generates the optimal recursive solution, stores each rod as an enforced LIFO stack, animates moves, and keeps playback controls and solution history synchronized.

## Features

- Choose 1â€“10 discs and see the optimal move count update.
- Recursive move generation and legal JavaScript stack operations.
- Animated disc movement; Play, pause, resume, step, previous, reset, and speed presets.
- Scrollable move explorer with completed/current/pending status.
- Dynamic progress, move statistics, completion validation, and a three-disc example.
- Responsive layout, keyboard focus indicators, semantic controls, and reduced-motion support.
- No dependencies, backend, build step, or network access.

## Run locally

From this directory, launch the terminal script:

```powershell
.\run-server.bat
```

Open <http://localhost:5500>. Keep the terminal window open while using the app; press Ctrl+C there to stop the server. The script changes to the project directory before starting Python, so the app opens at the root URL. If port 5500 is already in use, stop the other server first. If Python is unavailable, open this directory in VS Code and use the Live Server extension on `index.html`. Directly opening `index.html` is also supported; the scripts are classic local scripts, not ES modules.

## Structure

```text
tower-of-hanoi-visualizer/
â”œâ”€â”€ index.html
â”œâ”€â”€ css/ (style.css, animation.css, responsive.css)
â”œâ”€â”€ js/ (app.js, hanoi.js, stack.js, visualizer.js, controls.js)
â”œâ”€â”€ assets/README.md
â”œâ”€â”€ README.md
â””â”€â”€ .gitignore
```

## DSA explanation

To move `n` discs from source to target, recursively move `n âˆ’ 1` discs to the auxiliary rod, move disc `n` to target, then move the `n âˆ’ 1` discs from auxiliary to target. At `n = 0`, return. For one disc, the recursion produces one direct move. The smaller stack is moved out of the way before the largest disc moves; then the same reasoning solves the remaining subproblem.

Each rod is an array-backed stack (bottom to top). `pop()` removes only the top disc; `push()` rejects placing a larger numbered disc on a smaller one. A move is validated against the actual stacks before it is committed to the display.

### Complexity

- Time to generate the full solution: `O(2^n)`; the exact move count is `2^n âˆ’ 1`.
- Recursive auxiliary call stack: `O(n)`.
- Stored move sequence: `O(2^n)`.
- Minimum moves: `2^n âˆ’ 1`.

The recursive stack and stored move array are separate memory costs.

## Verify manually

1. Select 1, 2, 3, 4, and 10 discs; expected move totals are 1, 3, 7, 15, and 1,023.
2. Reset before play and during playback; confirm every disc returns to A and the counter becomes zero.
3. Pause and resume; change speed during playback; confirm the sequence continues from a legal state.
4. Use Previous and Next around a move boundary; confirm the rendered stacks and selected move agree.
5. Solve the puzzle; confirm A and B are empty, C contains all discs, and progress reaches 100%.
6. Try all count values in the labeled 1â€“10 range control.

The interface does not add an out-of-range numeric field, so invalid counts cannot be entered through the UI. No automated browser-test harness is included.

