# Discord bot template
**Used within 115 Studio**

## Stack
- Nest.js
- TypeORM
- Discord.js
- Docker
- PostgreSQL

## Basic usage
1. Clone the repository
2. Install dependencies `npm i`
3. Copy `.env.example` to `.env` and fill it with your data
4. Deploy database using docker `npm run deploy:dev`
5. Run the bot `npm run start:dev`

When deploying to production, use only `npm run deploy:prod`. It will build the app and deploy the database.

## Commands and more
You can see example command in `apps/bot/src/commands/hello-world.command.ts`. 

Create a new command in apps/bot/src/commands folder. Write class that implements one of: `TextCommand`, `SlashCommand`, `UserCommand`, `MessageCommand`, `SelectMenuCommand`, `ButtonCommand`, `ModalSubmitCommand`, `AutocompleteCommand`. 

Then export it in apps/bot/src/index.ts file. It will be automatically loaded & registered in Discord.

Commands is not limited to only slash commands. It handles all types of interactionCreate events using custom id system. 

## Custom id system
