
// ======================================================
// CUSTOM API ERROR CLASS
// ======================================================

class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    // Call parent Error constructor
    super(message);

    // HTTP status code
    this.statusCode = statusCode;

    // Response data
    this.data = null;

    // Error message
    this.message = message;

    // Success status
    this.success = false;

    // Additional errors
    this.errors = errors;

    // ==================================================
    // CONSOLE LOGS
    // ==================================================

    console.log("\n========== ApiError Created ==========");
    console.log("Status Code:", statusCode);
    console.log("Message:", message);
    console.log("Errors:", errors);

    // ==================================================
    // ERROR STACK
    // ==================================================

    if (stack) {
      // Agar custom stack provide ki gayi hai
      this.stack = stack;

      console.log("Custom Error Stack Used");
    } else {
      // Automatically error stack create karo
      Error.captureStackTrace(this, this.constructor);

      console.log("Error Stack Created Automatically");
    }

    console.log("======================================\n");
  }
}


// ======================================================
// EXPORT
// ======================================================

export { ApiError };
