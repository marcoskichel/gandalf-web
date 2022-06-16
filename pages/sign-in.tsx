import type { NextPage } from "next";
import Head from "next/head";
import SignInForm from "../containers/SignInForm";

const SignIn: NextPage = () => {
  return (
    <>
      <Head>
        <title>Gandalf</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SignInForm />
    </>
  );
};

export default SignIn;
