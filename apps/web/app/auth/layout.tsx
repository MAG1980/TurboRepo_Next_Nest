import { FC, PropsWithChildren } from 'react';

const AuthLayout: FC<PropsWithChildren> = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex h-screen items-center justify-center bg-gradient-to-br from-lime-400 to-cyan-400">
      {children}
    </div>
  );
};

export default AuthLayout;
