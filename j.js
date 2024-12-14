const bcrypt = require('bcryptjs');

const enteredPassword = "Satyam@2002"; // Password entered by the user
const storedHash = "$2a$10$Lb41SkUNj5gwR9IPSBxDb.agPDRtRDV8K9sKUd8Nqy8OTAN3L6NB2"; // Stored hash from database

// Rehash the entered password and compare the result
bcrypt.hash(enteredPassword, 10, (err, hash) => {
  if (err) {
    console.error("Error during hashing:", err);
  } else {
    console.log("Rehashed password:", hash); // Check the rehashed password

    // Now compare this hash with the stored hash
    bcrypt.compare(enteredPassword, storedHash, (err, isMatch) => {
      if (err) {
        console.error("Error during comparison:", err);
      } else {
        console.log("Password match result:", isMatch); // Should be true if passwords match
      }
    });
  }
});
