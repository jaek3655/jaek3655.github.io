
var Game = function() {
    this.playersGuess = null;
    this.winningNumber = generateWinningNumber();
    this.pastGuesses = [];
    this.hintUsed = false;
    this.attempt = 0;
}

function generateWinningNumber() {
    return Math.ceil(Math.random()*100);
}


function newGame() {
    return new Game(); //check that old game !== new game
}

Game.prototype.difference = function() {
    return Math.abs(this.playersGuess-this.winningNumber);
}

Game.prototype.isLower = function() {
    return this.playersGuess < this.winningNumber;
}

Game.prototype.playersGuessSubmission = function(guess) {
    if(isNaN(guess) || guess < 1 || guess > 100) {
        return "That is an invalid guess.";
    }
    this.playersGuess = guess;
    return this.checkGuess();
}


Game.prototype.provideHint = function() {
    var hintArray = [this.winningNumber, generateWinningNumber(), generateWinningNumber(), generateWinningNumber()];
    return shuffle(hintArray);

}

function shuffle(arr) { //Fisher-Yates - https://bost.ocks.org/mike/shuffle/
   for(var i = arr.length-1; i > 0; i--) {
       var randomIndex = Math.floor(Math.random() * (i + 1));
       var temp = arr[i];
       arr[i] = arr[randomIndex];
       arr[randomIndex] = temp;
    }
    return arr;
}


Game.prototype.checkGuess = function() {
    this.attempt ++;
    if(this.playersGuess===this.winningNumber) {
        $('#hint, #submit, #player-input').prop("disabled",true);
        $('#subtitle').text("Click Reset to play again!")
        this.pastGuesses.push(this.playersGuess);
        $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
        return 'You Win! Score: ' + this.scoreGenerator();
    }
    else {
        if(this.pastGuesses.indexOf(this.playersGuess) > -1) {
            return 'You already guessed that.';
        }
        else {
            this.pastGuesses.push(this.playersGuess);
            $('#guess-list li:nth-child('+ this.pastGuesses.length +')').text(this.playersGuess);
            if(this.pastGuesses.length === 5) {
                $('#hint, #submit, #player-input').prop("disabled",true);
                $('#subtitle').text("The number is " + this.winningNumber + ". Your luck may be in the next round.");
                return 'You Lose';
            }
            else {
                var diff = this.difference();
                if(this.isLower()) {
                    $('#subtitle').text("Guess Higher!")
                } else {
                    $('#subtitle').text("Guess Lower!")
                }
                if(diff < 7) return "You're burning up!";
                else if(diff < 13) return "That's pretty close";
                else if(diff < 50) return "Eh, not close at all";
                else return "That is a terrible guess";
            }
        }
    }
}


function makeAGuess(game) {
    var guess = $('#player-input').val();
    $('#player-input').val("");
    var output = game.playersGuessSubmission(parseInt(guess, 10));
    $('#title').text(output);
}


Game.prototype.scoreGenerator = function() {
    var hintPenalty = 0;
    if (this.hintUsed) {hintPenalty = 20}
    return 100 - (this.attempt-1) * 10 - hintPenalty;
}


$(document).ready(function() {
    var game = new Game();

    $('#submit').click(function(e) {
       makeAGuess(game);
    })

    $('#player-input').keypress(function(event) {
        if ( event.which == 13 ) {
           makeAGuess(game);
        }
    })

    $('#hint').click(function() {
        if (!(game.hintUsed)) {
            var hints = game.provideHint().sort();
            $('#title').text('One of: ' +hints[0]+ ', ' +hints[1]+ ', ' +hints[2]+ ', ' +hints[3]);
            game.hintUsed = true;
            $('#hint').prop("disabled", true);
        }


    })

    $('#reset').click(function() {
        game = newGame();
        $('#title').text('Lucky?');
        $('#subtitle').text('Guess a number between 1~100!')
        $('.guess').text('-');
        $('#hint, #submit, #player-input').prop("disabled",false);
    })
})



