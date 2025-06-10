function doGameOver() {
    console.log("GAME OVER");
}

// ----- GamePiece class -----

class GamePiece {
    // team: "black", "white"
    // pieceType: "rook", "knight", "bishop", "queen", "king", "pawn"
    constructor(team, pieceType) {
        this.team = team;
        this.pieceType = pieceType;
    }

    getTeam() {
        return this.team;
    }

    getPieceType() {
        return this.pieceType;
    }

    getAssetFilename() {
        return "assets/" + this.pieceType + "-" + this.team + ".png";
    }
}

// ----- Board class -----

const startingMainBoard = [
    [new GamePiece("black", "rook"), new GamePiece("black", "knight"), new GamePiece("black", "bishop"), new GamePiece("black", "queen"), new GamePiece("black", "king"), new GamePiece("black", "bishop"), new GamePiece("black", "knight"), new GamePiece("black", "rook")],
    [new GamePiece("black", "pawn"), new GamePiece("black", "pawn"), new GamePiece("black", "pawn"), new GamePiece("black", "pawn"), new GamePiece("black", "pawn"), new GamePiece("black", "pawn"), new GamePiece("black", "pawn"), new GamePiece("black", "pawn")],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [new GamePiece("white", "pawn"), new GamePiece("white", "pawn"), new GamePiece("white", "pawn"), new GamePiece("white", "pawn"), new GamePiece("white", "pawn"), new GamePiece("white", "pawn"), new GamePiece("white", "pawn"), new GamePiece("white", "pawn")],
    [new GamePiece("white", "rook"), new GamePiece("white", "knight"), new GamePiece("white", "bishop"), new GamePiece("white", "queen"), new GamePiece("white", "king"), new GamePiece("white", "bishop"), new GamePiece("white", "knight"), new GamePiece("white", "rook")]
];
const startingGulagBoard = [
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null],
    [null, null, null, null, null, null, null, null]
];

const PostMoveResult = {
    INVALID_MOVE: "invalid_move",
    VALID_MOVE: "valid_move",
    GAME_OVER: "game_over"
};

let mainBoardList = [];
let gulagBoardList = [];

class Board {
    playerTurn = "white";

    // Set up a new board.
    newBoard() {
        console.log("Setting up a new board");
        mainBoardList = [];
        gulagBoardList = [];
        for (let i = 0; i < startingMainBoard.length; i++) {
            mainBoardList.push(startingMainBoard[i].slice());
        }
        for (let i = 0; i < startingGulagBoard.length; i++) {
            gulagBoardList.push(startingGulagBoard[i].slice());
        }
    }

    nextPlayerTurn() {
        if (this.playerTurn === "white") {
            this.playerTurn = "black";
        } else {
            this.playerTurn = "white";
        }
    }

    // Get the piece for the piece position.
    // piecePosition: Position of the piece. e.g. "a5"
    // whichBoard: "main-chessboard" board or "gulag-chessboard" board
    getPiece(piecePosition, whichBoard) {
        if (piecePosition.length == 2) {
            const letter = piecePosition.charCodeAt(0) - 97;
            const number = parseInt(piecePosition.charAt(1));
            if (letter >= 0 && letter < 8 && number > 0 && number <= 8) {
                if (whichBoard === "main-chessboard") {
                    return mainBoardList[8 - number][letter];
                } else if (whichBoard === "gulag-chessboard") {
                    return gulagBoardList[8 - number][letter];
                }
            }
        }
        return null;
    }

