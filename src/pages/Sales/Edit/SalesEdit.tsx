import { Box, Button, Checkbox, Container, FormControl, IconButton, InputLabel, ListItemText, MenuItem, OutlinedInput, Paper, Select, SelectChangeEvent, Stack, TextField, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { OrderDetailBody, OrderDetailContainer, OrderDetailDate, OrderDetailDescription, OrderDetailStack } from './styles'
import Status from 'src/components/status/status'
import { useNavigate, useParams } from 'react-router-dom'
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useQuery } from '@tanstack/react-query'
import { getSalebyUID } from 'src/services/sales'
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Grid from '@mui/material/Unstable_Grid2';
import { getPaymentType } from 'src/services/payment-type'
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { getCapacity } from 'src/services/capacity'
import { getGrade } from 'src/services/grade'
import { getAccesories } from 'src/services/accesories'

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
    productDescription: string,
    serieNumber: string,
    firstImei: string,
    secondImei: string,
    capacity: string,
    grade: string,
    accesories: string[],
    price: number
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
    productDescription: '',
    serieNumber: '',
    firstImei: '',
    secondImei: '',
    capacity: '',
    grade: '',
    accesories: [],
    price: 0
};

const calculateDate = (date: Date): string => {
    const time = dayjs(date);
    const peruTime = time.tz("America/Lima").format("DD MMMM YYYY hh:mm A");
    return peruTime;
};

