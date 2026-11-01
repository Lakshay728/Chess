import React, { useState , useEffect } from 'react'

function ChessBoard() {
  
const [board , setBoard] = useState([
  ["br", "bn", "bb", "bq", "bk", "bb", "bn", "br"],
  ["bp", "bp", "bp", "bp", "bp", "bp", "bp", "bp"],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ["wp", "wp", "wp", "wp", "wp", "wp", "wp", "wp"],
  ["wr", "wn", "wb", "wq", "wk", "wb", "wn", "wr"]
])


function isvalidblackPawn(position ,startX , startY , endX , endY){
    if(startX === 1  && position[startX + 1 ][startY] === null && position[startX + 2][ startY] === null){
        if((startX + 2 === endX) && (startY === endY)){
        return true;
     }
        if((startX + 1 === endX) && (startY === endY)){                 // First step
        return true;
     }
     
    }
    if((startX + 1 === endX) && (startY === endY) &&  position[startX + 1][startY] === null){
        return true;                                                      // Regular step

    }
    if((startY - 1 === endY || startY + 1  === endY) && (startX + 1 === endX) &&  position[endX][endY]?.startsWith("w")){
        return true;                                                      // Capture
    }
    return false;
}

function isvalidwhitePawn(position ,startX , startY , endX , endY){
    if(startX === 6  && position[startX - 1 ][startY] === null && position[startX - 2][ startY] === null){
        if((startX - 1 === endX) && (startY === endY)){                 // First step
        return true;
     }
     if((startX - 2 === endX) && (startY === endY)){
        return true;
     }
    }
    if((startX - 1 === endX) && (startY === endY) &&  position[startX - 1][startY] === null){
        return true;                                                      // Regular step

    }
    if((startY + 1 === endY || startY - 1  === endY) && (startX - 1 === endX) &&  position[endX][endY]?.startsWith("b")){
        return true;                                                      // Capture
    }
    return false;
}


function isvalidrook(position ,startX , startY , endX , endY){


        if((startX === endX) && (startY !== endY)){
            
            let step = startY < endY ? 1 : -1;

            for( let x = startY + step; x !== endY; x+= step){
                if(position[startX][x] != null ){                          // horizontal movement
                    return false;
                }
            }
            return true;
        }

        if((startY === endY) && (startX !== endX)){
            
            let step = startX < endX ? 1 : -1;

            for( let x = startX + step; x !== endX; x+= step){
                if(position[x][startY] != null ){                          // vertical movement
                    return false;
                }
            }
            return true;
        }

        return false;
        

}

function isvalidknight(position ,startX , startY , endX , endY){
    if( (
        Math.abs(startX - endX) == 2 &&
        Math.abs(startY - endY) == 1 
        ) ||
        (
            Math.abs(startY - endY) == 2 &&
            Math.abs(startX - endX) == 1
        )
    )
    {
        return true;
    }
    return false;
}

function isvalidbishop(position ,startX , startY , endX , endY){
    if( startX !== endX && 
        Math.abs(startX - endX) === 
        Math.abs(startY - endY)     
    )
    {

        let stepx = startX < endX ? 1 : -1
        let stepy = startY < endY ? 1 : -1
        let x = startX + stepx;
        let y = startY + stepy;

        while(x !== endX){
            if(position[x][y] != null){
                return false;
            }
            x += stepx;
            y += stepy;
        }

        return true;
    }
    return false;
}

function isvalidqueen(position ,startX , startY , endX , endY){
    return (
        isvalidbishop(position ,startX , startY , endX , endY) || isvalidrook(position ,startX , startY , endX , endY)
    );
}

function isvalidking(position ,startX , startY , endX , endY){
    if( 
        Math.abs(startX - endX) <= 1 &&
        Math.abs(startY - endY) <= 1 &&
        (startX !== endX || startY !== endY)
    ){
        return true;
    }
    return false;
}

function isvalidmove(position , startX , startY , endX , endY){

    if( endX < 0 || endX > 7 ||endY < 0 || endY > 7)   {
        return false;
    }  



    let current = position[startX][startY];
    let ending = position[endX][endY]

    if (ending !== null && ending.endsWith("k")) {
        return false;
    }

      
    
    if(current === null){
        return false;
    }

    if (ending !== null && current[0] === ending[0]) {
    return false;
    }

    
    if(current === "bp"){
        return isvalidblackPawn(position , startX , startY , endX , endY);
    }
    if(current === "wp"){
        return isvalidwhitePawn(position , startX , startY , endX , endY);
    }
    if(current.endsWith("r")){
        return isvalidrook(position ,startX , startY , endX , endY);
    }
    if(current.endsWith("n")){
        return isvalidknight(position ,startX , startY , endX , endY);
    }
    if(current.endsWith("q")){
        return isvalidqueen(position ,startX , startY , endX , endY);
    }
    if(current.endsWith("k")){
        return isvalidking(position ,startX , startY , endX , endY) || canCastle(position, current[0], startX, startY, endX, endY);
    }
    if(current.endsWith("b")){
        return isvalidbishop(position ,startX , startY , endX , endY);
    }

    return false;

}




const pieces = {
  br: "♜",
  bn: "♞",
  bb: "♝",
  bq: "♛",
  bk: "♚",
  bp: "♟",

  wr: "♖",
  wn: "♘",
  wb: "♗",
  wq: "♕",
  wk: "♔",
  wp: "♙"
};

const[select , setSelect] = useState({x: null , y: null});


const[turn , setturn] = useState("w")

const[cpwhite , setcpwhite] = useState([]);
const[cpblack , setcpblack] = useState([]);
const[ history , sethistory] = useState([]);
const [gameStatus, setGameStatus] = useState("KEEP PLAYING");
const[promo , getpromo] = useState(false);
const[data , setdata] = useState(null);
const [hasMoved, setHasMoved] = useState({
    wk: false,
    bk: false,
    wra: false, 
    wrh: false, 
    bra: false, 
    brh: false  
});

const [whiteTime, setWhiteTime] = useState(10 * 60);
const [blackTime, setBlackTime] = useState(10 * 60);

useEffect(() => {
    if (
        gameStatus === "CHECKMATE" ||
        gameStatus === "STALEMATE" ||
        gameStatus === "TIMEOUT"
    ) return;

    const timer = setInterval(() => {
        if (turn === "w") {
            setWhiteTime(prev => Math.max(0, prev - 1));
        } else {
            setBlackTime(prev => Math.max(0, prev - 1));
        }
    }, 1000);

    return () => clearInterval(timer);

}, [turn, gameStatus]);

useEffect(() => {
    if (whiteTime === 0 || blackTime === 0) {
        setGameStatus("TIMEOUT");
    }
}, [whiteTime, blackTime]);





function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0")
    );
}

