const hand = document.querySelector(".hand")
const hitBtn = document.querySelector("#hit-btn")
const standBtn = document.querySelector("#stand-btn")
const replayBtn = document.querySelector("#replay-btn")
const pointEl = document.querySelector('#point-el')
const winLoseEl = document.querySelector('#win-lose-el')
const scoreEl = document.querySelector("#score-el")
const bestEl = document.querySelector("#best-el")
const dealerHand = document.querySelector(".dealer-hand")

let cardAmount = 1
let deckID = "new"
let faces = []
let j = 0
let pointSum = 0
let dealerPointSum = 0
let scoreSum = 0
let bestSum = 0
let turn = 1
let standing = false


// adds card elements to DOM
function renderCards(deckObj, i, player) {
    // creates image path string
    const cardsImgPath = "images/cards/" + deckObj.cards[i].code + ".png"
    // adds to path to current faces array index
    face = cardsImgPath

    // saves card path to array for later use
    faces[j] = cardsImgPath

    // creates cardEl div element as variable
    let cardEl = document.createElement("div")
    let hiddenCardEl = document.createElement("div")    
    // draws card with src of stored cardsImgPath and adds id = i
    cardEl.classList.add('card-slot') // adds "card-slot" class to cardEl div
    hiddenCardEl.classList.add('card-slot') // adds "card-slot" class to hiddenCardEl div
    cardEl.innerHTML = '<div class="card"><img class="card-back" src="images/cards/back.png"><img class="card-face" src="' + face + '" id="' + j + '"></div>' // adds children to "cardEl" div
    hiddenCardEl.innerHTML = '<div class="hidden"><img class="card-back" src="images/cards/back.png"><img class="card-face" src="images/cards/X2.png" id="' + j + '"></div></div>' // adds children to "hiddenCardEl" div

    if (player === "player") {
        hand.appendChild(cardEl) // adds that cardEl div along with it's nested element to PLAYER "hand"
    }
    else if (player === "dealer" && turn === 2) {
        dealerHand.appendChild(hiddenCardEl) // adds that cardEl div along with it's nested element to DEALER "hand"
    }
    else if (player === "dealer") {
        dealerHand.appendChild(cardEl) // adds that cardEl div along with it's nested element to DEALER "hand"
    }
    j++
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
            
            // renders all drawn cards
            for (i = 0; i < cardsLength; i++) {
                renderCards(deckObj, i, "dealer")
            }
            
            if (turn === 2) {
                hit()
            }
            else if (standing === true) {
                stand()
            }

            // console log for debugging
            // console.log("Dealer's Turn " + turn + "\n===============\nDeck ID: " + deckID + "\nCurrent card value: " + deckObj.cards[0].value + "\nPlayer total: " + pointSum + "\nDealer total: " + dealerPointSum)

        })
        .catch(error => {
            console.log(error)
        })
}

// reveals hidden cards
function reveal() {
    let hiddenCard = document.querySelector(".hidden")

    document.getElementById("1").src = faces[1]
    hiddenCard.classList.add("card")
}

