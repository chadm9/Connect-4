

$(document).ready(function () {

    var whosTurn = 'player';
    var playerToken = 'red';
    var cpuToken = 'black';

    var board = [[null, null, null, null, null, null, null],
                 [null, null, null, null, null, null, null],
                 [null, null, null, null, null, null, null],
                 [null, null, null, null, null, null, null],
                 [null, null, null, null, null, null, null],
                 ['open', 'open', 'open', 'open', 'open', 'open', 'open']];

    var boardMap = {a0: [0,0], a1:[1,0], a2:[2,0], a3:[3,0], a4:[4,0], a5:[5,0],
                    b0: [0,1], b1:[1,1], b2:[2,1], b3:[3,1], b4:[4,1], b5:[5,1],
                    c0: [0,2], c1:[1,2], c2:[2,2], c3:[3,2], c4:[4,2], c5:[5,2],
                    d0: [0,3], d1:[1,3], d2:[2,3], d3:[3,3], d4:[4,3], d5:[5,3],
                    e0: [0,4], e1:[1,4], e2:[2,4], e3:[3,4], e4:[4,4], e5:[5,4],
                    f0: [0,5], f1:[1,5], f2:[2,5], f3:[3,5], f4:[4,5], f5:[5,5],
                    g0: [0,6], g1:[1,6], g2:[2,6], g3:[3,6], g4:[4,6], g5:[5,6]
    };

    $('.slot').click(function () {
        if(board[boardMap[this.id][0]][boardMap[this.id][1]]  === 'open'){
            if(whosTurn === 'player'){
                $(this).css('background', playerToken);
                whosTurn = 'cpu';
            }else{
                $(this).css('background', cpuToken);
                whosTurn = 'player';
            }

        }
    })

});



