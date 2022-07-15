import React, { ReactElement } from "react";
import { BrowserRouter, Link, Route, useLocation, Routes } from "react-router-dom";
import { createTheme, StyledEngineProvider, ThemeProvider } from "@mui/material/styles";
import NavigationProvider from "helpers/NavigatingProvider";
import HomePage from "components/pages/HomePage";
import CanvasPage from "components/pages/CanvasPage";
import ArticlePage from "components/pages/ArticlePage";

import styles from "./App.module.scss";
import useTracking from "helpers/useTracking";

function TrackedRoutes(): ReactElement {
    useTracking();

    return (
        <Routes location={location}>
            <Route path="/" element={<HomePage />} />
            {/* <Route path="/articles/:id" element={<ArticlePage />} />
                        <Route path="/:id" element={<CanvasPage />} /> */}
        </Routes>
    );
}

function App(): ReactElement {
    // setDefaultBreakpoints([
    // 	{ xs: 0 },
    // 	{ s: 600 },
    // 	{ m: 900 },
    // 	{ l: 1200 },
    // 	{ xl: 1500 }
    // ]);

    const theme = createTheme({
        palette: {
            mode: "dark",
            //   primary: {
            // 	main: "#181e2e",
            // 	light: "#313742",
            // 	contrastText: "#fcffff"
            //   },
            //   secondary: {
            // 	main: "#00ffa4"
            //   },
            //   neutral: {
            // 	main: "#a4abb1"
            //   },
            //   text: {
            // 	primary: "rgba(255, 255, 255, 0.9)"
            //   },
            //   background: {
            // 	default: "#303843",
            // 	paper: "#181e2e"
            //   }
        },
    });

    return (
        <StyledEngineProvider injectFirst>
            <ThemeProvider theme={theme}>
                <NavigationProvider>
                    <div className={styles.App}>
                        <BrowserRouter>
                            <TrackedRoutes />
                        </BrowserRouter>
                    </div>
                </NavigationProvider>
            </ThemeProvider>
        </StyledEngineProvider>
    );
}

export default App;
