# Packing List App

## Table of Contents

- [Description](#description)
- [Installation Instructions](#installation-instructions)
- [Usage and Screenshots](#usage-and-screenshots)
- [Technologies Used](#technologies-used)
- [Dependencies and Credits](#dependencies-and-credits)
- [Project Structure](#project-structure)

## Description

I created this app as part of the curriculum for [The Odin Project](https://www.theodinproject.com). Originally I was planning to do a store inventory but thought that this packing list would be more useful for me in the future.

## Installation Instructions

1. Clone or fork this repo
2. cd into the project root directory (where the README.md file is located)
3. Run the following in your terminal
    - ``` bash
      npm init -y
      npm install 
      ```
1. Create a .env file 
   - ``` bash
     PORT="3000" (or any even 4 digit integer)
     ROLE_NAME= (database role name)
     ROLE_PASSWORD= (database role password)
     DATABASE_NAME= (database name)
     DATABASE_URL= (URL if remote database)
     ```
1. ``` bash
   npm run dev
   ```
   - `^` + `c` will end the process 

## Usage and Screenshots

<img src="./public/screenshot.png" alt="screenshot" style="height: 50vh; width: auto;">

To create a new item click on the "+ Add new item" button. An existing item can be edited by clicking the "Edit" button on the far right side.

- [Link to live preview](https://packing-list-67q7.onrender.com/)

### Features
- Allows users to add items to more than one category so that the same item can be used in multiple places
- Items can be edited
- Items can be marked as worn

## Technologies Used

### Frontend

- <a href="https://ejs.co/"><img src="https://img.icons8.com/?size=100&id=Pxe6MGswB8pX&format=png&color=000000" style="height: 2rem; width: auto; vertical-align: middle;"> EJS </a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-original.svg" style="height: 2rem; width: auto;"> JavaScript</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/HTML"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-original.svg" style="height: 2rem; width: auto;"> HTML</a>
- <a href="https://developer.mozilla.org/en-US/docs/Web/CSS"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-original.svg" style="height: 2rem; width: auto;"> CSS</a>

### Backend          
- <a href="https://nodejs.org"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg" style="height: 2rem; width: auto;"> Node.js</a>
- <a href="https://expressjs.com/"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/express/express-original.svg" style="height: 2rem; width: auto;"> Express</a>

### Development Tools

- <a href="https://code.visualstudio.com/"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg" style="height: 24px; width: auto;"/> VS Code</a>
- <a href="https://www.npmjs.com/"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/npm/npm-original.svg" style="height: 24px; width: auto;"/> NPM</a>
- <a href="https://git-scm.com/"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg" style="height: 24px; width: auto;"/> Git</a>

### Hosting

- <a href="https://github.com/"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original.svg" style="height: 24px; width: auto;"/> Github</a>
- <a href="https://render.com/"><img src="https://render.com/icon.svg" style="height: 24px; width: auto;"/> Render</a>


## Dependencies and Credits

### Package Dependencies

- [cors](https://www.npmjs.com/package/cors)
- [dotenv](https://www.npmjs.com/package/dotenv)
- [express-validator](https://www.npmjs.com/package/express-validator)
- [pg](https://www.npmjs.com/package/pg)

### Other Credits

- [Devicion](https://devicon.dev/)
- [Skillicons](https://skillicons.dev/)
- [LighterPack](https://lighterpack.com/)

## Project Structure

```bash
├──controllers/            # Controller function
├──db/                     # Mock database using JavaScript files
├──public/                 # Locally hosted image files
├──routes/                 # Router file
└──views/                  # Files to generate pages with EJS
    └── partials/          # Partial EJS
```
