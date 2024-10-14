import AppAlert from "@/components/alert";
import createEmotionCache from "@/createEmotionCache";
import { useNProgress } from "@/hooks/useNprogress";
import { AlertProvider } from "@/providers/alertProvider";
import { Providers } from "@/redux/provider";
import { store } from "@/redux/store";
import theme from "@/theme/theme";
import { CacheProvider, EmotionCache } from "@emotion/react";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider } from "@mui/material/styles";
import { AppProps } from "next/app";
import Head from "next/head";
import { persistStore } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import type { Page } from "../models/types/pages";
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
  Component: Page;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const persistor = persistStore(store);
  useNProgress();
  const getLayout = Component.getLayout ?? ((page) => page);

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="/static/logo.png" />
      </Head>
      <AlertProvider>
        <PersistGate persistor={persistor}>
          <Providers>
            <ThemeProvider theme={theme}>
              <AppAlert />
              {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
              <CssBaseline />
              {getLayout(<Component {...pageProps} />)}
            </ThemeProvider>
          </Providers>
        </PersistGate>
      </AlertProvider>
    </CacheProvider>
  );
}
