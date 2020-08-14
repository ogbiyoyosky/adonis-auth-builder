const ace = require("@adonisjs/ace");
ace.command(
  "make:auth",
  "Generates Views, Controllers and Models for user authentication",
  function({ name }) {
    console.log(`Scaffolding basic authentication`);
  }
);

// Boot ace to execute commands
ace.wireUpWithCommander();
ace.invoke();
