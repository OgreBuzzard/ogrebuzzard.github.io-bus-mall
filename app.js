'use strict';

// Create the global varialbes: a click counter, a trigger, an array for which products are in each slot on the page, and a list of images in an array.
var trialCounter = 0;
var trialTrigger = 25;
var imageSlot = [];
var productsShown = [];
var productsClicked = [];
var productsNames = [];
var images = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];

if (localStorage.productsShown && localStorage.productsClicked) {
  productsShown = JSON.parse(localStorage.productsShown);
  productsClicked = JSON.parse(localStorage.productsClicked);
}

// A constructor function that creates objects out of each image in the array and applies properties to them. The first letter of each product name is capitalized.
function Product(name) {
  this.name = name;
  this.fileName = 'image/' + name + '.jpg';
  this.totalClicks = 0;
  this.totalShown = 0;
  this.justShown = false;
};

// Uses the constructor function to push the objects into a new product array.
var products = [];
for (var i = 0; i < images.length; i++) {
  products.push(new Product(images[i]));
};

// Picks a random product from the array.
var randomProduct = function() {
  return Math.floor(Math.random() * (products.length));
};

// Assigns a random image to each of the three product slots and makes sure no picture is shown twice or was just shown in that slot.
var pickProducts = function() {
  var prodLeft = randomProduct();
  while (products[prodLeft].justShown === true) {
    prodLeft = randomProduct();
  }
  var prodCenter = randomProduct();
  while ((products[prodCenter].justShown === true) || (prodCenter === prodLeft)) {
    prodCenter = randomProduct();
  };
  var prodRight = randomProduct();
  while ((products[prodRight].justShown === true) || (prodRight === prodLeft) || (prodRight === prodCenter)) {
    prodRight = randomProduct();
  }
  if (imageSlot.length > 0) {
    justShownFalse(imageSlot[0], imageSlot[1], imageSlot[2]);
  }
  return [prodLeft, prodCenter, prodRight];
};

// Resets justShown to false, so it can be displayed again.
function justShownFalse(left, center, right) {
  products[left].justShown = false;
  products[center].justShown = false;
  products[right].justShown = false;
};

// Draws the three products on the page, increments the counter for each product shown, and sets the justShown flag to true.
var drawProduct = function() {
  imageSlot = pickProducts();
  document.getElementById('prodLeft').src = products[imageSlot[0]].fileName;
  // console.log('0: ', imageSlot[0], '1: ', imageSlot[1], '2: ', imageSlot[2]);
  // localStorage.imageSlot0 = imageSlot[0];
  document.getElementById('prodCenter').src = products[imageSlot[1]].fileName;
  // localStorage.imageSlot1 = imageSlot[1];
  document.getElementById('prodRight').src = products[imageSlot[2]].fileName;
  // localStorage.imageSlot1 = imageSlot[2];

  products[imageSlot[0]].totalShown++;
  products[imageSlot[1]].totalShown++;
  products[imageSlot[2]].totalShown++;
  products[imageSlot[0]].justShown = true;
  products[imageSlot[1]].justShown = true;
  products[imageSlot[2]].justShown = true;
};

drawProduct();

// checkForClick();
// if (!localStorage.trialCounter) {
//   drawProduct();
// } else if (Number(localStorage.trialCounter) < 25) {
//   trialCounter = Number(localStorage.trialCounter);
//   products = JSON.parse(localStorage.products);
//   x = Number(localStorage.imageSlot[0]);
//   y = Number(localStorage.imageSlot[1]);
//   z = Number(localStorage.imageSlot[2]);
//   drawProduct();
// } else {
//   showResult();
// }

// Checks for clicks on the three displayed products.
// function checkForClick() {
document.getElementById('prodLeft').addEventListener('click', clickEvent);
document.getElementById('prodCenter').addEventListener('click', clickEvent);
document.getElementById('prodRight').addEventListener('click', clickEvent);
// }

// Tracks which product the user clicked on, increments the clicked counter for that product, increments the trial counter, then generates a new set of pictures.
function clickEvent(event) {
  var targetName = event.target.src;
  targetName = targetName.split('image/')[1].split('.jpg')[0];
  for (var j = 0; j < products.length; j++) {
    if (targetName === products[j].name) {
      products[j].totalClicks++;
      trialCounter++;
      // localStorage.trialCounter = trialCounter;
      break;
    }
  }
  if (trialCounter >= trialTrigger) {
    showResult();
    return;
  }
  drawProduct();
}

// Shuts off the event listeners, runs capitalizeName, pushes the data into empty arrays for the chart, then runs make chart.
function showResult() {
  document.getElementById('prodLeft').removeEventListener('click', clickEvent);
  document.getElementById('prodCenter').removeEventListener('click', clickEvent);
  document.getElementById('prodRight').removeEventListener('click', clickEvent);
  var capitalizedName;
  for (var l = 0; l < products.length; l++) {
    productsShown[l] = ((productsShown[l] || 0) + products[l].totalShown);
    productsClicked[l] = ((productsClicked[l] || 0) + products[l].totalClicks);
    capitalizedName = capitalizeName(products[l].name);
    productsNames.push(capitalizedName);
  }
  localStorage.productsShown = JSON.stringify(productsShown);
  localStorage.productsClicked = JSON.stringify(productsClicked);
  makeChart();
}

// Capitalizes the first letter of each product name.
function capitalizeName(name) {
  var nameArray = name.split('');
  var firstLetter = name.split('')[0].toUpperCase();
  nameArray[0] = firstLetter;
  name = nameArray.join('');
  return name;
}

// Draws the chart
function makeChart() {
  var ctx = document.getElementById('productChart').getContext('2d');
  ctx.canvas.width = '960';
  ctx.canvas.height = '250';
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: productsNames,
      datasets: [{
        label: 'Times Shown',
        data: productsShown,
        backgroundColor: '#27AE60',
        borderColor: '#000',
        borderWidth: 1
      },
      {
        label: 'Times Selected',
        data: productsClicked,
        backgroundColor: '#F39C12',
        borderColor: '#000',
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
        }]
      }
    }
  });
};

// Stores the results locally.
// localStorage.products = [‘’];
// localStorage.hat;
// delete localStorage.prop;
//
// localStorage.setItem(‘product1’, ‘clicks’);
// localStorage.getItem(‘product1’);
// localStorage.removeItem(‘key’);
