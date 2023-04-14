import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import {HomePage} from "./component/HomePage";
import {Root} from "./component/Root";
import {MenuPage} from "./component/MenuPage.js";

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path='/' element={<Root/>}>
            <Route path='' element={<HomePage/>}/>
            <Route path='/menu' element={<MenuPage/>}/>
        </Route>
    )
)
