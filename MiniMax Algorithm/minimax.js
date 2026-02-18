/**
 * Calculates the best move for the current player using the Minimax algorithm with Alpha-Beta pruning.
 * @param {Array} board - An array of 9 elements representing the Tic-Tac-Toe grid.
 * Values: 'X', 'O', or null.
 * Example input: ['X', 'O', 'X', null, 'O', null, null, null, null]
 */
function getBestMoveMinimax(board) {

    /**
     * Internal helper to determine the game state.
     * Checks all winning rows, columns, and diagonals.
     */
    function checkWinner(b) {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
            [0, 4, 8], [2, 4, 6]             // Diagonals
        ];
        for (let l of lines) {
            if (b[l[0]] && b[l[0]] === b[l[1]] && b[l[0]] === b[l[2]]) {
                return { w: b[l[0]] }; // Returns 'X' or 'O' as winner
            }
        }
        return b.includes(null) ? null : { w: 'TIE' }; // Returns 'TIE' or null
    }

    /**
     * Core recursive Minimax function with Alpha-Beta pruning.
     */
    function minimax(b, depth, alpha, beta, isMaximizing) {
        let result = checkWinner(b);
        if (result) {
            if (result.w === 'O') return 10 - depth;
            if (result.w === 'X') return depth - 10;
            return 0;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (!b[i]) {
                    b[i] = 'O';
                    let score = minimax(b, depth + 1, alpha, beta, false);
                    b[i] = null;
                    bestScore = Math.max(score, bestScore);
                    alpha = Math.max(alpha, bestScore);
                    if (beta <= alpha) break; // Beta cut-off
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (!b[i]) {
                    b[i] = 'X';
                    let score = minimax(b, depth + 1, alpha, beta, true);
                    b[i] = null;
                    bestScore = Math.min(score, bestScore);
                    beta = Math.min(beta, bestScore);
                    if (beta <= alpha) break; // Alpha cut-off
                }
            }
            return bestScore;
        }
    }

    // Determine current player (Assumes 'X' starts first if counts are equal)
    const xCount = board.filter(v => v === 'X').length;
    const oCount = board.filter(v => v === 'O').length;
    const currentPlayer = (oCount < xCount) ? 'O' : 'X';
    const isMaximizing = (currentPlayer === 'O');

    let bestScore = isMaximizing ? -Infinity : Infinity;
    let move = -1;

    // Search for the best move index
    for (let i = 0; i < 9; i++) {
        if (!board[i]) {
            board[i] = currentPlayer;
            let score = minimax(board, 0, -Infinity, Infinity, !isMaximizing);
            board[i] = null;

            if (isMaximizing) {
                if (score > bestScore) {
                    bestScore = score;
                    move = i;
                }
            } else {
                if (score < bestScore) {
                    bestScore = score;
                    move = i;
                }
            }
        }
    }

    return { move, score: bestScore };
}