function promotion(piece){
    if (!data) return;

   const {x , y , color} = data

    const newBoard = board.map(row => [...row]);

    newBoard[x][y] = color + piece;

    setBoard(newBoard);
    getpromo(false);
    setdata(null);

    

    

    const nextTurn = color === "w" ? "b" : "w";
    setturn(nextTurn);
    setGameStatus(getGameStatus(newBoard, nextTurn));

}




function findKing(position ,turn) {
    for (let x = 0; x < 8; x++){
        for (let y = 0; y < 8; y++) {
                    if (position[x][y] === turn + "k") {
                        return { x, y };
                    }
                }
    } 
                
            
    return null;
}
            

function isKingInCheck(position ,turn) {
    const king = findKing(position ,turn);

    if (king === null) return false;

    const opponent = turn === "w" ? "b" : "w";

    return isSquareAttacked(position , king.x , king.y , opponent);
}


function isSquareAttacked(position ,targetX , targetY , byColor) {
    

 

    for (let x = 0; x < 8; x++) {
        for (let y = 0; y < 8; y++) {
            const piece = position[x][y];

            if( piece === null ) continue;

            if(piece[0] !== byColor) continue;

            if((piece) === "bp"){
                if(targetX === x + 1 && Math.abs(targetY - y) === 1){
                    return true;                                                      // Capture
                }
                continue;
            }
            if((piece) === "wp"){
                if( targetX === x - 1 && Math.abs(targetY - y) === 1 ){
                    return true;                                                      // Capture
                }
                continue;
            }

                let attacked = false;

                if (piece.endsWith("r")) {
                    attacked = isvalidrook(position ,x, y, targetX, targetY);
                } else if (piece.endsWith("n")) {
                    attacked = isvalidknight(position ,x, y, targetX, targetY);
                } else if (piece.endsWith("b")) {
                    attacked = isvalidbishop(position ,x, y, targetX, targetY);
                } else if (piece.endsWith("q")) {
                    attacked = isvalidqueen(position ,x, y, targetX, targetY);
                } else if (piece.endsWith("k")) {
                    attacked = isvalidking(position ,x, y, targetX, targetY);
                }

                if (attacked) return true;

    
            }
    }    
            return false;
}

