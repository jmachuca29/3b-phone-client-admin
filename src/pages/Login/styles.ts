import styled from '@emotion/styled';
import { Box } from '@mui/material';

const LoginSection = styled(Box)`
  display: flex;
  flex: 1 1 auto;
  min-height: 100%;
  flex-direction: column;
`;

const LoginContainer = styled(Box)`
  display: flex;
  flex: 1 1 auto;
  flex-direction: row;
`;

const LoginLeftPanel = styled(Box)`
  padding: 72px 24px;
  width: 100%;
  max-width: 480px;
  gap: 64px;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background-color: #FAFAFA;
`;

const LoginRightPanel = styled(Box)`
  padding: 40px 16px;
  display: flex;
  flex: 1 1 auto;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  background-color: #FFF;
`

const LoginFormContainer = styled(Box)`
width: 100%;
display: flex;
flex-direction: column;
max-width: 420px`

export {
  LoginSection,
  LoginContainer,
  LoginLeftPanel,
  LoginRightPanel,
  LoginFormContainer
}