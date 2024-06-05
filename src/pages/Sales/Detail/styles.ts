import styled from "@emotion/styled";
import { Avatar, Box, Stack, Typography } from "@mui/material";

const OrderDetailContainer = styled(Stack)`
  margin: 40px 0px;
  flex-direction: row;
`

const OrderDetailStack = styled(Stack)`
  display: flex;
  flex-direction: row;
  gap: 8px;
  align-items: flex-start;
`

const OrderDetailActions = styled(Stack)`
  flex-direction: row;
  align-items: center;
  gap: 12px;
  flex-grow: 1;
  justify-content: end;
`

const OrderDetailBody = styled(Stack)`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const OrderDetailDescription = styled(Stack)`
  display: flex;
  flex-direction: row;
  gap: 8px;
  -webkit-box-align: center;
  align-items: center;
`

const OrderDetailDate = styled(Typography)`
  margin: 0px;
  line-height: 1.57143;
  font-size: 0.875rem;
  font-family: "Public Sans", sans-serif;
  font-weight: 400;
  color: rgb(145, 158, 171);
`

const OrderDetailStatus = styled(Box)`
  height: 24px;
  min-width: 24px;
  line-height: 0;
  border-radius: 6px;
  cursor: default;
  -webkit-box-align: center;
  align-items: center;
  white-space: nowrap;
  display: inline-flex;
  -webkit-box-pack: center;
  justify-content: center;
  text-transform: capitalize;
  padding: 0px 6px;
  font-size: 0.75rem;
  font-weight: 700;
  transition: all 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  color: rgb(17, 141, 87);
  background-color: rgba(34, 197, 94, 0.16);
`

const ProductDetailContainer = styled(Stack)`
  padding-left: 24px;
  padding-right: 24px;
`

const ProductDetailDescriptionContainer = styled(Stack)`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding-top: 24px;
  padding-bottom: 24px;
  min-width: 640px;
  border-bottom: 2px dashed rgb(244, 246, 248);
`
const ProductDetailDescriptionAvatar = styled(Avatar)`
  margin-right: 16px;
`

const ProductDetailDescriptionListItem = styled(Stack)`
  flex: 1 1 auto;
  min-width: 0px;
  margin: 0px;
`

const ProductDetailDescriptionQuantity = styled(Stack)`
  line-height: 1.57143;
  font-size: 0.875rem;
  font-family: "Public Sans", sans-serif;
  font-weight: 400;
`

const ProductDetailDescriptionPrice = styled(Stack)`
  width: 110px;
  text-align: right;
  font-weight: 600;
  line-height: 1.57143;
  font-size: 0.875rem;
  font-family: "Public Sans", sans-serif;
`

const ProductPriceDetailContainer = styled(Stack)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-end;
  margin-top: 3rem;
  margin-bottom: 3rem;
  text-align: end;
  line-height: 1.57143;
  font-size: 0.875rem;
`

const ProductPriceDetailStack = styled(Stack)`
  display: flex;
  flex-direction: row;
`

const ProductPriceDetailDescription = styled(Box)`
  color: rgb(99, 115, 129);
`

const ProductPriceDetailPrice = styled(Box)`
  width: 160px;
  font-weight: 600;
  line-height: 1.57143;
  font-size: 0.875rem;
`

const ProductPriceDetailTotalStack = styled(Stack)`
  display: flex;
  flex-direction: row;
  font-weight: 600;
  line-height: 1.5;
  font-size: 1rem;
`

const ProductPriceDetailTotalDescription = styled(Stack)``;

const ProductPriceDetailTotalPrice = styled(Stack)`
  width: 160px;
`

const CustomerInfoContainer = styled(Stack)`
  display: flex;
  flex-direction: row;
  padding: 24px;
`

const CustomerInfoAvatarContainer = styled(Avatar)`
  margin-right: 1rem;
`

const CustomerInfoDescriptionContainer = styled(Stack)`
  gap: 4px;
  align-items: flex-start;
  line-height: 1.57143;
  font-size: 0.875rem;
  font-family: "Public Sans", sans-serif;
  font-weight: 400;
`

const CustomerDeliveryContainer = styled(Stack)`
  gap: 12px;
  padding: 24px;
  line-height: 1.57143;
  font-size: 0.875rem;
  font-family: "Public Sans", sans-serif;
  font-weight: 400;
`

const CustomerDeliverySubCategoryContainer = styled(Stack)`
  flex-direction: row;
  align-items: center;
`
const CustomerDeliverySubCategoryName = styled.span`
  color: rgb(99, 115, 129);
  width: 120px;
  flex-shrink: 0;
`

const CustomerShippingContainer = styled(Stack)`
  gap: 12px;
  padding: 24px;
  line-height: 1.57143;
  font-size: 0.875rem;
  font-family: "Public Sans", sans-serif;
  font-weight: 400;
`

const CustomerShippingSubCategoryContainer = styled(Stack)`
  flex-direction: row;
  align-items: center;
`
const CustomerShippingSubCategoryName = styled.span`
  color: rgb(99, 115, 129);
  width: 120px;
  flex-shrink: 0;
`

const CustomerPaymentContainer = styled(Stack)`
  gap: 12px;
  padding: 24px;
  line-height: 1.57143;
  font-size: 0.875rem;
  font-family: "Public Sans", sans-serif;
  font-weight: 400;
`

const CustomerPaymentSubCategoryContainer = styled(Stack)`
  flex-direction: row;
  align-items: center;
`
const CustomerPaymentSubCategoryName = styled.span`
  color: rgb(99, 115, 129);
  width: 120px;
  flex-shrink: 0;
`

export {
  //ORDER DETAIL
  OrderDetailContainer,
  OrderDetailStack,
  OrderDetailBody,
  OrderDetailDescription,
  OrderDetailDate,
  OrderDetailStatus,
  OrderDetailActions,
  //PRODUCT CARD
  ProductDetailContainer,
  ProductDetailDescriptionContainer,
  ProductDetailDescriptionAvatar,
  ProductDetailDescriptionListItem,
  ProductDetailDescriptionQuantity,
  ProductDetailDescriptionPrice,
  ProductPriceDetailContainer,
  ProductPriceDetailStack,
  ProductPriceDetailDescription,
  ProductPriceDetailPrice,
  ProductPriceDetailTotalStack,
  ProductPriceDetailTotalDescription,
  ProductPriceDetailTotalPrice,
  // CUSTOMER INFO CARD
  CustomerInfoContainer,
  CustomerInfoAvatarContainer,
  CustomerInfoDescriptionContainer,
  // DELIVERY
  CustomerDeliveryContainer,
  CustomerDeliverySubCategoryContainer,
  CustomerDeliverySubCategoryName,
  // SHIPPING
  CustomerShippingContainer,
  CustomerShippingSubCategoryContainer,
  CustomerShippingSubCategoryName,
  // PAYMENT
  CustomerPaymentContainer,
  CustomerPaymentSubCategoryContainer,
  CustomerPaymentSubCategoryName
};