function re(){
    setSelect({x:null , y:null})
    
}

function getCoordinates(x , y){
    
    const files = "abcdefgh";

    return files[y] + (8 - x);

}

function movePiece(x , y ,z , w){

    if (!isvalidmove(board,
        x,
        y,
        z,
        w
    )) {
        re();
        return;
    }

    const cp = board[z][w];

    let pt = getCoordinates(x , y)
    let nt = getCoordinates(z , w)

    const move = {
        currp: board[x][y],
        from: `( ${pt} )`,
        to: `( ${nt} )`,
        postp: board[z][w],
        castling: board[x][y].endsWith("k") && Math.abs(w - y) === 2
        ? (w === 6 ? "O-O" : "O-O-O")
        : null
    }
    



    const newBoard = board.map(row => [...row]);

    

    const Piece = newBoard[x][y]
    newBoard[x][y] = null
    newBoard[z][w] = Piece

  
if (Piece.endsWith("k") && Math.abs(w - y) === 2) {
    const row = x;

    if (w === 6) {
        // Kingside: rook moves from h-file to f-file
        newBoard[row][5] = newBoard[row][7];
        newBoard[row][7] = null;
    }
    else if (w === 2) {
        // Queenside: rook moves from a-file to d-file
        newBoard[row][3] = newBoard[row][0];
        newBoard[row][0] = null;
    }
}

    if (isKingInCheck(newBoard, turn)) {
                re();
                return;
            }


setHasMoved(prev => {
    const updated = { ...prev };

    // King moved
    if (Piece === "wk") updated.wk = true;
    if (Piece === "bk") updated.bk = true;

    // If white castles
    if (Piece === "wk" && w === 6) updated.wrh = true;
    if (Piece === "wk" && w === 2) updated.wra = true;

    // If black castles
    if (Piece === "bk" && w === 6) updated.brh = true;
    if (Piece === "bk" && w === 2) updated.bra = true;

    // Rook moved from original square
    if (Piece === "wr" && x === 7 && y === 0) updated.wra = true;
    if (Piece === "wr" && x === 7 && y === 7) updated.wrh = true;

    if (Piece === "br" && x === 0 && y === 0) updated.bra = true;
    if (Piece === "br" && x === 0 && y === 7) updated.brh = true;

    // Original rook captured
    if (cp === "wr" && z === 7 && w === 0) updated.wra = true;
    if (cp === "wr" && z === 7 && w === 7) updated.wrh = true;

    if (cp === "br" && z === 0 && w === 0) updated.bra = true;
    if (cp === "br" && z === 0 && w === 7) updated.brh = true;

    return updated;
});            



    if( (newBoard[z][w] === "bp" && z === 7 ) || ( newBoard[z][w] === "wp" && z === 0) ){
         

        if( cp !== null ){
        if(cp[0] == "w"){
        setcpwhite(prev => [...prev , cp])
        }
        if(cp[0] == "b"){
            setcpblack(prev => [...prev , cp])
        }
        }
        sethistory(prev => [...prev , move])    


        setBoard(newBoard)
        setdata({
            x: z,
            y: w,
            color: turn
        }) 
        getpromo(true);
        re();
        return;   


    }
    





   
    if( cp !== null ){
        if(cp[0] == "w"){
        setcpwhite(prev => [...prev , cp])
        }
        if(cp[0] == "b"){
            setcpblack(prev => [...prev , cp])
        }
    }
    sethistory(prev => [...prev , move])

    setBoard(newBoard); 
    
    
    const nextTurn = turn === "w" ? "b" : "w";
    setturn(nextTurn);
    
    const status = getGameStatus(newBoard, nextTurn)
    setGameStatus(status);

    re();

}







