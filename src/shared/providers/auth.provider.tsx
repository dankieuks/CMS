import { ReactNode, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { authState } from "@/shared/store/Atoms/auth";
import { useRouter } from "next/navigation";

interface ProtectedRouteProps {
  requiredRole: "ADMIN" | "STAFF";
  children: ReactNode;
}

const ProtectedRoute = ({ requiredRole, children }: ProtectedRouteProps) => {
  const auth = useRecoilValue(authState);
  const router = useRouter();

  useEffect(() => {
    if (auth?.user?.role !== requiredRole) {
      router.replace("/unauthorized");
    }
  }, [auth?.user?.role, requiredRole, router]);

  return auth?.user?.role === requiredRole ? <>{children}</> : null;
};

export default ProtectedRoute;
