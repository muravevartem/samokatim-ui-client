import React, {useState} from "react";
import {AbsoluteCenter, Box, Button, ButtonGroup, Center, Container, Heading, Input, Stack} from "@chakra-ui/react";

export function LoginPage() {
    const [signInObject, setSignInObject] = useState({});

    return (
        <AbsoluteCenter>
            <Container>
                <InternalLoginComponent
                    value={signInObject}
                    onChange={setSignInObject}/>
            </Container>
        </AbsoluteCenter>
    )
}

function InternalLoginComponent(props) {

    function onChange(value) {
        props.onChange({
            ...props.value,
            ...value
        })
    }

    return (
        <Stack>
            <Heading colorScheme='yellow'>Самокатим</Heading>
            <Input
                value={props.value.login}
                onChange={event => onChange({login: event.target.value})}
                placeholder='email@email.com'
            />
            <Input
                type='password'
                value={props.value.password}
                onChange={event => onChange({password: event.target.value})}
            />
            <ButtonGroup>
                <Button colorScheme='gray'>Отмена</Button>
                <Button colorScheme='yellow'>Войти</Button>
            </ButtonGroup>
        </Stack>
    );
}