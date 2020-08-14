"use strict";

const Config = use("Config");
/*
|--------------------------------------------------------------------------
| API Auth Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");

Route.group(() => {
  Route.post("/login", "ApiAuthController.login").validator("Login");
  Route.post("/register", "ApiAuthController.register").validator(
    "AccountCreation"
  );
  Route.get(
    "/account/confirm/:confirmation_token",
    "ApiAuthController.confirmUserAccount"
  );
  Route.post(`/forgot-password`, "ApiAuthController.forgotPassword").validator(
    "SendLink"
  );
  Route.post(`/reset-password`, "ApiAuthController.resetPassword").validator(
    "ResetPassword"
  );
  Route.post(`/generate-token`, "ApiAuthController.generateToken");
  Route.post(`/reset-password-in-app`, "ApiAuthController.resetPasswordInApp")
    .middleware("auth")
    .validator("InAppResetPassword");
  Route.get(`/logout`, "ApiAuthController.logout");
}).prefix("/v1");
