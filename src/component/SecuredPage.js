import React, {useEffect} from "react";
import {userService} from "../service/UserService.js";
import {Navigate, useNavigate} from "react-router-dom";
import {routes} from "../routes.js";
import {AppEvents, eventBus} from "../service/EventBus.js";

export function SecuredPage({children}) {

    let navigate = useNavigate();

    useEffect(() => {
        let onLogOut = eventBus.on(AppEvents.LogOut, () => navigate(routes.signIn));

        return () => {
            onLogOut();
        }
    })

   if (userService.authenticated())
       return children;
   return <Navigate to={routes.signIn}/>
}