    // Return the valid moves of the piece in the selected position.
    // piecePosition: The position of the piece we want to get valid moves for (e.g. "a5")
    // whichBoard: "main-chessboard" board or "gulag-chessboard" board
    getValidMoves(piecePosition, whichBoard) {
        const piece = this.getPiece(piecePosition, whichBoard);
        if (piece.team !== this.playerTurn) {
            console.log("It is not " + piece.team + "'s turn yet. It's currently " + this.playerTurn + "'s turn.");
            return [];
        }
        const pieceType = piece.getPieceType();
        const team = piece.getTeam();
        const currLetter = piecePosition.charCodeAt(0) - 97;
        const currNumber = parseInt(piecePosition.charAt(1));
        let validMoves = [];

        if (pieceType === "pawn") {
            if (team === "white") {
                console.log("curr number is " + currNumber);
                if (currNumber == 2) {
                    console.log("curr num is 1");
                    if (this.getPiece(String.fromCharCode(currLetter + 97) + (currNumber + 1), whichBoard) === null && this.getPiece(String.fromCharCode(currLetter + 97) + (currNumber + 2), whichBoard) === null) {
                        validMoves.push(String.fromCharCode(currLetter + 97) + (currNumber + 2));
                    }
                }
                if (this.getPiece(String.fromCharCode(currLetter + 97) + (currNumber + 1), whichBoard) === null) {
                    validMoves.push(String.fromCharCode(currLetter + 97) + (currNumber + 1));
                }
                if (currLetter > 0 && this.getPiece(String.fromCharCode(currLetter + 97 - 1) + (currNumber + 1), whichBoard) !== null) {
                    validMoves.push(String.fromCharCode(currLetter + 97 - 1) + (currNumber + 1));
                }
                if (currLetter < 7 && this.getPiece(String.fromCharCode(currLetter + 97 + 1) + (currNumber + 1), whichBoard) !== null) {
                    validMoves.push(String.fromCharCode(currLetter + 97 + 1) + (currNumber + 1));
                }
            } else if (team === "black") {
                if (currNumber == 7) {
                    if (this.getPiece(String.fromCharCode(currLetter + 97) + (currNumber - 1), whichBoard) === null && this.getPiece(String.fromCharCode(currLetter + 97) + (currNumber - 2), whichBoard) === null) {
                        validMoves.push(String.fromCharCode(currLetter + 97) + (currNumber - 2));
                    }
                }
                if (this.getPiece(String.fromCharCode(currLetter + 97) + (currNumber - 1), whichBoard) === null) {
                    validMoves.push(String.fromCharCode(currLetter + 97) + (currNumber - 1));
                }
                if (currLetter > 0 && this.getPiece(String.fromCharCode(currLetter + 97 - 1) + (currNumber - 1), whichBoard) !== null) {
                    validMoves.push(String.fromCharCode(currLetter + 97 - 1) + (currNumber - 1));
                }
                if (currLetter < 7 && this.getPiece(String.fromCharCode(currLetter + 97 + 1) + (currNumber - 1), whichBoard) !== null) {
                    validMoves.push(String.fromCharCode(currLetter + 97 + 1) + (currNumber - 1));
                }
            }
        }
        if (pieceType === "rook" || pieceType === "queen") {
            let tempX = currLetter; // 0 to 7
            let tempY = currNumber; // 1 to 8
            // Up
            tempY = currNumber + 1; // 1 to 8
            while (tempY <= 8) {
                validMoves.push(String.fromCharCode(currLetter + 97) + tempY);
                if (this.getPiece(String.fromCharCode(currLetter + 97) + tempY, whichBoard) !== null) {
                    tempY = 100;
                }
                tempY += 1;
            }
            // Down
            tempY = currNumber - 1; // 1 to 8
            while (tempY >= 1) {
                validMoves.push(String.fromCharCode(currLetter + 97) + tempY);
                if (this.getPiece(String.fromCharCode(currLetter + 97) + tempY, whichBoard) !== null) {
                    tempY = -100;
                }
                tempY -= 1;
            }
            // Left
            tempX = currLetter - 1; // 0 to 7
            while (tempX >= 0) {
                validMoves.push(String.fromCharCode(tempX + 97) + currNumber);
                if (this.getPiece(String.fromCharCode(tempX + 97) + currNumber, whichBoard) !== null) {
                    tempX = -100;
                }
                tempX -= 1;
            }
            // Right
            tempX = currLetter + 1; // 0 to 7
            while (tempX <= 7) {
                validMoves.push(String.fromCharCode(tempX + 97) + currNumber);
                if (this.getPiece(String.fromCharCode(tempX + 97) + currNumber, whichBoard) !== null) {
                    tempX = 100;
                }
                tempX += 1;
            }
        }
        if (pieceType === "knight") {
            // Up-left highest
            if (currNumber + 2 <= 8 && currLetter - 1 >= 0) {
                validMoves.push(String.fromCharCode(currLetter - 1 + 97) + (currNumber + 2));
            }
            // Up-left lower
            if (currNumber + 1 <= 8 && currLetter - 2 >= 0) {
                validMoves.push(String.fromCharCode(currLetter - 2 + 97) + (currNumber + 1));
            }
            // Down-left highest
            if (currNumber - 1 <= 8 && currLetter - 2 >= 0) {
                validMoves.push(String.fromCharCode(currLetter - 2 + 97) + (currNumber - 1));
            }
            // Down-left lower
            if (currNumber - 2 <= 8 && currLetter - 1 >= 0) {
                validMoves.push(String.fromCharCode(currLetter - 1 + 97) + (currNumber - 2));
            }
            // Up-right highest
            if (currNumber + 2 <= 8 && currLetter - 1 >= 0) {
                validMoves.push(String.fromCharCode(currLetter - 1 + 97) + (currNumber + 2));
            }
            // Up-right lower
            if (currNumber + 1 <= 8 && currLetter - 2 >= 0) {
                validMoves.push(String.fromCharCode(currLetter - 2 + 97) + (currNumber + 1));
            }
            // Down-right highest
            if (currNumber - 1 <= 8 && currLetter - 2 >= 0) {
                validMoves.push(String.fromCharCode(currLetter - 2 + 97) + (currNumber - 1));
            }
            // Down-right lower
            if (currNumber - 2 <= 8 && currLetter - 1 >= 0) {
                validMoves.push(String.fromCharCode(currLetter - 1 + 97) + (currNumber - 2));
            }
        }
        if (pieceType === "bishop" || pieceType === "queen") {
            let tempX = currLetter; // 0 to 7
            let tempY = currNumber; // 1 to 8
            // Up-left
            tempY = currNumber + 1; // 1 to 8
            tempX = currLetter - 1; // 0 to 7
            while (tempY <= 8 && tempX >= 0) {
                validMoves.push(String.fromCharCode(tempX + 97) + tempY);
                if (this.getPiece(String.fromCharCode(tempX + 97) + tempY, whichBoard) !== null) {
                    tempX = -100;
                    tempY = 100;
                }
                tempX -= 1;
                tempY += 1;
            }
            // Up-right
            tempY = currNumber + 1; // 1 to 8
            tempX = currLetter + 1; // 0 to 7
            while (tempY <= 8 && tempX <= 7) {
                validMoves.push(String.fromCharCode(tempX + 97) + tempY);
                if (this.getPiece(String.fromCharCode(tempX + 97) + tempY, whichBoard) !== null) {
                    tempX = 100;
                    tempY = 100;
                }
                tempX += 1;
                tempY += 1;
            }
            // Down-left
            tempY = currNumber - 1; // 1 to 8
            tempX = currLetter - 1; // 0 to 7
            while (tempY >= 1 && tempX >= 0) {
                validMoves.push(String.fromCharCode(tempX + 97) + tempY);
                if (this.getPiece(String.fromCharCode(tempX + 97) + tempY, whichBoard) !== null) {
                    tempX = -100;
                    tempY = -100;
                }
                tempX -= 1;
                tempY -= 1;
            }
            // Down-right
            tempY = currNumber - 1; // 1 to 8
            tempX = currLetter + 1; // 0 to 7
            while (tempY >= 1 && tempX <= 7) {
                validMoves.push(String.fromCharCode(tempX + 97) + tempY);
                if (this.getPiece(String.fromCharCode(tempX + 97) + tempY, whichBoard) !== null) {
                    tempX = 100;
                    tempY = -100;
                }
                tempX += 1;
                tempY -= 1;
            }
        }
        if (pieceType === "king") {
            // Up-left
            if (currNumber + 1 <= 8 && currLetter - 1 >= 0) {
                validMoves.push(String.fromCharCode(currLetter - 1 + 97) + (currNumber + 1));
            }
            // Up-right
            if (currNumber + 1 <= 8 && currLetter + 1 <= 7) {
                validMoves.push(String.fromCharCode(currLetter + 1 + 97) + (currNumber + 1));
            }
            // Down-left
            if (currNumber - 1 >= 1 && currLetter - 1 >= 0) {
                validMoves.push(String.fromCharCode(currLetter - 1 + 97) + (currNumber - 1));
            }
            // Down-right
            if (currNumber - 1 >= 1 && currLetter + 1 <= 7) {
                validMoves.push(String.fromCharCode(currLetter + 1 + 97) + (currNumber - 1));
            }
            // Up
            if (currNumber + 1 <= 8) {
                validMoves.push(String.fromCharCode(currLetter + 97) + (currNumber + 1));
            }
            // Down
            if (currNumber - 1 >= 1) {
                validMoves.push(String.fromCharCode(currLetter + 97) + (currNumber - 1));
            }
            // Left
            if (currLetter - 1 >= 0) {
                validMoves.push(String.fromCharCode(currLetter - 1 + 97) + (currNumber));
            }
            // Right
            if (currLetter + 1 <= 7) {
                validMoves.push(String.fromCharCode(currLetter + 1 + 97) + (currNumber));
            }
        }

        return validMoves;
    }

