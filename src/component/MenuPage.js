import React, {useEffect} from "react";
import {CloseButton, Divider, Heading, HStack, LinkBox, Text, VStack} from "@chakra-ui/react";
import {useNavigate} from "react-router-dom";

export function MenuPage() {
    let navigate = useNavigate();

    useEffect(() => {
        document.title = 'Самокатим.Меню'
    },[])

    return (
        <VStack w='100%'>
            <HStack justifyContent='end' w='100%' p={5}>
                <CloseButton onClick={() => navigate(-1)} color='green'/>
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
