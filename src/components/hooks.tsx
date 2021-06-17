import { useQuery, UseQueryOptions, UseQueryResult } from "react-query";
import React, { FunctionComponent, ReactElement, useEffect } from "react";

type UseQueryProps = {
  children: (result: UseQueryResult) => ReactElement;
  options: UseQueryOptions;
};

export const UseQuery: FunctionComponent<UseQueryProps> = ({ children, options }) =>
  children(useQuery(options));

export const useIsClient = () => {
  const [isClient, setIsClient] = React.useState(false);
  // The following effect will be ignored on server,
  // but run on the browser to set the flag true
  useEffect(() => setIsClient(true), []);
  return isClient;
};
