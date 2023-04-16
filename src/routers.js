import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import {HomePage} from "./component/HomePage";
import {Root} from "./component/Root";
import {MenuPage} from "./component/MenuPage.js";
import {OrderPage} from "./component/OrderPage.js";
import {ProfilePage} from "./component/ProfilePage.js";
import {LoginPage} from "./component/LoginPage.js";

export const routes = {
    menu: '/menu',
    orders: '/orders',
    profile: '/profile',
    settings: '/settings',
    home: '/',
    login: '/signin',
    register: '/signup'
}

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path={routes.home} element={<Root/>}>
            <Route path='' element={<HomePage/>}/>
            <Route path={routes.menu} element={<MenuPage/>}/>
            <Route path={routes.orders} element={<OrderPage/>}/>
            <Route path={routes.profile} element={<ProfilePage/>}/>
            <Route path={routes.login} element={<LoginPage/>}/>
        </Route>
    )
)


