import { Box, Button, FormControl, IconButton, InputLabel, Menu, MenuItem, Paper, Select, Stack, TextField, Typography, Container, FormLabel, RadioGroup, FormControlLabel, Radio } from '@mui/material';
import { useEffect, useState } from 'react';
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Grid from '@mui/material/Unstable_Grid2';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import useUbigeo from 'src/hooks/use-ubigeo';
import { getSalebyUID, updateSale } from 'src/services/sales';
import { getPaymentType } from 'src/services/payment-type';
import { getCapacity } from 'src/services/capacity';
import { getGrade } from 'src/services/grade';
import { SaleUpdateProps, SalesUpdateDto } from 'src/models/sales';
import Iconify from 'src/components/iconify';
import { SaleState } from 'src/constant/sales';
import Status from 'src/components/status/status';
import { OrderDetailActions, OrderDetailBody, OrderDetailContainer, OrderDetailDate, OrderDetailDescription, OrderDetailStack } from './styles';
import getDocumentType from 'src/services/type-document';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

const documentValidator: any = {
    DNI: {
        minLength: 8,
        maxLength: 8,
        maxLengthErrorMessage: "Maximo 8 digitos",
    },
    PASAPORTE: {
        minLength: 15,
        maxLength: 15,
        maxLengthErrorMessage: "Maximo 15 digitos",
    },
};

const SaleStateEnum: SaleState[] = [SaleState.Pending, SaleState.Approved, SaleState.Rejected, SaleState.Reajusted];

type Inputs = {
    name: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    department: string;
    province: string;
    district: string;
    address: string;
    paymentType: string;
    bankEntity: string;
    numberAccount: string;
    productId: string;
    productName: string;
    serieNumber: string;
    firstImei: string;
    secondImei: string;
    capacity: string;
    grade: string;
    originalBox: string;
    price: string;
    uuid: string;
    status: SaleState;
    documentType: string;
    documentNumber: string;
};

const defaultFormValue: Inputs = {
    name: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    department: '',
    province: '',
    district: '',
    address: '',
    paymentType: '',
    bankEntity: '',
    numberAccount: '',
    productId: '',
    productName: '',
    serieNumber: '',
    firstImei: '',
    secondImei: '',
    capacity: '',
    grade: '',
    originalBox: '',
    price: '',
    uuid: '',
    status: SaleState.Pending,
    documentType: '',
    documentNumber: '',
};

const calculateDate = (date: Date): string => {
    const time = dayjs(date);
    const peruTime = time.tz("America/Lima").format("DD MMMM YYYY hh:mm A");
    return peruTime;
};

