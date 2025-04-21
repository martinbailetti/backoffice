import "../../styles/main.scss";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { DataProvider } from "@/context/DataContext";
import { useEffect } from "react";
import { useRouter } from "next/router";

const App = ({ Component, pageProps }: AppProps) => {
  const router = useRouter();

  useEffect(() => {
    const handleRouteChangeError = (err: unknown, url: string) => {
      if ((err as any).cancelled) { // eslint-disable-line
        console.warn(`Navigation to ${url} was cancelled`);
      }
    };

    router.events.on("routeChangeError", handleRouteChangeError);

    return () => {
      router.events.off("routeChangeError", handleRouteChangeError);
    };
  }, [router]);

  return (
      <DataProvider>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </DataProvider>
  );
};
export default App;
