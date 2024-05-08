const hand = document.querySelector(".hand")
const cardFace = document.querySelector(".card-face")
const hitBtn = document.querySelector("#hit-btn")
const pointEl = document.querySelector('#point-el')
const winLoseEl = document.querySelector('#win-lose-el')
const dealerHand = document.querySelector(".dealer-hand")

let cardAmount = 1
let deckID = "new"
let faces = []
let pointSum = 0
let turn = 0

// Game Structure:
// - [x] player is dealt first card
// - [] dealer card is dealt face down
// - [] player card is dealt again
// - [] dealer card is dealt face up
// - [] player hits as much as they want (until bust or blackjack) or stays
// - [] dealer reveals hidden card
// - [] if dealer hand total is below 17 then draw a card until total is above 16

// Win/Lose Conditions:
// - [] player wins if player hand is greater than dealer hand
// - [] dealer wins if dealer hand is greater than player hand or is blackjack
// - [/] player or dealer loses if hand is greater than 21

function drawCard(deckObj, i) {
    let cardEl = document.createElement("div")

    // creates image path string and adds to faces array
    const cardsImgPath = "/images/cards/" + deckObj.cards[i].code + ".png"
    faces[i] = cardsImgPath
    // console.log(faces[i])
    
    // draws card with src of stored cardsImgPath and adds id = i
    cardEl.classList.add('card-slot')
    cardEl.innerHTML = '<div class="card"><img class="card-back" src="/images/cards/back.png"><img class="card-face" src="' + faces[i] + '" id="' + i + '"></div>'
    hand.appendChild(cardEl)
}

function hit() {
    const domainStr = "https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=" + cardAmount
    // call API and construct deck object:
    fetch(domainStr)
        .then(response => {
            return response.json()
        })
        .then(deckObj => { // game runs in here
            const cardsLength = deckObj.cards.length
            deckID = deckObj.deck_id
            // Assigning proper integer values to cards drawn
            if (deckObj.cards[0].value === "ACE" && pointSum + 11 <= 21) {
                pointSum += 11
                console.log("Ace is BIG")
            }
            else if (deckObj.cards[0].value === "ACE" && pointSum + 11 > 21) {
                pointSum += 1
                console.log("Ace is SMALL")
            }
            else if (deckObj.cards[0].value === "JACK" || deckObj.cards[0].value === "QUEEN" || deckObj.cards[0].value === "KING") {
                pointSum += 10
                console.log("FACE is 10")
            }
            else {
                console.log("Just numbers")
                pointSum += parseInt(deckObj.cards[0].value)
            }
            console.log("Card value: " + deckObj.cards[0].value)
            console.log("Total: " + pointSum)
            // console.log("Deck ID: " + deckID)
            console.log(deckObj)
            for (i = 0; i < cardsLength; i++) {
                drawCard(deckObj, i)
                // console.log(cardsLength + " card drawn.")
            }
            if (pointSum > 21) {
                winLoseEl.textContent = "Out"
            }
            else if (pointSum === 21) {
                winLoseEl.textContent = "Win"
            }
            pointEl.innerHTML = pointSum
            turn += 1
            console.log("Turn: " + turn)
            // draw five cards to win (five card charlie) unless dealer draws blackjack
        })
        .catch(error => {
            console.log(error)
        })
}