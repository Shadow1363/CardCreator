// Width x Height
const C_WIDTH = 250;
const C_HEIGHT = C_WIDTH * 1.4;

// Other Vars
let cardsLoaded = false;
let allCards = [];
let deck = [];
// #FFC138 - Orange
// #FFEC66 - Yellow

// Functions
function flavorSplit(str) {
  if (str.includes("-")) {
    var index = str.lastIndexOf("-");
    return [str.slice(0, index), str.slice(index)];
  } else {
    let arr = [str, ""];
    return arr;
  }
}

function abilitySplit(str) {
  if (str.length > 30) {
    let index = str.indexOf(",");
    return [str.slice(0, index + 1), str.slice(index + 1)];
  } else {
    let arr = [str, ""];
    return arr;
  }
}

function createCard(obj) {
  const C_ID = obj.ID;
  if (!C_ID) {
    return;
  }
  const C_TYPE = obj.Type;
  const C_NAME = obj.Name;
  const C_COST = obj.Cost;
  const C_ATTACK = obj.Attack;
  const C_HEALTH = obj.Health;
  const C_ABILITY = obj.Abilities;
  const C_FLAVOR = obj.Quote;
  const C_RARITY = obj.Rarity;

  const C = document.createElement("canvas");
  document.getElementById("displayZone").appendChild(C);
  C.id = C_ID;
  C.className = "card";
  C.style.borderRadius = `${C_WIDTH * 0.04}px`;
  C.style.border = `${C_WIDTH * 0.008}px solid #000000`;
  C.width = C_WIDTH;
  C.height = C_HEIGHT;
  const CTX = C.getContext("2d");

  let cFlavor = C_FLAVOR;
  let cAbility = C_ABILITY;
  cFlavor = flavorSplit(cFlavor);
  cAbility = abilitySplit(cAbility);

  // Background Color
  let cMain = "";
  let cSecondary = "";
  if (C_TYPE.toLowerCase() == "water") {
    cMain = "#00A6A6";
    cSecondary = "#BBDEF0";
  } else if (C_TYPE.toLowerCase() == "fire") {
    cMain = "#EC4E20";
    cSecondary = "#FEC0AA";
  } else if (C_TYPE.toLowerCase() == "nature") {
    cMain = "#51CB20";
    cSecondary = "#76B041";
  } else if (C_TYPE.toLowerCase() == "light") {
    cMain = "#E6D3A3";
    cSecondary = "#F6FEDB";
  } else if (C_TYPE.toLowerCase() == "dark") {
    cMain = "#643173";
    cSecondary = "#333333";
  } else if (C_TYPE.toLowerCase() == "magic") {
    cMain = "#49306B";
    cSecondary = "#635380";
  } else {
    cMain = "#7A7D7D";
    cSecondary = "#FFFBFE";
  }

  // Name
  CTX.fillStyle = cMain;
  CTX.fillRect(C_WIDTH * 0.2, 0, C_WIDTH * 0.8, C_WIDTH * 0.2);
  CTX.fillStyle = "#000000";
  CTX.font = `${C_WIDTH * 0.16}px 'Bai Jamjuree'`;
  CTX.fillText(C_NAME, C_WIDTH * 0.21, C_WIDTH * 0.16, C_WIDTH * 0.79);

  // Cost
  CTX.fillStyle = cSecondary;
  CTX.fillRect(0, 0, C_WIDTH * 0.2, C_WIDTH * 0.2);
  CTX.fillStyle = "#000000";
  CTX.font = `${C_WIDTH * 0.2}px 'Bai Jamjuree'`;
  CTX.fillText(` ${C_COST}`, 0, C_WIDTH * 0.17, C_WIDTH * 0.2);

  // Image
  CTX.fillStyle = cSecondary;
  CTX.fillRect(0, C_WIDTH * 0.2, C_WIDTH, C_WIDTH * 0.8);

  // Footer
  CTX.fillStyle = cMain;
  CTX.fillRect(0, C_WIDTH, C_WIDTH, C_WIDTH * 0.8);

  // Attack
  CTX.fillStyle = cSecondary;
  CTX.fillRect(0, C_WIDTH * 1.2, C_WIDTH * 0.2, C_WIDTH * 0.2);
  CTX.fillStyle = "#000000";
  CTX.font = `${C_WIDTH * 0.2}px 'Bai Jamjuree'`;
  CTX.fillText(` ${C_ATTACK}`, 0, C_WIDTH * 1.37, C_WIDTH * 0.2);

  // Health
  CTX.fillStyle = cSecondary;
  CTX.fillRect(C_WIDTH * 0.2, C_WIDTH * 1.2, C_WIDTH * 0.2, C_WIDTH * 0.2);
  CTX.fillStyle = "#000000";
  CTX.font = `${C_WIDTH * 0.2}px 'Bai Jamjuree'`;
  CTX.fillText(` ${C_HEALTH}`, C_WIDTH * 0.2, C_WIDTH * 1.37, C_WIDTH * 0.2);

  // Abilities
  CTX.fillStyle = "#000000";
  CTX.font = `${C_WIDTH * 0.08}px 'Bai Jamjuree'`;
  CTX.fillText(cAbility[0], 0, C_WIDTH * 1.07, C_WIDTH);

  CTX.fillStyle = "#000000";
  CTX.font = `${C_WIDTH * 0.08}px 'Bai Jamjuree'`;
  CTX.fillText(cAbility[1], 0, C_WIDTH * 1.17, C_WIDTH);

  // Flavor
  CTX.fillStyle = "#000000";
  CTX.font = `italic ${C_WIDTH * 0.08}px 'Bai Jamjuree'`;
  CTX.fillText(cFlavor[0], C_WIDTH * 0.4, C_WIDTH * 1.27, C_WIDTH * 0.6);

  CTX.fillStyle = "#000000";
  CTX.font = `italic ${C_WIDTH * 0.08}px 'Bai Jamjuree'`;
  CTX.fillText(cFlavor[1], C_WIDTH * 0.4, C_WIDTH * 1.37, C_WIDTH * 0.6);

  C.addEventListener("click", function () {
    deck.push({
      ID: C_ID,
      Cost: C_COST,
      Attack: C_ATTACK,
      Health: C_HEALTH,
      Abilities: C_ABILITY,
      Quote: C_FLAVOR,
      Rarity: C_RARITY,
      Type: C_TYPE,
      Name: C_NAME,
    });
    console.log(deck);
    document.getElementById("totalDeck").textContent =
      "Total Cards in Deck: " + deck.length;
  });
}

