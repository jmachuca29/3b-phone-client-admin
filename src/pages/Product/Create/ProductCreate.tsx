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
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Grid from "@mui/material/Unstable_Grid2";
import { Controller, SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { getCapacity } from "src/services/capacity";
import Iconify from "src/components/iconify";
import IllustrationFile from "src/assets/illustration_file.svg?react";
import { useDropzone } from "react-dropzone";
import { useCallback, useEffect, useState } from "react";
import { getGrade } from "src/services/grade";
import { ProductCreateDto, ProductWithImageDto } from "src/models/product";
import { createProduct } from "src/services/product";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

type ProductImage = {
    name: string
    url: string
}

type Inputs = {
    description: string
    capacity: string
    image: ProductImage
    prices: any
};



const defaultFormValue: Inputs = {
    description: "",
    capacity: "",
    image: {
        name: '',
        url: ''
    },
    prices: [{ grade: "", price: "" }]
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
        const filesFiltered = files.filter((file: any) => file.path !== filename);
        const fileToRemove = files.find((file: any) => file.path === filename);
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

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        maxFiles: 1,
        accept: {
            'image/png': ['.png'],
            'image/jpg': ['.jpg', '.jpeg'],
        },
        maxSize: 350000,
        onDrop
    });

    const handleSubmitFile = async (e: React.FormEvent) => {
        e.preventDefault();

        const uploadFiles = async (file: File) => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", "vxhqbcnh");
            formData.append("api_key", "263659376641652");
            formData.append("folder", "products");

            const res = await fetch(
                "https://api.cloudinary.com/v1_1/dwuk1xa8f/image/upload",
                {
                    method: "POST",
                    body: formData,
                }
            );
            const data = await res.json();
            setFiles((prevFiles: any) =>
                prevFiles.map((f: File) =>
                    f.name === file.name ? Object.assign(file, {
                        secure_url: data.secure_url,
                    }) : f
                )
            );
        };

        for (const file of files) {
            await uploadFiles(file);
        }
    };

    const mutationProduct = useMutation({
        mutationFn: createProduct,
        onSuccess: () => {
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

    const { data: gradeData } = useQuery({
        queryKey: ["grade"],
        queryFn: getGrade,
    });

    const { handleSubmit, control } = useForm<Inputs>({
        defaultValues: defaultFormValue,
    });

    const {
        fields,
        append,
        remove,
    } = useFieldArray({
        control,
        name: "prices"
    });

    const onSubmit: SubmitHandler<Inputs> = (data) => {
        const baseSchema = {
          description: data.description,
          capacity: data.capacity,
          prices: data.prices,
        };
      
        let product;
      
        if (files.length === 0) {
          product = new ProductCreateDto(baseSchema);
        } else {
          const productSchemaWithImage = {
            ...baseSchema,
            image: {
              name: files[0]?.name,
              url: files[0]?.secure_url,
            },
          };
          product = new ProductWithImageDto(productSchemaWithImage);
        }
      
        mutationProduct.mutate(product);
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
                                    name="description"
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
                                                        thorough your machine (Max. 350KB)
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
                                                            onClick={() => onRemove(file.path)}
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
                                                <Button
                                                    variant="contained"
                                                    size="small"
                                                    startIcon={<Iconify icon="ep:upload-filled" />}
                                                    onClick={handleSubmitFile}
                                                    disabled={files[0]?.secure_url !== undefined}
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
                                <>
                                    {fields.map((item, index) => {
                                        return (
                                            <Box sx={{ display: 'grid', gap: '24px 16px', gridTemplateColumns: '1fr 1fr auto', alignItems: 'center' }} key={item.id}>
                                                <Controller
                                                    render={({ field }) =>
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
                                                    }
                                                    name={`prices.${index}.grade`}
                                                    control={control}
                                                />
                                                <Controller
                                                    render={({ field }) =>
                                                        <TextField
                                                            type="number"
                                                            label="Precio"
                                                            variant="outlined"
                                                            {...field}
                                                        />
                                                    }
                                                    name={`prices.${index}.price`}
                                                    control={control}
                                                />
                                                <IconButton onClick={() => remove(index)}>
                                                    <Iconify icon="ic:outline-delete" />
                                                </IconButton>
                                            </Box>
                                        );
                                    })}
                                    <Box sx={{ textAlign: 'center' }}>
                                        <IconButton onClick={() => append({ grade: "", price: "" })}>
                                            <Iconify icon="carbon:add-filled" />
                                        </IconButton>
                                    </Box>
                                </>
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
