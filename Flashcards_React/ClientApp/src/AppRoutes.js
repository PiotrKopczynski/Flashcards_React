import Home from "./components/Home";
import Login from "./components/authentication/Login";
import Register from "./components/authentication/Register";
import BrowseDecks from "./components/BrowseDecks";
import UpdateDeck from "./components/UpdateDeck";
import CreateDeck from "./components/CreateDeck";
import DeleteDeck from "./components/DeleteDeck";
import BrowseFlashcards from "./components/BrowseFlashcards";
import CreateFlashcard from "./components/CreateFlashcard";
import UserTable from "./components/admin/UserTable";
import Unauthorized from "./components/admin/Unauthorized";
import UpdateFlashcard from "./components/UpdateFlashcard";
import DeleteFlashcard from "./components/DeleteFlashcard";


const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/browsedecks',
    element: <BrowseDecks />
  },
  {
    path: '/updatedeck/:deckId',
    element: <UpdateDeck />
  },
  {
    path: '/createdeck',
    element: <CreateDeck />
  },
  {
    path: '/deletedeck/:deckId',
    element: <DeleteDeck />
  },
  {
    path: '/browseflashcards/:deckId',
    element: <BrowseFlashcards />
   },
   {
     path: '/updateflashcard/:deckId',
     element: <UpdateFlashcard />
   },
   {
      path: '/deleteflashcard/:deckId',
      element: <DeleteFlashcard />
   },
  {
    path: '/createflashcard/:deckId',
    element: <CreateFlashcard />
  },
  {
    path: '/usertable',
    element: <UserTable />
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
];

export default AppRoutes;
