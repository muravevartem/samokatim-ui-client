import React from "react";
import {Outlet} from "react-router-dom";
import {VStack} from "@chakra-ui/react";
import moment from "moment";
import 'moment/locale/ru.js'


export function Root() {
    moment.locale('ru')


    return (
        <VStack>
            <Outlet/>
        </VStack>
    )
}
