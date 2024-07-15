import {
    Box,
    Button,
    CardHeader,
    Container,
    Divider,
    IconButton,
    ListItemText,
    Menu,
    MenuItem,
    Stack,
    Typography,
} from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getSalebyUID, updateSaleStatus } from "src/services/sales";
import Grid from "@mui/material/Unstable_Grid2";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
    CustomerInfoAvatarContainer,
    CustomerInfoContainer,
    CustomerInfoDescriptionContainer,
    CustomerPaymentContainer,
    CustomerPaymentSubCategoryContainer,
    CustomerPaymentSubCategoryName,
    CustomerShippingContainer,
    CustomerShippingSubCategoryContainer,
    CustomerShippingSubCategoryName,
    OrderDetailActions,
    OrderDetailBody,
    OrderDetailContainer,
    OrderDetailDate,
    OrderDetailDescription,
    OrderDetailStack,
    ProductDetailContainer,
    ProductDetailDescriptionAvatar,
    ProductDetailDescriptionContainer,
    ProductDetailDescriptionListItem,
    ProductDetailDescriptionPrice,
    ProductDetailDescriptionQuantity,
    ProductPriceDetailContainer,
    ProductPriceDetailDescription,
    ProductPriceDetailPrice,
    ProductPriceDetailStack,
    ProductPriceDetailTotalDescription,
    ProductPriceDetailTotalPrice,
    ProductPriceDetailTotalStack,
} from "./styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { MuiPaper } from "src/components/mui-paper/mui-paper";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import Iconify from "src/components/iconify";
import Status from "src/components/status/status";
import { SaleState } from "src/constant/sales";
import { SalesDto } from "src/models/sales";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

const SaleStateEnum: SaleState[] = [SaleState.Pending, SaleState.Approved, SaleState.Rejected, SaleState.Reajusted]

const stringAvatar = (name: string) => {
    return {
        children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
    };
};

const calculateDate = (date: Date): string => {
    const time = dayjs(date);
    const peruTime = time.tz("America/Lima").format("DD MMMM YYYY hh:mm A");
    return peruTime;
};

const generateInfoDevice = (capacity: string, originalBox?: boolean): string => {
    const descriptionCapacity = capacity;
    const descriptionOriginalBox = originalBox ? 'Incluye caja original' : 'No incluye caja original';
    return `${descriptionCapacity} - ${descriptionOriginalBox}`;
}

