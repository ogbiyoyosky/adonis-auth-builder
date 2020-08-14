"use strict";

class Login {
  get validateAll() {
    return true;
  }
  get rules() {
    return {
      old_password: "required",
      new_password: "required",
      confirm_new_password: "required",
    };
  }

  get messages() {
    return {
      "old_password.required": "Old Password is required",
      "new_password.required": "New Password is required",
      "confirm_new_password.required": "New Password Confirmation is required",
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