function canCastle(position, color, startX, startY, endX, endY) {
    const row = color === "w" ? 7 : 0;
    const opponent = color === "w" ? "b" : "w";

   
    if (startX !== row || startY !== 4 || endX !== row) {
        return false;
    }

   
    if (hasMoved[color + "k"]) return false;


    if (isKingInCheck(position, color)) return false;


    if (endY === 6) {
        if (hasMoved[color + "rh"]) return false;

        
        if (position[row][7] !== color + "r") return false;

    
        if (
            position[row][5] !== null ||
            position[row][6] !== null
        ) return false;

        
        if (
            isSquareAttacked(position, row, 5, opponent) ||
            isSquareAttacked(position, row, 6, opponent)
        ) return false;

        return true;
    }

    
    if (endY === 2) {
        if (hasMoved[color + "ra"]) return false;

    
        if (position[row][0] !== color + "r") return false;

        
        if (
            position[row][1] !== null ||
            position[row][2] !== null ||
            position[row][3] !== null
        ) return false;

    
        if (
            isSquareAttacked(position, row, 3, opponent) ||
            isSquareAttacked(position, row, 2, opponent)
        ) return false;

        return true;
    }

    return false;
}






















function set(x  , y){
    setSelect({x , y});
}


function handleSquareClick( x , y  ){

    if (gameStatus === "CHECKMATE" ||
        gameStatus === "STALEMATE"|| 
        gameStatus === "TIMEOUT") {
        return;
    }

    if (promo) return;

    let current = board[x][y];
    if(select.x === x && select.y === y){
        re();
        return;
    }
    if( select.x === null){
        if( current !== null && current[0] === turn){
            setSelect({x , y})
        }

        return;

    }   

    const selectedPiece = board[select.x][select.y];

    if (
        current !== null &&
        current[0] === selectedPiece[0]
    ) {
        setSelect({ x, y });
        return;
    }
    
    

    

    movePiece(select.x , select.y , x , y);
       

}


function hasLegalMoves(position , turn){
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = position[i][j];
            if (piece === null || piece[0] !== turn) continue;

            for (let x = 0; x < 8; x++) {
                for (let y = 0; y < 8; y++) {
                    if (!isvalidmove(position, i, j, x, y)) continue;
                    const nextPosition = position.map(row => [...row]);

                    const movingPiece = nextPosition[i][j];

                    nextPosition[x][y] = movingPiece;
                    nextPosition[i][j] = null;

                    // Simulate rook movement during castling
                    if (movingPiece.endsWith("k") && Math.abs(y - j) === 2) {
                        if (y === 6) {
                            nextPosition[i][5] = nextPosition[i][7];
                            nextPosition[i][7] = null;
                        } else if (y === 2) {
                            nextPosition[i][3] = nextPosition[i][0];
                            nextPosition[i][0] = null;
                        }
                    }

                    if (!isKingInCheck(nextPosition, turn)) return true;    
                }
            }
        }
    }

    return false;
}


