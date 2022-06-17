import nookies from "nookies";
import { GetServerSidePropsContext } from "next";
import firebaseAdmin from "../config/firebaseAdmin";

const checkUserIsAuthorized = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    const token = await firebaseAdmin.auth().verifyIdToken(cookies.token);

    return token;
  } catch (err) {
    ctx.res.writeHead(302, { Location: "/sign-in" });
    ctx.res.end();
    return null;
  }
};

const checkUserIsNotAuthorized = async (ctx: GetServerSidePropsContext) => {
  try {
    const cookies = nookies.get(ctx);
    await firebaseAdmin.auth().verifyIdToken(cookies.token);
    ctx.res.writeHead(302, { Location: "/" });
    ctx.res.end();

    return null;
  } catch (err) {
    return null;
  }
};

export { checkUserIsAuthorized, checkUserIsNotAuthorized };