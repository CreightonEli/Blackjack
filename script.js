const tableEl = document.querySelector("#table-el")
const cardFace = document.querySelector(".card-face")

window.onload = () => {
    draw();
}

function draw() {
    fetch("https://deckofcardsapi.com/api/deck/new/draw/?count=1")
        .then(response => {
            return response.json();
        })
        .then(deckData => {
            console.log(deckData);
            const cardsImgURL = deckData.cards[0].image;
            cardFace.src = cardsImgURL;
            console.log(cardsImgURL)
        })
        .catch(error => {
            console.log(error);
        })
}