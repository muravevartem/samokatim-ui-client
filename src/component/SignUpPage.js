import React, {useState} from "react";
import {
    Alert,
    AlertDescription,
    AlertIcon,
    AlertTitle,
    Button,
    ButtonGroup,
    Center,
    FormControl,
    FormLabel,
    Input,
    InputGroup,
    Link,
    Stack,
    Text,
    useToast,
    VStack
} from "@chakra-ui/react";
import isEmail from "validator/es/lib/isEmail.js";
import {errorConverter} from "../error/ErrorConverter.js";
import {userService} from "../service/UserService.js";
import {routes} from "../routes.js";


export function SignUpPage() {
    const [step, setStep] = useState(0);
    const [client, setClient] = useState({
        email: ''
    });

    function onNext() {
        setStep(step + 1)
    }

    function onPrev() {
        setStep(step - 1)
    }

    const steps = [
        (<InvateStep value={client} onChange={setClient} onNext={onNext}/>),
        (<InfoStep value={client}/>)
    ]

    console.log(step)

    return steps[step];
}

function InvateStep({value, onChange, onPrev, onNext}) {
    const toast = useToast();

    async function register() {
        try {
            await userService.registration(value)
            onNext()
        } catch (e) {
            toast(errorConverter.convertToToastBody(e))
        }
    }

    return (
        <Stack minH='100vh'>
            <Center minH='100vh'>
                <VStack spacing={6} p={6} rounded={5}>
                    <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                          bgClip='text'
                          p={2}
                          fontSize="4xl"
                          textAlign='center'
                          fontWeight="extrabold">
                        Регистрация
                    </Text>

                    <FormControl>
                        <FormLabel>
                            <Text bgGradient="linear(to-l, #7928CA,#FF0080)"
                                  bgClip='text'
                                  fontSize="md"
                                  fontWeight="extrabold">
                                Адрес электронной почты
                            </Text>
                        </FormLabel>
                        <InputGroup>
                            <Input value={value.email}
                                   fontWeight='bolder'
                                   onChange={e => onChange({...value, email:e.target.value})}/>
                        </InputGroup>
                    </FormControl>


                    <ButtonGroup>
                        <Button colorScheme='brand'
                                isDisabled={!isEmail(value.email)}
                                onClick={register}>
                            Готово
                        </Button>
                    </ButtonGroup>
                </VStack>
            </Center>
        </Stack>
    )
}

function InfoStep({value}) {


    return (
        <Center minH='100vh'>
            <VStack spacing={6} p={4}>
                <Alert
                    status='success'
                    variant='subtle'
                    flexDirection='column'
                    alignItems='center'
                    justifyContent='center'
                    textAlign='center'
                    rounded={10}
                >
                    <AlertIcon boxSize='40px' mr={0}/>
                    <AlertTitle mt={4} mb={1} fontSize='lg'>
                        На почтовый адрес {value.email} выслано приглашение
                    </AlertTitle>
                    <AlertDescription maxWidth='md'>
                        <VStack>
                            <Text>
                                Приглашение действительно 15 минут.
                                По истечению указанного срока потребуется выполнить процедуру сброса пароля
                            </Text>
                            <Link href={routes.signIn} textDecor='underline'>
                                На страницу авторизации
                            </Link>
                        </VStack>
                    </AlertDescription>
                </Alert>
            </VStack>
        </Center>
    )
}
