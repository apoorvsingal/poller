# The Poller Bot
A discord bot to create and manage polls.

## Commands
- `createPoll question:[question] options:[option1;;option2;;option3...] startThread:[True|False]` - Creates a poll. A thread is auto-instantiated under the poll if startthread is True.
- `setPollChannel channel:[#channel]` - Sets the server's poll channel to be the specified channel. This is where all polls are posted when `createpoll` command is used.
- `setPollInterval interval:[dd:hh:mm]` - Sets the expiration interval for polls to be the specified interval. The thread is archived after the poll is over and the original poll message is edited to show the final results.
- `setSubscriberRole role:[role]`- The specified role is notified every time a new poll is created.

## Example:
<img src="https://media.discordapp.net/attachments/905707713634377778/905819031829889034/unknown.png" alt="command" style="width:1000px;"/>
<img src="https://media.discordapp.net/attachments/905707713634377778/905813185968361482/unknown.png" alt="poll" style="width:500px;"/>

> Important: The bot never stores or tracks any information about the polls or server members apart from the polls' message IDs and expiration timestamps. All of your private data never leaves your server.

<br/>

## Running your own instance of the bot
Poller is licensed under the MIT license. Folow these steps to run your own instance of the bot:

### Clone the repository
```bash
git clone https://github.com/apoorvsingal/poller.git
```

### Setup the database

1. Poller uses [Google Cloud Firestore](https://firebase.google.com/docs/firestore) as it's database. Follow their getting started guide to create a firestore database.
2. Create a new service account and generate its private key from [here](https://console.cloud.google.com/iam-admin/serviceaccounts).
3. Put the `FIREBASE_ADMIN_PROJECT_ID`, `FIREBASE_ADMIN_PRIVATE_KEY`, and `FIREBASE_ADMIN_CLIENT_EMAIL` environment variables inside the `.env` file from the generated JSON service account credentails file.

### Setup discord bot account

1. Follow [the official Discord docs](https://discord.com/developers/docs/intro) to create a new discord application and bot.
2. Copy the bot token and put it as the `DISCORD_BOT_TOKEN` environment variable inside the .env file.

### Example .env
```env
FIREBASE_ADMIN_PROJECT_ID="firebase project id"
FIREBASE_ADMIN_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n
firebase private key
\n-----END PRIVATE KEY-----\n"
FIREBASE_ADMIN_CLIENT_EMAIL="firebase client email"
DISCORD_BOT_TOKEN="discord bot token"
```

### Install packages
```bash
cd poller
yarn
```

### Run the bot
```bash
node index.js
```

You should see an output like this after that command:
```bash
Successfully registered application commands.
Logged in as Poll Bot#2360!
```

The bot should be up and running after this. You can now start editing and files and playing around with the code. Check out [the discord.js docs](https://discordjs.guide/) for more on how to use the discord API.