function getGameStatus(position, turn) {
    if(isKingInCheck(position , turn) == true && hasLegalMoves(position  ,turn) == false){
        return "CHECKMATE";
    }
    else if(isKingInCheck(position , turn) == false && hasLegalMoves(position  ,turn) == false){
        return "STALEMATE";
    }
    else if (isKingInCheck(position , turn) == true && hasLegalMoves(position  ,turn) == true){
        return "CHECK";
    }
    else{
        return "KEEP PLAYING";
    }
}

  return (
    <>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">
                Turn: {turn === "w" ? "White ⚪" : "Black ⚫"}
            </h3>
        </div>

        <div className="mb-3">
            <h3 className="font-semibold mb-1">White Captured ({cpwhite.length})</h3>
            <div className="flex gap-2 text-2xl">
                {cpwhite.map((piece, index) => (
                    <span key={index}>{pieces[piece]}</span>
                ))}
            </div>
        </div>

        <div className="mb-4">
            <h3 className="font-semibold mb-1">Black Captured ({cpblack.length})</h3>
            <div className="flex gap-2 text-2xl">
                {cpblack.map((piece, index) => (
                    <span key={index}>{pieces[piece]}</span>
                ))}
            </div>
        </div>    
        

        <div className="flex justify-between gap-6">

            <div className="rounded-lg bg-gray-900 p-4 text-white">
                <h3>White</h3>
                <h2 className="text-3xl font-bold">
                    {formatTime(whiteTime)}
                </h2>
            </div>

            <div className="rounded-lg bg-gray-900 p-4 text-white">
                <h3>Black</h3>
                <h2 className="text-3xl font-bold">
                    {formatTime(blackTime)}
                </h2>
            </div>

        </div>
        

        <h2 className="inline-flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700 shadow-sm">
            {gameStatus === "TIMEOUT"
                ? `TIME OUT! ${turn === "w" ? "Black" : "White"} wins`
                : gameStatus === "CHECKMATE"
                ? `CHECKMATE! ${turn === "w" ? "Black" : "White"} wins`
                : gameStatus === "STALEMATE"
                ? "STALEMATE! It's a draw"
                : gameStatus === "CHECK"
                ? `${turn === "w" ? "White" : "Black"} is in check`
                : `${turn === "w" ? "White" : "Black"} to move`
            }
        </h2>

            
                 { promo && <div className="absolute left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white p-4 shadow-xl">
                    <h2 className="mb-3 text-center font-bold">Promote Pawn</h2>

                    <div className="flex gap-3">
                    {["q", "r", "b", "n"].map((piece, i) => (
                        <button
                        key={i}
                        onClick={() => {promotion(piece)}}
                        className="rounded-md bg-gray-200 p-3 text-3xl hover:bg-amber-300"
                        >
                        {pieces[(data?.color || "w") + piece]}
                        </button>
                    ))}
                    </div>
                </div>
                }
                
            


        <div className="absolute top-5 right-5 w-56 max-h-400px overflow-y-auto rounded-xl border border-gray-700 bg-[#1e1e1e] p-4 text-white shadow-lg">
            <h2>HISTORY</h2>
            {history.map((x , y) => (
                
                <div key={y}>
                    {y+1}.{x.castling ? x.castling : `${pieces[x.currp]} ${x.from} → ${x.to}`} {x.postp && " X"} 
                </div>
                
            ))}
        </div>

        

    <div className='ChessBoard'>
            {board.map((row , x) => 
             row.map((col , y) => (
                
                <div className={select.x === x && select.y === y ? ( x + y ) % 2 === 0 ? "Selectedblack" : "Selectedwhite" : ( x + y ) % 2 === 0 ? "black" : "white"}
                     key={`${x}--${y}`}
                     onClick={ () => handleSquareClick(x , y) }
                >
                    {pieces[col]}
                </div>
            )))}
    </div>
    </>
  );
}

export default ChessBoard