function parseTSV(tsvString) {
  let lines = tsvString.split("\n");
  let headers = lines[0].split("\t");
  let data = lines.slice(1).map((line) => {
    let values = line.split("\t");
    let row = {};
    headers.forEach((header, index) => {
      let headerFix = header.replace("\r", "");
      row[headerFix] = values[index];
    });
    return row;
  });
  return data;
}

function largeImage() {
  const smallCanvasElements = document.getElementsByClassName("card");
  const CARDS_PER_ROW = 10;

  const largeCanvas = document.createElement("canvas");
  const ctx = largeCanvas.getContext("2d");

  largeCanvas.width = CARDS_PER_ROW * C_WIDTH;
  largeCanvas.height =
    C_HEIGHT * Math.ceil(smallCanvasElements.length / CARDS_PER_ROW);

  for (let i = 0; i < smallCanvasElements.length; i++) {
    const smallCanvas = smallCanvasElements[i];
    const smallCtx = smallCanvas.getContext("2d");
    const x = (i % CARDS_PER_ROW) * C_WIDTH;
    const y = Math.floor(i / CARDS_PER_ROW) * C_HEIGHT;
    ctx.drawImage(smallCtx.canvas, x, y);
  }

  const dataUrl = largeCanvas.toDataURL("image/png");

  const link = document.createElement("a");
  link.download = "canvasImage.png";
  link.href = dataUrl;
  link.click();
}

