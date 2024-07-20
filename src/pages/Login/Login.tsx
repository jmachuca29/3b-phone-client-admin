import { useNavigate } from "react-router-dom";
import { LoginContainer, LoginFormContainer, LoginLeftPanel, LoginRightPanel, LoginSection } from "./styles";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { signIn } from "src/services/auth";

type Inputs = {
  username: '',
  password: '',
};

const defaultFormValue: Inputs = {
  username: '',
  password: '',
};

const LoginPage = () => {
  const navigate = useNavigate();

  const mutationLogin = useMutation({
    mutationFn: signIn,
    onSuccess: async(response) => {
      const token = response.data.access_token || "";
      if (token !== "") {
        localStorage.setItem("3b-iphone-token", token);
        navigate('/dashboard')
      }
    },
    onError: (error: any) => {
      console.log(error);
    },
  });

  const {
    handleSubmit,
    control,
  } = useForm<Inputs>({
    defaultValues: defaultFormValue,
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    mutationLogin.mutate({ username: data.username, password: data.password })
  }

  return (
    <LoginSection>
      <LoginContainer component={"main"}>
        <LoginLeftPanel>
          <div>
            <Typography variant="h3">Hi, Welcome back</Typography>
            <Typography variant="body1">More effectively with optimized workflows.</Typography>
          </div>
          <img src="assets/illustrations/illustration_login.png" alt="" />
        </LoginLeftPanel>
        <LoginRightPanel>
          <LoginFormContainer>
            <Stack sx={{ marginBottom: 4 }}>
              <Typography variant="h5">Sign in to your account</Typography>
            </Stack>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack>
                <Box sx={{ display: 'grid', gap: '24px 16px', gridTemplateColumns: 'repeat(1, 1fr)' }}>
                  <Controller
                    name="username"
                    control={control}
                    render={({ field }) => <TextField label="Email" type="email" variant="outlined" {...field} />}
                  />
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => <TextField label="Password" type="password" variant="outlined" {...field} />}
                  />
                  <Button
                    variant="contained"
                    type="submit"
                  >
                    Login
                  </Button>
                </Box>
              </Stack>
            </form>
          </LoginFormContainer>
        </LoginRightPanel>
      </LoginContainer>
    </LoginSection>
  )
}

export default LoginPage