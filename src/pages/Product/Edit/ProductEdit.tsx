/// <reference types="vite-plugin-svgr/client" />
import {
    Box,
    Button,
    Checkbox,
    Chip,
    Container,
    FormControl,
    IconButton,
    InputLabel,
    ListItemText,
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
import { useNavigate, useParams } from "react-router-dom";
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
import { ProductUpdateDto, ProductWithImageUpdateDto } from "src/models/product";
import { getProductbyID, updateProduct } from "src/services/product";
import { getColor } from "src/services/color";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

type Inputs = {
    _id: string
    description: string
    colors: any[]
    image: any
    prices: any
};

const defaultFormValue: Inputs = {
    _id: "",
    description: "",
    colors: [],
    image: {
        name: '',
        url: ''
    },
    prices: [{ grade: "", price: "", capacity: "", }]
};

const ProductUpdate = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [files, setFiles] = useState<any>([]);

    const onDrop = useCallback((acceptedFiles: File[]) => {
        if (acceptedFiles && acceptedFiles.length > 0) {
            setFiles(() => [
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
                        secure_url: data?.secure_url,
                    }) : f
                )
            );
        };

        for (const file of files) {
            await uploadFiles(file);
        }
    };

    const mutationProduct = useMutation({
        mutationFn: ({ id, product }: any) => updateProduct(id, product),
        onSuccess: () => {
            navigate(-1)
        },
        onError: (error: any) => {
            console.log(error)
        },
    });

    const { data } = useQuery({
        queryKey: ["saleDetail", id],
        queryFn: () =>
            id ? getProductbyID(id) : Promise.reject("No uuid found"),
    });

    const { data: colorData } = useQuery({
        queryKey: ["color"],
        queryFn: getColor,
    });

    const { data: capacityData } = useQuery({
        queryKey: ["capacity"],
        queryFn: getCapacity,
    });

    const { data: gradeData } = useQuery({
        queryKey: ["grade"],
        queryFn: getGrade,
    });

    const { handleSubmit, control, setValue } = useForm<Inputs>({
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

    useEffect(() => {
        if (data) {
            const response = data?.data || null;
            setForm(response);
        }
    }, [data]);

    const getColorDescriptions = (colorList: any[]): string[] => {
        return colorList.map(color => color._id);
    }

    const getColorsByIds = (ids: string[], colorList: any[]): any[] => {
        return colorList.filter(color => ids.includes(color._id));
    }

    const setForm = (data: any) => {
        setValue('_id', data?._id)
        setValue('colors', getColorDescriptions(data?.colors))
        setValue('description', data?.description)
        setValue('image', data?.image)
        setValue('prices', data?.prices)
        const imageUrl = data?.image?.url || 'https://res.cloudinary.com/dwuk1xa8f/image/upload/v1718328345/404_not_found.jpg'
        const imageName = data?.image?.name || 'not_found.jpg'
        urlToFile(imageUrl, imageName, "image/jpeg").then((file) => {
            setFiles(() => [
                Object.assign(file, {
                    preview: URL.createObjectURL(file),
                    secure_url: imageUrl
                })
            ]);
        });
    }

    const urlToFile = async (url: string, filename: string, mimeType: string): Promise<File> => {
        const response = await fetch(url);
        const blob = await response.blob();
        return new File([blob], filename, { type: mimeType });
    };

    const onSubmit: SubmitHandler<Inputs> = (data) => {

        const baseSchema = {
            _id: data._id,
            description: data.description,
            colors: getColorsByIds(data.colors, colorData?.data),
            prices: data.prices,
        };

        let product;

        if (files.length === 0) {
            product = new ProductUpdateDto(baseSchema);
        } else {
            const productSchemaWithImage = {
                ...baseSchema,
                image: {
                    name: files[0]?.name,
                    url: files[0]?.secure_url || 'https://res.cloudinary.com/dwuk1xa8f/image/upload/v1718328345/404_not_found.jpg',
                },
            };
            product = new ProductWithImageUpdateDto(productSchemaWithImage);
        }
        console.log(product)
        mutationProduct.mutate({ id: id, product: product });
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
                            <Typography variant="h4">Editar Producto</Typography>
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
                        <Typography variant="h6">Color</Typography>
                        <Typography variant="body2">Seleccione los colores...</Typography>
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
                                    name="colors"
                                    control={control}
                                    render={({ field }) => (
                                        <FormControl>
                                            <InputLabel id="demo-simple-select-label">Color</InputLabel>
                                            <Select
                                                multiple
                                                labelId="demo-simple-select-label"
                                                label="Color"
                                                {...field}
                                                renderValue={(selectedIds) => (
                                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                        {selectedIds.map((id) => {
                                                            const color = colorData?.data.find((e: any) => e._id === id);
                                                            return <Chip key={id} label={color?.description} />
                                                        })}
                                                    </Box>
                                                )}
                                            >
                                                {colorData?.data.map((role: any) => (
                                                    <MenuItem key={role._id} value={role._id}>
                                                        <Checkbox checked={field.value.includes(role._id)} />
                                                        <ListItemText primary={role.description} />
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
                                            <Box sx={{ display: 'grid', gap: '24px 16px', gridTemplateColumns: '1fr 1fr 1fr auto', alignItems: 'center' }} key={item.id}>
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
                                                    name={`prices.${index}.capacity`}
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
                                        <IconButton onClick={() => append({ grade: "", price: "", capacity: "" })}>
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
                            Actualizar
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default ProductUpdate;
