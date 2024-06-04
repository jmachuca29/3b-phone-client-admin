import { Container, Stack, TableHead, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
// import Box from '@mui/material/Box';
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
// import useAppStore from 'src/store/store';
import { useQuery } from "@tanstack/react-query";
import InfoIcon from "@mui/icons-material/Info";
import { useNavigate } from "react-router-dom";
import { getSales } from "src/services/sales";
import { faker } from '@faker-js/faker';
import { OrderDetailBody, OrderDetailContainer, OrderDetailDate, OrderDetailDescription, OrderDetailStack, OrderDetailStatus } from "./styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import localizedFormat from "dayjs/plugin/localizedFormat";

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

const calculateDate = (date: Date): string => {
  const time = dayjs(date);
  const peruTime = time.tz("America/Lima").format("DD MMMM YYYY hh:mm A");
  return peruTime;
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
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  // const [user] = useAppStore((state) => [state.user]);
  const [rows, setRows] = useState<any>([]);
  const navigate = useNavigate();

  const { isPending, isError, error, data } = useQuery({
    queryKey: ["sales"], // Include the token as part of the query key
    queryFn: getSales,
  });

  useEffect(() => {
    if (data) {
      const sales = data.data;
      setRows(sales);
    }
  }, [data]);

  console.log(rows);

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
          <IconButton aria-label="arrow-back" onClick={() => navigate(-1)}>
            <ChevronLeftIcon />
          </IconButton>
          <OrderDetailBody>
            <OrderDetailDescription>
              <Typography variant="h4">Sales #</Typography>
              <OrderDetailStatus>STATUS</OrderDetailStatus>
            </OrderDetailDescription>
            <OrderDetailDate variant="body2">
              {calculateDate(new Date())}
            </OrderDetailDate>
          </OrderDetailBody>
        </OrderDetailStack>
      </OrderDetailContainer>
      <Stack>
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 500 }} aria-label="custom pagination table">
            <TableHead>
              <TableRow>
                <TableCell># Orden</TableCell>
                <TableCell align="right">Precio</TableCell>
                <TableCell align="right">Status</TableCell>
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
              ).map((row: any) => (
                <TableRow key={row.uuid || faker.string.uuid()}>
                  <TableCell component="th" scope="row">
                    {row.uuid || 'Not available'}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {row.price}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    {row.status}
                  </TableCell>
                  <TableCell style={{ width: 160 }} align="right">
                    <IconButton
                      aria-label="info-icon"
                      onClick={() => navigate(`/resume/${row.uuid}`)}
                    >
                      <InfoIcon />
                    </IconButton>
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
