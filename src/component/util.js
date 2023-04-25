import React, {useEffect} from "react";
import {Card, CardBody, Heading, HStack, IconButton, Skeleton, Tag, VStack} from "@chakra-ui/react";
import {MdArrowBack} from "react-icons/md";
import {useNavigate} from "react-router-dom";
import moment from "moment";
import {IoMdCash} from "react-icons/io";

export function pageTitle(title) {
    document.title = title
}

export function Header({title}) {
    let navigate = useNavigate();

    return (
        <HStack justifyContent='start' w='100%' spacing={4}>
            <IconButton icon={<MdArrowBack/>} aria-label={''} onClick={() => navigate(-1)} colorScheme='green'/>
            <Heading>{title}</Heading>
        </HStack>
    );
}

export function beautifulRelativeDate(date) {
    let mDate = moment(date);
    return mDate.format('LLL')
}

export function NotContent() {
    return (
        <></>
    )
}

export function toLastPoint(track) {
    if (track) {
        return track[track.length - 1];
    }
    return null;
}