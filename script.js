let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = true;
let isAnimating = false;
let scores = { X: 0, O: 0, TIE: 0 };

function drawPiece(index, type, instant = false, alpha = 1.0) {
    return new Promise((resolve) => {
        const cvs = document.getElementById(`cvs${index}`);
        if (!cvs) return resolve();
        const ctx = cvs.getContext('2d');
        cvs.width = 200; cvs.height = 200;
        ctx.clearRect(0, 0, 200, 200);
        ctx.globalAlpha = alpha;
        ctx.lineWidth = 16;
        ctx.lineCap = 'round';

        if (type === 'X') {
            ctx.strokeStyle = '#e67e22';
            let p = 0;
            const ani = () => {
                p += instant ? 1 : 0.05;
                ctx.clearRect(0, 0, 200, 200);
                ctx.beginPath(); ctx.moveTo(60, 60);
                ctx.lineTo(60 + 80 * Math.min(p, 0.5) * 2, 60 + 80 * Math.min(p, 0.5) * 2);
                ctx.stroke();
                if (p > 0.5) {
                    ctx.beginPath(); ctx.moveTo(140, 60);
                    ctx.lineTo(140 - 80 * (p - 0.5) * 2, 60 + 80 * (p - 0.5) * 2);
                    ctx.stroke();
                }
                if (p < 1 && !instant) requestAnimationFrame(ani); else resolve();
            }; ani();
        } else {
            ctx.strokeStyle = '#3498db';
            let p = 0;
            const ani = () => {
                p += instant ? 1 : 0.04;
                ctx.clearRect(0, 0, 200, 200);
                ctx.beginPath(); ctx.arc(100, 100, 50, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * p);
                ctx.stroke();
                if (p < 1 && !instant) requestAnimationFrame(ani); else resolve();
            }; ani();
        }
    });
}

async function handleMove(i) {
    if (!gameActive || board[i] || isAnimating) return;
    isAnimating = true;
    board[i] = currentPlayer;
    await drawPiece(i, board[i], false, 1.0);

    let win = checkWinner(board);
    if (win) { endGame(win); isAnimating = false; }
    else {
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        updateUI();
        if (!document.getElementById('analysisToggle').checked && currentPlayer === 'O') {
            setTimeout(async () => {
                let moveResult = getBestMove();
                let move = moveResult.move;
                if (move !== -1) {
                    board[move] = 'O';
                    await drawPiece(move, 'O', false, 1.0);
                    let win2 = checkWinner(board);
                    if (win2) endGame(win2); else { currentPlayer = 'X'; updateUI(); }
                }
                isAnimating = false;
            }, 500);
        } else { isAnimating = false; }
    }
}

function checkWinner(b) {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let l of lines) if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[0]] === b[l[2]]) return { w: b[l[0]], l };
    return b.includes(null) ? null : { w: 'TIE' };
}

function minimax(b, d, a, bt, isM) {
    let r = checkWinner(b);
    if (r) return r.w === 'O' ? 10 - d : (r.w === 'X' ? d - 10 : 0);
    if (isM) {
        let s = -Infinity;
        for (let i = 0; i < 9; i++) if (!b[i]) { b[i] = 'O'; s = Math.max(s, minimax(b, d + 1, a, bt, false)); b[i] = null; a = Math.max(a, s); if (bt <= a) break; }
        return s;
    } else {
        let s = Infinity;
        for (let i = 0; i < 9; i++) if (!b[i]) { b[i] = 'X'; s = Math.min(s, minimax(b, d + 1, a, bt, true)); b[i] = null; bt = Math.min(bt, s); if (bt <= a) break; }
        return s;
    }
}

function getBestMove() {
    let ana = document.getElementById('analysisToggle').checked;
    let diff = ana ? 'hard' : document.getElementById('difficulty').value;
    let available = board.map((v, i) => v === null ? i : null).filter(v => v !== null);

    if (diff === 'easy') {
        return { move: available[Math.floor(Math.random() * available.length)], score: 0 };
    }

    if (diff === 'medium') {
        const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
        for (let l of lines) {
            let xCount = 0, emptyIndex = -1;
            l.forEach(idx => { if (board[idx] === 'X') xCount++; else if (board[idx] === null) emptyIndex = idx; });
            if (xCount === 2 && emptyIndex !== -1) return { move: emptyIndex, score: 0 };
        }
        return { move: available[Math.floor(Math.random() * available.length)], score: 0 };
    }

    let s = (currentPlayer === 'O') ? -Infinity : Infinity, m = -1;
    for (let i = 0; i < 9; i++) if (!board[i]) {
        board[i] = currentPlayer; let v = minimax(board, 0, -Infinity, Infinity, currentPlayer === 'X'); board[i] = null;
        if (currentPlayer === 'O') { if (v > s) { s = v; m = i; } } else { if (v < s) { s = v; m = i; } }
    }
    return { move: m, score: s };
}

function updateUI() {
    let ana = document.getElementById('analysisToggle').checked;
    if (gameActive) document.getElementById('status').innerText = `Turn: ${currentPlayer}`;
    for (let i = 0; i < 9; i++) if (!board[i]) {
        const cvs = document.getElementById(`cvs${i}`);
        if (cvs) cvs.getContext('2d').clearRect(0, 0, 200, 200);
    }
    if (ana && gameActive) {
        let res = getBestMove();
        document.getElementById('score').innerText = (res.score > 0 ? "+" : "") + res.score;
        if (res.move !== -1) drawPiece(res.move, currentPlayer, true, 0.2);
    } else { document.getElementById('score').innerText = "--"; }
}

function endGame(res) {
    gameActive = false;
    document.getElementById('status').innerText = res.w === 'TIE' ? "Draw Game" : `Winner: ${res.w}`;
    if (res.w !== 'TIE') {
        scores[res.w]++;
        document.getElementById(`win${res.w}`).innerText = scores[res.w];
    } else { scores.TIE++; document.getElementById('draws').innerText = scores.TIE; }
}

function toggleAnalysis() {
    const ana = document.getElementById('analysisToggle').checked;
    const diffSelect = document.getElementById('difficulty');
    if (ana) {
        diffSelect.value = 'hard';
        diffSelect.disabled = true;
    } else {
        diffSelect.disabled = false;
    }
    updateUI();
}

function resetGame() {
    board = Array(9).fill(null); gameActive = true; isAnimating = false; currentPlayer = 'X';
    for (let i = 0; i < 9; i++) {
        const cvs = document.getElementById(`cvs${i}`);
        if (cvs) cvs.getContext('2d').clearRect(0, 0, 200, 200);
    }
    if (document.getElementById('aiFirstToggle').checked) {
        currentPlayer = 'O';
        if (!document.getElementById('analysisToggle').checked) {
            isAnimating = true;
            setTimeout(async () => {
                let m = getBestMove().move; board[m] = 'O'; await drawPiece(m, 'O', false, 1.0);
                currentPlayer = 'X'; updateUI(); isAnimating = false;
            }, 500);
        }
    }
    updateUI();
}
updateUI();