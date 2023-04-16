import React, {useEffect} from "react";
import {CloseButton, Divider, Heading, HStack, IconButton, LinkBox, Text, VStack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";
import {MdArrowBack} from "react-icons/md";

export function MenuPage() {
    let navigate = useNavigate();

    useEffect(() => {
        document.title = 'Самокатим.Меню'
    },[])

    return (
        <VStack w='100%'>
            <HStack justifyContent='start' w='100%' p={5} spacing={3}>
                <IconButton icon={<MdArrowBack/>} aria-label={''} onClick={() => navigate(-1)} colorScheme='green'/>
                <Heading>Меню</Heading>
            </HStack>
            <LinkBox
                w='100%'
                p='5'
                onClick={() => navigate('/history')}
                cursor='default'>
                <Heading size='md'>История</Heading>
            </LinkBox>
            <Divider/>
            <LinkBox
                w='100%'
                p='5'
                onClick={() => navigate('/settings')}
                cursor='default'>
                <Heading size='md'>Настройки</Heading>
            </LinkBox>
        </VStack>
    )
}
