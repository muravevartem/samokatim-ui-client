import React, {useEffect} from "react";
import {Outlet} from "react-router-dom";
import {VStack} from "@chakra-ui/react";

export function Root() {
    useEffect(() => {
        document.title = 'Самокатим'
    },[])
    return (
        <VStack>
            <Outlet/>
        </VStack>
    )
}
