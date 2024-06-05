import { Avatar, Container, ListItemText, Menu, MenuItem, Stack, TableHead, Typography } from "@mui/material";
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
import { useQuery } from "@tanstack/react-query";
import { getSales } from "src/services/sales";
import { faker } from '@faker-js/faker';
import { OrderDetailBody, OrderDetailContainer, OrderDetailDescription, OrderDetailStack } from "./styles";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";
import Status from "src/components/status/status";
import Iconify from "src/components/iconify";
import { useNavigate } from "react-router-dom";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(localizedFormat);

interface TablePaginationActionsProps {
  count: number;
  page: number;
  rowsPerPage: number;
  onPageChange: (
    event: React.MouseEvent<HTMLButtonElement>,
    newPage: number
  ) => void;
}

const stringAvatar = (name: string) => {
  return {
    children: `${name.split(" ")[0][0]}${name.split(" ")[1][0]}`,
  };
};

const calculateDate = (date: Date): any => {
  const time = dayjs(date);
  const peruTimeDay = time.tz("America/Lima").format("DD MMMM YYYY");
  const peruTimeHour = time.tz("America/Lima").format("hh:mm A");
  return {
    peruTimeDay,
    peruTimeHour
  };
};

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

const SalesPage = () => {
  const navigate = useNavigate();
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = useState<any>([]);
  const [menuAnchorEls, setMenuAnchorEls] = useState<{ [key: number]: HTMLElement | null }>({});

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, index: number) => {
    setMenuAnchorEls((prev) => ({ ...prev, [index]: event.currentTarget }));
  };

  const handleClose = (index: number) => {
    setMenuAnchorEls((prev) => ({ ...prev, [index]: null }));
  };

  const { isPending, isError, error, data } = useQuery({
    queryKey: ["sales"], // Include the token as part of the query key
    queryFn: getSales,
    retry: false
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
              <Typography variant="h4">My Sales</Typography>
            </OrderDetailDescription>
          </OrderDetailBody>
        </OrderDetailStack>
      </OrderDetailContainer>
      <Stack>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell># Orden</TableCell>
                <TableCell align="left">Cliente</TableCell>
                <TableCell align="left">Fecha</TableCell>
                <TableCell align="left">Precio</TableCell>
                <TableCell align="left">Status</TableCell>
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
                <TableRow key={row.uuid || faker.string.uuid()}>
                  <TableCell component="th" scope="row">
                    {row.uuid || 'Not available'}
                  </TableCell>
                  <TableCell style={{ display: 'flex', alignItems: 'center' }} align="left">
                    <Avatar sx={{ marginRight: 2 }} {...stringAvatar(
                      `${row?.user?.name.toUpperCase() +
                      " " +
                      row?.user?.last_name.toUpperCase()
                      }`
                    )}>
                    </Avatar>
                    <ListItemText
                      primary={row?.user?.name + ' ' + row?.user?.last_name || 'Usuario Anonimo'}
                      secondary={row?.user?.email || null}
                    />
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="left">
                    <ListItemText
                      primary={row?.createdAt ? calculateDate(row?.createdAt).peruTimeDay : '-'}
                      secondary={row?.createdAt ? calculateDate(row?.createdAt).peruTimeHour : null}
                    />
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="left">
                    {row.price}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="left">
                    <Status state={row.status} />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={(event) => handleClick(event, index)}>
                      <Iconify icon="bi:three-dots-vertical" />
                    </IconButton>
                    <Menu
                      anchorEl={menuAnchorEls[index]}
                      open={Boolean(menuAnchorEls[index])}
                      onClose={() => handleClose(index)}
                      MenuListProps={{
                        'aria-labelledby': 'basic-button',
                      }}
                    >
                      <MenuItem onClick={() => navigate(`detail/${row.uuid}`)}>
                        <Iconify style={{ marginRight: 8 }} icon="carbon:view-filled" />
                        Ver
                      </MenuItem>
                    </Menu>
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

export default SalesPage;