    // Send a piece to the gulag. Return false if it kills something and goes back to the main board.
    sendToGulag(piecePosition) {
        if (this.getPiece(piecePosition, "gulag-chessboard") !== null) {
            console.log("Piece from the gulag just got killed! At " + piecePosition);
            this.deleteFromGulag(piecePosition);
            return false;
        }
        const letter = piecePosition.charCodeAt(0) - 97;
        const number = parseInt(piecePosition.charAt(1));
        gulagBoardList[8 - number][letter] = mainBoardList[8 - number][letter];
        mainBoardList[8 - number][letter] = null;
        renderChessPiecesUI();
        return true;
    }

    // Send a(n attacking) piece (that tried to get the position) to the gulag.
    sendFailedAttackerToGulag(startingPosition, destinedPosition) {
        const startingLetter = startingPosition.charCodeAt(0) - 97;
        const startingNumber = parseInt(startingPosition.charAt(1));
        const destinedLetter = destinedPosition.charCodeAt(0) - 97;
        const destinedNumber = parseInt(destinedPosition.charAt(1));
        gulagBoardList[8 - destinedNumber][destinedLetter] = mainBoardList[8 - startingNumber][startingLetter];
        mainBoardList[8 - startingNumber][startingLetter] = null;
        renderChessPiecesUI();
    }

