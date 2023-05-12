import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import isNumeric from "validator/es/lib/isNumeric.js";
import {routes} from "../routes.js";
import {
    Button,
    Center,
    Collapse,
    Divider,
    FormControl,
    FormHelperText,
    FormLabel,
    HStack,
    PinInput,
    PinInputField,
    Skeleton,
    Stack,
    Text,
    useToast,
    VStack
} from "@chakra-ui/react";
import {InputPassword} from "./components.js";
import {userService} from "../service/UserService.js";
import {errorConverter} from "../error/ErrorConverter.js";

export function ConfirmationUserPage() {
    let [state, setState] = useState({
        password: '',
        confirmPassword: '',
        code: ''
    });
    let [loading, setLoading] = useState(false);

    let {id} = useParams();
    let navigate = useNavigate();
    let toast = useToast();

    useEffect(() => {
        if (!isNumeric(id))
            navigate(routes["404"])
    }, [])


    async function setNewPassword() {
        try {
            setLoading(loading);
            await userService.completeInvite(id, {
                password: state.password,
                code: state.code
            })
            toast({
                status: 'success',
                title: 'Пароль успешно изменен',
                duration: 120000,
                isClosable: true
            })
            navigate(routes.signIn);
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        }
    }

    return (
        <Center minH='100vh'>
            <VStack spacing={4}>
                <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                      bgClip="text"
                      fontSize="4xl"
                      textAlign='center'
                      fontWeight="extrabold">
                    Изменение пароля
                </Text>
                <div style={{height: 30}}/>
                <Stack>
                    <FormControl>
                        <FormLabel>
                            <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                                  bgClip='text'
                                  fontSize="md"
                                  fontWeight="extrabold">
                                Код подтверждения
                            </Text>
                        </FormLabel>
                        <HStack>
                            <PinInput type='alphanumeric'
                                      colorScheme='brand'
                                      onChange={code => setState({
                                          ...state,
                                          code: code
                                      })}
                                      value={state.code}>
                                <PinInputField/>
                                <PinInputField/>
                                <PinInputField/>
                                <PinInputField/>
                                <PinInputField/>
                                <PinInputField/>
                            </PinInput>
                        </HStack>
                    </FormControl>
                    <Collapse in={state.code.length === 8} animateOpacity>
                        <Stack w='100%'>
                            <FormControl>
                                <FormLabel>
                                    <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                                          bgClip='text'
                                          fontSize="md"
                                          fontWeight="extrabold">
                                        Введите новый пароль
                                    </Text>
                                </FormLabel>
                                <InputPassword
                                    placeholder='*******'
                                    onlyHidden
                                    value={state.password}
                                    onChange={e => setState({
                                        ...state,
                                        password: e.target.value
                                    })}
                                    isInvalid={state.password !== '' && state.password < 6}
                                />
                                <FormHelperText >Длина не менее 6 символов</FormHelperText>
                            </FormControl>

                            <Divider/>
                            <FormControl>
                                <FormLabel>
                                    <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                                          bgClip='text'
                                          fontSize="md"
                                          fontWeight="extrabold">
                                        Повторите пароль
                                    </Text>
                                </FormLabel>
                                <InputPassword
                                    placeholder='*******'
                                    onlyHidden
                                    value={state.confirmPassword}
                                    onChange={e => setState({
                                        ...state,
                                        confirmPassword: e.target.value
                                    })}
                                    isInvalid={state.confirmPassword !== '' && state.confirmPassword !== state.password}
                                />
                                <FormHelperText >Пароль должен совпадать с ранее введенным</FormHelperText>
                            </FormControl>
                            <div style={{height: 30}}/>
                            <Skeleton isLoaded={!loading}>
                                <HStack justifyContent='center'>
                                    <Button onClick={() => navigate(routes.signIn)}>
                                        Отмена
                                    </Button>
                                    <Button colorScheme='brand'
                                            isDisabled={
                                                state.password.length < 6
                                                || state.confirmPassword !== state.password
                                                || state.code.length !== 6
                                            }
                                            onClick={setNewPassword}>
                                        Изменить
                                    </Button>
                                </HStack>
                            </Skeleton>
                        </Stack>
                    </Collapse>
                </Stack>

            </VStack>
        </Center>
    )

}