const SalesEdit = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const [sale, setSale] = useState<any>(null);
    const [documentTypeName, setDocumentTypeName] = useState("");
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const mutationSale = useMutation({
        mutationFn: ({ id, sale }: any) => updateSale(id, sale),
        onSuccess: () => {
            navigate(-1);
        },
        onError: (error: any) => {
            console.log(error);
        },
    });

    const { data } = useQuery({
        queryKey: ["saleDetail", uuid],
        queryFn: () =>
            uuid ? getSalebyUID(uuid) : Promise.reject("No uuid found"),
    });

    const { data: typeDocumentData } = useQuery({
        queryKey: ["typeDocument"],
        queryFn: getDocumentType,
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
        isPending,
        error,
        departments,
        provinces,
        districts,
        getProvincesByDepartamento,
        getDistricts,
    } = useUbigeo();

    const {
        handleSubmit,
        setValue,
        control,
        watch,
        formState: { errors },
    } = useForm<Inputs>({
        defaultValues: defaultFormValue,
    });

    const watchDepartment = watch("department");
    const watchProvince = watch("province");
    const watchDocumentType = watch("documentType");

    useEffect(() => {
        const documentTypes = typeDocumentData?.data || [];
        const documentTypeName =
            documentTypes.find((doc) => doc._id === watchDocumentType)?.description ||
            "";
        setDocumentTypeName(documentTypeName);
    }, [typeDocumentData, watchDocumentType]);

    useEffect(() => {
        if (watchDepartment) {
            getProvincesByDepartamento(watchDepartment);
            setValue("province", "");
            setValue("district", "");
        }
    }, [watchDepartment]);

    useEffect(() => {
        if (watchProvince) {
            getDistricts(watchDepartment, watchProvince);
        }
    }, [watchProvince]);

    useEffect(() => {
        if (provinces.length > 0) {
            setValue('province', sale?.user?.province);
        }
    }, [provinces]);

    useEffect(() => {
        if (districts.length > 0) {
            setValue('district', sale?.user?.district);
        }
    }, [districts]);

    useEffect(() => {
        if (data && departments.length > 0) {
            const response = data?.data || null;
            setForm(response);
            setSale(response);
        }
    }, [data, departments]);

    const setForm = (data: any) => {
        setValue('name', data?.user?.name);
        setValue('lastName', data?.user?.lastName);
        setValue('email', data?.user?.email);
        setValue('phoneNumber', data?.user?.phoneNumber);
        setValue('department', data?.user?.department);
        setValue('address', data?.user?.address);
        setValue('paymentType', data?.paymentType);
        setValue('bankEntity', data?.bankEntity);
        setValue('numberAccount', data?.numberAccount);
        setValue('productId', data?.productId);
        setValue('productName', data?.productName);
        setValue('serieNumber', data?.serieNumber);
        setValue('firstImei', data?.firstImei);
        setValue('secondImei', data?.secondImei);
        setValue('capacity', data?.capacity?._id);
        setValue('grade', data?.grade?._id);
        setValue('originalBox', data?.originalBox.toString());
        setValue('price', data?.price);
        setValue('uuid', data?.uuid);
        setValue('status', data?.status);
        setValue('documentType', data?.documentType?._id);
        setValue('documentNumber', data?.documentNumber);
    };

    const updateState = (state: SaleState) => {
        setValue('status', state);
        setSale((prevProduct: any) => ({
            ...prevProduct,
            status: state,
        }));
        handleClose();
    };

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        const hasOriginalBox: boolean = data.originalBox === "true"
        const saleSchema: SaleUpdateProps = {
            productId: data?.productId,
            productName: data?.productName,
            capacity: data?.capacity,
            originalBox: hasOriginalBox,
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
                department: data?.department,
                province: data?.province,
                district: data?.district,
                address: data?.address,
            },
            price: Number(data?.price),
            uuid: data?.uuid,
            bankEntity: data?.bankEntity,
            numberAccount: data?.numberAccount,
            status: data?.status,
            documentType: data?.documentType,
            documentNumber: data?.documentNumber,
        };
        const sales = new SalesUpdateDto(saleSchema);
        mutationSale.mutate({ id: sale._id, sale: sales });
    };

    if (isPending) {
        return <span>Loading...</span>;
    }

    if (error) {
        return <span>Error: {error.message}</span>;
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
                            <Typography variant="h4">Sales #{sale?.correlative || 0}</Typography>
                            <Status state={sale?.status} />
                        </OrderDetailDescription>
                        <OrderDetailDate variant="body2">
                            {calculateDate(sale?.createdAt)}
                        </OrderDetailDate>
                    </OrderDetailBody>
                </OrderDetailStack>
                <OrderDetailActions>
                    <Button
                        variant="outlined"
                        endIcon={<Iconify icon="iconamoon:arrow-down-2" />}
                        onClick={handleClick}>
                        {sale?.status.toLowerCase()}
                    </Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        {SaleStateEnum.map((state, index) => (
                            <MenuItem key={index} onClick={() => updateState(state)}>{state}</MenuItem>
                        ))}
                    </Menu>
                </OrderDetailActions>
            </OrderDetailContainer>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Grid container spacing={2}>
                    <Grid xs={4}>
                        <Typography variant="h6">Usuario</Typography>
                        <Typography variant="body2">Datos del Usuario...</Typography>
                    </Grid>
                    <Grid xs={8}>
                        <Paper>
                            <Stack sx={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <Box sx={{ display: 'grid', gap: '24px 16px', gridTemplateColumns: 'repeat(2, 1fr)' }}>
                                    <Controller
                                        name="name"
                                        control={control}
                                        render={({ field }) => <TextField label="Nombres" variant="outlined" {...field} />}
                                    />
                                    <Controller
                                        name="lastName"
                                        control={control}
                                        render={({ field }) => <TextField label="Apellidos" variant="outlined" {...field} />}
                                    />
                                    <Controller
                                        name="documentType"
                                        control={control}
                                        render={({ field }) => (
                                            <FormControl>
                                                <InputLabel id="demo-simple-select-label">
                                                    Tipo Documento
                                                </InputLabel>
                                                <Select label="Tipo Documento" {...field}>
                                                    {typeDocumentData?.data?.map(
                                                        (type: any, index: number) => (
                                                            <MenuItem key={index} value={type._id}>
                                                                {type.description}
                                                            </MenuItem>
                                                        )
                                                    )}
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                    <Controller
                                        name="documentNumber"
                                        control={control}
                                        rules={{
                                            maxLength: documentValidator[documentTypeName]?.maxLength,
                                        }}
                                        render={({ field }) => (
                                            <TextField
                                                label="Numero Documento"
                                                variant="outlined"
                                                error={!!errors.documentNumber}
                                                helperText={
                                                    errors.documentNumber &&
                                                    documentValidator[documentTypeName]
                                                        .maxLengthErrorMessage
                                                }
                                                {...field}
                                            />
                                        )}
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
                        <Typography variant="body2">Datos de Direccion...</Typography>
                    </Grid>
                    <Grid xs={8}>
                        <Paper>
                            <Stack sx={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <Controller
                                    name="department"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl>
                                            <InputLabel id="department-label">Department</InputLabel>
                                            <Select
                                                {...field}
                                                labelId="department-label"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setValue("province", "");
                                                    setValue("district", "");
                                                }}
                                            >
                                                {departments.map((d, index) => (
                                                    <MenuItem key={index} value={d}>{d}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    name="province"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl>
                                            <InputLabel id="province-label">Province</InputLabel>
                                            <Select
                                                {...field}
                                                labelId="province-label"
                                                onChange={(e) => {
                                                    field.onChange(e);
                                                    setValue("district", "");
                                                }}
                                            >
                                                {provinces.map((p, index) => (
                                                    <MenuItem key={index} value={p}>{p}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                                <Controller
                                    name="district"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl>
                                            <InputLabel id="district-label">District</InputLabel>
                                            <Select
                                                {...field}
                                                labelId="district-label"
                                            >
                                                {districts.map((d, index) => (
                                                    <MenuItem key={index} value={d}>{d}</MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                    )}
                                />
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
                        <Typography variant="body2">Datos de Pago...</Typography>
                    </Grid>
                    <Grid xs={8}>
                        <Paper>
                            <Stack sx={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <Controller
                                    name="paymentType"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl>
                                            <InputLabel id="paymentType-label">Tipo Pago</InputLabel>
                                            <Select
                                                {...field}
                                                labelId="paymentType-label"
                                            >
                                                {paymentTypeData?.data?.map((type: any, index: any) => (
                                                    <MenuItem key={index} value={type._id}>{type.description}</MenuItem>
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
                        <Typography variant="body2">Datos de Propiedades...</Typography>
                    </Grid>
                    <Grid xs={8}>
                        <Paper>
                            <Stack sx={{ display: 'flex', flexDirection: 'column', gap: '24px', padding: '24px' }}>
                                <Controller
                                    name="productName"
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
                                                <InputLabel id="capacity-label">Capacidad</InputLabel>
                                                <Select
                                                    {...field}
                                                    labelId="capacity-label"
                                                >
                                                    {capacityData?.data?.map((type: any, index: any) => (
                                                        <MenuItem key={index} value={type._id}>{type.description}</MenuItem>
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
                                                <InputLabel id="grade-label">Grado</InputLabel>
                                                <Select
                                                    {...field}
                                                    labelId="grade-label"
                                                >
                                                    {gradeData?.data?.map((type: any, index: any) => (
                                                        <MenuItem key={index} value={type._id}>{type.description}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                    <div></div>
                                    <Controller
                                        name="originalBox"
                                        control={control}
                                        render={({ field }) => (
                                            <>
                                                <FormControl>
                                                    <FormLabel id="originalBox-group-label">
                                                        Incluye Caja
                                                    </FormLabel>
                                                    <RadioGroup
                                                        {...field}
                                                        row
                                                        aria-labelledby="originalBox-buttons-group-label"
                                                        name="originalBox-radio-buttons-group"
                                                        onChange={(event: any) => {
                                                            field.onChange(event.target.value);
                                                        }}
                                                    >
                                                        <FormControlLabel
                                                            value="true"
                                                            control={<Radio />}
                                                            label="Si"
                                                        />
                                                        <FormControlLabel
                                                            value="false"
                                                            control={<Radio />}
                                                            label="No"
                                                        />
                                                    </RadioGroup>
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
                        <Button type='submit' variant="contained" size='large'>Guardar Cambios</Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
}

export default SalesEdit;
