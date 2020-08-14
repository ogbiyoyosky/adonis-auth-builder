"use strict";

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use("Schema");

class AddAccountStatusToUsersSchema extends Schema {
  up() {
    this.alter("users", (table) => {
      table.dateTime("is_activated_at");
    });
  }

  down() {
    this.table("users", (table) => {
      table.dropColumn("is_activated_at");
    });
  }
}

module.exports = AddAccountStatusToUsersSchema;
