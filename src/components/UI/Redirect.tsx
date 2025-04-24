
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "./LoadingSpinner";

interface RedirectProps {
  to: string;
  children?: ReactNode;
}

export function Redirect({ to, children }: RedirectProps) {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate(to);
  }, [navigate, to]);
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      {children || <LoadingSpinner />}
    </div>
  );
}
