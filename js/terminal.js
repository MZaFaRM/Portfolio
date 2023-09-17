// Define a constant banner.
const banner = "banner";

function focusWithoutScrolling(inputElement) {
  // Store the current position values.
  const prevPosition = inputElement.style.position;
  const prevTop = inputElement.style.top;

  // Temporarily fix the position.
  inputElement.style.position = 'fixed';
  inputElement.style.top = '0px';

  // Focus the element.
  inputElement.focus();

  // Restore the previous position values.
  inputElement.style.position = prevPosition;
  inputElement.style.top = prevTop;
}

// Function to remove the ID attributes from the CLI and its output area.
// This is done to ensure we can add a new CLI input without conflicting IDs.
function releaseCli() {
  const outputArea = document.getElementById("cli-output");
  const commandInput = document.getElementById("cli");

  // Only remove the 'id' attribute if the element exists.
  if (commandInput) {
    commandInput.removeAttribute('id');
  }
  if (outputArea) {
    outputArea.removeAttribute('id');
  }
}

// Function to set up the CLI input interface on the page.
function setBoard() {
  // Fetch the main container where we will add the CLI content.
  let mainBody = document.querySelector("main");

  // Determine the file name to fetch for the CLI window.
  let cli = determineFileName("cli-window");

  // Use async function within to handle asynchronous fetch operations.
  (async () => {
    try {
      // Fetch the CLI window content.
      const response = await fetch(cli);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const content = await response.text();
      
      // Append the fetched CLI content to the main container.
      mainBody.innerHTML += content;

      // Add event listener to the CLI input to handle user input.
      const commandInput = document.getElementById("cli");
      focusWithoutScrolling(commandInput);
      commandInput.addEventListener("keydown", function (event) {
        if (event.key === "Enter") {

          const command = commandInput.value;
          executeCommand(command);  // Execute the command when the Enter key is pressed.
        }
      });
    } catch (error) {
      // Log errors for debugging purposes.
      console.error("Error:", error);
    }
  })();
}

// Helper function to determine the file name based on the given command.
function determineFileName(command) {
  return "pages/" + command + ".html";
}

// Function to handle command execution. 
// It fetches the corresponding content based on the command and displays it.
function executeCommand(command) {
  if (command === "clear") {
    return clearScreen();
  }

  const fileName = determineFileName(command);
  const outputArea = document.getElementById("cli-output");
  const commandInput = document.getElementById("cli");

  // Fetch the content based on the command.
  fetch(fileName)
    .then((response) => response.text())
    .then((content) => {
      // Display the fetched content.
      outputArea.innerHTML += content;

      // Disable the previous CLI input to prevent further input.
      if (commandInput) {
        commandInput.disabled = true;
      }
    })
    .catch((error) => {
      // Display the error in the output area.
      outputArea.innerHTML += "Error: " + error + "<br>";
    })
    .finally(() => {
      // Regardless of whether the fetch was successful or not, 
      // we'll always release the previous CLI and set up a new one.
      releaseCli();
      setBoard();
    });
}

// Initialize the board by setting up the first CLI input.
setBoard();
function clearScreen() {
  const outputArea = document.querySelector("main");
  outputArea.innerHTML = "";
  setBoard();
  return;
}

