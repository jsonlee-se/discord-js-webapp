# Embed webapp

This project contains a simple web interface to create and send embedded messages in discord.

## Project and `config.json` setup

This guide will walk you through setting up a Node.js project and creating a `config.json` file to manage your project's configuration.

## Prerequisites

- Git installed on your machine. You can download it from [Git official website](https://git-scm.com/).
- Node.js and npm (Node Package Manager) installed on your machine. You can download them from [Node.js official website](https://nodejs.org/).

### Step 1: Clone the repository

1. Open a terminal.
2. Navigate to the directory where you want to clone the repository.
3. Run the following command to clone the repository:

```shell
git clone https://github.com/JSON-Lee-ai/discord_js_webapp.git
```


### Step 2: Create a new Node.js project

1. Open a terminal.
2. Navigate to the directory where you want to create your project.
3. Run the following command to create a new Node.js project:

```shell
npm init -y

npm install
```

Add your configuration in JSON format in the root folder. For example:

```json
{
  "token" : "your-discord-token",
  "channel_id" : "your-channel-id",
}
```

You can add channel id's according to the channels you want to send embedded messages in.