document.getElementById("tsvFile").addEventListener("change", function (evt) {
  let file = evt.target.files[0];
  let reader = new FileReader();
  reader.onload = function (e) {
    let tsvString = e.target.result;
    allCards = parseTSV(tsvString);
    for (let i = 0; i < allCards.length; i++) {
      createCard(allCards[i]);
    }
    cardsLoaded = true;
    document.getElementById("totalCards").textContent =
      "Total Cards: " + document.getElementsByClassName("card").length;
    console.log(allCards);
  };
  reader.readAsText(file);
});

function download() {
  let cards = document.getElementsByClassName("card");

  if (cardsLoaded) {
    while (cards.length > 0) {
      cards[0].parentNode.removeChild(cards[0]);
    }
    for (let i = 0; i < deck.length; i++) {
      createCard(deck[i]);
    }
    largeImage();
  }
}

function search() {
  const idCard = document.getElementById("idCard").checked;
  const typeCard = document.getElementById("typeCard").checked;
  const nameCard = document.getElementById("nameCard").checked;
  const abilityCard = document.getElementById("abilityCard").checked;

  const flavorCard = document.getElementById("flavorCard").checked;
  const costCard = document.getElementById("costCard").checked;
  const healthCard = document.getElementById("healthCard").checked;
  const attackCard = document.getElementById("attackCard").checked;
  const rarityCard = document.getElementById("rarityCard").checked;

  let searchCard = document.getElementById("searchCard").value;
  let cards = document.getElementsByClassName("card");

  if (searchCard !== "") {
    while (cards.length > 0) {
      cards[0].parentNode.removeChild(cards[0]);
    }
    for (let i = 0; i < allCards.length; i++) {
      if (
        !idCard &&
        !typeCard &&
        !nameCard &&
        !abilityCard &&
        !flavorCard &&
        !costCard &&
        !healthCard &&
        !attackCard &&
        !rarityCard
      ) {
        createCard(allCards[i]);
      } else if (
        (allCards[i].ID.toLowerCase().includes(searchCard.toLowerCase()) &&
          idCard) ||
        (allCards[i].Type.toLowerCase().includes(searchCard.toLowerCase()) &&
          typeCard) ||
        (allCards[i].Name.toLowerCase().includes(searchCard.toLowerCase()) &&
          nameCard) ||
        (allCards[i].Abilities.toLowerCase().includes(
          searchCard.toLowerCase()
        ) &&
          abilityCard) ||
        (allCards[i].Quote.toLowerCase().includes(searchCard.toLowerCase()) &&
          flavorCard) ||
        (allCards[i].Cost.toLowerCase().includes(searchCard.toLowerCase()) &&
          costCard) ||
        (allCards[i].Health.toLowerCase().includes(searchCard.toLowerCase()) &&
          healthCard) ||
        (allCards[i].Attack.toLowerCase().includes(searchCard.toLowerCase()) &&
          attackCard) ||
        (allCards[i].Rarity.toLowerCase().includes(searchCard.toLowerCase()) &&
          rarityCard)
      ) {
        createCard(allCards[i]);
      }
    }
    document.getElementById("totalCards").textContent =
      "Total Cards: " + cards.length;
  }
}

// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
// Chart.Js
/*
const xValues = [
  "Warrior",
  "Magic",
  "Light",
  "Dark",
  "Nature",
  "Fire",
  "Water",
];
const yValues = [55, 49, 44, 24, 15];
const barColors = ["#b91d47", "#00aba9", "#2b5797", "#e8c3b9", "#1e7145"];

new Chart("typeSpread", {
  type: "doughnut",
  data: {
    labels: xValues,
    datasets: [
      {
        backgroundColor: barColors,
        data: yValues,
      },
    ],
  },
  options: {
    title: {
      display: false,
    },
  },
});
*/
