import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Menu,
  MenuItem,
  Stack,
  TableHead,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";
import React, { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { deleteProduct, getProducts } from "src/services/product";
import {
  OrderDetailActions,
  OrderDetailBody,
  OrderDetailContainer,
  OrderDetailDescription,
  OrderDetailStack,
} from "./styles";
import Iconify from "src/components/iconify";

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

function TablePaginationActions(props: TablePaginationActionsProps) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}

const ProductPage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient()
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState<any>([]);
  const [menuAnchorEls, setMenuAnchorEls] = useState<{
    [key: number]: HTMLElement | null;
  }>({});
  const [modalEls, setModalEls] = React.useState<any>({});

  const handleModalClose = (index: number) => {
      setModalEls((prev: any) => ({ ...prev, [index]: null }));
  };

  const handleModalClickOpen = (
    index: number
  ) => {
    handleClose(index)
    setModalEls((prev: any) => ({ ...prev, [index]: true }));
  };

  const confirmDelete = (id: string, index: number) => {
    handleModalClose(index)
    mutationDeleteProduct.mutate(id)
};

  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement>,
    index: number
  ) => {
    setMenuAnchorEls((prev) => ({ ...prev, [index]: event.currentTarget }));
  };

  const handleClose = (index: number) => {
    setMenuAnchorEls((prev) => ({ ...prev, [index]: null }));
  };

  const mutationDeleteProduct = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  const { isPending, isError, error, data } = useQuery({
    queryKey: ["products"], // Include the token as part of the query key
    queryFn: getProducts,
  });

  useEffect(() => {
    if (data) {
      const sales = data.data;
      setRows(sales);
    }
  }, [data]);

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const handleChangePage = (
    _event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
          <OrderDetailBody>
            <OrderDetailDescription>
              <Typography variant="h4">Mis Productos</Typography>
            </OrderDetailDescription>
          </OrderDetailBody>
        </OrderDetailStack>
        <OrderDetailActions>
          <Button variant="contained" onClick={() => navigate("create")}>
            Nuevo Producto
          </Button>
        </OrderDetailActions>
      </OrderDetailContainer>
      <Stack>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell>Descripcion</TableCell>
                <TableCell align="right">Capacidad</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
                ? rows.slice(
                    page * rowsPerPage,
                    page * rowsPerPage + rowsPerPage
                  )
                : rows
              ).map((row: any, index: number) => (
                <TableRow key={row._id}>
                  <TableCell component="th" scope="row">
                    {row.description}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {row?.capacity?.description}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    <IconButton onClick={(event) => handleClick(event, index)}>
                      <Iconify icon="bi:three-dots-vertical" />
                    </IconButton>
                    <Menu
                      anchorEl={menuAnchorEls[index]}
                      open={Boolean(menuAnchorEls[index])}
                      onClose={() => handleClose(index)}
                      MenuListProps={{
                        "aria-labelledby": "basic-button",
                      }}
                    >
                      <MenuItem onClick={() => navigate(`edit/${row._id}`)}>
                        <Iconify
                          style={{ marginRight: 8 }}
                          icon="fluent:edit-24-filled"
                        />
                        Editar
                      </MenuItem>
                      <MenuItem onClick={() => handleModalClickOpen(index)}>
                        <Iconify
                          style={{ marginRight: 8 }}
                          icon="ic:outline-delete"
                        />
                        Eliminar
                      </MenuItem>
                    </Menu>
                    <Dialog
                      open={Boolean(modalEls[index])}
                      aria-labelledby="alert-dialog-title"
                      aria-describedby="alert-dialog-description"
                    >
                      <DialogTitle id="alert-dialog-title">
                        {"Desea eliminar este producto?"}
                      </DialogTitle>
                      <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                          Esta accion no se podra revertir
                        </DialogContentText>
                      </DialogContent>
                      <DialogActions>
                        <Button onClick={()=> handleModalClose(index)}>Cancelar</Button>
                        <Button onClick={()=> confirmDelete(row._id, index)} autoFocus>
                          Aceptar
                        </Button>
                      </DialogActions>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 25, { label: "All", value: -1 }]}
                  colSpan={3}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  slotProps={{
                    select: {
                      inputProps: {
                        "aria-label": "rows per page",
                      },
                      native: true,
                    },
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      </Stack>
    </Container>
  );
};

export default ProductPage;
