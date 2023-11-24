import { Counter } from "./components/Counter";
import { FetchData } from "./components/FetchData";
import Home from "./components/Home";
import Login from "./components/authentication/Login";
import Register from "./components/authentication/Register";
import BrowseDecks from "./components/BrowseDecks";
import UpdateDeck from "./components/UpdateDeck";
import CreateDeck from "./components/CreateDeck";
import DeleteDeck from "./components/DeleteDeck";


const AppRoutes = [
  {
    index: true,
    element: <Home />
  },
  {
    path: '/counter',
    element: <Counter />
  },
  {
    path: '/fetch-data',
    element: <FetchData />
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
    path: '/login',
    element: <Login />
  },
  {
    path: '/register',
    element: <Register />
  }
];

export default AppRoutes;