const SalesDetail = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient()
    const [sale, setSale] = useState<SalesDto | null>(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const { isPending, isError, data, error } = useQuery({
        queryKey: ["saleDetail", uuid],
        queryFn: () =>
            uuid ? getSalebyUID(uuid) : Promise.reject("No uuid found"),
    });

    const mutationSaleState = useMutation({
        mutationFn: ({ id, state }: any) => updateSaleStatus(id, state),
        onSuccess: () => {
            handleClose()
            queryClient.invalidateQueries({ queryKey: ['saleDetail'] })
        },
        onError: (error: any) => {
            console.log(error)
        },
    });

    const updateState = (id?: string, state?: SaleState) => {
        if (!id) return
        mutationSaleState.mutate({ id: id, state: state })
    }

    useEffect(() => {
        if (data) {
            const response = data?.data || null;
            setSale(response);
        }
    }, [data]);

    if (isPending) {
        return <span>Loading...</span>;
    }

    if (isError) {
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
                            <Status state={sale?.status || SaleState.Pending} />
                        </OrderDetailDescription>
                        <OrderDetailDate variant="body2">
                            {calculateDate(sale?.createdAt || new Date())}
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
                    <Button variant="contained" onClick={() => navigate(`../edit/${sale?.uuid}`)}>Edit</Button>
                    <Menu
                        id="basic-menu"
                        anchorEl={anchorEl}
                        open={open}
                        onClose={handleClose}
                        MenuListProps={{
                            'aria-labelledby': 'basic-button',
                        }}
                    >
                        {
                            SaleStateEnum.map((state, index) => <MenuItem key={index} onClick={() => updateState(sale?._id, state)}>{state}</MenuItem>)
                        }
                    </Menu>
                </OrderDetailActions>
            </OrderDetailContainer>
            <Grid container spacing={2}>
                <Grid xs={8}>
                    <Stack>
                        <MuiPaper>
                            <CardHeader
                                title="Details"
                                action={
                                    <IconButton aria-label="settings">
                                        <MoreVertIcon />
                                    </IconButton>
                                }
                            />
                            <ProductDetailContainer>
                                <ProductDetailDescriptionContainer>
                                    <ProductDetailDescriptionAvatar variant="rounded">
                                        <Iconify icon="ic:baseline-apple" />
                                    </ProductDetailDescriptionAvatar>
                                    <ProductDetailDescriptionListItem>
                                        <ListItemText
                                            primary={sale?.productName}
                                            secondary={generateInfoDevice(sale?.capacity?.description, sale?.originalBox)}
                                        />
                                    </ProductDetailDescriptionListItem>
                                    <ProductDetailDescriptionQuantity>
                                        x1
                                    </ProductDetailDescriptionQuantity>
                                    <ProductDetailDescriptionPrice>
                                        S/ {sale?.price}
                                    </ProductDetailDescriptionPrice>
                                </ProductDetailDescriptionContainer>
                                <ProductPriceDetailContainer>
                                    <ProductPriceDetailStack>
                                        <ProductPriceDetailDescription>
                                            Sub Total
                                        </ProductPriceDetailDescription>
                                        <ProductPriceDetailPrice>
                                            S/ {sale?.price}
                                        </ProductPriceDetailPrice>
                                    </ProductPriceDetailStack>
                                    <ProductPriceDetailStack>
                                        <ProductPriceDetailDescription>
                                            Shipping
                                        </ProductPriceDetailDescription>
                                        <ProductPriceDetailPrice>-</ProductPriceDetailPrice>
                                    </ProductPriceDetailStack>
                                    <ProductPriceDetailTotalStack>
                                        <ProductPriceDetailTotalDescription>
                                            Total
                                        </ProductPriceDetailTotalDescription>
                                        <ProductPriceDetailTotalPrice>
                                            S/ {sale?.price}
                                        </ProductPriceDetailTotalPrice>
                                    </ProductPriceDetailTotalStack>
                                </ProductPriceDetailContainer>
                            </ProductDetailContainer>
                        </MuiPaper>
                    </Stack>
                </Grid>
                <Grid xs={4}>
                    <MuiPaper>
                        <CardHeader
                            title="Datos Usuario"
                            action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>
                            }
                        />
                        <CustomerInfoContainer>
                            <CustomerInfoAvatarContainer
                                {...stringAvatar(
                                    `${sale?.user?.name.toUpperCase() +
                                    " " +
                                    sale?.user?.lastName.toUpperCase()
                                    }`
                                )}
                            ></CustomerInfoAvatarContainer>
                            <CustomerInfoDescriptionContainer>
                                <Typography variant="subtitle2" gutterBottom>
                                    {sale?.user?.name} {sale?.user?.lastName}
                                </Typography>
                                <Box>{sale?.user?.email}</Box>
                            </CustomerInfoDescriptionContainer>
                        </CustomerInfoContainer>
                        <CustomerShippingContainer>
                            <CustomerShippingSubCategoryContainer>
                                <CustomerShippingSubCategoryName>
                                    Tipo Doc.
                                </CustomerShippingSubCategoryName>
                                {sale?.documentType?.description || '-' }
                            </CustomerShippingSubCategoryContainer>
                            <CustomerShippingSubCategoryContainer>
                                <CustomerShippingSubCategoryName>
                                    # Documento
                                </CustomerShippingSubCategoryName>
                                {sale?.documentNumber || '-' }
                            </CustomerShippingSubCategoryContainer>
                        </CustomerShippingContainer>
                        <Divider />
                        <CardHeader
                            title="Shipping"
                            action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>
                            }
                        />
                        <CustomerShippingContainer>
                            <CustomerShippingSubCategoryContainer>
                                <CustomerShippingSubCategoryName>
                                    Department
                                </CustomerShippingSubCategoryName>
                                {sale?.user?.department}
                            </CustomerShippingSubCategoryContainer>
                            <CustomerShippingSubCategoryContainer>
                                <CustomerShippingSubCategoryName>
                                    Province
                                </CustomerShippingSubCategoryName>
                                {sale?.user?.province}
                            </CustomerShippingSubCategoryContainer>
                            <CustomerShippingSubCategoryContainer>
                                <CustomerShippingSubCategoryName>
                                    District
                                </CustomerShippingSubCategoryName>
                                {sale?.user?.district}
                            </CustomerShippingSubCategoryContainer>
                            <CustomerShippingSubCategoryContainer>
                                <CustomerShippingSubCategoryName>
                                    Address
                                </CustomerShippingSubCategoryName>
                                {sale?.user?.address}
                            </CustomerShippingSubCategoryContainer>
                            <CustomerShippingSubCategoryContainer>
                                <CustomerShippingSubCategoryName>
                                    Phone number
                                </CustomerShippingSubCategoryName>
                                {sale?.user?.phoneNumber}
                            </CustomerShippingSubCategoryContainer>
                        </CustomerShippingContainer>
                        <Divider />
                        <CardHeader
                            title="Payment"
                            action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>
                            }
                        />
                        <CustomerPaymentContainer>
                            <CustomerPaymentSubCategoryContainer>
                                <CustomerPaymentSubCategoryName>
                                    Bank
                                </CustomerPaymentSubCategoryName>
                                {sale?.bankEntity}
                            </CustomerPaymentSubCategoryContainer>
                            <CustomerPaymentSubCategoryContainer>
                                <CustomerPaymentSubCategoryName>
                                    # Account
                                </CustomerPaymentSubCategoryName>
                                {sale?.numberAccount}
                            </CustomerPaymentSubCategoryContainer>
                        </CustomerPaymentContainer>
                    </MuiPaper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default SalesDetail;
