import React from "react";
import {Outlet} from "react-router-dom";
import {Avatar, Box, Button, ButtonGroup, Flex, Heading, IconButton, Spacer, VStack} from "@chakra-ui/react";
import {FaAndroid, FaMagic} from "react-icons/fa";

export function Root() {
    return (
        <>
            <VStack>
                <Header/>
                <Outlet/>
            </VStack>
        </>
    )
}

function Header() {
    return (
        <Flex justifyContent='space-around' padding={2} zIndex={99} w='100%'>
            <IconButton aria-label={'menu'} icon={<FaAndroid/>}/>
            <Box p='2'>
                <Heading size='md' bg='yellow'>
                    Самокатим
                </Heading>
            </Box>
            <Avatar name='Муравьев Артём'>

            </Avatar>
        </Flex>
    )
}