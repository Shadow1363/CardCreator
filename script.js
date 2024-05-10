// Width x Height
const C_WIDTH = 250;
const C_HEIGHT = C_WIDTH * 1.4;
let cardsLoaded = false;

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

function card(obj) {
  const C_TYPE = obj.Type;
  const C_NAME = obj.Name;
  const C_COST = obj.Cost;
  const C_ATTACK = obj.Attack;
  const C_HEALTH = obj.Health;
  if (!C_TYPE || !C_NAME || !C_COST) {
    return;
  }
  const C = document.createElement("canvas");
  document.body.appendChild(C);
  C.id = `card_${obj.ID}`;
  C.className = "card";
  C.style.borderRadius = `${C_WIDTH * 0.04}px`;
  C.style.border = `${C_WIDTH * 0.008}px solid #000000`;
  C.width = C_WIDTH;
  C.height = C_HEIGHT;
  const CTX = C.getContext("2d");

  let cFlavor = `${obj.Quote}`;
  let cAbility = `${obj.Abilities}`;
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

  // Click to delete
  C.addEventListener("click", function () {
    document.body.removeChild(C);
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

  const largeCanvas = document.createElement("canvas");
  const ctx = largeCanvas.getContext("2d");

  largeCanvas.width = smallCanvasElements.length * C_WIDTH;
  largeCanvas.height = C_HEIGHT;
  for (let i = 0; i < smallCanvasElements.length; i++) {
    const smallCanvas = smallCanvasElements[i];
    const smallCtx = smallCanvas.getContext("2d");
    ctx.drawImage(smallCtx.canvas, i * C_WIDTH, 0);
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
    let data = parseTSV(tsvString);
    for (let i = 0; i < data.length; i++) {
      console.log(data[i])
      card(data[i]);
      if (data[i].Rarity != "Legendary") {
        card(data[i]);
      }
    }
    cardsLoaded = true;
  };
  reader.readAsText(file);
});

document.addEventListener("keydown", function (event) {
  if (event.key === "e" && cardsLoaded) {
    largeImage();
  }
});

setInterval(function () {
  let cards = document.getElementsByClassName("card");
  document.getElementById("totalCards").textContent =
    "Total Cards: " + cards.length;
});


// https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D
