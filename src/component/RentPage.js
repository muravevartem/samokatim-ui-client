import React, {useEffect, useId, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {Alert, AlertIcon, Center, CircularProgress, Skeleton, VStack} from "@chakra-ui/react";
import {Header} from "./util";
import {paymentService} from "../service/PaymentService";
import {errorService} from "../service/ErrorService";

export function RentPage() {
    const params = useParams();
    const rentId = params['rentId'];
    const [loading, setLoading] = useState(false);
    const [rent, setRent] = useState({});
    const [error, setError] = useState();
    const navigate = useNavigate();

    async function loadRent() {
        try {
            setLoading(true);
            let rent = await paymentService.getRent(rentId);
            setRent(rent);
        } catch (e) {
            navigate('/rents/error')
        } finally {
            setLoading(false)
        }
    }

    useEffect(()=>{
        loadRent()
    },[])

    if (loading)
        return (
            <Center w='100%' h='100vh'>
                <CircularProgress isIndeterminate color='green'/>
            </Center>
        )

    if (error)
        return (
            <Center w='100%' h='100vh'>
                <Alert status='error'><AlertIcon/>{error.message}</Alert>
            </Center>
        )

    return (
        <VStack w='100%' alignItems='start' p={5}>
            <Header title={`Аренда #${rentId}`}/>
            <RentView>

            </RentView>
        </VStack>
    )
}

function RentView() {
    return (
        <></>
    )
}