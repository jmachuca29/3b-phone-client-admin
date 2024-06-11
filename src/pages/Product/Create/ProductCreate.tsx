/// <reference types="vite-plugin-svgr/client" />
import { Box, Button, Container, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import { ImagePreviewContainer, ImagePreviewElement, ImagePreviewElementBox, ImagePreviewElementCloseIcon, ImagePreviewElementSpan, ImageUploadContainer, ImageUploadSection, ImageUploadSectionChild, ImageUploadSectionDescription, ImageUploadSectionInstructions, ImageUploadSectionInstructionsLink, ImageUploadSectionSVG, OrderDetailBody, OrderDetailContainer, OrderDetailDescription, OrderDetailStack } from './styles'
import { useNavigate } from 'react-router-dom'
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useMutation, useQuery } from '@tanstack/react-query'
import { createSale } from 'src/services/sales'
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Grid from '@mui/material/Unstable_Grid2';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { getCapacity } from 'src/services/capacity'
import { SaleCreateProps, SalesCreateDto } from 'src/models/sales'
import Iconify from 'src/components/iconify'
import { SaleState } from 'src/constant/sales'
import IllustrationFile from "src/assets/illustration_file.svg?react";


dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

type Inputs = {
    name: string,
    lastName: string,
    email: string,
    phoneNumber: string,
    address: string,
    paymentType: string,
    bankEntity: string,
    numberAccount: string,
    productName: string,
    serieNumber: string,
    firstImei: string,
    secondImei: string,
    capacity: string,
    grade: string,
    accesories: string[],
    price: string,
    status: SaleState
};

const defaultFormValue: Inputs = {
    name: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    paymentType: '',
    bankEntity: '',
    numberAccount: '',
    productName: '',
    serieNumber: '',
    firstImei: '',
    secondImei: '',
    capacity: '',
    grade: '',
    accesories: [],
    price: '',
    status: SaleState.Pending
};

