import React, { useState, ReactNode, ReactElement } from "react";
import NavigatingContext from "./NavigatingContext";

interface Props {
    children?: ReactNode;
}

function NavigatingProvider(props: Props): ReactElement {
    const [isNavigating, setIsNavigating] = useState(false);

    return (
        <NavigatingContext.Provider
            value={{
                isNavigating,
                setIsNavigating: setIsNavigating,
            }}
        >
            {props.children}
        </NavigatingContext.Provider>
    );
}

export default NavigatingProvider;
