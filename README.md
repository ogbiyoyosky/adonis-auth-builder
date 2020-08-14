![Adonis Auth Builder Logo](https://i.ibb.co/mJt9gh1/Whats-App-Image-2020-08-14-at-08-20-58.jpg)

# Adonis Auth Builder.

Adonis auth scaffold offers you painless authentication

Spend those minutes you'd use in setting up authentication doing awesome stuff within your app.

## Index

- [Introduction](#introduction)
- [Installation](#installation)
- [Getting Started](#getting-started)

## Introduction

### Directory Structure

```
app
└── Controllers
    └── HTTP
        ├── AuthController.js
        ├── ApiAuthController.js
config
    ├── adonis-auth-builder.js
resources
    └── views
        └── auth
            └── emails
                ├── password.edge
                ├── welcome-mail.edge

start
    ├── authEvents.js
    ├── authRoutes.js
    ├── apiAuthRoutes.js
```

## About Adonis Auth Builder.

Adonis Auth Scaffold is a CLI utility that gives you a functional authentication system in Adonis.js
within seconds.

## Getting Started

### Installation

Install `adonis-auth-builder` by running the below command.

**NPM**

```bash
npm install adonis-auth-builder --save-dev
npm install @adonisjs/mail @adonisjs/persona @adonisjs/validator
```

**Yarn**

```bash
yarn add adonis-auth-builder --save-dev
yarn add @adonisjs/mail @adonisjs/persona @adonisjs/validator
```

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

### Generating auth scaffold.

![Auth Scaffold Gif](https://user-images.githubusercontent.com/5021686/54365412-10485200-466f-11e9-8fb5-cbaa920c6950.gif)

Please run the below command to scaffold authentication.

```js
adonis make:auth
```

A prompt to choose between generating code for a RESTful Api or a HTTP client allows you customize the generated files for your specific use case.
Alternative versions of this command involves passing either the `--api-only` or `--http-only` flags.

To generate auth files for a REST Api, you may run:

```js
adonis make:auth --api-only
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

## Author

Emmanuel Ogbiyoyo <nuel@nueljoe.com>

## Contributing

Contributions are welcome! Check out the [issues](https://github.com/ogbiyoyosky/adonis-auth-builder/issues) or the [PRs](https://github.com/ogbiyoyosky/adonis-auth-builder/pull-requests), and make your own if you want something that you don't see there.

## License

[GPLv3.0](https://github.com/ogbiyoyosky/adonis-auth-builder)
