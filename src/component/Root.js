import React, {useEffect} from "react";
import {Outlet, useNavigate} from "react-router-dom";
import {VStack} from "@chakra-ui/react";
import moment from "moment";
import 'moment/locale/ru.js'
import {events, eventService} from "../service/EventService.js";
import {routes} from "../routers.js";


export function Root() {
    moment.locale('ru')

    let navigate = useNavigate();

    useEffect(() => {
        document.title = 'Самокатим'
        eventService.subscribe(events.error403, () => navigate(routes.login))
    },[])
    return (
        <VStack>
            <Outlet/>
        </VStack>
    )
}
