const flop = document.querySelector(".flop")
const cardFace = document.querySelector(".card-face") // can't find
const hitBtn = document.querySelector("#hit-btn")
let cardAmount = 5;

window.onload = () => {
    play()
}

// drawCards():
// - Creates card-slot element and nested elements
// - Neat solution but a bit slow.
// -----------------------------------------------
// function drawCards(deckObj) {
//     const cardsLength = deckObj.cards.length
//     let cardEl = document.createElement("div")
    
//     for (i = 0; i < cardsLength; i++) {
//         cardEl.classList.add('card-slot')
//         cardEl.innerHTML = '<div class="card"><img class="card-back" src="https://deckofcardsapi.com/static/img/back.png"><img class="card-face" src="https://github.com/crobertsbmw/deckofcards/blob/master/static/img/X2.png?raw=true"></div>'
//         flop.appendChild(cardEl)
//         console.log("good")
//     }
// }

function renderFace(deckObj) {
    const cardsLength = deckObj.cards.length
    
    for (i = 0; i < cardsLength; i++) {
        const cardsImgURL = deckObj.cards[i].image
        cardFace.src = cardsImgURL
        console.log(cardsImgURL)
    }
}

function play() {
    const domainStr = "https://deckofcardsapi.com/api/deck/new/draw/?count="
    // call API and construct deck object:
    fetch(domainStr + cardAmount)
        .then(response => {
            return response.json()
        })
        .then(deckObj => { // game loop runs in here
            console.log(deckObj)
            // drawCards(deckObj)
            renderFace(deckObj)
        })
        .catch(error => {
            console.log(error)
        })
}