const ProductCreate = () => {
    const navigate = useNavigate();

    const mutationSale = useMutation({
        mutationFn: createSale,
        onSuccess: ($event) => {
            console.log($event)
            navigate(-1)
        },
        onError: (error: any) => {
            console.log(error)
        },
    });

    const { data: capacityData } = useQuery({
        queryKey: ["capacity"],
        queryFn: getCapacity,
    });

    const {
        handleSubmit,
        control,
    } = useForm<Inputs>({
        defaultValues: defaultFormValue,
    });

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        const saleSchema: SaleCreateProps = {
            productName: data?.productName,
            capacity: data?.capacity,
            accesories: data?.accesories,
            serieNumber: data?.serieNumber,
            firstImei: data?.firstImei,
            secondImei: data?.secondImei,
            paymentType: data?.paymentType,
            grade: data?.grade,
            user: {
                name: data?.name,
                lastName: data?.lastName,
                email: data?.email,
                phoneNumber: data?.phoneNumber,
                ubigeo: '',
                address: data?.address
            },
            price: Number(data?.price),
            bankEntity: data?.bankEntity,
            numberAccount: data?.numberAccount,
            status: data?.status
        }
        const sale = new SalesCreateDto(saleSchema)
        mutationSale.mutate(sale)
    }


    return (
        <Container maxWidth="lg">
            <OrderDetailContainer>
                <OrderDetailStack>
                    <IconButton aria-label="arrow-back" onClick={() => navigate(-1)}>
                        <ChevronLeftIcon />
                    </IconButton>
                    <OrderDetailBody>
                        <OrderDetailDescription>
                            <Typography variant="h4">Crear Producto</Typography>
                        </OrderDetailDescription>
                    </OrderDetailBody>
                </OrderDetailStack>
            </OrderDetailContainer>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid xs={4}>
                        <Typography variant="h6">Producto</Typography>
                        <Typography variant="body2">Descripcion del Producto...</Typography>
                    </Grid>
                    <Grid xs={8}>
                        <Paper>
                            <Stack sx={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field }) => <TextField label="Nombre" variant="outlined" {...field} />}
                                />
                                <ImageUploadContainer sx={{ gap: '12px' }}>
                                    <Typography variant="subtitle2">Images</Typography>
                                    <Box>
                                        <ImageUploadSection>
                                            <input type="file" name="image_upload" id="image" multiple />
                                            <ImageUploadSectionChild>
                                                <ImageUploadSectionSVG>
                                                    <IllustrationFile />
                                                </ImageUploadSectionSVG>
                                                <ImageUploadSectionDescription>
                                                    <Typography variant="h6">Drop or Select file</Typography>
                                                    <ImageUploadSectionInstructions variant="body2">Drop files here or click
                                                        <ImageUploadSectionInstructionsLink component={'span'}>browse</ImageUploadSectionInstructionsLink>thorough your machine
                                                    </ImageUploadSectionInstructions>
                                                </ImageUploadSectionDescription>
                                            </ImageUploadSectionChild>
                                        </ImageUploadSection>
                                        <ImagePreviewContainer>
                                            <ImagePreviewElement>
                                                <ImagePreviewElementSpan component={'span'}>
                                                    <ImagePreviewElementBox component={'img'} src='/assets/illustrations/illustration_avatar.png'>
                                                    </ImagePreviewElementBox>
                                                </ImagePreviewElementSpan>
                                                <ImagePreviewElementCloseIcon size="small">
                                                    <Iconify icon="material-symbols:close" style={{ width: '14px', height: '14px' }} />
                                                </ImagePreviewElementCloseIcon>
                                            </ImagePreviewElement>
                                            <ImagePreviewElement>
                                                <ImagePreviewElementSpan component={'span'}>
                                                    <ImagePreviewElementBox component={'img'} src='/assets/illustrations/illustration_avatar.png'>
                                                    </ImagePreviewElementBox>
                                                </ImagePreviewElementSpan>
                                                <ImagePreviewElementCloseIcon size="small">
                                                    <Iconify icon="material-symbols:close" style={{ width: '14px', height: '14px' }} />
                                                </ImagePreviewElementCloseIcon>
                                            </ImagePreviewElement>
                                            <ImagePreviewElement>
                                                <ImagePreviewElementSpan component={'span'}>
                                                    <ImagePreviewElementBox component={'img'} src='/assets/illustrations/illustration_avatar.png'>
                                                    </ImagePreviewElementBox>
                                                </ImagePreviewElementSpan>
                                                <ImagePreviewElementCloseIcon size="small">
                                                    <Iconify icon="material-symbols:close" style={{ width: '14px', height: '14px' }} />
                                                </ImagePreviewElementCloseIcon>
                                            </ImagePreviewElement>
                                        </ImagePreviewContainer>
                                        <Stack>3</Stack>
                                    </Box>
                                </ImageUploadContainer>
                            </Stack>
                        </Paper>
                    </Grid>
                    <Grid xs={4}>
                        <Typography variant="h6">Capacidad</Typography>
                        <Typography variant="body2">Seleccione una...</Typography>
                    </Grid>
                    <Grid xs={8}>
                        <Paper>
                            <Stack sx={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <Controller
                                    name="capacity"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl>
                                            <InputLabel id="demo-simple-select-label">
                                                Capacidad
                                            </InputLabel>
                                            <Select label="Capacidad" {...field}>
                                                {capacityData?.data?.map((type: any, index: number) => (
                                                    <MenuItem key={index} value={type._id}>
                                                        {type.description}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                            </Stack>
                        </Paper>
                    </Grid>
                    <Grid xs={4}>
                        <Typography variant="h6">Precio</Typography>
                        <Typography variant="body2">Datos de Precio...</Typography>
                    </Grid>
                    <Grid xs={8}>
                        <Paper>
                            <Stack sx={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <Controller
                                    name="price"
                                    control={control}
                                    render={({ field }) => <TextField type='number' label="Precio" variant="outlined" {...field} />}
                                />
                            </Stack>
                        </Paper>
                    </Grid>
                    <Grid xs={4}></Grid>
                    <Grid xs={8} sx={{ textAlign: 'end' }}>
                        <Button type='submit' variant="contained" size='large'>Crear</Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    )
}

export default ProductCreate