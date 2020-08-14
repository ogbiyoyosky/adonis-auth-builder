## Getting Started with Adonis Auth Builder.

Thanks for using Adonis auth scaffold.

### Register providers.

The `adonis-auth-builder` provider must be registered as an `aceProvider`.
We are running CLI commands after all!

```js
const aceProviders = [
  "adonis-auth-builder/providers/AdonisAuthBuilderProvider",
];
```

Also add providers for the newly installed dependencies.

```js
const providers = [
  "@adonisjs/validator/providers/ValidatorProvider",
  "@adonisjs/mail/providers/MailProvider",
];
```

### Register Middleware

Register the below middleware in `start/kernel.js`

```js
const globalMiddleware = ["App/Middleware/ViewHelper"];
```

### Generating auth scaffold.

Please run the below command to scaffold authentication.

```js
adonis make:auth
```

### Routes

Please add the following line at the beginning of `start/routes.js`.

```js
require("./authRoutes");
```

### Events

Please add the following line at the beginning of `start/events.js`.

```js
require("./authEvents");
```

### Migrations

Run the following command to run startup migrations.
Please remember to add the `status` column to your User migration.

```js
adonis migration:run
```
