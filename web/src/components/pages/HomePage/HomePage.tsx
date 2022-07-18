import React, { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";

import Button from "@mui/material/Button";
import cn from "classnames";
import { Navigate } from "react-router-dom";

import styles from "./HomePage.module.scss";

function HomePage() {
    const [isClicked, setIsClicked] = useState(false);
    const [isAnimationDone, setIsAnimationDone] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(true);
    }, []);

    const markAnimationFinished = (e: AnimationEvent) => {
        if (e.animationName.includes("fade-out")) {
            setIsAnimationDone(true);
        }
    };

    const markClicked = () => {
        setIsClicked(true);
    };

    const getClickedClassNames = (classNames: string) =>
        cn(classNames, {
            [styles.clicked]: isClicked,
        });

    if (isAnimationDone) {
        return <Navigate to="/about" />;
    }

    return (
        <CSSTransition in={isClicked} timeout={200} classNames="my-node">
            <div className={styles.Home}>
                <div
                    className={cn(getClickedClassNames(styles.title), {
                        [styles.loaded]: isLoaded,
                    })}
                >
                    David Liu
                </div>
                <div
                    className={cn(getClickedClassNames(styles.description), {
                        [styles.loaded]: isLoaded,
                    })}
                >
                    Software | Design | Bouldering | Melee
                </div>
                <Button
                    className={cn(getClickedClassNames(styles.button), {
                        [styles.loaded]: isLoaded,
                    })}
                    variant="outlined"
                    onClick={markClicked}
                    disabled={isClicked}
                >
                    <div className={styles.buttonContent}>
                        <b>{"About Me"}</b>
                    </div>
                </Button>
            </div>
        </CSSTransition>
    );
}

export default HomePage;
