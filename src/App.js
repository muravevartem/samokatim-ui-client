import './App.css';
import {ChakraProvider, extendTheme} from "@chakra-ui/react";
import {RouterProvider} from "react-router-dom";
import {router} from "./routes.js";

const theme = extendTheme({
    colors: {
        brand: {
            100: '#E1BEE7',
            200: '#CE93D8',
            300: '#BA68C8',
            400: '#AB47BC',
            500: '#9C27B0',
            600: '#8E24AA',
            700: '#7B1FA2',
            800: '#6A1B9A',
            900: '#4A148C'
        }
    }
})

function App() {
    return (
        <ChakraProvider theme={theme}>
            <RouterProvider router={router}/>
        </ChakraProvider>
    );
}

export default App;
