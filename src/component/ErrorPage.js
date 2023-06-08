import React from "react";
import {useNavigate, useRouteError} from "react-router-dom";
import {Button, Center, Image, Text, VStack} from "@chakra-ui/react";
import {routes} from "../routes.js";

export function ErrorPage() {
    const error = useRouteError();
    // console.log(error);

    return <>Ошибка</>
}

export function ErrorRentPage() {
    let navigate = useNavigate();

    return (
        <Center w='100%' h='100vh' bgColor='black'>
            <VStack spacing={6}>
                <Image src='/error-background.gif' boxShadow={0} boxSize={200} borderBox={0}/>
                <Text textColor='white'>
                    Что-то пошло не так...
                </Text>
                <Button size='sm' onClick={()=>navigate(routes.home)}>
                    На главную
                </Button>
            </VStack>
        </Center>
    )
}
