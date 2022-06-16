import {
  Box,
  Button,
  Container,
  Grid,
  Link,
  TextField,
  Typography,
} from "@mui/material";
import { SchemaOf, object, string } from "yup";
import { FirebaseError } from "firebase-admin";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useAuth } from "../providers/auth";
import { useRouter } from "next/router";

interface FormData {
  email: string;
  password: string;
}

const schema: SchemaOf<FormData> = object().shape({
  email: string().email("Required field").required("Must be a password"),
  password: string().required("Required field"),
});

const SignInForm = () => {
  const { signInWithEmailAndPassword } = useAuth();
  const router = useRouter();

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      await signInWithEmailAndPassword(data.email, data.password);
      router.push("/");
    } catch (error) {
      const fbError = error as FirebaseError;
      if (
        fbError.code === "auth/user-not-found" ||
        fbError.code === "auth/wrong-password"
      ) {
        alert("invalid user");
      }
    }
  });

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={onSubmit} noValidate>
          <Controller
            name={"email"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                onChange={onChange}
                value={value || ""}
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                autoFocus
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
              />
            )}
          />
          <Controller
            name={"password"}
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextField
                onChange={onChange}
                value={value || ""}
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                error={Boolean(errors.password)}
                helperText={errors.password?.message}
              />
            )}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
};

export default SignInForm;
