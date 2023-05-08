import {createBrowserRouter, createRoutesFromElements, Navigate, Route} from "react-router-dom";
import {HomePage} from "./component/home/HomePage.js";
import {Root} from "./component/Root";
import {ArchiveRentPage} from "./component/rent/ArchiveRentPage.js";
import {ProfilePage} from "./component/ProfilePage.js";
import {RentPage} from "./component/rent/RentPage.js";
import {ErrorRentPage} from "./component/ErrorPage";
import {SecuredPage} from "./component/SecuredPage.js";
import {SigInPage} from "./component/SigInPage.js";
import {SignUpPage} from "./component/SignUpPage.js";
import {ConfirmationUserPage} from "./component/ConfirmationUserPage.js";

export const routes = {
    menu: '/menu',
    rent: '/rents',
    archiveRents: '/rents/archived',
    profile: '/profile',
    settings: '/settings',
    root: '/',
    home: '/home',
    signIn: '/signin',
    signUp: '/signup',
    confirm: '/confirm'
}

export const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path={routes.root} element={<Root/>}>
            <Route path=''
                   element={<Navigate to={routes.home}/>}/>
            <Route path={routes.home}
                   element={
                       <SecuredPage>
                           <HomePage/>
                       </SecuredPage>
                   }/>
            <Route path={routes.profile}
                   element={
                       <SecuredPage>
                           <ProfilePage/>
                       </SecuredPage>
                   }/>

            <Route path={routes.archiveRents} element={<ArchiveRentPage/>}/>
            <Route path={routes.signIn} element={<SigInPage/>}/>
            <Route path={routes.signUp} element={<SignUpPage/>}/>
            <Route path={`${routes.rent}/error`} element={<ErrorRentPage/>}/>
            <Route path={`${routes.rent}/:rentId`} element={<RentPage/>}/>
            <Route path={`${routes.confirm}/:id`} element={<ConfirmationUserPage/>}/>
        </Route>
    )
)


