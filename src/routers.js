import {createBrowserRouter, createRoutesFromElements, Route} from "react-router-dom";
import {HomePage} from "./component/HomePage";
import {Root} from "./component/Root";
import {MenuPage} from "./component/MenuPage.js";
import {ArchiveRentPage} from "./component/ArchiveRentPage.js";
import {ProfilePage} from "./component/ProfilePage.js";
import {LoginPage} from "./component/LoginPage.js";
import {RentPage} from "./component/RentPage";

export const routes = {
    menu: '/menu',
    rent: '/rents',
    archive: `rents/archived`,
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
            <Route path={routes.archive} element={<ArchiveRentPage/>}/>
            <Route path={routes.profile} element={<ProfilePage/>}/>
            <Route path={routes.login} element={<LoginPage/>}/>
            <Route path={`${routes.rent}/:rentId`} element={<RentPage/>}/>
        </Route>
    )
)


