# NFC Spotify MQTT Manager

## Description

This project is a web application built with Remix, TypeScript, and SQLite. It includes features such as tag management, PDF generation, and more.

## Installation

1. Clone the repository:

   ```sh
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:

   ```sh
   npm install
   ```

3. Set up the environment variables:
   ```sh
   cp example.env .env
   ```

## Scripts

- `npm run dev`: Start the development server.
- `npm run build`: Build the project.
- `npm run start`: Start the production server.

## Usage

1. Start the development server:

   ```sh
   npm run dev
   ```

2. Open your browser and navigate to `http://localhost:3008`.

## Project Details

### Database

The database is managed using SQLite and the Drizzle ORM. The database configuration and migration setup can be found in db.js.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## Acknowledgements

- [Remix](https://remix.run/)
- [TypeScript](https://www.typescriptlang.org/)
- [SQLite](https://www.sqlite.org/)
- [Drizzle ORM](https://github.com/drizzle-team/drizzle-orm)
