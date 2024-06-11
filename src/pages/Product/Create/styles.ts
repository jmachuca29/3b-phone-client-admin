import styled from "@emotion/styled";
import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";

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

const ImageUploadContainer = styled(Stack)`
  gap: 12px;
`

const ImageUploadSection = styled(Box)`
  padding: 40px;
  outline: none;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
  background-color: rgba(145, 158, 171, 0.08);
  border: 1px dashed rgba(145, 158, 171, 0.2);
  transition: opacity 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, padding 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
`

const ImageUploadSectionChild = styled(Stack)`
  display: flex;
  flex-flow: column wrap;
  gap: 24px;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
`

const ImageUploadSectionSVG = styled.svg`
  width: 100%;
  height: 100%;
  max-width: 200px;
`

const ImageUploadSectionDescription = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
`

const ImageUploadSectionInstructions = styled(Typography)`
  margin: 0px;
  line-height: 1.57143;
  font-size: 0.875rem;
  font-family: "Public Sans", sans-serif;
  font-weight: 400;
  color: rgb(99, 115, 129);
`

const ImageUploadSectionInstructionsLink = styled(Box)`
  margin-left: 4px;
  margin-right: 4px;
  color: rgb(0, 167, 111);
  text-decoration: underline;
`

const ImagePreviewContainer = styled(Box)`
  margin-top: 24px;
  margin-bottom: 24px;
`

const ImagePreviewElement = styled(Stack)`
  flex-direction: column;
  -webkit-box-align:center;
  align-items: center;
  display: inline-flex;
  -webkit-box-pack: center;
  justify-content: center;
  margin: 4px;
  width: 80px;
  height: 80px;
  border-radius: 10px;
  overflow: hidden;
  position: relative;
  border: 1px solid rgba(145, 158, 171, 0.16);
`

const ImagePreviewElementSpan = styled<any>(Stack)`
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  width: fit-content;
  height: inherit;
`

const ImagePreviewElementBox = styled<any>(Box)`
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  object-fit: cover;
  position: absolute;
`

const ImagePreviewElementCloseIcon = styled<any>(IconButton)`
  display: inline-flex;
  -webkit-box-align: center;
  align-items: center;
  -webkit-box-pack: center;
  justify-content: center;
  box-sizing: border-box;
  -webkit-tap-highlight-color: transparent;
  outline: 0px;
  border: 0px;
  margin: 0px;
  cursor: pointer;
  user-select: none;
  vertical-align: middle;
  appearance: none;
  text-decoration: none;
  text-align: center;
  flex: 0 0 auto;
  border-radius: 50%;
  overflow: visible;
  transition: background-color 150ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  font-size: 1.125rem;
  padding: 4px;
  top: 4px;
  right: 4px;
  position: absolute;
  color: rgb(255, 255, 255);
  background-color: rgba(22, 28, 36, 0.48);
  :hover {
    background-color: rgba(22, 28, 36, 0.72);
  }
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
  CustomerPaymentSubCategoryName,
  // IMAGE
  ImageUploadContainer,
  ImageUploadSection,
  ImageUploadSectionChild,
  ImageUploadSectionSVG,
  ImageUploadSectionDescription,
  ImageUploadSectionInstructions,
  ImageUploadSectionInstructionsLink,
  ImagePreviewContainer,
  ImagePreviewElement,
  ImagePreviewElementSpan,
  ImagePreviewElementBox,
  ImagePreviewElementCloseIcon
};
