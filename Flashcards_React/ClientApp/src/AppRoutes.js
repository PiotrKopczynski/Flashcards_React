import Home from "./components/home/Home";
import Login from "./components/authentication/Login";
import Register from "./components/authentication/Register";
import BrowseDecks from "./components/deck/BrowseDecks";
import UpdateDeck from "./components/deck/UpdateDeck";
import CreateDeck from "./components/deck/CreateDeck";
import DeleteDeck from "./components/deck/DeleteDeck";
import BrowseFlashcards from "./components/flashcard/BrowseFlashcards";
import CreateFlashcard from "./components/flashcard/CreateFlashcard";
import UserTable from "./components/admin/UserTable";
import Unauthorized from "./components/admin/Unauthorized";
import UpdateFlashcard from "./components/flashcard/UpdateFlashcard";
import DeleteFlashcard from "./components/flashcard/DeleteFlashcard";
import DetailFlashcard from "./components/flashcard/DetailFlashcard";
import Privacy from "./components/Privacy";


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
    path: '/detailflashcard/:deckId',
    element: <DetailFlashcard />
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
    },

    {
        path: '/privacy',
        element: <Privacy />
    }

];

export default AppRoutes;
