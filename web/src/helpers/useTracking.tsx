import { useEffect } from "react";
import ReactGA from "react-ga";
import { useLocation } from "react-router-dom";

export default function useTracking(): void {
    const trackingId = "UA-117671460-1";
    const location = useLocation();

    useEffect(() => {
        // Enable debug mode on the local development environment
        const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === "development";
        ReactGA.initialize(trackingId, { debug: isDev });
    }, []);

    useEffect(() => {
        const currentPath = location.pathname + location.search;
        ReactGA.set({ page: currentPath });
        ReactGA.pageview(currentPath);
    }, [location]);
}
