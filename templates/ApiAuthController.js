"use strict";
const Config = use("Config");
const User = use("App/Models/User");
const Hash = use("Hash");
const Token = use("App/Models/Token");
const PasswordReset = use("App/Models/PasswordReset");
const moment = require("moment");
const randomString = require("randomstring");
const Event = use("Event");

class ApiAuthController {
  async login({ request, auth, response }) {
    try {
      const { email, password } = request.all();
      const user = await User.query().where("email", email).first();

      if (!user) {
        return response.status(400).send({
          message: "email does not exist",
          status_code: 400,
          status: "fail",
        });
      }

      const token = await auth.withRefreshToken().attempt(email, password);
      const authConfig = Config.get("auth");
      const { expiresIn } = authConfig.jwt.options;
      token.expiresIn = expiresIn;

      return response.status(200).send({
        message: "Login Successful",
        status: "Success",
        status_code: 200,
        result: token,
      });
    } catch (error) {
      console.log("Login Error -> ", error);
      return response.status(400).send({
        status: "fail",
        status_code: 400,
        message: "Email Or Password Incorrect",
      });
    }
  }

  async register({ request, auth, response }) {
    try {
      let payload = request.only([
        "email",
        "first_name",
        "last_name",
        "phone_number",
        "password",
      ]);

      const { password_confirmation } = request.all();

      const confirmation_token = randomString.generate({
        length: 15,
      });

      if (payload.password !== password_confirmation) {
        return response.status(400).send({
          status: "invalid",
          message: "Password must match confirmation password",
          status_code: 400,
        });
      }
      const user = await User.create(payload);
      const token = await auth
        .withRefreshToken()
        .attempt(payload.email, payload.password);

      const authConfig = Config.get("auth");
      const frontend = Config.get("adonis-auth-builder");

      const { expiresIn } = authConfig.jwt.options;
      token.expiresIn = expiresIn;

      const mailDetails = {
        user,
        confirmation_token,
        appURL: frontend.appURL,
      };

      await Token.create({
        user_id: user.id,
        token: confirmation_token,
        type: "confirmation_token",
      });

      Event.fire("user::created", mailDetails);

      return response.status(201).send({
        status: "Success",
        message: "Successfully Registered",
        status_code: 201,
        results: {
          user,
          token,
        },
      });
    } catch (error) {
      console.log(error);
      return response.status(500).send({
        status: "Fail",
        message: "Internal Server Error",
        status_code: 500,
      });
    }
  }

  async confirmUserAccount({
    request,
    response,
    params: { confirmation_token },
  }) {
    try {
      if (!confirmation_token) {
        return response.status(400).send({
          message: "confirmation_token is required",
          status_code: 400,
          status: "Invalid Data",
        });
      }
      const token = await Token.query()
        .where({
          type: "confirmation_token",
          token: confirmation_token,
          is_revoked: 0,
        })
        .first();

      if (!token)
        return response.status(400).send({
          message: "User not found or has already confirmed their email",
          status_code: 400,
          status: "Fail",
        });

      const user = await User.findBy("id", token.user_id);
      user.is_activated_at = moment().format("YYYY-MM-DD HH:mm:ss");
      await user.save();

      await token.delete();

      return response.status(200).send({
        message: "Account successfully confirmed",
        status_code: 200,
        status: "Success",
        result: user,
      });
    } catch (confirmAccountError) {
      console.log("confirmAccountError", confirmAccountError);
      return response.status(500).send({
        status: "Fail",
        message: "Internal Server Error",
        status_code: 500,
      });
    }
  }

  async logout({ request, response, auth }) {
    try {
      const refreshToken = request.input("refreshToken");
      if (!refreshToken) {
        // You can throw any exception you want here
        return response.status(400).send({
          status: 400,
          status_code: 400,
          message: "please provide your refresh token",
        });
      }
      await auth.authenticator("jwt").revokeTokens([refreshToken], true);

      return response.status(200).send({
        status: 200,
        status_code: 200,
        message: "Successfully logged",
      });
    } catch (logoutError) {
      console.log("logoutError", logoutError);
      return response.status(500).send({
        status: "Fail",
        message: "Internal Server Error",
        status_code: 500,
      });
    }
  }

