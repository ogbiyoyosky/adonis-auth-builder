"use strict";

class Login {
  get validateAll() {
    return true;
  }
  get rules() {
    return {
      email: "required|email",
      password: "required",
    };
  }

  get messages() {
    return {
      "email.required": "Email is required",
      "password.required": "Password is required",
      "email.email": "Please provide a valid email address",
    };
  }

  async fails(errorMessages) {
    return this.ctx.response.status(400).json({
      status: "invalid",
      message: "Invalid data",
      status_code: 400,
      errorMessages: errorMessages[0].message,
    });
  }
}

module.exports = Login;
