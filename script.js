//get all needed DOM elements

//check-in form
const form = document.getElementById("checkInForm");
//name inputs
const nameInput = document.getElementById("attendeeName");
//team dropdown
const teamSelect = document.getElementById("teamSelect");

//additional DOM elements
const attendeeCount = document.getElementById("attendeeCount");
const progressBar = document.getElementById("progressBar");
const greeting = document.getElementById("greeting");
const celebrationMessage = document.getElementById("celebrationMessage");
const attendeeList = document.getElementById("attendeeList");

//track attendance
let count = Number(localStorage.getItem("count")) || 0;
const maxCount = 50;

//store attendee data
let attendees = JSON.parse(localStorage.getItem("attendees")) || [];

//load saved data when the page opens
loadSavedData();

//tell browser to watch for certain events - event listener
form.addEventListener("submit", function (e) {
  e.preventDefault();

  //get form values
  const name = nameInput.value.trim();
  const team = teamSelect.value;
  const teamName = teamSelect.selectedOptions[0].text;

  console.log(name, team, teamName);

  //make sure user enters a name and team
  if (name === "" || team === "") {
    alert("Please enter your name and select a team.");
    return;
  }

  //increment count
  count++;
  console.log("Total check-ins: ", count);

  //update attendance display
  attendeeCount.textContent = count;

  //update progress bar
  const percentage = Math.min(Math.round((count / maxCount) * 100), 100);

  progressBar.style.width = percentage + "%";
  progressBar.textContent = percentage + "%";

  console.log(`Progress: ${percentage}%`);

  //update team counter
  const teamCounter = document.getElementById(team + "Count");
  teamCounter.textContent = parseInt(teamCounter.textContent) + 1;

  //show welcome message
  const message = `Welcome, ${name} from ${teamName}!`;
  greeting.textContent = message;

  console.log(message);

  //add attendee to list
  attendees.push({
    name: name,
    team: teamName,
  });

  const listItem = document.createElement("li");
  listItem.textContent = `${name} - ${teamName}`;

  attendeeList.appendChild(listItem);

  //save progress
  localStorage.setItem("count", count);
  localStorage.setItem("attendees", JSON.stringify(attendees));
  localStorage.setItem("waterCount", document.getElementById("waterCount").textContent);
  localStorage.setItem("zeroCount", document.getElementById("zeroCount").textContent);
  localStorage.setItem("powerCount", document.getElementById("powerCount").textContent);

  //celebrate when goal is reached
  if (count >= maxCount) {
    celebrationMessage.textContent =
      `🎉 Attendance goal reached! ${getWinningTeam()} wins!`;
  }

  form.reset();
});

function loadSavedData() {
  //load total attendance count
  attendeeCount.textContent = count;

  //load team counts
  document.getElementById("waterCount").textContent =
    localStorage.getItem("waterCount") || 0;

  document.getElementById("zeroCount").textContent =
    localStorage.getItem("zeroCount") || 0;

  document.getElementById("powerCount").textContent =
    localStorage.getItem("powerCount") || 0;

  //load progress bar
  const percentage = Math.min(Math.round((count / maxCount) * 100), 100);

  progressBar.style.width = percentage + "%";
  progressBar.textContent = percentage + "%";

  //load attendee list
  attendeeList.innerHTML = "";

  attendees.forEach(function (attendee) {
    const listItem = document.createElement("li");
    listItem.textContent = `${attendee.name} - ${attendee.team}`;
    attendeeList.appendChild(listItem);
  });

  //show celebration message if goal was already reached
  if (count >= maxCount) {
    celebrationMessage.textContent =
      `🎉 Attendance goal reached! ${getWinningTeam()} wins!`;
  }
}

function getWinningTeam() {
  const waterCount = parseInt(document.getElementById("waterCount").textContent);
  const zeroCount = parseInt(document.getElementById("zeroCount").textContent);
  const powerCount = parseInt(document.getElementById("powerCount").textContent);

  let winningTeam = "Team Water Wise";

  if (zeroCount > waterCount && zeroCount > powerCount) {
    winningTeam = "Team Net Zero";
  }

  if (powerCount > waterCount && powerCount > zeroCount) {
    winningTeam = "Team Renewables";
  }

  return winningTeam;
}