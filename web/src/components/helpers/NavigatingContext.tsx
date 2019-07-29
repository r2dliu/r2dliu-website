import { createContext } from "react";

interface NavigatingContextInterface {
	isNavigating: boolean;
	setIsNavigating: (bool: boolean) => void;
}

const NavigatingContext = createContext<NavigatingContextInterface>({
	isNavigating: false,
	setIsNavigating: () => {}
});

export default NavigatingContext;
