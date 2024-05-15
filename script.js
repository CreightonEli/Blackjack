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
let dealerPointSum = 0
let turn = 1
let standing = false

// Game Structure:
// - [x] player is dealt first card
// - [x] dealer card is dealt face down
// - [x] player card is dealt again
// - [x] dealer card is dealt face up
// - [/] player hits as much as they want (until bust or blackjack) or stays
// - [] dealer reveals hidden card
// - [] if dealer hand total is below 17 then draw a card until total is above 16

// Win/Lose Conditions:
// - [x] player wins if player hand is greater than dealer hand
// - [] dealer wins if dealer hand is greater than player hand or is blackjack
// - [/] player or dealer loses if hand is greater than 21

function renderCards(deckObj, i, player) {
    // creates image path string
    const cardsImgPath = "/images/cards/" + deckObj.cards[i].code + ".png"
    // adds to path to current faces array index
    face = cardsImgPath
    
    // creates cardEl div element as variable
    let cardEl = document.createElement("div")
    let hiddenCardEl = document.createElement("div")    
    // draws card with src of stored cardsImgPath and adds id = i
    cardEl.classList.add('card-slot') // adds "card-slot" class to cardEl div
    hiddenCardEl.classList.add('card-slot') // adds "card-slot" class to hiddenCardEl div
    cardEl.innerHTML = '<div class="card"><img class="card-back" src="/images/cards/back.png"><img class="card-face" src="' + face + '" id="' + i + '"></div>' // adds children to "cardEl" div
    hiddenCardEl.innerHTML = '<div class="hidden"><img class="card-back" src="/images/cards/back.png"><img class="card-face" src="/images/cards/X2.png" id="' + i + '"></div></div>' // adds children to "hiddenCardEl" div

    if (player === "player") {
        hand.appendChild(cardEl) // adds that cardEl div along with it's nested element to PLAYER "hand"
    }
    else if (player === "dealer" && turn === 2) {
        dealerHand.appendChild(hiddenCardEl) // adds that cardEl div along with it's nested element to DEALER "hand"
    }
    else if (player === "dealer") {
        dealerHand.appendChild(cardEl) // adds that cardEl div along with it's nested element to DEALER "hand"
    }
}

// dealer draws cards to dealer hand
function dealerDraw() {
    const domainStr = "https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=" + cardAmount

    // call API and construct deck object:
    fetch(domainStr)
        .then(response => {
            return response.json()
        })
        .then(deckObj => {
            const cardsLength = deckObj.cards.length // grabs amount of cards drawn in 1 go around
            deckID = deckObj.deck_id // grabs deck ID from deck object fetched

            // Assigning proper integer values to cards drawn to dealer deck and adding points to DEALER hand
            if (deckObj.cards[0].value === "ACE" && dealerPointSum + 11 <= 21) { // if ace card is drawn and hand sum doesn't break 21 then it is worth 11 points
                dealerPointSum += 11
            }
            else if (deckObj.cards[0].value === "ACE" && dealerPointSum + 11 > 21) { // if ace card is drawn and hand sum does break 21 then it is worth 1 point
                dealerPointSum += 1
            }
            else if (deckObj.cards[0].value === "JACK" || deckObj.cards[0].value === "QUEEN" || deckObj.cards[0].value === "KING") { // if face card is drawn it is worth 10 points
                dealerPointSum += 10
            }
            else { // if the card drawn is not an ace or face card then parse the integer value of card and add to the sum of the hand
                dealerPointSum += parseInt(deckObj.cards[0].value)
            }

            // console logs lol
            console.log("Dealer's Turn " + turn + "\n===============\nDeck ID: " + deckID + "\nCurrent card value: " + deckObj.cards[0].value + "\nPlayer total: " + pointSum + "\nDealer total: " + dealerPointSum)
            
            // renders all drawn cards
            for (i = 0; i < cardsLength; i++) {
                renderCards(deckObj, i, "dealer")
            }
            
            if (turn === 2) {
                hit()
            }
            else if (standing === true) {
                stand()
                console.log(standing)
            }
        })
        .catch(error => {
            console.log(error)
        })
}

