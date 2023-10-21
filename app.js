const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON in the request body
app.use(bodyParser.json());

app.post("/user/validate", (req, res) => {
  // Get the user data from the request body
  const userData = req.body;

  // Ensure 'id' is included in the response
  if (!userData.id) {
    return res
      .status(400)
      .json({ error: "User ID is missing in the request." });
  }

  // Define validation rules for fields
  const validationRules = {
    "businessProfile.companyName": {
      validate: (value) => value && value.trim() !== "",
      errorMessage: "Company name should not be empty.",
    },
    "businessProfile.legalName": {
      validate: (value) => value && value.trim() !== "",
      errorMessage: "Legal name should not be empty.",
    },
    "businessProfile.taxIdentifiers.pan": {
      validate: (pan) => {
        return pan && /^[A-Za-z0-9]{10}$/.test(pan); // Check if 'pan' is 10 alphanumeric characters
      },
      errorMessage: "PAN should be 10 alphanumeric characters.",
    },
    "businessProfile.taxIdentifiers.ein": {
      validate: (ein) => {
        return ein && /^\d{8}$/.test(ein); // Check if 'ein' is 8 digits
      },
      errorMessage: "EIN should be 8 digits.",
    },
    "businessProfile.email": {
      validate: (email) => {
        return email && isValidEmail(email);
      },
      errorMessage: "Email is invalid.",
    },
    "businessProfile.businessAddress.line1": {
      validate: (value) => value && value.trim() !== "",
      errorMessage: "Business address line1 should not be empty.",
    },
    "businessProfile.businessAddress.city": {
      validate: (value) => value && value.trim() !== "",
      errorMessage: "Business address city should not be empty.",
    },
    "businessProfile.businessAddress.state": {
      validate: (value) => value && value.trim() !== "",
      errorMessage: "Business address state should not be empty.",
    },
    "businessProfile.businessAddress.country": {
      validate: (value) => value && value.trim() !== "",
      errorMessage: "Business address country should not be empty.",
    },
    "businessProfile.businessAddress.zip": {
      validate: (zip) => /^\d{5}$/.test(zip),
      errorMessage:
        "Business address zip code should be a valid 5-digit numeric value.",
    },
    "businessProfile.legalAddress.line1": {
      validate: (value) => value && value.trim() !== "",
      errorMessage: "Legal address line1 should not be empty.",
    },
    "businessProfile.legalAddress.city": {
      validate: (value) => value && value.trim() !== "",
      errorMessage: "Legal address city should not be empty.",
    },
    "businessProfile.legalAddress.state": {
      validate: (value) => value && value.trim() !== "",
      errorMessage: "Legal address state should not be empty.",
    },
    "businessProfile.legalAddress.country": {
      validate: (value) => value && value.trim() !== "",
      errorMessage: "Legal address country should not be empty.",
    },
    "businessProfile.legalAddress.zip": {
      validate: (zip) => /^\d{5}$/.test(zip),
      errorMessage:
        "Legal address zip code should be a valid 5-digit numeric value.",
    },
  };

  const validationErrors = [];

  // Check each field based on the validation rules
  for (const fieldPath in validationRules) {
    if (getFieldByPath(userData, fieldPath)) {
      const fieldValidation = validationRules[fieldPath];
      const field = getFieldByPath(userData, fieldPath);

      if (!fieldValidation.validate(field)) {
        validationErrors.push(fieldValidation.errorMessage);
      }
    }
  }

  if (validationErrors.length > 0) {
    return res
      .status(400)
      .json({ errors: validationErrors, userId: userData.id });
  }

  res.json({ message: "User data is valid.", userId: userData.id });
});

// Helper function to get a nested field by path
function getFieldByPath(obj, path) {
  const parts = path.split(".");
  let value = obj;
  for (const part of parts) {
    if (value && value.hasOwnProperty(part)) {
      value = value[part];
    } else {
      return undefined; // Property does not exist
    }
  }
  return value;
}

function isValidEmail(email) {
  // Regular expression for a simple email validation
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
