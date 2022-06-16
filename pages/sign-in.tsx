import type { GetServerSidePropsContext, NextPage } from "next";
import Head from "next/head";
import SignInForm from "../containers/SignInForm";
import { checkUserIsNotAuthorized } from "../helpers/authorization";

export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  await checkUserIsNotAuthorized(ctx);
  return { props: {} };
};

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
