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
    CustomerDeliveryContainer,
    CustomerDeliverySubCategoryContainer,
    CustomerDeliverySubCategoryName,
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

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

enum SaleState {
    Pending = 'PENDING',
    Approved = 'APPROVED',
    Rejected = 'REJECTED',
    Reajusted = 'REAJUSTED'
}

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

const SalesDetail = () => {
    const { uuid } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient()
    const [product, setProduct] = useState<any>(null);
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
        onSuccess:  () => {
          handleClose()
          queryClient.invalidateQueries({ queryKey: ['saleDetail'] })
        },
        onError: (error: any) => {
            console.log(error)
        },
      });

    const updateState = (id:string, state: SaleState) => {
        mutationSaleState.mutate({ id: id, state: state })
    }

    useEffect(() => {
        if (data) {
            const response = data?.data || null;
            setProduct(response);
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
                            <Typography variant="h4">Sales #{uuid}</Typography>
                            <Status state={product?.status} />
                        </OrderDetailDescription>
                        <OrderDetailDate variant="body2">
                            {calculateDate(product?.createdAt)}
                        </OrderDetailDate>
                    </OrderDetailBody>
                </OrderDetailStack>
                <OrderDetailActions>
                    <Button
                        variant="outlined"
                        endIcon={<Iconify icon="iconamoon:arrow-down-2" />}
                        onClick={handleClick}>
                        {product?.status.toLowerCase()}
                    </Button>
                    <Button variant="contained" onClick={() => navigate(`../edit/${product?.uuid}`)}>Edit</Button>
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
                            SaleStateEnum.map((state, index) => <MenuItem key={index} onClick={ ()=> updateState(product?._id, state)}>{state}</MenuItem>)
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
                                        <p>Product</p>
                                    </ProductDetailDescriptionAvatar>
                                    <ProductDetailDescriptionListItem>
                                        <ListItemText
                                            primary={product?.product?.description}
                                            secondary={product?.capacity?.description}
                                        />
                                    </ProductDetailDescriptionListItem>
                                    <ProductDetailDescriptionQuantity>
                                        x1
                                    </ProductDetailDescriptionQuantity>
                                    <ProductDetailDescriptionPrice>
                                        S/ {product?.price}
                                    </ProductDetailDescriptionPrice>
                                </ProductDetailDescriptionContainer>
                                <ProductPriceDetailContainer>
                                    <ProductPriceDetailStack>
                                        <ProductPriceDetailDescription>
                                            Sub Total
                                        </ProductPriceDetailDescription>
                                        <ProductPriceDetailPrice>
                                            S/ {product?.price}
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
                                            S/ {product?.price}
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
                            title="Customer Info"
                            action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>
                            }
                        />
                        <CustomerInfoContainer>
                            <CustomerInfoAvatarContainer
                                {...stringAvatar(
                                    `${product?.user?.name.toUpperCase() +
                                    " " +
                                    product?.user?.last_name.toUpperCase()
                                    }`
                                )}
                            ></CustomerInfoAvatarContainer>
                            <CustomerInfoDescriptionContainer>
                                <Typography variant="subtitle2" gutterBottom>
                                    {product?.user?.name} {product?.user?.last_name}
                                </Typography>
                                <Box>{product?.user?.email}</Box>
                            </CustomerInfoDescriptionContainer>
                        </CustomerInfoContainer>
                        <Divider />
                        <CardHeader
                            title="Delivery"
                            action={
                                <IconButton aria-label="settings">
                                    <MoreVertIcon />
                                </IconButton>
                            }
                        />
                        <CustomerDeliveryContainer>
                            <CustomerDeliverySubCategoryContainer>
                                <CustomerDeliverySubCategoryName>
                                    Ship by
                                </CustomerDeliverySubCategoryName>
                                -
                            </CustomerDeliverySubCategoryContainer>
                            <CustomerDeliverySubCategoryContainer>
                                <CustomerDeliverySubCategoryName>
                                    Tracking No.
                                </CustomerDeliverySubCategoryName>
                                -
                            </CustomerDeliverySubCategoryContainer>
                        </CustomerDeliveryContainer>
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
                                    Address
                                </CustomerShippingSubCategoryName>
                                {product?.user?.address}
                            </CustomerShippingSubCategoryContainer>
                            <CustomerShippingSubCategoryContainer>
                                <CustomerShippingSubCategoryName>
                                    Phone number
                                </CustomerShippingSubCategoryName>
                                {product?.user?.cellphone}
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
                                {product?.bankEntity}
                            </CustomerPaymentSubCategoryContainer>
                            <CustomerPaymentSubCategoryContainer>
                                <CustomerPaymentSubCategoryName>
                                    # Account
                                </CustomerPaymentSubCategoryName>
                                {product?.numberAccount}
                            </CustomerPaymentSubCategoryContainer>
                        </CustomerPaymentContainer>
                    </MuiPaper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default SalesDetail;