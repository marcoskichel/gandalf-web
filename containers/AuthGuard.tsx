import { useRouter } from "next/router";
import { useAuth } from "../providers/auth";

interface Props {
  children: React.ReactNode;
}

const AuthGuard = (props: Props) => {
  const { children } = props;

  const router = useRouter();
  const { user } = useAuth();

  if (!user) {
    router.push("/sign-in");
    return <div>Unauthorized</div>;
  }

  return children;
};

export default AuthGuard;