    deleteFromGulag(piecePosition) {
        const letter = piecePosition.charCodeAt(0) - 97;
        const number = parseInt(piecePosition.charAt(1));
        if (gulagBoardList[8 - number][letter].getPieceType() === "king") {
            doGameOver();
        }
        gulagBoardList[8 - number][letter] = null;
        renderChessPiecesUI();
    }

    // Attempt to move a piece from startPosition to endPosition. Returns a PostMoveResult.
    // startPosition: Beginning position of the piece (e.g. "a5")
    // endPosition: End position of the piece (e.g. "a6")
    // whichBoard: "main-chessboard" board or "gulag-chessboard" board
    movePiece(startPosition, endPosition, whichBoard) {
        clearChessMoveIndicatorsUI();
        const startLetter = startPosition.charCodeAt(0) - 97;
        const startNumber = parseInt(startPosition.charAt(1));
        const endLetter = endPosition.charCodeAt(0) - 97;
        const endNumber = parseInt(endPosition.charAt(1));
        if (whichBoard === "main-chessboard") {
            console.log("(main board) Trying to move from", startPosition, "to", endPosition);

            if (this.getPiece(endPosition, whichBoard) !== null) {
                console.log("Sending a piece to the gulag.");
                if (this.sendToGulag(endPosition)) {
                    mainBoardList[8 - endNumber][endLetter] = mainBoardList[8 - startNumber][startLetter];
                    mainBoardList[8 - startNumber][startLetter] = null;
                    if (endNumber === 8 && this.getPiece(endPosition, "main-chessboard").getPieceType() === "pawn") {
                        mainBoardList[8 - endNumber][endLetter] = new GamePiece(this.getPiece(endPosition, "main-chessboard").getTeam(), "queen");
                    }
                } else {
                    console.log("The piece came back from the gulag! Sending the attacking piece down to the gulag instead.");
                    this.sendFailedAttackerToGulag(startPosition, endPosition);
                    if (endNumber === 8 && this.getPiece(endPosition, "gulag-chessboard").getPieceType() === "pawn") {
                        mainBoardList[8 - endNumber][endLetter] = new GamePiece(this.getPiece(endPosition, "gulag-chessboard").getTeam(), "queen");
                    }
                }
            } else {
                mainBoardList[8 - endNumber][endLetter] = mainBoardList[8 - startNumber][startLetter];
                mainBoardList[8 - startNumber][startLetter] = null;
                if (endNumber === 8 && this.getPiece(endPosition, whichBoard).getPieceType() === "pawn") {
                    mainBoardList[8 - endNumber][endLetter] = new GamePiece(this.getPiece(endPosition, whichBoard).getTeam(), "queen");
                }
            }
            renderChessPiecesUI();

            return PostMoveResult.VALID_MOVE;
        } else if (whichBoard === "gulag-chessboard") {
            console.log("(gulag board) Trying to move from", startPosition, "to", endPosition);

            if (this.getPiece(endPosition, whichBoard) !== null) {
                this.deleteFromGulag(endPosition);
                console.log("(gulag board) Piece was captured. Leaving the gulag");

                if (this.getPiece(endPosition, "main-chessboard") !== null) {
                    const tempMainBoardPiece = mainBoardList[8 - endNumber][endLetter];
                    mainBoardList[8 - endNumber][endLetter] = gulagBoardList[8 - startNumber][startLetter];
                    gulagBoardList[8 - startNumber][startLetter] = tempMainBoardPiece;
                } else {
                    mainBoardList[8 - endNumber][endLetter] = gulagBoardList[8 - startNumber][startLetter];
                    gulagBoardList[8 - startNumber][startLetter] = null;
                }
                if (endNumber === 8 && this.getPiece(endPosition, "main-chessboard").getPieceType() === "pawn") {
                    gulagBoardList[8 - endNumber][endLetter] = new GamePiece(this.getPiece(endPosition, "main-chessboard").getTeam(), "queen");
                }
            } else {
                gulagBoardList[8 - endNumber][endLetter] = gulagBoardList[8 - startNumber][startLetter];
                gulagBoardList[8 - startNumber][startLetter] = null;
                if (endNumber === 8 && this.getPiece(endPosition, "gulag-chessboard").getPieceType() === "pawn") {
                    gulagBoardList[8 - endNumber][endLetter] = new GamePiece(this.getPiece(endPosition, "gulag-chessboard").getTeam(), "queen");
                }
            }
            renderChessPiecesUI();
            return PostMoveResult.VALID_MOVE;
        }
        return PostMoveResult.INVALID_MOVE;
    }
}

