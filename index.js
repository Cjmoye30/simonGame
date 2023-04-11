// Variables
const colors = ["red", "blue", "green", "yellow"];
let computerArr = [];
const maxLevel = 20;
let level = 0;
let displayIndex = 0;
let checkIndex = 0;
let seconds = 0;
let finalSeconds = 0;
let finalLevel = level - 1;
let highscoreUsers = [];

// Event listener for the start button to initiate the game
// Begin from level 1 and start the game clock
$("#startButton").click(function () {
    level = 1;
    $("#level").text("Level: " + level);
    $("#titleSection").attr("style", "display: none");
    $("#level").attr("style", "display: block");
    $(".gameTimer").attr("style", "display: block");
    playGame();
    gameClock();
})

// Event listener for the game buttons - this essentially runs and controls the game
$(".col").click(function (e) {
    effects(e.target.id);
    if (e.target.id === computerArr[checkIndex]) {
        checkIndex++;
        if (level === checkIndex) {
            level++;
            setTimeout(function () {
                $("#level").text("Level: " + level);
                playGame();
            }, 500)
        }
    } else {
        $("#level").text("Wrong!");
        finalSeconds = seconds;
        clearInterval(gameTimer);

        $("body").attr("style", "background-color: red");
        setTimeout(() => {
            $("body").attr("style", "background-color: white");
        }, 100);

        // Show the user score and highscore sections
        setTimeout(() => {
            userScore();
            $("#gameContainer").attr("style", "display: none");
            $("#highscoresSection").attr("style", "display: block");
        }, 1000);
    }
})

$("#restart").click(function () {
    $("#highscoresSection").attr("style", "display: none");
    $("gameContainer").attr("style", "display: block")
    $("titleSection").attr("style", "display: block")
})

$("#highScoresTableLink").click(() => {
    $("#highscoresSection").attr("style", "display: block");
    $("gameContainer").attr("style", "display: none")
    $("titleSection").attr("style", "display: none")
})

// Generate game pattern at the start of the document load
function generateGamePattern() {
    for (let i = 0; i < maxLevel; i++) {
        let randNum = Math.floor(Math.random() * colors.length);
        let randColor = colors[randNum];
        computerArr.push(randColor);
    }
}

// Showing the game pattern at the start of each level
function showPattern() {
    setTimeout(function () {
        effects(computerArr[displayIndex]);
        displayIndex++;
        if (displayIndex < level) {
            showPattern();
        }

        // Decrease the time between showing the pattern to increase the difficulty
    }, 500 - (level * 10))
}

// Reset the check and display indexs so the answer check and show pattern functions are reset
function playGame() {
    checkIndex = 0;
    displayIndex = 0;
    showPattern();
}

// Effects for button click and showing the game pattern
function effects(x) {
    // Flash buttons on click or computer generate
    $("#" + x).attr("style", "background-color: whitesmoke");
    setTimeout(function () {
        $("#" + x).removeAttr("style", "background-color: whitesmoke");
    }, 100);

    // Play sound of button click or computer generate
    var audio = new Audio("assets/sounds/" + x + ".mp3")
    audio.play();
}

// Game clock for 1 second interval
function gameClock() {
    gameTimer = setInterval(() => {
        seconds++;
        $("#timer").text(seconds);
    }, 1000);
}

// Showing user score in HTML
function userScore() {
    $("#userLevel").text(level - 1);
    $("#userTime").text(finalSeconds);
}



// Event Listener to store the value of the user
$("#initials-submit-btn").click(function (e) {
    e.preventDefault();
    let userIntials = $("#initialsInput").val();

    if (userIntials.length > 10 || userIntials.length === 0) {
        $("#error").text("Invalid. Please enter in an indentified in 10 or fewer characters.");
        $("#error").attr("style", "display: block");
        setTimeout(() => {
            $("#error").attr("style", "display: none");
        }, 3000);
    } else if (highscoreUsers.includes(userIntials)) {
        $("#error").text("Those intials are already taken! Please enter a different value.");
        $("#error").attr("style", "display: block");
        setTimeout(() => {
            $("#error").attr("style", "display: none");
        }, 3000);
    } else {
        level -= 1;
        localStorage.setItem(userIntials, "Level: " + level + " Time: " + finalSeconds + " seconds");
        location.href = "highscores.html";
        // showHighscores();
    }
})

// Get all data from local storage and populate the highscores table
function showHighscores() {
    $("#highscoresTable").text("");
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        highscoreUsers.push(key);
        let value = localStorage.getItem(key);

        let highscoresEntry = $("<li>").html("<span class = 'username'>" + key + "</span> <span class='userscore'>" + value + "</span>").addClass("highscoresEntry");
        $("#highscoresTable").append(highscoresEntry);
    }
}
// Create game pattern on document load
showHighscores();
generateGamePattern();