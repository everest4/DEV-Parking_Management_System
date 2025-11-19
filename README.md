# Client

This project was generated using [Angular CLI](https://github.com/angular/angular-cli) version 20.3.7.

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Code scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
ng generate component component-name
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
ng generate --help
```

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.



## How to Use the Parking Management System

After launching the Angular application, you will be directed to the Login Page.
You can log in using the default administrator credentials:

Email: admin@test.com

Password: admin123

Once logged in, you will access the main dashboard, where the sidebar gives you access to all system features:

# Home (Manage Parking Spots)

Add new parking spots by selecting Floor (A–C), Spot Number (1–30), and Type (Regular, EV, Unavailable).

View all parking spots visually as color-coded cards.

Book (occupy) or unbook (free) any available spot.

Delete unwanted or incorrectly added spots.

EV spots, unavailable spots, and regular spots all display special colors with dark-mode support.

# Parking Spots

Filter spots by Free, Occupied, or Unavailable.

View real-time spot status and timers that show how long a car has been parked.

# Tariffs

Create fully customizable pricing rules.

Each tariff rule includes:

Minimum minutes

Maximum minutes

Price (in Lek)

You can add unlimited tariff rules, edit them, or delete them.

All tariff changes are automatically saved to db.json through the backend.

# Tickets

Select an occupied spot to calculate parking duration.

The system automatically:

Calculates the total minutes parked

Matches the correct tariff

Shows the price before generating the ticket

You can then generate and save a ticket into the database.

# Dark Mode

Toggle dark mode anytime using the switch in the top bar.

# Logout

Use the logout button in the top bar to safely exit the admin interface.
