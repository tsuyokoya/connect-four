/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
let board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */
const makeBoard = () => {
  for(let y = 0; y < HEIGHT; y++){
    board.push([]);
    for(let x = 0; x < WIDTH; x++){
      board[y].push(null);
    }
  }
}

/** handleClick: handle click of column top to play piece */
const handleClick = (evt) => {
  // get x from ID of clicked cell
  const x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  const y = findSpotForCol(x);
  if (y === undefined) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);

  //update in-memory board
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    if(currPlayer === 1) {
      return endGame(`${p1Name} won!`);
    } else {
      return endGame(`${p2Name} won!`);
    }
  }

  // check for tie
  // check if all cells in board are filled; if so call, call endGame
  const tie = board.every((row)=>{
    row.every((cell)=>{
      return cell !== null;
    })
  });
  if(tie){
    return endGame("It's a tie!")
  }
  // switch players
  currPlayer === 1 ? currPlayer = 2 : currPlayer = 1;
}

/** makeHtmlBoard: make HTML table and row of column tops. */
const htmlBoard = document.querySelector("#board");
const makeHtmlBoard = () => {
  //creates a table row with an id of #column-top
  //handles click of column top to play a piece
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  //creates table data cells that appends to each row
  //id of 0-6
  for (let x = 0; x < WIDTH; x++) {
    const headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }
  htmlBoard.append(top);

  //for each row (based on HEIGHT)
  for (let y = 0; y < HEIGHT; y++) {
    //create a table row
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      //append table data cells to each table row (based on WIDTH)
      //each table data cell has an id of "nth row - nth width"
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
}

makeHtmlBoard();

/** findSpotForCol: given column x, return top empty y (null if filled) */
const tr = document.querySelectorAll("tr");
const findSpotForCol = (x) => {
  let y;

  //loop through all cells in selected column bottom up
  //and select empty cell
  for(let i = 6; i > 0; i--){
    let td = tr[i].childNodes[x];

    //if cell is empty, return x position
    if(td.innerHTML === ''){
      return td.id[0];
    }
  }
}

/** placeInTable: update DOM to place piece into HTML table of board */

// make a div and insert into correct table cell
const placeInTable = (y, x) => {
    const piece = document.createElement("div");
    const td = document.querySelector(`[id="${y}-${x}"]`);

    piece.classList.add("piece");

    if(lotr.checked){
      if(currPlayer === 1){
        piece.classList.add("p1Lotr");
      } else {
        piece.classList.add("p2Lotr");
      }
    } else {
      if(currPlayer === 1){
        piece.classList.add("p1");
      } else {
        piece.classList.add("p2");
      }
    }
    td.append(piece);
}

/** endGame: announce game end */
const endGame = (msg) => {
  // TODO: pop up alert message
  alert(msg);
  htmlBoard.style.pointerEvents = 'none';

}

/** checkForWin: check board cell-by-cell for "does a win start here?" */

const checkForWin = () => {
  const _win = (cells) => {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) => //array destructuring, y is the first value, x is the second value
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  }

  //checks for the win in all possible four-cell combinations
  for (var y = 0; y < HEIGHT; y++) {
    for (var x = 0; x < WIDTH; x++) {
      var horiz = [[y, x], [y, x + 1], [y, x + 2], [y, x + 3]];
      var vert = [[y, x], [y + 1, x], [y + 2, x], [y + 3, x]];
      var diagDR = [[y, x], [y + 1, x + 1], [y + 2, x + 2], [y + 3, x + 3]];
      var diagDL = [[y, x], [y + 1, x - 1], [y + 2, x - 2], [y + 3, x - 3]];

      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
}

makeBoard();

//handle custom player names
const form = document.querySelector('form');
const input = document.querySelectorAll('input');
let p1Name = 'Player 1';
let p2Name = 'Player 2';

form.addEventListener("submit",(e) => {
  p1Name = e.target[0].value;
  p2Name = e.target[1].value;
  e.preventDefault();

  p1Name === '' ? p1Name = 'Player 1' : p1Name;
  p2Name === '' ? p2Name = 'Player 2' : p2Name;
  input[0].value = '';
  input[1].value = '';
})

//Reset board
const reset = document.querySelector('#reset');
reset.addEventListener('click',() => {
  //reset in-JS board
  board = [];
  makeBoard();

  for(let y = HEIGHT; y > 0; y--){
    for (let x = 0; x < WIDTH; x++){
      let td = tr[y].childNodes[x];
      td.innerHTML = '';
    }
  }
  htmlBoard.style.pointerEvents = '';
})

//change background image and piece images to Lord of the Rings theme
const body = document.querySelector('body');
const lotr = document.querySelector('#lotr');

lotr.addEventListener('click',(e) => {
  let lotrEnabled = lotr.checked;
  if(lotrEnabled) {
    body.style.backgroundImage = 'url(https://media.vanityfair.com/photos/6108358567433342b380092f/5:3/w_2000,h_1200,c_limit/lord-of-the-rings-amazon-studios.png)';
    body.style.backgroundPosition = 'center';
  } else { //reset when unchecked
    body.style.backgroundImage = '';
    body.style.backgroundPosition = '';
  }
})