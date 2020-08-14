const Config = use("Config");
const Event = use("Event");
const Mail = use("Mail");

Event.on("user::created", async (mailDetails) => {
  await Mail.send("auth.emails.welcome-mail", mailDetails, (message) => {
    message.to(mailDetails.user.email);
    message.from("admin@example.com");
  });
});

Event.on("forgot::password", async ({ user, token }) => {
  await Mail.send(
    "auth.emails.password",
    {
      token,
      user,
      appURL: Config.get("adonis-auth-builder.appURL"),
    },
    (message) => {
      message.to(user.email);
      message.from("admin@example.com").subject("Password reset");
    }
  );
});