// ----- Main game logic -----

let board = new Board();

function renderChessPiecesUI() {
    clearChessPiecesUI();
    clearChessMoveIndicatorsUI();

    // Render main board
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (mainBoardList[i][j] !== null) {
                let rowId = String.fromCharCode(('a'.charCodeAt() + j));
                let colId = 8 - i;
                let piecePosition = rowId + colId
                placeChessPiece(mainBoardList[i][j].getAssetFilename(), piecePosition, "main-chessboard");
            }
        }
    }
    // Render gulag board
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (gulagBoardList[i][j] !== null) {
                let rowId = String.fromCharCode(('a'.charCodeAt() + j));
                let colId = 8 - i;
                let piecePosition = rowId + colId
                placeChessPiece(gulagBoardList[i][j].getAssetFilename(), piecePosition, "gulag-chessboard");
            }
        }
    }
}

function startNewGame() {
    board = new Board();
    board.newBoard();

    generateChessboardUI("main-chessboard");
    generateChessboardUI("gulag-chessboard");
    renderChessPiecesUI();
}

function showValidMoves(boardPosition, whichBoard) {
    console.log("showing valid moves for " + boardPosition + " on " + whichBoard);
    clearChessMoveIndicatorsUI();
    let validMoves = board.getValidMoves(boardPosition, whichBoard)
    console.log("Valid moves: " + validMoves)
    for (let i = 0; i < validMoves.length; i++) {
        placeSuggestionDots(boardPosition, validMoves[i], whichBoard);
    }
}

function moveBoardPiece(originalPosition, boardPosition, whichBoard) {
    board.movePiece(originalPosition, boardPosition, whichBoard);
    board.nextPlayerTurn();
}