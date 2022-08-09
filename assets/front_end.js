"use strict;"

const function_type = 'function';

// http://deckofcardsapi.com/
let cardApiData = {
    'deckIdent': document.cookie,
    'urlPrefix': 'http://deckofcardsapi.com/api/deck/',
    'urlPostfix': '/draw/',
    'params': {'count': 5}
}


getNewCardHand(fetchNewDeck=false);
document.getElementById('draw_from_deck').onclick = drawCards;

function addImageElement(imgsrc, value) {
    var card = document.createElement('img');
    card.src = imgsrc;
    card.innerHTML = value;
    return card;
}

// getNewCardHand()
// params: fetchNewDeck (bool) - defines whether the request should obtain a new deck
// return: void
function getNewCardHand(fetchNewDeck=false) {
    let fetchURL;
    if (fetchNewDeck) fetchURL = cardApiData.urlPrefix.concat('new', cardApiData.urlPostfix);
    else fetchURL = cardApiData.urlPrefix.concat(cardApiData.deckIdent, cardApiData.urlPostfix);

    jQuery.ajax({
        type: 'GET',
        url: fetchURL,
        dataType: 'json',
        data: cardApiData.params,
        cache: false,
        error: function (response) {
            console.log("jQuery.ajax could not complete the query.");
            console.log(response);
        },
        success: function (obj) {
            if ('success' in obj && obj.success) {
                console.log(obj);
                let currentCardHandSection = document.getElementById('current_card_hand');
                // clearing currentCardHandSection before adding new cards
                currentCardHandSection.replaceChildren();
                
                // removed outer 'if' statement to reduce complexity
                // if statement left as addImageElement hint?
                // if (typeof addImageElement === function_type) {

                let sortedArr = sortCards(obj.cards);

                for (let i = 0; i < sortedArr.length; i++) {
                    let cardImageElement = addImageElement(
                        sortedArr[i].image, 
                        sortedArr[i].value
                    );
                    currentCardHandSection.appendChild(cardImageElement);
                }
                
                

                document.getElementById('current_card_deck').innerHTML = obj.deck_id;
                document.getElementById('deck_count_remaining').innerHTML = obj.remaining;

                document.cookie = obj.deck_id;
                return cardApiData.deckIdent = obj.deck_id, document.cookie;
            } else {
                console.log({'success': false, 'feelingsOnTheMatter': '😑'});
            }
        }
    });
}


// drawCards()
// params: none
// return: none
function drawCards() {
    console.log('Drawing new cards!')
    if (document.getElementById('deck_count_remaining').innerHTML < 5) {
        console.log("Oops, need a fresh deck!");
        getNewCardHand(fetchNewDeck=true);
    } else {
        getNewCardHand(fetchNewDeck=false);
    }
}

//helper function for sortCards
function setCardValues(cardObj){
    switch (cardObj.value) {
        case 'ACE':
            cardObj.value = 14;
            break;
        case 'KING':
            cardObj.value = 13;
            break;
        case 'QUEEN':
            cardObj.value = 12;
            break;
        case 'JACK':
            cardObj.value = 11;
            break;
        case '10':
            cardObj.value = 10;
            break;
    }
}

function sortCards(obj) {
    let cardsArr = [];
    for (i in obj) {
        // setting values of face cards to int & str to int
        setCardValues(obj[i]);
        obj[i].value = parseInt(obj[i].value);
        cardsArr.push(obj[i]);
    }

    // source: https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
    cardsArr.sort((a,b) => (a.value < b.value) ? 1 : (b.value < a.value) ? -1 : 0);
    return cardsArr;
}


// BEWARE: YOU ARE NOW ENTERING THE CODE GRAVEYARD


// tried a lower-complexity function but did not work
// function setCardValues2(cardObj){
//     if (cardObj.value == 'ACE') {
//         cardObj.value = 14;
//     } else if (cardObj.value == 'KING') {
//         cardObj.value = 13;
//     } else if (cardObj.value == 'QUEEN') {
//         cardObj.value = 12;
//     } else if (cardObj.value == 'JACK') {
//         cardObj.value = 11;
//     } else {
//         cardObj.value = 10;
//     }
// }


// console.log('line 93:', document.getElementById('current_card_deck').innerHTML);
// // cardApiData.deckIdent = document.getElementById('current_card_deck').innerHTML;
// console.log('line 96, ', cardApiData.deckIdent);

// helper function for sortCards()
// function setCardValues(cardObj) {
//     if (cardObj.textContent == "ACE") {
//         return cardObj.textContent = '40';
//     }
// };

// semi-working function:
// function sortCards() {
//     let cardsArr;
//     let currentCardHandSection = document.getElementById('current_card_hand');
//     let unsorted = currentCardHandSection.children;
//     cardsArr = Array.from(unsorted);

//     // console.log('unsorted:', unsorted);
//     // console.log(cardsArr[2]['textContent']);
//     cardsArr.sort((a,b) => (a.textContent < b.textContent) ? 1 : (b.textContent < a.textContent) ? -1 : 0);
//     console.log('sorted cardsArr:',cardsArr, cardsArr.length);
    
//     unsortedArr = Array.from(unsorted);
//     console.log("unsortedArr:",unsortedArr, unsortedArr.length);

//     for (let i = 0; i < cardsArr.length; i++) {
//         console.log(cardsArr[i]);
//         // currentCardHandSection.replaceChild(cardsArr[i], unsortedArr[i]);
//         currentCardHandSection.appendChild(cardsArr[i]);
//     };

//     // child = currentHand.removeChild(currentHand.firstChild);
//     // console.log('child:', child, 'child type:', typeof child);
// };