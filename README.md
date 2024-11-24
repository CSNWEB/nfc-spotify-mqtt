# NFC Spotify MQTT Manager

## Description

This app listens the MQTT topic `nfc-player/spotify` for tag ids . When a tag is read, the app will search for the tag in the database and pubslish the Spotify URI to the MQTT topic `nfc-player/spotify`. If the tag cannot be found in the database a new record for the tag will be created. The UI then allows you to search for a song and add it to the tag. Moreover, you can select tags and generate a PDF for labels to print on the NFC cards.

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
