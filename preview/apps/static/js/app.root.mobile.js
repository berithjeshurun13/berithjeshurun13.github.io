let toggleDiv = document.getElementById("left-panel-swipe");
let tDiv2 = document.getElementById("right-panel-swipe")
let notes = document.getElementById("smartnotes_mobile");
let note_btn = document.getElementById("phone-view-notes-butt");
let note_tools = document.getElementById("phone-tools");
let isDivVisible = false;
let ON_PHONE = false;
// Variables to track swipe start and end positions
let startX = 0;
let endX = 0;
let startY, endY = 0;

// alert(`Your device width : ${window.innerWidth}`);

// Detect touch start
window.addEventListener("touchstart", function (event) {
  ON_PHONE = true;
  startX = event.touches[0].clientX;
  startY = event.touches[0].clientY;
});

// Detect touch end
window.addEventListener("touchend", function (event) {
  endX = event.changedTouches[0].clientX;
  // this.alert("Swipe ended. X: " + endX + ", Y: " + endY);
  endY = event.changedTouches[0].clientY;
  handleSwipe();
});

// Handle swipe logic
function handleSwipe() {
  // Left-to-right swipe to show the div
  if (endX > startX + 250 && !isDivVisible) {
    toggleDiv.style.display = "flex";
    tDiv2.style.display = "none";
    isDivVisible = true;
    pushHistory();
  }
  // Right-to-left swipe to hide the div
  else if (startX > endX + 250 && isDivVisible) {
    toggleDiv.style.display = "none";
    tDiv2.style.display = "flex";
    isDivVisible = false;
    history.back(); // Go back to reset history state
  }else if (startY > endY + 500) {
    toggleDiv.style.display = "none";
    tDiv2.style.display = "none";
    notes.style.display = "block";
    note_btn.style.display = "block";
    isDivVisible = false;

    history.back(); // Go back to reset history state
  }
}

// Handle back button press
window.addEventListener("popstate", function (event) {
  if (isDivVisible) {
    toggleDiv.style.display = "none";
    isDivVisible = false;
  }
});

// Add a history state to enable back button press detection
function pushHistory() {
  history.pushState(null, null, location.href);
}

// Initial call to set up history state for back button detection
pushHistory();

// Push history state every time the div is shown
toggleDiv.addEventListener("click", function () {
  if (isDivVisible) {
    pushHistory();
  }
});


function openSmartNotesTools() {
  if (note_tools.style.display == "block") {
    note_tools.style.display = "none";
  }else {
    note_tools.style.display = "block";
  }

}

function closeSmartNotesToolPanel() {
  if (note_tools.style.display == "block") {
    note_tools.style.display = "none";
  }else {
    note_tools.style.display = "block";
  }
}