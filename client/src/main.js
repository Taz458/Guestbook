// Select the main app div and form elements
const guestbookList = document.getElementById("guestbook-list");
const form = document.getElementById("guestbook-form");
const nameInput = document.getElementById("name");
const reviewInput = document.getElementById("review");

// Function to fetch guestbook entries from the server
async function fetchGuestbook() {
  const res = await fetch(`http://localhost:4242/guestbook`); // GET request to fetch guestbook data
  const guestbookEntries = await res.json(); // Convert response to JSON
  displayGuestbook(guestbookEntries); // Call function to display entries
}

// Function to display guestbook entries on the page
function displayGuestbook(entries) {
  guestbookList.innerHTML = ""; // Clear the div before adding new entries

  entries.forEach((entry) => {
    // Create elements for name, review, delete button, and a container
    const h3 = document.createElement("h3");
    const pTag = document.createElement("p");
    const div = document.createElement("div");
    const deleteButton = document.createElement("button");

    // Set text content
    h3.innerText = entry.name; // Display user's name
    pTag.innerText = entry.review; // Display user's review
    deleteButton.innerText = "Delete Review"; // 'X' button to delete entry

    // Add an event listener to the delete button
    deleteButton.addEventListener("click", function () {
      handleDelete(entry.id); // Calls function to delete the entry
    });

    // Append elements to the div
    div.appendChild(h3);
    div.appendChild(pTag);
    div.appendChild(deleteButton);

    // Append the div to the app container
    guestbookList.appendChild(div);
  });
}

// Function to handle deleting a guestbook entry
async function handleDelete(id) {
  const res = await fetch(`http://localhost:4242/guestbook/${id}`, {
    method: "DELETE", // Sends a DELETE request to remove the entry
  });

  if (res.ok) {
    fetchGuestbook(); // Refresh the list after deletion
  }
}

// Event listener for form submission
form.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevents the page from refreshing when submitting

  await fetch("http://localhost:4242/guestbook", {
    method: "POST", // Sends a POST request to server to add a new entry
    headers: { "Content-Type": "application/json" }, // Sends JSON data
    body: JSON.stringify({
      name: nameInput.value, // Get name input value
      review: reviewInput.value, // Get review input value
    }),
  });

  // Clear input fields after submission
  nameInput.value = "";
  reviewInput.value = "";

  // Refresh the guestbook list with the new entry
  fetchGuestbook();
});

// Initial fetch to load guestbook entries when the page loads
fetchGuestbook();