// player draws cards to player hand
function hit() {
    const domainStr = "https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=" + cardAmount

    // call API and construct deck object:
    fetch(domainStr)
        .then(response => {
            return response.json()
        })
        .then(deckObj => {
            const cardsLength = deckObj.cards.length // grabs amount of cards drawn in 1 go
            deckID = deckObj.deck_id // grabs deck ID from deck object fetched

            // Assigning proper integer values to cards drawn and adding them to PLAYER hand
            if (deckObj.cards[0].value === "ACE" && pointSum + 11 <= 21) { // if ace card is drawn and hand sum doesn't break 21 then it is worth 11 points
                pointSum += 11
            }
            else if (deckObj.cards[0].value === "ACE" && pointSum + 11 > 21) { // if ace card is drawn and hand sum does break 21 then it is worth 1 point
                pointSum += 1
            }
            else if (deckObj.cards[0].value === "JACK" || deckObj.cards[0].value === "QUEEN" || deckObj.cards[0].value === "KING") { // if face card is drawn it is worth 10 points
                pointSum += 10
            }
            else { // if the card drawn is not an ace or face card then parse the integer value of card and add to the sum of the hand
                pointSum += parseInt(deckObj.cards[0].value)
            }

            // bunch of random console logs (CAN and maybe should DELETE LATER)
            console.log("Player's Turn " + turn + "\n===============\nDeck ID: " + deckID + "\nCurrent card value: " + deckObj.cards[0].value + "\nPlayer total: " + pointSum + "\nDealer total: " + dealerPointSum)

            // renders all drawn cards
            for (i = 0; i < cardsLength; i++) {
                renderCards(deckObj, i, "player")
                // console.log(cardsLength + " card drawn.")
            }

            // Win/Lose condition check:
            if (pointSum > 21) { // lose condition
                winLoseEl.textContent = "Bust!"
                // remove hit button and replace with replay button
                // reveal hidden dealer card
                console.log()
            }
            else if (pointSum === 21) { // win condition
                winLoseEl.textContent = "Blackjack!"
                // remove hit button and replace with replay button
                // reveal hidden dealer card
                console.log()
            }
            else if (pointSum === 21 && dealerPointSum === 21) {
                winLoseEl.textContent = "Push!"
                // remove hit button and replace with replay button
                // reveal hidden dealer card
            }
            else if (pointSum < 21 && turn === 5) { // Five Card Charlie: player wins if they draw 5 cards without going out
                winLoseEl.textContent = "Five Card Charlie!"
                // remove hit button and replace with replay button
                // reveal hidden dealer card
                console.log()
            }
            
            // render points to screen
            pointEl.innerHTML = pointSum

            // if turn is 1 or 2 call dealer draw function, else continue:
            if (turn === 1 || turn === 2) {
                dealerDraw()
            }

            // increment turn number
            turn += 1
        })
        .catch(error => {
            console.log(error)
        })
}

function stand() {
    // reveal dealer cards
    // if dealer sum is less than 17 then draw more cards until it is more
    standing = true
    console.log(standing + ", you stand...")
    if (dealerPointSum < 17) {
        dealerDraw()
        console.log("dealer draws...\ndealer sum is " + dealerPointSum)
    }
    else {
        // check for win if player's pointSum is greater than the dealer's dealerPointSum or loss if vice versa
        if (pointSum > dealerPointSum) {
            winLoseEl.textContent = "You win!"
            // remove hit button and replace with replay button
            // reveal hidden dealer card
            }
        else if (pointSum < dealerPointSum) {
            winLoseEl.textContent = "You lose!"
            // remove hit button and replace with replay button
            // reveal hidden dealer card
            }
        else {
            winLoseEl.textContent = "Push!"
            // remove hit button and replace with replay button
            // reveal hidden dealer card
        }
    }
}

// shuffle deck reset all variables and clear rendered hands
function replay() {
    const domainStr = "https://deckofcardsapi.com/api/deck/" + deckID + "/shuffle/"

    fetch(domainStr)
       .then(response => {
            return response.json()
        })
        .then(deckObj => {
            cardAmount = 1
            faces = []
            pointSum = 0
            dealerPointSum = 0
            turn = 1
            standing = false

            // come back to this

            play()
        })
        .catch(error => {
            console.log(error)
        })
}