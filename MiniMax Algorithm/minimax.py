import math

def check_winner(b):
    lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    for l in lines:
        if b[l[0]] and b[l[0]] == b[l[1]] == b[l[2]]:
            return b[l[0]]
    return "TIE" if None not in b else None

def minimax(b, d, a, bt, is_m):
    r = check_winner(b)
    if r == "O": return 10 - d
    if r == "X": return d - 10
    if r == "TIE": return 0
    
    if is_m:
        s = -math.inf
        for i in range(9):
            if b[i] is None:
                b[i] = "O"
                s = max(s, minimax(b, d + 1, a, bt, False))
                b[i] = None
                a = max(a, s)
                if bt <= a: break
        return s
    else:
        s = math.inf
        for i in range(9):
            if b[i] is None:
                b[i] = "X"
                s = min(s, minimax(b, d + 1, a, bt, True))
                b[i] = None
                bt = min(bt, s)
                if bt <= a: break
        return s

def get_best_move(board, player):
    best_val = -math.inf if player == "O" else math.inf
    move = -1
    for i in range(9):
        if board[i] is None:
            board[i] = player
            val = minimax(board, 0, -math.inf, math.inf, player == "X")
            board[i] = None
            if player == "O":
                if val > best_val:
                    best_val, move = val, i
            else:
                if val < best_val:
                    best_val, move = val, i
    return move

print("""
Board Index Reference:
 0 | 1 | 2 
-----------
 3 | 4 | 5 
-----------
 6 | 7 | 8 

Example Input: X, None, O, None, X, None, None, None, None
""")

raw_input = input("Enter board state (9 values separated by comma): ")
board = [val.strip() if val.strip() in ["X", "O"] else None for val in raw_input.split(",")]
current_player = input("Enter current player (X or O): ").strip().upper()

best_idx = get_best_move(board, current_player)
print(f"Best Move Index: {best_idx}")