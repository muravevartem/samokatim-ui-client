import React, {useRef, useState} from "react";
import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogOverlay,
    Box,
    Button,
    CircularProgress,
    CloseButton,
    HStack,
    Link,
    Stack,
    Text,
    useDisclosure,
    useToast
} from "@chakra-ui/react";
import "cropperjs/dist/cropper.css";
import {fileService} from "../../service/FileService.js";
import {errorConverter} from "../../error/ErrorConverter.js";
import {FiFile} from "react-icons/fi";
import {Cropper} from "react-cropper";

export function InputImage({children, onUpload}) {
    let {isOpen, onOpen, onClose} = useDisclosure();
    const cancelRef = React.useRef()
    let [files, setFiles] = useState([]);

    useState(() => {
        console.log(files)
    }, [files])

    return (
        <>
            <Box onClick={onOpen}>
                {children}
            </Box>
            <AlertDialog
                isOpen={isOpen}
                leastDestructiveRef={cancelRef}
                onClose={onClose}
            >
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='xl' fontWeight='bold' textAlign='center'>
                            Загрузка изображения
                        </AlertDialogHeader>

                        <AlertDialogBody>
                            <Stack>
                                <ImageUpload files={files} setFiles={setFiles} onUpload={onUpload}/>
                            </Stack>
                        </AlertDialogBody>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
        </>
    )
}

function FileUpload({files, setFiles, multiple = false}) {
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    console.log(files)

    async function uploadFile(filesForUpload) {
        try {
            if (filesForUpload.length === 0) {
                return;
            }
            setLoading(true);
            let uploadedFile = await fileService.upload(filesForUpload[0]);
            if (multiple) {
                setFiles([...files, uploadedFile]);
            } else {
                setFiles([uploadedFile])
            }

        } catch (e) {
            toast(errorConverter.convertToToastBody(e));
        } finally {
            setLoading(false);
        }
    }

    function deleteFile(file) {
        setFiles(files.filter(f => file.id !== f.id))
    }

    return (
        <Stack>
            <input type='file'
                   multiple={multiple}
                   id='input-id'
                   style={{display: 'none'}}
                   disabled={loading}
                   onChange={e => uploadFile(Array.from(e.target.files))}/>
            <Stack>
                {files.map(file => (
                    <HStack bgColor='whiteAlpha.500'
                            key={file.id}
                            p={2}
                            rounded={10}
                            justifyContent='space-between'
                            zIndex={99}>
                        <HStack gap={1}>
                            <FiFile/>
                            <Stack spacing={0}>
                                <Link color='brand.600'
                                      isExternal
                                      href={fileService.url(file)}
                                      fontWeight='bolder'>
                                    {file.originalFilename}
                                </Link>
                                <Text>{(file.bytes/1024).toFixed(2)} Кб</Text>
                            </Stack>
                        </HStack>
                        <CloseButton onClick={e => {
                            deleteFile(file);
                            e.stopPropagation()
                        }}/>
                    </HStack>
                ))}
            </Stack>
            <label htmlFor='input-id'>
                <Stack bgColor='brand.100'
                       rounded={10}
                       p={5}>
                    <Stack>
                        {!loading &&
                            <Text textAlign='center'
                                  color='brand.600'
                                  fontWeight='extrabold'>
                                Выбрать файл
                            </Text>
                        }
                        {loading &&
                            <CircularProgress isIndeterminate/>
                        }
                    </Stack>
                </Stack>
            </label>
        </Stack>
    )
}

function ImageUpload({files, setFiles, multiple = false, onUpload}) {
    const [loading, setLoading] = useState(false);
    const toast = useToast();
    const cropperRef = useRef(null);
    const onCrop = async () => {
        const cropper = cropperRef.current?.cropper;
        cropper.getCroppedCanvas().toBlob(async (file) => {
            let uploadedFile = await fileService.upload(file);
            onUpload(uploadedFile)
        })
    };


    async function uploadFile(filesForUpload) {
        try {
            if (filesForUpload.length === 0) {
                return;
            }
            setLoading(true);
            let uploadedFile = await fileService.upload(filesForUpload[0]);
            if (multiple) {
                setFiles([...files, uploadedFile]);
            } else {
                setFiles([uploadedFile])
            }

        } catch (e) {
            toast(errorConverter.convertToToastBody(e));
        } finally {
            setLoading(false);
        }
    }

    function deleteFile(file) {
        setFiles(files.filter(f => file.id !== f.id))
    }

    return (
        <Stack>
            <input type='file'
                   accept='image/jpeg'
                   multiple={multiple}
                   id='input-id'
                   style={{display: 'none'}}
                   disabled={loading}
                   onChange={e => uploadFile(Array.from(e.target.files))}/>
            <Stack>
                {files.length > 0 &&
                    <Stack>
                        <Box>
                            <Cropper
                                src={fileService.url(files[0])}
                                style={{ height: 400, width: "100%" }}
                                aspectRatio={1}
                                allowFullScreen
                                guides={false}
                                ref={cropperRef}
                            />
                        </Box>
                        <Button onClick={onCrop}>Обрезать</Button>
                    </Stack>
                }
            </Stack>
            <Stack>
                {files.map(file => (
                    <HStack bgColor='whiteAlpha.500'
                            key={file.id}
                            p={2}
                            rounded={10}
                            justifyContent='space-between'
                            zIndex={99}>
                        <HStack gap={1}>
                            <FiFile/>
                            <Stack spacing={0}>
                                <Link color='brand.600'
                                      isExternal
                                      href={fileService.url(file)}
                                      fontWeight='bolder'>
                                    {file.originalFilename}
                                </Link>
                                <Text>{(file.bytes/1024).toFixed(2)} Кб</Text>
                            </Stack>
                        </HStack>
                        <CloseButton onClick={e => {
                            deleteFile(file);
                            e.stopPropagation()
                        }}/>
                    </HStack>
                ))}
            </Stack>
            {(multiple || files.length === 0) &&
                <label htmlFor='input-id'>
                    <Stack bgColor='brand.100'
                           rounded={10}
                           p={2}>
                        <Stack>
                            {!loading &&
                                <Text textAlign='center'
                                      color='brand.600'
                                      fontWeight='extrabold'>
                                    Выбрать файл
                                </Text>
                            }
                            {loading &&
                                <CircularProgress isIndeterminate/>
                            }
                        </Stack>
                    </Stack>
                </label>
            }
        </Stack>
    )
}
