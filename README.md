<h1 align="center">
  <br>
  <a href="TBD-demo-prod"><img src="https://i.imgur.com/J3xI4fm.gif" alt="Markdownify" width="600"></a>
  <br>
  TypeHacker
  <br>
</h1>

## What is it?
Typehacker (originally named _Typefighters_) is one of X-Team's internal games developed with Phaser and focused on the web.

## 📑Contents

* [Tech Stack](#tech-stack)
* [Requirements](#requirements)
* [Project](#project)
    * [Environmental Variables](#environmental-variables)
    * [Run The Game](#run-the-game)
* [How to contribute](#how-to-contribute)
	* [JIRA](#jira)
    * [Commits](#commits)
    * [Pull Requests](#pull-requests)
* [Continous Integration](#continous-integration)

## 📦Tech Stack
* [Node.js](https://nodejs.org/)
* [Typescript](https://www.typescriptlang.org/)
* [Vite](https://vitejs.dev/)
* [Phaser](https://phaser.io/)

## 🔎Requirements
* [NVM - Node Version Manager](https://github.com/nvm-sh/nvm)

## 🚀Project
Let's setup the project!🥹

### **🔒Environmental Variables**
The APP needs some env vars to work properly. You can ask @ccmoralesj for this.

Just grab the `.env.example` file and copy everything into a new file called `.env`. It will look something like this at first.

```
# NOT SO PUBLIC
API_SIGNING_SECRET=

# PUBLIC
VITE_API_HOST="http://127.0.0.1:3000"
VITE_API_CLIENT_SECRET=

# GAMES API LEADERBOARD
VITE_GAMES_API_HIGHEST_LEADERBOARD_ID=
```

### **🎮Run The Game**
We are almost there with the setup.🥲

**Optional:** You can run the API to connect the game with. Is not mandatory, but it could be good if you want to login and send data tothe DB. Go to [Games API repo](https://github.com/x-team/GamesHQ-API) and follow the [README](https://github.com/x-team/GamesHQ-API#readme) to setup you own API, or you can connect with the staging API:

```bash
VITE_API_HOST=https://gameshq-api-staging.x-team.com
```

Now let's run the Game. 🎮


First, make sure you're using our recommended version of Node and yarn by running these commands:

```bash
nvm use
```

Following up, we have to install all required dependencies to run the project:

```bash
npm i
```

Finally, run the game with the following command:

```bash
npm run dev

# If you want to run "production" mode use npm run build and go to dist/index.html
```

The Game should be up and running 🎮at port 3000! (or 3001 if you ran the API first)🎮 You can verify by browsing to [http://localhost:3000](http://localhost:3000)

Let's start game-dev!🤓
![Running game](https://i.imgur.com/Twd9PFA.gif)

## 🫂How to contribute
Collaborate in this repo is quite easy.
### 📊JIRA
You only need to pick up a ticket from the [JIRA board](https://x-team-internal.atlassian.net/jira/software/c/projects/XTG/boards/48) (If you don't have access you can ask @ccmoralesj)

Each JIRA ticket has an identifier based on a code and a number like XTG-123 which you will use later.
### 💾Commits
Each commit you do needs to have the JIRA ticket identifier so it can be related to the board.

You can use this commit format suggestion.

```
:optional-emoji: XTG-123: New endpoint to handle login
```
**Note:** Please don't commit with `--no-verify` to skip the husky precommit hook

| **Emoji** | **Description**                         |
|-----------|-----------------------------------------|
| **🚀**    | New features, or enhancements to code   |
| **🐞**    | Bug fixes                               |
| **⚙️**    | Refactors                               |
| **📦**    | Build files, dependencies, config files |
| **🔎**    | Minor fixes, typos, imports, etc        |
| **🪄**    | Others                                  |

![Commit Example](https://i.imgur.com/gClC6CV.gif)

### 🕵🏻Pull Requests
Once you're ready. You can create a new Pull Request (PR) by adding the JIRA ticket identifier in the title. The repo will give you a template to fill in the details of your amazing work!

You can use this PR title format suggestion.

```
XTG-123: Login
```

You'll need at least 1 review from your teammates to merge the pull request.

## 🪄Continous Integration
This project is connected to an EC2 instance from AWS.

All code from `main` branch will be deployed to staging.

To **deploy to production** you must create a `new release` and follow the [semantic versioning](https://semver.org/lang/es/) fundamentals. That will trigger an automated deployment to **production**.
