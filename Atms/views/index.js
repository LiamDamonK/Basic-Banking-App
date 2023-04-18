// Update your frontend JS (index.js) to fetch data from the API endpoint and compare with user-entered information

// Get the DOM elements for username, password, and sign-in button
const userEnterInput = document.getElementById("UserEnter");
const passEnterInput = document.getElementById("PassEnter");
const signInButton = document.getElementById("SignIn");

// Add click event listener to sign-in button
signInButton.addEventListener("click", () => {
  // Fetch data from the API endpoint
  fetch("/api/users")
    .then((response) => response.json())
    .then((users) => {
      // Loop through the array of users data
      for (const user of users) {
        // Compare username and password with user-entered information
        if (
          user.username === userEnterInput.value &&
          user.password === passEnterInput.value
        ) {
          console.log("Sign in successful"); // Replace with your logic
          return; // Exit the loop if a match is found
        }
      }
      console.log("Sign in failed"); // Replace with your logic if no match is found
    })
    .catch((error) => console.error(error));
});
