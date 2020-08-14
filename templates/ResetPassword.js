"use strict";

class ResetPassword {
  get validateAll() {
    return true;
  }
  get rules() {
    return {
      token: "required",
      password: "required",
      confirm_password: "required",
    };
  }

  get messages() {
    return {
      "confirm_password.required": "Password is required",
      "password.required": "Password is required",
      "token.required": " Token is required",
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

module.exports = ResetPassword;
