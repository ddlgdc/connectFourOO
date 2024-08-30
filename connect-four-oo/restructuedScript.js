// player classs to repres. each plyr with a color 
class Player {
    constructor( color ) {
        this.color = color; // stores color for the player
    }
}

// game class to mng the game
class Game {

    // constructor
    constructor( height = 6, width = 7, p1Color = 'red', p2Color = 'blue' ) {
        this.height = height;                       // height of game 
        this.width = width;                         // width of game
        this.board = [];                            // 2d array of game board
        this.currPlayer = new Player( p1Color );    // player 1
        this.otherPlayer = new Player( p2Color );   // player 2
        this.gameOver = false;                      // flag to indicate end game
        this.makeBoard();                           // creates game arr
        this.makeHtmlBoard();                       // creates html structure
    }


    // methods 
    // initializes the board 
    makeBoard() {
        for ( let y = 0; y < this.height; y++ ) {
            // initialies eahc row as an arr of undefined vals
            this.board.push( Array.from({ length: this.width })); 
        }
    }

    // creates html structure
    makeHtmlBoard() {
        const board = document.getElementById( 'board' ); // gets board elment
        board.innerHTML = ''; // clears any existing board html

        const top = document.createElement( 'tr' );
        top.setAttribute( 'id', 'column-top' );
         // attach event listners for clicks
        top.addEventListener( 'click', this.handleClick.bind( this ));

        for ( let x = 0; x < this.width; x++ ) {
            const headCell = document.createElement( 'td' );
            headCell.setAttribute( 'id', x ); // sets id to the column index
            top.append( headCell );
        }

        board.append( top );

        // creates rows for the game
        for ( let y = 0; y < this.height; y++ ) {
            const row = document.createElement( 'tr' ); // creates table row

            for ( let x = 0; x < this.width; x++ ) {
                const cell = document.createElement( 'td' ); //creats a table cell
                cell.setAttribute( 'id', `${y}-${x}` ); // sets id to row-colomn index
                row.append( cell );
            }

            board.append( row );
        }
    }

    // handles the click even when plyr sleects a col
    handleClick( evt ) {
        if ( this.gameOver ) return; // exit game if game is over

        const x = +evt.target.id; // gets the column index from clicked elements id
        const y = this.findSpotForCol( x ); // find next avail. row in col
        if ( y === null ) { // exit if col is full
            return;
        }

        this.board[y][x] = this.currPlayer; // place the curr players piece on board
        this.placeInTable( y, x ); // add the piece to the html table

        if ( this.checkForWin() ) { // checks if curr player has won
            this.gameOver = true; // set game over flag
            setTimeout(() => alert( `${this.currPlayer.color} player won !` ), 10);
            return;
        }

        if ( this.board.every( row => row.every( cell => cell ))) { // check if board is full
            this.gameOver = true; // set game over flag
            setTimeout(() => alert( 'tie!' ), 10);
            return;
        }
        
        // swap players
        [this.currPlayer, this.otherPlayer] = [this.otherPlayer, this.currPlayer]; 
    }

    // finds the lowest available row in a col
    findSpotForCol( x ) {
        for ( let y = this.height - 1; y >= 0; y-- ) {
            if ( !this.board[y][x] ) { // checks if cell is empty 
                return y; // return the row index if cell is empty
            }
        }
        return null; // return null if col is full
    }

    // places the plkayers piece in the html table
    placeInTable( y, x ) {
        const piece = document.createElement( 'div' );
        piece.classList.add( 'piece' ); // add the piece class
        piece.style.backgroundColor = this.currPlayer.color; // set piece color
        piece.style.top = -50 * ( y + 1 ); // position the piece (animation effect)

        const spot = document.getElementById( `${y}-${x}` ); // get the cell elmenet
        spot.append( piece );
    }

    // checks if theres a winning condition on the board
    checkForWin() {
        // helper func to check if all cells in the arr have same player
        const _win = ( cells ) =>
            cells.every(
                ( [y, x] ) =>
                y >= 0 &&
                y < this.height &&
                x >= 0 &&
                x < this.width &&
                // chekc if all cells match the current player
                this.board[y][x] === this.currPlayer 
            );

            
        // check all possible win conditions
        for ( let y = 0; y < this.height; y++ ) {
            for ( let x = 0; x < this.width; x++ ) {
                const horiz = [
                    [y, x],
                    [y, x + 1],
                    [y, x + 2],
                    [y, x + 3],
                ];
                const vert = [
                    [y, x],
                    [y + 1, x],
                    [y + 2, x],
                    [y + 3, x],
                ];
                const diagDR = [
                    [y, x],
                    [y + 1, x + 1],
                    [y + 2, x + 2],
                    [y + 3, x + 3],
                ];
                const diagDL = [
                    [y, x],
                    [y + 1, x - 1],
                    [y + 2, x - 2],
                    [y + 3, x - 3],
                ];

                // checks if any condition is met 
                if ( _win(horiz) ||_win(vert) || _win(diagDR) || _win(diagDL )) {
                    return true; // return true if there is a win
                }
            }
        }
    }  
}

// start the game when btn is clicked
document.getElementById('start-game').addEventListener('click', () => {
    const p1Color = document.getElementById( 'p1-color' ).value;
    const p2Color = document.getElementById( 'p2-color' ).value;
    new Game( 6, 7, p1Color, p2Color );
});