// player draws cards to player hand
function hit() {
    const domainStr = "https://deckofcardsapi.com/api/deck/" + deckID + "/draw/?count=" + cardAmount
    hitBtn.textContent = "HIT"

    // show stand button
    standBtn.classList.remove("no-display")

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

            // renders all drawn cards
            for (i = 0; i < cardsLength; i++) {
                renderCards(deckObj, i, "player")
            }

            // Win/Lose condition check:
            if (pointSum > 21) { // lose condition
                winLoseEl.textContent = "Bust!"
                if (bestSum < scoreSum) {
                    bestSum = scoreSum
                    bestEl.textContent = bestSum
                }
                scoreSum = 0
                scoreEl.textContent = scoreSum
                hitBtn.classList.add("no-display")
                standBtn.classList.add("no-display")
                replayBtn.classList.remove("no-display")
                reveal()
            }
            else if (pointSum === 21 && dealerPointSum === 21) { // Push condition
                winLoseEl.textContent = "Push!"
                if (bestSum < scoreSum) {
                    bestSum = scoreSum
                    bestEl.textContent = bestSum
                }
                scoreSum = 0
                scoreEl.textContent = scoreSum
                hitBtn.classList.add("no-display")
                standBtn.classList.add("no-display")
                replayBtn.classList.remove("no-display")
                reveal()
            }
            else if (pointSum === 21) { // win condition
                winLoseEl.textContent = "Blackjack!"
                scoreSum += 1
                scoreEl.textContent = scoreSum
                hitBtn.classList.add("no-display")
                standBtn.classList.add("no-display")
                replayBtn.classList.remove("no-display")
                reveal()
            }
            else if (pointSum === 21 && dealerPointSum === 21) {
                winLoseEl.textContent = "Push!"
                hitBtn.classList.add("no-display")
                standBtn.classList.add("no-display")
                replayBtn.classList.remove("no-display")
                reveal()
            }
            else if (pointSum < 21 && turn === 5 && dealerPointSum != 21) { // Five Card Charlie: player wins if they draw 5 cards without going out
                winLoseEl.textContent = "Five Card Charlie!"
                scoreSum += 1
                scoreEl.textContent = scoreSum
                hitBtn.classList.add("no-display")
                standBtn.classList.add("no-display")
                replayBtn.classList.remove("no-display")
                reveal()
            }
            
            // render points to screen
            pointEl.innerHTML = pointSum

            // if turn is 1 or 2 call dealer draw function, else continue:
            if (turn === 1 || turn === 2) {
                dealerDraw()
            }

            // console log for debugging
            // console.log("Player's Turn " + turn + "\n===============\nDeck ID: " + deckID + "\nCurrent card value: " + deckObj.cards[0].value + "\nPlayer total: " + pointSum + "\nDealer total: " + dealerPointSum)

            // increment turn number
            turn += 1
        })
        .catch(error => {
            console.log(error)
        })
}

// the player stands
function stand() {
    // hide stand button and hit button
    hitBtn.classList.add("no-display")
    standBtn.classList.add("no-display")
    replayBtn.classList.remove("no-display")    

    // reveal dealer cards by adding "card" class to hidden card
    reveal()

    // if dealer sum is less than 17 then draw more cards until it is more
    standing = true
    if (dealerPointSum < 17) {
        dealerDraw()
    }
    else {
        // check for win if player's pointSum is greater than the dealer's dealerPointSum or loss if vice versa
        if (pointSum > dealerPointSum) {
            winLoseEl.textContent = "You win!"
            scoreSum += 1
            scoreEl.textContent = scoreSum
            reveal()
        }
        else if (pointSum < dealerPointSum && dealerPointSum > 21) {
            winLoseEl.textContent = "You Win!"
            scoreSum += 1
            scoreEl.textContent = scoreSum
            reveal()
        }
        else if (pointSum < dealerPointSum) {
            winLoseEl.textContent = "You lose!"
            if (bestSum < scoreSum) {
                bestSum = scoreSum
                bestEl.textContent = bestSum
            }
            scoreSum = 0
            scoreEl.textContent = scoreSum
            reveal()
        }
        else {
            winLoseEl.textContent = "Push!"
            if (bestSum < scoreSum) {
                bestSum = scoreSum
                bestEl.textContent = bestSum
            }
            scoreSum = 0
            scoreEl.textContent = scoreSum
            reveal()
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
            
            for (i = 0; i < j; i++) {
                document.querySelector(".card-slot").remove()
            }
            
            faces = []
            j = 0
            pointSum = 0
            dealerPointSum = 0
            turn = 1
            standing = false

            hitBtn.classList.remove("no-display")
            standBtn.classList.remove("no-display")
            replayBtn.classList.add("no-display")
            winLoseEl.textContent = "Total"

            hit()
        })
        .catch(error => {
            console.log(error)
        })
}