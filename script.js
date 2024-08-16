document.addEventListener("DOMContentLoaded", async function () {
  const response = await fetch("./config.json");
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  const CONFIG = await response.json();
  const C_WIDTH = CONFIG.card.width;
  const C_HEIGHT = C_WIDTH * 1.4;
  let cardsLoaded = false;
  let deck = [];
  let allCards = [];

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

  function getColors(type) {
    const typeLower = type.toLowerCase();
    const colors = CONFIG?.types[typeLower] || CONFIG?.types["generic"];
    return {
      mainColor: colors.mainColor,
      secColor: colors.secColor,
    };
  }

  function createCard(obj) {
    const C_ID = obj?.ID;
    const C_TYPE = obj?.Type;

    if (!C_ID || !C_TYPE) {
      return;
    }

    const C_NAME = obj?.Name;
    const C_COST = obj?.Cost;
    const C_ATTACK = obj?.Attack;
    const C_HEALTH = obj?.Health;
    const C_ABILITY = obj?.Abilities;
    const C_FLAVOR = obj?.Quote;
    const C_RARITY = obj?.Rarity;

    const C = document.createElement("canvas");
    document.getElementById("displayZone").appendChild(C);
    C.id = C_ID;
    C.className = "card";
    C.style.borderRadius = `${C_WIDTH * 0.04}px`;
    if (CONFIG.card.border) {
      C.style.marginLeft = `${C_WIDTH * 0.01}px`;
      C.style.border = `${C_WIDTH * 0.008}px solid #000000`;
    } else {
      C.style.marginLeft = `${C_WIDTH * 0.02}px`;
    }
    C.width = C_WIDTH;
    C.height = C_HEIGHT;
    const CTX = C.getContext("2d");

    let cFlavor = C_FLAVOR;
    let cAbility = C_ABILITY;
    cFlavor = flavorSplit(cFlavor);
    cAbility = abilitySplit(cAbility);

    // Background Color
    const { mainColor: cMain, secColor: cSecondary } = getColors(C_TYPE);

    // Name
    CTX.fillStyle = cMain;
    CTX.fillRect(C_WIDTH * 0.2, 0, C_WIDTH * 0.8, C_WIDTH * 0.2);
    CTX.fillStyle = CONFIG.font.color;
    CTX.font = `${C_WIDTH * 0.16}px '${CONFIG.font.name}'`;
    CTX.fillText(C_NAME, C_WIDTH * 0.21, C_WIDTH * 0.16, C_WIDTH * 0.79);

    // Cost
    CTX.fillStyle = cSecondary;
    CTX.fillRect(0, 0, C_WIDTH * 0.2, C_WIDTH * 0.2);
    CTX.fillStyle = CONFIG.font.color;
    CTX.font = `${C_WIDTH * 0.2}px '${CONFIG.font.name}'`;
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
    CTX.fillStyle = CONFIG.font.color;
    CTX.font = `${C_WIDTH * 0.2}px '${CONFIG.font.name}'`;
    CTX.fillText(` ${C_ATTACK}`, 0, C_WIDTH * 1.37, C_WIDTH * 0.2);

    // Health
    CTX.fillStyle = cSecondary;
    CTX.fillRect(C_WIDTH * 0.2, C_WIDTH * 1.2, C_WIDTH * 0.2, C_WIDTH * 0.2);
    CTX.fillStyle = CONFIG.font.color;
    CTX.font = `${C_WIDTH * 0.2}px '${CONFIG.font.name}'`;
    CTX.fillText(` ${C_HEALTH}`, C_WIDTH * 0.2, C_WIDTH * 1.37, C_WIDTH * 0.2);

    // Abilities
    CTX.fillStyle = CONFIG.font.color;
    CTX.font = `${C_WIDTH * 0.08}px '${CONFIG.font.name}'`;
    CTX.fillText(cAbility[0], 0, C_WIDTH * 1.07, C_WIDTH);

    CTX.fillStyle = CONFIG.font.color;
    CTX.font = `${C_WIDTH * 0.08}px '${CONFIG.font.name}'`;
    CTX.fillText(cAbility[1], 0, C_WIDTH * 1.17, C_WIDTH);

    // Flavor
    CTX.fillStyle = CONFIG.font.color;
    CTX.font = `italic ${C_WIDTH * 0.08}px '${CONFIG.font.name}'`;
    CTX.fillText(cFlavor[0], C_WIDTH * 0.4, C_WIDTH * 1.27, C_WIDTH * 0.6);

    CTX.fillStyle = CONFIG.font.color;
    CTX.font = `italic ${C_WIDTH * 0.08}px '${CONFIG.font.name}'`;
    CTX.fillText(cFlavor[1], C_WIDTH * 0.4, C_WIDTH * 1.37, C_WIDTH * 0.6);

    C.addEventListener("click", () => {
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
      C.addEventListener("", () => {});
      console.log(deck);
      typeChart(deck);
      lineChart(deck);
      document.getElementById("totalDeck").innerHTML =
        "<b>Total Cards in Deck:</b> " + deck.length;
    });
  }

  function typeChart(deck) {
    const ctx = document.getElementById("typeChart");
    const typeCounts = Object.keys(CONFIG.types).reduce((counts, type) => {
      counts[type] = deck.filter(
        (card) => card.Type.toLowerCase() === type.toLowerCase()
      ).length;
      return counts;
    }, {});

    let labels = Object.keys(CONFIG.types);
    const data = Object.values(typeCounts);
    const backgroundColor = labels.map((type) => CONFIG.types[type].mainColor);
    labels = labels.map(
      (label) => label.charAt(0).toUpperCase() + label.slice(1)
    );

    const chartConfig = {
      type: "doughnut",
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: backgroundColor,
            borderWidth: 1,
          },
        ],
      },
      options: {
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };

    if (window.myChart) {
      window.myChart.data.labels = labels;
      window.myChart.data.datasets[0].data = data;
      window.myChart.data.datasets[0].backgroundColor = backgroundColor;
      window.myChart.options = chartConfig.options;
      window.myChart.update();
    } else {
      window.myChart = new Chart(ctx, chartConfig);
    }
  }

  function lineChart(deck) {
    const ctx = document.getElementById("deckChart").getContext("2d");

    const costData = Array(10).fill(0);
    const attackData = Array(10).fill(0);
    const healthData = Array(10).fill(0);

    deck.forEach((card) => {
      const cost = parseInt(card.Cost);
      const attack = parseInt(card.Attack);
      const health = parseInt(card.Health);
      costData[cost <= 9 ? cost : 9]++;
      attackData[attack <= 9 ? attack : 9]++;
      healthData[health <= 9 ? health : 9]++;
    });

    let chart = window.deckChartInstance;
    if (chart) {
      chart.data.datasets[0].data = costData;
      chart.data.datasets[1].data = attackData;
      chart.data.datasets[2].data = healthData;
      chart.update();
    } else {
      window.deckChartInstance = new Chart(ctx, {
        type: "line",
        data: {
          labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, "9+"],
          datasets: [
            {
              label: "Cost",
              data: costData,
              borderColor: "rgb(255, 99, 132)",
              borderWidth: 2,
              fill: false,
            },
            {
              label: "Attack",
              data: attackData,
              borderColor: "rgb(54, 162, 235)",
              borderWidth: 2,
              fill: false,
            },
            {
              label: "Health",
              data: healthData,
              borderColor: "rgb(75, 192, 192)",
              borderWidth: 2,
              fill: false,
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            x: {
              title: {
                display: true,
                text: "Value",
              },
            },
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    }
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

  document.getElementById("downloadDeck").addEventListener("click", () => {
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
  });

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
      document.getElementById("totalCards").innerHTML =
        "<b>Total Cards:</b> " + document.getElementsByClassName("card").length;
      console.log(allCards);
    };
    reader.readAsText(file);
  });
});
