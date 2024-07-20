import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import Nav from './nav';
import Main from './main';
import Header from './header';
import { useNavigate } from 'react-router-dom';


export default function DashboardLayout({ children }: any) {
  const navigate = useNavigate();
  const [openNav, setOpenNav] = useState(false);
  const token = localStorage.getItem("3b-iphone-token");
  
  useEffect(() => {
    console.log(token?.length)
    if(token?.length === undefined) {
      navigate('/')
    }
  }, [])
  
  
  
  return (
    <>
      <Header onOpenNav={() => setOpenNav(true)} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
        }}
      >
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />

        <Main>{children}</Main>
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