  async resetPasswordInApp({ request, response, auth }) {
    try {
      const userObject = await auth.current.user;
      const user = await User.findBy("id", userObject.id);

      const {
        old_password,
        new_password,
        confirm_new_password,
      } = await request.post();

      const verifiedPassword = await Hash.verify(old_password, user.password);

      if (!verifiedPassword) {
        return response.status(400).send({
          status: "Invalid",
          message: "Current Password Could Not Be Verified",
          status_code: 400,
        });
      }

      if (old_password === new_password) {
        return response.status(200).send({
          status: "Success",
          message: "Current Password Matches New Password",
          status_code: 200,
        });
      }

      if (new_password === confirm_new_password) {
        user.password = new_password;
        await user.save();

        return response.status(200).send({
          status: "Success",
          message: "Password Updated",
          status_code: 200,
        });
      } else {
        return response.status(400).json({
          status: "Bad Request",
          message: "Password Change Failed",
          status_code: 400,
        });
      }
    } catch (resetPassword) {
      console.log("Reset Password Error =>", resetPassword);
      response.status(500).json({
        status: "Internal Server Error",
        message: "Internal Error, Please try again later",
        status_code: 500,
      });
    }
  }

  async forgotPassword({ response, request }) {
    try {
      const { email } = request.all();
      const current_date = Date.now();
      const user = await User.findBy("email", email);
      if (user) {
        //there is a token that has not expired dont send a mail
        const password_reset_token = await Token.query()
          .where("user_id", user.id)
          .andWhere("type", "password_reset_token")
          .andWhere("is_revoked", 0)
          .andWhere("created_at", ">", current_date)
          .first();

        if (password_reset_token) {
          return response.status(200).send({
            status: "Success",
            message: `An email has already been sent to ${user.email} `,
            status_code: 200,
          });
        } else {
          const token = randomString.generate(32);
          const expires_at = moment() + 3600000;
          //  find the last password reset token and delete
          const last_token = await PasswordReset.findBy("user_id", user.id);
          if (last_token) {
            last_token.expires_at = expires_at;
            last_token.token = token;
            await last_token.save();
          } else {
            const password_reset = new PasswordReset();
            password_reset.expires_at = expires_at;
            password_reset.token = token;
            password_reset.user_id = user.id;
            await password_reset.save();
          }
          const frontend = Config.get("adonis-auth-builder");

          const mailDetails = {
            user,
            token,
            appURL: frontend.appURL,
          };

          Event.fire("forgot::password", mailDetails);
        }

        return response.status(200).send({
          status: "Success",
          message: `A reset mail has been sent to ${user.email}`,
          status_code: 200,
        });
      }

      return response.status(400).send({
        status: "Fail",
        message: "User does not exist in the system",
        status_code: 400,
      });
    } catch (forgotPassword) {
      console.log("forgotPassword", forgotPassword);
      return response.status(500).send({
        status: "Fail",
        message: "Internal Server Error",
        status_code: 500,
      });
    }
  }

  async resetPassword({ request, response }) {
    try {
      const { token, password, confirm_password } = request.all();

      if (password === confirm_password) {
        return response.status(400).send({
          status: "fail",
          message: "Password do not match",
          status_code: 400,
        });
      }
      const current_date = Date.now();
      //there is a token that has not expired dont send a mail
      const password_reset_token = await PasswordReset.query()
        .where("token", token)
        .andWhere("expires_at", ">", current_date)
        .first();

      if (password_reset_token) {
        const user = await User.findBy("id", password_reset_token.user_id);
        user.password = password;
        await user.save();
        await password_reset_token.delete();

        return response.status(200).send({
          status: "Success",
          message: `Password changed successfully`,
          status_code: 200,
        });
      } else {
        return response.status(400).send({
          status: "Fail",
          message: `The password reset token does not exist or has expired.`,
          status_code: 400,
        });
      }
    } catch (forgotPassword) {
      console.log("forgotPassword", forgotPassword);
      return response.status(500).send({
        status: "Fail",
        message: "Internal Server Error",
        status_code: 500,
      });
    }
  }

  async generateToken({ auth, response, request }) {
    try {
      const { refresh_token } = request.all();

      if (!refresh_token) {
        return response.status(400).send({
          status: "Invalid Data",
          message: "refresh_token is required",
          status_code: 400,
        });
      }
      const token = await auth.generateForRefreshToken(refresh_token, true);
      return response.status(200).send({
        status: "success",
        message: "Token Refreshed",
        status_code: 200,
        result: token,
      });
    } catch (generateTokenError) {
      console.log("generateTokenErrror", generateTokenError);
      if (generateTokenError.name === "InvalidRefreshToken") {
        return response.status(401).send({
          status_code: 401,
          status: "InvalidRefreshToken",
          message: "Invalid refresh token please login",
        });
      }
      return response.status(500).send({
        status: "Fail",
        message: "Internal Server Error",
        status_code: 500,
      });
    }
  }
}

module.exports = ApiAuthController;
