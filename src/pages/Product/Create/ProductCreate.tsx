/// <reference types="vite-plugin-svgr/client" />
import {
  Box,
  Button,
  Container,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ImagePreviewContainer,
  ImagePreviewElement,
  ImagePreviewElementActions,
  ImagePreviewElementBox,
  ImagePreviewElementCloseIcon,
  ImagePreviewElementSpan,
  ImageUploadContainer,
  ImageUploadSection,
  ImageUploadSectionChild,
  ImageUploadSectionDescription,
  ImageUploadSectionInstructions,
  ImageUploadSectionInstructionsLink,
  ImageUploadSectionSVG,
  OrderDetailBody,
  OrderDetailContainer,
  OrderDetailDescription,
  OrderDetailStack,
} from "./styles";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import { useMutation, useQuery } from "@tanstack/react-query";
import { createSale } from "src/services/sales";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Grid from "@mui/material/Unstable_Grid2";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { getCapacity } from "src/services/capacity";
import { SaleCreateProps, SalesCreateDto } from "src/models/sales";
import Iconify from "src/components/iconify";
import { SaleState } from "src/constant/sales";
import IllustrationFile from "src/assets/illustration_file.svg?react";
import { useDropzone } from "react-dropzone";
import { useCallback, useEffect, useState } from "react";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

type Inputs = {
  name: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  paymentType: string;
  bankEntity: string;
  numberAccount: string;
  productName: string;
  serieNumber: string;
  firstImei: string;
  secondImei: string;
  capacity: string;
  grade: string;
  accesories: string[];
  price: string;
  status: SaleState;
};

const defaultFormValue: Inputs = {
  name: "",
  lastName: "",
  email: "",
  phoneNumber: "",
  address: "",
  paymentType: "",
  bankEntity: "",
  numberAccount: "",
  productName: "",
  serieNumber: "",
  firstImei: "",
  secondImei: "",
  capacity: "",
  grade: "",
  accesories: [],
  price: "",
  status: SaleState.Pending,
};

const ProductCreate = () => {
  const navigate = useNavigate();

  const [files, setFiles] = useState<any>([]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      setFiles((prevFiles: any) => [
        ...prevFiles,
        ...acceptedFiles.map((file: File) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        ),
      ]);
    }
  }, []);

  const onRemove = (filename: string) => {
    const filesFiltered = files.filter((file: File) => file.name !== filename);
    const fileToRemove = files.find((file: File) => file.name === filename);
    if (fileToRemove) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
    setFiles(filesFiltered);
  };
  

  useEffect(() => {
    // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
    return () =>
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  //   const handleSubmitFile = async (e: any) => {
  //     e.preventDefault();

  //     const formData = new FormData();
  //     formData.append("file", acceptedFiles[0]);
  //     formData.append("upload_preset", "YOUR_PRESET");
  //     formData.append("api_key", "YOUR_API_KEY");

  //     console.log(e.target[1]);
  //     const res = await fetch(
  //       "https://api.cloudinary.com/v1_1/fazttech/image/upload",
  //       {
  //         method: "POST",
  //         body: formData,
  //       }
  //     );
  //     const data = await res.json();
  //     console.log(data);
  //   };

  const mutationSale = useMutation({
    mutationFn: createSale,
    onSuccess: ($event) => {
      console.log($event);
      navigate(-1);
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  const { data: capacityData } = useQuery({
    queryKey: ["capacity"],
    queryFn: getCapacity,
  });

  const { handleSubmit, control } = useForm<Inputs>({
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
        ubigeo: "",
        address: data?.address,
      },
      price: Number(data?.price),
      bankEntity: data?.bankEntity,
      numberAccount: data?.numberAccount,
      status: data?.status,
    };
    const sale = new SalesCreateDto(saleSchema);
    mutationSale.mutate(sale);
  };

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
              <Stack
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                  padding: "24px",
                }}
              >
                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField label="Nombre" variant="outlined" {...field} />
                  )}
                />
                <ImageUploadContainer sx={{ gap: "12px" }}>
                  <Typography variant="subtitle2">Images</Typography>
                  <Box>
                    <ImageUploadSection
                      isdragactive={isDragActive.toString()}
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <ImageUploadSectionChild>
                        <ImageUploadSectionSVG>
                          <IllustrationFile />
                        </ImageUploadSectionSVG>
                        <ImageUploadSectionDescription>
                          <Typography variant="h6">
                            Drop or Select file
                          </Typography>
                          <ImageUploadSectionInstructions variant="body2">
                            Drop files here or click
                            <ImageUploadSectionInstructionsLink
                              component={"span"}
                            >
                              browse
                            </ImageUploadSectionInstructionsLink>
                            thorough your machine
                          </ImageUploadSectionInstructions>
                        </ImageUploadSectionDescription>
                      </ImageUploadSectionChild>
                    </ImageUploadSection>
                    <ImagePreviewContainer>
                      {files?.map((file: any, index: any) => (
                        <Tooltip title={file.name} key={index}>
                          <ImagePreviewElement>
                            <ImagePreviewElementSpan component={"span"}>
                              <ImagePreviewElementBox
                                component={"img"}
                                src={file.preview}
                              ></ImagePreviewElementBox>
                            </ImagePreviewElementSpan>
                            <ImagePreviewElementCloseIcon
                              size="small"
                              onClick={() => onRemove(file.name)}
                            >
                              <Iconify
                                icon="material-symbols:close"
                                style={{ width: "14px", height: "14px" }}
                              />
                            </ImagePreviewElementCloseIcon>
                          </ImagePreviewElement>
                        </Tooltip>
                      ))}
                    </ImagePreviewContainer>
                    {files?.length > 0 && (
                      <ImagePreviewElementActions>
                        <Button variant="outlined" size="small">
                          Remove All
                        </Button>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<Iconify icon="ep:upload-filled" />}
                        >
                          Upload
                        </Button>
                      </ImagePreviewElementActions>
                    )}
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
              <Stack
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                  padding: "24px",
                }}
              >
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
              <Stack
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "24px",
                  padding: "24px",
                }}
              >
                <Controller
                  name="price"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      type="number"
                      label="Precio"
                      variant="outlined"
                      {...field}
                    />
                  )}
                />
              </Stack>
            </Paper>
          </Grid>
          <Grid xs={4}></Grid>
          <Grid xs={8} sx={{ textAlign: "end" }}>
            <Button type="submit" variant="contained" size="large">
              Crear
            </Button>
          </Grid>
        </Grid>
      </form>
    </Container>
  );
};

export default ProductCreate;
