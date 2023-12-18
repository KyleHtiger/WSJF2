// script.js

let timer;
let timeLeft;
let timerRunning = false;
let results = [];

function pickNumber() {
  const selectedNameChip = document.querySelector('.nameChip.selected');
  const selectedNumberChip = document.querySelector('.numberChip.selected');

  const participantName = selectedNameChip ? selectedNameChip.textContent.trim() : '';
  const selectedNumber = selectedNumberChip ? selectedNumberChip.textContent.trim() : '';

  if (selectedNameChip && selectedNumber) {
    // Disable and grey out the selected name chip
    disableChip(selectedNameChip);

    // Add the pick to results
    results.push(`${participantName} ${selectedNumber}`);

    clearFields(); // Clear the fields after picking a number

    // Save results to session storage
    saveResults();

    // Show toast message for 2 seconds
    showToast('Pick Submitted');
  } else {
    alert('Please select your name and pick a number.');
  }
}

function clearFields() {
  document.getElementById('featureName').value = '';
  clearChips('.nameChip.selected');
  clearChips('.numberChip.selected');
}

function clearChips(selector) {
  document.querySelectorAll(selector).forEach(chip => {
    chip.classList.remove('selected');
  });
}

function disableChip(chip) {
  chip.classList.add('disabled');
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.style.display = 'block';

  setTimeout(() => {
    toast.style.display = 'none';
  }, 2000);
}

function saveResults() {
  sessionStorage.setItem('results', JSON.stringify(results));
}

function displayResults() {
  const resultsList = document.getElementById('resultsList');
  const mostPickedNumber = document.getElementById('mostPickedNumber');
  const highestNumberPickersList = document.getElementById('highestNumberPickersList');

  const storedResults = sessionStorage.getItem('results');

  if (storedResults) {
      const resultsArray = JSON.parse(storedResults);
      const resultsMap = new Map();
      let mostPickedCount = 0;
      let highestPickedNumber = 0;
      let highestNumberPickers = [];

      resultsArray.forEach(result => {
          const [name, number] = result.split(' ');
          const listItem = document.createElement('li');
          listItem.textContent = result;
          resultsList.appendChild(listItem);

          // Count the number of picks for each number
          const count = resultsMap.has(number) ? resultsMap.get(number) + 1 : 1;
          resultsMap.set(number, count);

          // Update mostPickedCount and mostPickedNumber
          if (count > mostPickedCount) {
              mostPickedCount = count;
              highestPickedNumber = parseInt(number, 10);
              highestNumberPickers = [name]; // Reset the list with a single name
          } else if (count === mostPickedCount && parseInt(number, 10) > highestPickedNumber) {
              highestPickedNumber = parseInt(number, 10);
              highestNumberPickers = [name]; // Reset the list with a single name
          } else if (count === mostPickedCount && parseInt(number, 10) === highestPickedNumber) {
              highestNumberPickers.push(name); // Add another name to the list
          }
      });

      mostPickedNumber.textContent = highestPickedNumber;

      // Display names of people who picked the highest number
      highestNumberPickersList.innerHTML = "";
      highestNumberPickers.forEach(name => {
          const highestNumberPicker = document.createElement('li');
          highestNumberPicker.textContent = name;
          highestNumberPickersList.appendChild(highestNumberPicker);
      });
  }
}

// Event listener for name chips
document.querySelectorAll('.nameChip').forEach(chip => {
  chip.addEventListener('click', () => {
    toggleChip(chip);
  });
});

// Event listener for number chips
document.querySelectorAll('.numberChip').forEach(chip => {
  chip.addEventListener('click', () => {
    toggleChip(chip);
  });
});

// Event listener for the "View Results" button
document.getElementById('viewResultsBtn').addEventListener('click', () => {
  navigateToResults();
});

function toggleChip(chip) {
  const isNameChip = chip.classList.contains('nameChip');
  const isSelected = chip.classList.contains('selected');

  if (isNameChip) {
      if (!isSelected) {
          chip.classList.add('selected');
      } else {
          chip.classList.remove('selected');
      }
  } else {
      // Handle number chips here (add or remove 'selected' class)
      if (!isSelected) {
          chip.classList.add('selected');
      } else {
          chip.classList.remove('selected');
      }
  }
}

function navigateToResults() {
  window.location.href = 'results.html';
}

document.addEventListener('DOMContentLoaded', function () {
  displayResults(); // Call the function to display results
});

// Function to fetch Gist data
function fetchGistData() {
  const gistID = '5d00bbddad0777de25828b0d743b4ad8';

  fetch(`https://api.github.com/gists/${gistID}`)
    .then(response => response.json())
    .then(data => {
      // Access Gist content and other details
      const files = data.files;
      const resultsFile = files['results.json'];
      const resultsContent = resultsFile.content;
      console.log('Gist Content:', resultsContent);
    })
    .catch(error => console.error('Error fetching Gist:', error));
}

// Call the fetchGistData function
fetchGistData();

// Function to save data to Gist
function saveDataToGist(data) {
  const gistID = 'YOUR_GIST_ID';

  // Assuming you're using the Fetch API
  fetch(`https://api.github.com/gists/${gistID}`, {
    method: 'PATCH', // PATCH is used for updating
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer YOUR_ACCESS_TOKEN', // Add your GitHub personal access token here
    },
    body: JSON.stringify({
      files: {
        'results.json': {
          content: JSON.stringify(data),
        },
      },
    }),
  })
    .then(response => response.json())
    .then(() => {
      // Display a toast message
      showToast('Data saved to Gist!');
    })
    .catch(error => {
      console.error('Error saving data to Gist:', error);
      // Display an error toast message
      showToast('Error saving data to Gist. Please try again.');
    });
}

// Function to display a toast message
function showToast(message) {
  alert(message);
}

