import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import {HomePage} from "./component/HomePage";
import {Root} from "./component/Root";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<Root/>}>
            <Route path='' element={<HomePage/>}/>
        </Route>
    )
)