const SalesEdit = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState<any>(null);
    const [paymentType, setPaymentType] = useState([])

    const { data } = useQuery({
        queryKey: ["saleDetail", uuid],
        queryFn: () =>
            uuid ? getSalebyUID(uuid) : Promise.reject("No uuid found"),
    });

    const { data: paymentTypeData } = useQuery({
        queryKey: ["paymentType"],
        queryFn: getPaymentType,
    });

    const { data: capacityData } = useQuery({
        queryKey: ["capacity"],
        queryFn: getCapacity,
    });

    const { data: gradeData } = useQuery({
        queryKey: ["grade"],
        queryFn: getGrade,
    });

    const {
        handleSubmit,
        setValue,
        control,
    } = useForm<Inputs>({
        defaultValues: defaultFormValue,
    });

    useEffect(() => {
        if (data) {
            const response = data?.data || null;
            setForm(response);
            setProduct(response);
        }
    }, [data]);

    useEffect(() => {
        if (paymentTypeData) {
            const response = paymentTypeData?.data || [];
            setPaymentType(response);
        }
    }, [paymentTypeData]);

    const setForm = (data: any) => {
        setValue('name', data?.user?.name)
        setValue('lastName', data?.user?.lastName)
        setValue('email', data?.user?.email)
        setValue('phoneNumber', data?.user?.phoneNumber)
        setValue('address', data?.user?.address)
        setValue('paymentType', data?.paymentType)
        setValue('bankEntity', data?.bankEntity)
        setValue('numberAccount', data?.numberAccount)
        setValue('productDescription', data?.productName)
        setValue('serieNumber', data?.serieNumber)
        setValue('firstImei', data?.firstImei)
        setValue('secondImei', data?.secondImei)
        setValue('capacity', data?.capacity?._id)
        setValue('grade', data?.grade)
        setValue('accesories', data?.accesories)
        setValue('price', data?.price)
    }

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        console.log(data)
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
                            <Typography variant="h4">Orden #{uuid}</Typography>
                            <Status state={product?.status} />
                        </OrderDetailDescription>
                        <OrderDetailDate variant="body2">
                            {calculateDate(product?.createdAt)}
                        </OrderDetailDate>
                    </OrderDetailBody>
                </OrderDetailStack>
            </OrderDetailContainer>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid xs={4}>
                        <Typography variant="h6">Usuario</Typography>
                        <Typography variant="body2">Title, short description, image...</Typography>
                    </Grid>
                    <Grid xs={8}>
                        <Paper>
                            <Stack sx={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <Box sx={{ display: 'grid', gap: '24px 16px', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => <TextField label="name" variant="outlined" {...field} />}
                                    />
                                    <Controller
                                        name="lastName"
                                        control={control}
                                        render={({ field }) => <TextField label="Apellidos" variant="outlined" {...field} />}
                                    />
                                    <Controller
                                        name="email"
                                        control={control}
                                        render={({ field }) => <TextField label="Email" variant="outlined" {...field} />}
                                    />
                                    <Controller
                                        name="phoneNumber"
                                        control={control}
                                        render={({ field }) => <TextField label="Numero Telefonico" variant="outlined" {...field} />}
                                    />
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                    <Grid xs={4}>
                        <Typography variant="h6">Direccion</Typography>
                        <Typography variant="body2">Address...</Typography>
                    </Grid>
                    <Grid xs={8}>
                        <Paper>
                            <Stack sx={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <Controller
                                    name="address"
                                    control={control}
                                    render={({ field }) => <TextField label="Direccion" variant="outlined" {...field} />}
                                />
                            </Stack>
                        </Paper>
                    </Grid>
                    <Grid xs={4}>
                        <Typography variant="h6">Pagos</Typography>
                        <Typography variant="body2">Detalle...</Typography>
                    </Grid>
                    <Grid xs={8}>
                        <Paper>
                            <Stack sx={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <Controller
                                    name="paymentType"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl>
                                            <InputLabel id="demo-simple-select-label">
                                                Tipo Pago
                                            </InputLabel>
                                            <Select label="Tipo Pago" {...field}>
                                                {paymentType?.map((type: any, index: number) => (
                                                    <MenuItem key={index} value={type._id}>
                                                        {type.description}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    name="bankEntity"
                                    control={control}
                                    render={({ field }) => <TextField label="Banco" variant="outlined" {...field} />}
                                />
                                <Controller
                                    name="numberAccount"
                                    control={control}
                                    render={({ field }) => <TextField label="# Cuenta" variant="outlined" {...field} />}
                                />
                            </Stack>
                        </Paper>
                    </Grid>
                    <Grid xs={4}>
                        <Typography variant="h6">Propiedades</Typography>
                        <Typography variant="body2">Propiedades...</Typography>
                    </Grid>
                    <Grid xs={8}>
                        <Paper>
                            <Stack sx={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <Controller
                                    name="productDescription"
                                    control={control}
                                    render={({ field }) => <TextField label="Descripcion" variant="outlined" {...field} />}
                                />
                                <Box sx={{ display: 'grid', gap: '24px 16px', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                                    <Controller
                                        name="firstImei"
                                        control={control}
                                        render={({ field }) => <TextField label="Imei 1" variant="outlined" {...field} />}
                                    />
                                    <Controller
                                        name="secondImei"
                                        control={control}
                                        render={({ field }) => <TextField label="Imei 2" variant="outlined" {...field} />}
                                    />
                                    <Controller
                                        name="serieNumber"
                                        control={control}
                                        render={({ field }) => <TextField label="Numero de Serie" variant="outlined" {...field} />}
                                    />
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
                                    <Controller
                                        name="grade"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControl>
                                                <InputLabel id="demo-simple-select-label">
                                                    Grado
                                                </InputLabel>
                                                <Select label="Grado" {...field}>
                                                    {gradeData?.data?.map((type: any, index: number) => (
                                                        <MenuItem key={index} value={type._id}>
                                                            {type.description}
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                    <Controller
                                        name="accesories"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <FormControl>
                                                    <InputLabel id="demo-multiple-checkbox-label">Accesories</InputLabel>
                                                    <Select
                                                        label="Accesories"
                                                        multiple
                                                        value={field?.value || []}
                                                        onChange={(event: SelectChangeEvent<string[]>) => {
                                                            field.onChange(event.target.value);
                                                        }}
                                                        input={<OutlinedInput label="Accesorios" />}
                                                        renderValue={(selected: string[]) => selected.join(', ')}
                                                    >
                                                        {getAccesories()?.map((accesory) => (
                                                            <MenuItem key={accesory} value={accesory}>
                                                                <Checkbox checked={field.value.includes(accesory)} />
                                                                <ListItemText primary={accesory} />
                                                            </MenuItem>
                                                        ))}
                                                    </Select>
                                                </FormControl>
                                            </>

                                        )}
                                    />
                                </Box>
                            </Stack>
                        </Paper>
                    </Grid>
                    <Grid xs={4}>
                        <Typography variant="h6">Precio</Typography>
                        <Typography variant="body2">Precio...</Typography>
                    </Grid>
                    <Grid xs={8}>
                        <Paper>
                            <Stack sx={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <Controller
                                    name="price"
                                    control={control}
                                    render={({ field }) => <TextField label="Precio" variant="outlined" {...field} />}
                                />
                            </Stack>
                        </Paper>
                    </Grid>
                    <Grid xs={4}></Grid>
                    <Grid xs={8} sx={{ textAlign: 'end' }}>
                        <Button type='submit' variant="contained" size='large'>Guardar Cambios</Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    )
}

export default SalesEdit