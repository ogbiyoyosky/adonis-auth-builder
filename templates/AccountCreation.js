"use strict";

class AccountCreation {
  get sanitizationRules() {
    return {
      email: "trim|normalize_email",
      password: "trim",
    };
  }

  get rules() {
    return {
      first_name: "required",
      last_name: "required",
      email: "required|email|unique:users,email",
      password: "required|min:6",
      password_confirmation: "required|min:6",
      phone_number: "string",
    };
  }

  get messages() {
    return {
      "first_name.required": "First Name is required",
      "last_name.required": "Last Name is required",
      "email.required": "Email is required",
      "email.email": "Email is invalid",
      "email.unique": "An account with this Email exists",
      "password.required": "Password is required",
      "password_confirmation.required": "Password confirmation is required",
      "password.min": "Password too short. Expected a minimum of 6 characters",
    };
  }

  async fails(errorMessages) {
    return this.ctx.response.status(400).json({
      status_code: 400,
      status: "Invalid",
      description: "Invalid Data",
      message: errorMessages[0].message,
    });
  }
}

module.exports = AccountCreation;
