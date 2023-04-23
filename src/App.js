import './App.css';
import {Box} from "@chakra-ui/react";
import {RouterProvider} from "react-router-dom";
import {router} from "./routers";
import {useEffect} from "react";

function App() {
    return (
        <Box w='100%' minH='100vh'>
            <RouterProvider router={router}/>
        </Box>
    );
}

export default App;
