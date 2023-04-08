import React, {useState} from "react";
import {Box, Button, CloseButton, Container, HStack, IconButton, Slide, Text, VStack} from "@chakra-ui/react";
import {FaBicycle} from "react-icons/fa";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";

export function HomePage() {
    const [isOpenMenu, setIsOpenMenu] = useState(false);

    return (
        <VStack>
            <Box zIndex={99}>
                <IconButton onClick={() => setIsOpenMenu(!isOpenMenu)}>

                </IconButton>
            </Box>

            <Box w='100%' h='100vh' position='fixed' zIndex={0} top={0}>
                <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} style={{width: '100%', height: '100%'}}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[51.505, -0.09]}>
                        <Popup>
                            A pretty CSS3 popup. <br /> Easily customizable.
                        </Popup>
                    </Marker>
                </MapContainer>
            </Box>
            <Slide direction='bottom' in={isOpenMenu}>
                <Container bg='white' padding={5}>
                    <CloseButton/>
                    <Text
                        bgGradient='linear(to-l, #7928CA, #FF0080)'
                        bgClip='text'
                        fontSize='4xl'
                        fontWeight='extrabold'
                    >
                        Самокатим
                    </Text>
                    <HStack>
                        <IconButton
                            size='4xl'
                            icon={<FaBicycle/>}
                            aria-label='open menu'/>
                    </HStack>
                    <Button>
                        Ok
                    </Button>
                </Container>
            </Slide>
        </VStack>
    )
}