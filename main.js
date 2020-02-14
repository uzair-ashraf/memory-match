$(document).ready(initializeApp);
var attempts = null;
var matches = null;
var gamesPlayed = null;
var maxMatches = 9;
var canBeClicked = true;
var firstCardClicked = null;
var secondCardClicked = null;
var imgClassNameArray = [
    "js-logo",
    "react",
    "css",
    "docker",
    "php",
    "html",
    "github",
    "node",
    "mysql"
];

function initializeApp () {
    createCards(imgClassNameArray);
    attachClickHandler();
}

function attachClickHandler() {
    $("#card-container").on("click", ".card-back", handleCardClick);
    $("#modal-close").on("click", resetGame);
}

function handleCardClick (event) {
    console.log(event);
    if(!canBeClicked){
        return;
    }
    if (firstCardClicked === null){
        firstCardClicked = $(event.currentTarget);
        console.log(firstCardClicked);
        firstCardClicked.toggleClass("hidden");
    } else {
        canBeClicked = false;
        secondCardClicked = $(event.currentTarget);
        secondCardClicked.toggleClass("hidden");
        if (firstCardClicked.next().css("background-image") === secondCardClicked.next().css("background-image")) {
            matches++;
            attempts++;
            displayStats();
            setTimeout (function() {
                firstCardClicked.next().addClass("hidden");
                secondCardClicked.next().addClass("hidden");
                firstCardClicked = null;
                secondCardClicked = null;
                canBeClicked = true
                if (matches === maxMatches) {
                    $("#win-modal").toggleClass("hidden");
                }
            }, 1000);

        } else {
            attempts++;
            displayStats();
            canBeClicked = false;
            setTimeout (function(){
                firstCardClicked.toggleClass("hidden");
                secondCardClicked.toggleClass("hidden");
                firstCardClicked = null;
                secondCardClicked = null;
                canBeClicked = true;
            },1000);
            }
        }
}

function displayStats () {
    $("#attempts > p").text(attempts);
    var accuracy = calculateAccuracy();
    $("#accuracy > p").text(`${accuracy}%`);
}

function calculateAccuracy (){
    if(!matches){
        matches = 0;
    }
    var accuracy = matches/attempts;
    var fixedAccuracy = parseInt(accuracy * 100);
    return fixedAccuracy;
}

function resetGame () {
    $(".card-back, .card").removeClass("hidden");
    gamesPlayed++;
    attempts = null;
    matches = null;
    canBeClicked = true;
    firstCardClicked = null;
    secondCardClicked = null;
    $("#games-played > p").text(gamesPlayed);
    $("#attempts > p").text(0);
    $("#accuracy > p").text(`${0}%`);
    $("#win-modal").toggleClass("hidden");
}

function shuffleCards (imgArray) {
    var fullImageArray = imgArray.concat(imgArray);

    for (var arrayIndex = fullImageArray.length-1; arrayIndex > 0; arrayIndex--) {
        var randomNum = Math.floor(Math.random() * (arrayIndex + 1));
        var tempPosition = fullImageArray[arrayIndex];
        fullImageArray[arrayIndex] = fullImageArray[randomNum];
        fullImageArray[randomNum] = tempPosition;
    }
    return fullImageArray;

}

function createCards(imgClassNameArray) {
    $("#card-container").empty();
    var cardImages = shuffleCards(imgClassNameArray);
    for(var imgIndex = 0; imgIndex < cardImages.length; imgIndex++) {
        var card = $("<div>",{
            class: "card"
        });
        var cardBack = $("<div>", {
            class: "card-back"
        });
        var cardFront = $("<div>", {
            class:`card-front ${cardImages[imgIndex]}`
        });
        $(card).append(cardBack, cardFront);
        $("#card-container").append(card);
    }
}
