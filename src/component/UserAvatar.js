import React, {useEffect, useState} from "react";
import {Avatar, Skeleton, useToast} from "@chakra-ui/react";
import {userService} from "../service/UserService.js";

export function UserAvatar(props) {
    // let [loading, setLoading] = useState(false);
    // let [user, setUser] = useState({});
    // let toast = useToast();

    // async function loadMe() {
    //     setLoading(true);
    //     try {
    //         let u = await userService.me();
    //         setUser(u);
    //     } catch (e) {
    //         console.log(e)
    //         toast({
    //             status: 'error',
    //             title: 'Ошибка',
    //             description: 'Не удалось загрузить информацию о пользователе',
    //             duration: 2000
    //         })
    //     } finally {
    //         setLoading(false);
    //     }
    // }

    // useEffect(() => {
    //     loadMe()
    // }, [])

    return (
<></>
    )


}
