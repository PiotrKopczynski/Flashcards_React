## CFlashcards

### Utilized Tools:

- **Technology Stack**: This project is built using .NET 7 and ASP.NET Core in Visual Studio 2022.
- **ASP.NET Identity**: For user authentication and management.
- **Entity Framework Core**: To handle data access and database operations.
- **Open-Source Libraries**: We're using the following open-source libraries and resources: [KUTE.JS](https://thednp.github.io/kute.js/) -  animation engine, [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API) to incorporate voice data into web app. 
- **SQLite Database**: Our application uses a [SQLite](https://www.sqlite.org/index.html) database for storage users' data.

### User Instructions:

> [!NOTE]
> Before running the project you may need to install npm. Please follow instructions for installing and integrating font awesome icons in React with npm in the cmd

### Installation

1. Open Terminal/CMD: Access your project directory.
```bash
   cd .\Flashcards_React\ClientApp

2. Type in npm commands
```bash
npm i --save @fortawesome/fontawesome-svg-core
npm install --save @fortawesome/free-solid-svg-icons
npm install --save @fortawesome/react-fontawesome
npm install --save @fortawesome/fontawesome-free
npm install axios
``````
> [!NOTE]
> Please log in using the admin account for having access to all functions
> **Admin email**: admin@example.com
> **Password**: 123456#eE
> > It is also possible to log in with a normal user using the **testUser email**: testUser@example.com with the same password

1. **Choosing Flashcard Category**: Upon launching the web page, users can select between language and non-language flashcards.

2. **Language Flashcards**: If you choose language flashcards, the text-to-speech feature allows you to hear pronunciations in either Norwegian or English. Simply click on the sound sign to have the text read aloud.

3. **Non-Language Flashcards**: For non-language flashcards, you can interact with the content and test your knowledge.
# Flashcards_React

To use button icons in BrowseDeck: 
npm install --save @fortawesome/fontawesome-free
