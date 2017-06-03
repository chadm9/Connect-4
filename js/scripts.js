

$(document).ready(function () {

    var gameNotOver = true;
    var playersTurn = true;
    var alpha = -10000;
    var beta = 10000;
    var playerToken = 'red';
    var cpuToken = 'black';
    var availableMoves = [[5,0], [5,1], [5,2], [5,3], [5,4], [5,5], [5,6]];
    var depth = 7;
    var maximizer = true;

    var board = [[null, null, null, null, null, null, null],
                 [null, null, null, null, null, null, null],
                 [null, null, null, null, null, null, null],
                 [null, null, null, null, null, null, null],
                 [null, null, null, null, null, null, null],
                 ['open', 'open', 'open', 'open', 'open', 'open', 'open']];

    var newBoard = copyBoard(board);
    var initialAvailableMoves = copyAvailableMoves(availableMoves);

    var goard = [[null, null, null, null, 'red', 'red', 'red'],
        [null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null],
        ['black', null, null, null, null, null, null],
        ['black', null, null, null, null, null, null],
        ['black', 'black', 'black', 'open', 'open', 'red', 'red']];

    var boardMap = {a0: [0,0], a1:[1,0], a2:[2,0], a3:[3,0], a4:[4,0], a5:[5,0],
                    b0: [0,1], b1:[1,1], b2:[2,1], b3:[3,1], b4:[4,1], b5:[5,1],
                    c0: [0,2], c1:[1,2], c2:[2,2], c3:[3,2], c4:[4,2], c5:[5,2],
                    d0: [0,3], d1:[1,3], d2:[2,3], d3:[3,3], d4:[4,3], d5:[5,3],
                    e0: [0,4], e1:[1,4], e2:[2,4], e3:[3,4], e4:[4,4], e5:[5,4],
                    f0: [0,5], f1:[1,5], f2:[2,5], f3:[3,5], f4:[4,5], f5:[5,5],
                    g0: [0,6], g1:[1,6], g2:[2,6], g3:[3,6], g4:[4,6], g5:[5,6]
    };

    function heuristic(board) {
        boardCopy = copyBoard(board);
        playerThreats = 0;
        cpuThreats = 0;
        for(var i = 0; i < 6; i++){
            for(var j = 0; j < 7; j++){
                if(boardCopy[i][j] === null || boardCopy[i][j] === 'open'){
                    boardCopy[i][j] = playerToken;
                    if(evaluateState(boardCopy) === -1000){
                        playerThreats++;
                    }
                    boardCopy[i][j] = null;
                    boardCopy[i][j] = cpuToken;
                    if(evaluateState(boardCopy) === 1000){
                        cpuThreats++;
                    }
                    boardCopy[i][j] = null

                }
            }
        }
        return 100*cpuThreats - 100*playerThreats
    }

    function minimax(board, availableMoves, depth, alpha, beta, maximizer) {

        var currentValue = evaluateState(board);
        var bestValue;
        if (currentValue === 1000 || currentValue === -1000) {
            return currentValue;
        }


        if (availableMoves.length === 0) {
            return 0;
        }

        if(depth === 0){
            return heuristic(board);
        }


        if (maximizer) {
            bestValue = -10000;
            for (var i = 0; i < availableMoves.length; i++) {
                var boardCopy = copyBoard(board);
                var availableMovesCopy = copyAvailableMoves(availableMoves);
                updateBoard(boardCopy, availableMovesCopy[i], availableMovesCopy, false);
                bestValue = Math.max(minimax(boardCopy, availableMovesCopy, depth - 1, alpha, beta, !maximizer), bestValue);
                alpha = Math.max(bestValue, alpha);
                if(beta <= alpha){
                    break;
                }

            }
            return bestValue;
        }
        else{
            bestValue = 10000;
            for (var i = 0; i < availableMoves.length; i++) {
                var boardCopy = copyBoard(board);
                var availableMovesCopy = copyAvailableMoves(availableMoves);
                updateBoard(boardCopy, availableMovesCopy[i], availableMovesCopy, true);
                bestValue = Math.min(minimax(boardCopy, availableMovesCopy, depth - 1, alpha, beta, !maximizer), bestValue);
                beta = Math.min(bestValue, beta);
                if(beta <= alpha){
                    break;
                }
            }
            return bestValue;
        }

    }

    function determineMove(board, availableMoves) {
        var bestMove = [null, null];
        var highestMoveValue = -10000;


        for (var i = 0; i < availableMoves.length; i++) {
            var availableMovesCopy = copyAvailableMoves(availableMoves);

            var boardCopy = copyBoard(board);
            updateBoard(boardCopy, availableMovesCopy[i], availableMovesCopy, false);
            moveValue = minimax(boardCopy, availableMovesCopy, depth - 1, -10000, 10000, !maximizer);

            if (highestMoveValue < moveValue) {
                highestMoveValue = moveValue;
                bestMove[0] = availableMoves[i][0];
                bestMove[1] = availableMoves[i][1];
                    }
        }
        return bestMove
    }

    function copyBoard(board){
        var boardCopy = [];
        for(var i = 0; i < 6; i++){
            boardCopy.push(board[i].slice())
        }
        return boardCopy;
    }
    function copyAvailableMoves(availableMoves) {
        var availableMovesCopy = [];
        for(var i = 0; i < availableMoves.length; i++){
            availableMovesCopy.push(availableMoves[i].slice())
        }
        return availableMovesCopy;
    }

    function updateBoard(board, move, availableMoves, playersTurn){
        if(playersTurn){
            board[move[0]][move[1]] = playerToken;
        }else{
            board[move[0]][move[1]] = cpuToken;
        }
        for(var i = 0; i < availableMoves.length; i++){
            if(move[0] === availableMoves[i][0]  && move[1] === availableMoves[i][1]){
                availableMoves.splice(i,1);
            }
        }
        if(move[0] !== 0){
            board[move[0]-1][move[1]] = 'open';
            availableMoves.push([move[0]-1, move[1]]);
        }
    }

    function evaluateState(board){
        var currentToken;
        var previousToken;

        //check rows for victory
        for(var i = 0; i < 6; i++){
            previousToken = board[i][0];
            var tokensInARow = 1;
            for(var j = 1; j < 7; j++){
                currentToken = board[i][j];
                if((currentToken === previousToken)){
                    tokensInARow++;
                    if(tokensInARow === 4){
                        if(currentToken === playerToken){
                            return -1000;
                        }else if(currentToken === cpuToken){
                            return 1000;
                        }
                    }
                }else{
                    previousToken = currentToken;
                    tokensInARow = 1;
                }
            }
        }
        //check columns for victory
        for(var i = 0; i < 7; i++){
            previousToken = board[0][i];
            tokensInARow = 1;
            for(var j = 1; j < 6; j++){
                currentToken = board[j][i];
                if((currentToken === previousToken)){
                    tokensInARow++;
                    if(tokensInARow === 4){
                        if(currentToken === playerToken){
                            return -1000;
                        }else if(currentToken === cpuToken){
                            return 1000;
                        }
                    }
                }else{
                    previousToken = currentToken;
                    tokensInARow = 1;
                }
            }
        }

        //check a3 rightward diagonal for victory
        tokensInARow = 1;
        for(i = 1; i < 4; i++){
            previousToken = board[3][0];
            currentToken = board[3-i][i];
            if(currentToken === previousToken){
                tokensInARow++;
            }else{
                break;
            }
            if(tokensInARow === 4){
                if(currentToken === playerToken){
                    return -1000;
                }else if(currentToken === cpuToken){
                    return 1000;
                }
            }

        }
        //check g3 leftward diagonal for victory
        tokensInARow = 1;
        for(i = 1; i < 4; i++){
            previousToken = board[3][6];
            currentToken = board[3-i][6-i];
            if(currentToken === previousToken){
                tokensInARow++;
            }else{
                break;
            }
            if(tokensInARow === 4){
                if(currentToken === playerToken){
                    return -1000;
                }else if(currentToken === cpuToken){
                    return 1000;
                }
            }

        }

        //check d5 rightward diagonal for victory
        tokensInARow = 1;
        for(i = 1; i < 4; i++){
            previousToken = board[5][3];
            currentToken = board[5-i][3+i];
            if(currentToken === previousToken){
                tokensInARow++;
            }else{
                break;
            }
            if(tokensInARow === 4){
                if(currentToken === playerToken){
                    return -1000;
                }else if(currentToken === cpuToken){
                    return 1000;
                }
            }

        }

        //check d5 leftward diagonal for victory
        tokensInARow = 1;
        for(i = 1; i < 4; i++){
            previousToken = board[5][3];
            currentToken = board[5-i][3-i];
            if(currentToken === previousToken){
                tokensInARow++;
            }else{
                break;
            }
            if(tokensInARow === 4){
                if(currentToken === playerToken){
                    return -1000;
                }else if(currentToken === cpuToken){
                    return 1000;
                }
            }

        }

        //check a4 diagonal for victory
        tokensInARow = 1;
        previousToken = board[4][0];
        for(i = 1; i < 5; i++){

            currentToken = board[4-i][i];
            if(currentToken === previousToken){
                tokensInARow++;
            }else{
                previousToken = currentToken;
                tokensInARow =1;
            }
            if(tokensInARow === 4){
                if(currentToken === playerToken){
                    return -1000;
                }else if(currentToken === cpuToken){
                    return 1000;
                }
            }

        }


        //check g4 leftward diagonal for victory
        tokensInARow = 1;
        previousToken = board[4][6];
        for(i = 1; i < 5; i++){

            currentToken = board[4-i][6-i];
            if(currentToken === previousToken){
                tokensInARow++;
            }else{
                previousToken = currentToken;
                tokensInARow =1;
            }
            if(tokensInARow === 4){
                if(currentToken === playerToken){
                    return -1000;
                }else if(currentToken === cpuToken){
                    return 1000;
                }
            }

        }

        //check c5 rightward diagonal for victory
        tokensInARow = 1;
        previousToken = board[5][2];
        for(i = 1; i < 5; i++){

            currentToken = board[5-i][2+i];
            if(currentToken === previousToken){
                tokensInARow++;
            }else{
                previousToken = currentToken;
                tokensInARow =1;
            }
            if(tokensInARow === 4){
                if(currentToken === playerToken){
                    return -1000;
                }else if(currentToken === cpuToken){
                    return 1000;
                }
            }

        }

        //check e5 leftward diagonal for victory
        tokensInARow = 1;
        previousToken = board[5][4];
        for(i = 1; i < 5; i++){

            currentToken = board[5-i][4-i];
            if(currentToken === previousToken){
                tokensInARow++;
            }else{
                previousToken = currentToken;
                tokensInARow =1;
            }
            if(tokensInARow === 4){
                if(currentToken === playerToken){
                    return -1000;
                }else if(currentToken === cpuToken){
                    return 1000;
                }
            }

        }

        //check a5 rightward diagonal for victory
        tokensInARow = 1;
        previousToken = board[5][0];
        for(i = 1; i < 6; i++){

            currentToken = board[5-i][i];
            if(currentToken === previousToken){
                tokensInARow++;
            }else{
                previousToken = currentToken;
                tokensInARow =1;
            }
            if(tokensInARow === 4){
                if(currentToken === playerToken){
                    return -1000;
                }else if(currentToken === cpuToken){
                    return 1000;
                }
            }

        }

        //check g5 leftward diagonal for victory
        tokensInARow = 1;
        previousToken = board[5][6];
        for(i = 1; i < 6; i++){

            currentToken = board[5-i][6-i];
            if(currentToken === previousToken){
                tokensInARow++;
            }else{
                previousToken = currentToken;
                tokensInARow =1;
            }
            if(tokensInARow === 4){
                if(currentToken === playerToken){
                    return -1000;
                }else if(currentToken === cpuToken){
                    return 1000;
                }
            }

        }

        //check b5 rightward diagonal for victory
        tokensInARow = 1;
        previousToken = board[5][1];
        for(i = 1; i < 6; i++){

            currentToken = board[5-i][1+i];
            if(currentToken === previousToken){
                tokensInARow++;
            }else{
                previousToken = currentToken;
                tokensInARow =1;
            }
            if(tokensInARow === 4){
                if(currentToken === playerToken){
                    return -1000;
                }else if(currentToken === cpuToken){
                    return 1000;
                }
            }

        }

        //check f5 leftward diagonal for victory
        tokensInARow = 1;
        previousToken = board[5][5];
        for(i = 1; i < 6; i++){

            currentToken = board[5-i][5-i];
            if(currentToken === previousToken){
                tokensInARow++;
            }else{
                previousToken = currentToken;
                tokensInARow =1;
            }
            if(tokensInARow === 4){
                if(currentToken === playerToken){
                    return -1000;
                }else if(currentToken === cpuToken){
                    return 1000;
                }
            }

        }


        //the game is tied
        return 0;
    }

    Object.prototype.getKey = function(value) {
        var object = this;
        for(var key in object){
            if(object[key][0]==value[0]  && object[key][1]==value[1]){
                return key;
            }
        }
    };

    function checkResult(board, availableMoves) {
        if(evaluateState(board) === -1000){
            $('#title').html('You Win!');
            gameNotOver = false;
        }else if(evaluateState(board) === 1000){
            $('#title').html('You Lose...');
            gameNotOver = false;
        }else if(availableMoves.length === 0){
            $('#title').html('Draw.');
            gameNotOver = false;
        }
        if(!gameNotOver){
            $('#restart').css('visibility', 'visible');
        }
    }

    //console.log(heuristic(goard));

    function animateSlots() {
        var columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
        notFinished = true;
        var i = 0;
        var j = 0;
        var k  = 1;
        currentColumn = columns[i];
        currentRow = 0;



        var animate = setInterval(function () {
            currentColumn = columns[i];
            $('#' + currentColumn + currentRow).css('visibility', 'visible');
            $('#' + currentColumn + currentRow).css('animation', 'bubbles 0.15s 1');

            i++;

            if(i%7===0) {

                currentRow += 1;
                i=0;
                currentColumn = currentColumn[i];
            }
            if(currentRow >= 6){
                clearInterval(animate);
            }

        }, 55);
    }

    animateSlots();

    $('.slot').click(function () {
        if(board[boardMap[this.id][0]][boardMap[this.id][1]]  === 'open'){
            if(playersTurn && gameNotOver){
                //$(this).css('background', playerToken);
                $(this).css('display', 'none');
                $('#' + this.id + '-container').append('<img class="faces" src="images/purple-face.png">');

                updateBoard(board, boardMap[this.id], availableMoves, true);

                // $(this).css('border', 'none');
                checkResult(board, availableMoves);
                // if(evaluateState(board) === -1000){
                //     $('#title').html('You Win!')
                // }

                playersTurn = false;


                setTimeout(function () {
                    if(gameNotOver){
                        cpuMove = determineMove(board, availableMoves);
                        //$('#' + boardMap.getKey(cpuMove)).css('background', cpuToken);
                        $('#' + boardMap.getKey(cpuMove)).css('display', 'none');
                        $('#' + boardMap.getKey(cpuMove) + '-container').append('<img class="faces" src="images/red-face.png">');


                        updateBoard(board, cpuMove, availableMoves, false);
                        checkResult(board, availableMoves);
                        // if(evaluateState(board) === 1000){
                        //     $('#title').html('You Lose...')
                        // }
                        playersTurn = true;
                    }
                },25);



            }


        }
    });




    $('.slot').hover(function () {
        if(board[boardMap[this.id][0]][boardMap[this.id][1]]  === 'open' && gameNotOver) {
            $(this).css('background', 'rgba(135,206,250,0.5)');
        }
    }, function () {
        if(board[boardMap[this.id][0]][boardMap[this.id][1]]  === 'open') {
            $(this).css('background', 'rgba(75,0,130,0.5)');
        }
    });

    $('#restart').click(function () {
        if(!gameNotOver){
            board = copyBoard(newBoard);
            availableMoves = copyAvailableMoves(initialAvailableMoves);
            $('.faces').remove();
            $('.slot').each(function () {
                $(this).css('background', 'rgba(75,0,130,0.5)');
                $(this).css('display', 'grid');

            });
            gameNotOver = true;
            playersTurn = true;
            $('#title').html('Connect-4');
            $('#restart').css('visibility', 'hidden');


        }
    })

});



