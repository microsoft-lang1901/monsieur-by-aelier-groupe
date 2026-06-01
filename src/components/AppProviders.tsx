import type { ReactElement } from "react";

type AppProvidersProps = {
  children: ReactElement;
};

export function AppProviders({ children }: AppProvidersProps) {
  return <>{children}</>;
}
