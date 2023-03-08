import { useLocation, useOutlet } from "@remix-run/react";
import CanvasPage from "components/BasePages/CanvasPage";
import { AnimatePresence, motion } from "framer-motion";

export default function Canvas() {
  const outlet = useOutlet();
  console.log("canvas");
  return (
    <CanvasPage>
      <AnimatePresence mode="wait">
        <motion.div
          key={useLocation().pathname}
          initial={{ y: "-5px", opacity: 0 }}
          animate={{ y: "0", opacity: 1 }}
          exit={{
            y: "5px",
            opacity: 0,
            transition: {
              duration: "0.15",
              ease: "easeOut",
            },
          }}
          transition={{ duration: "0.15", ease: "easeIn" }}
        >
          {outlet}
        </motion.div>
      </AnimatePresence>
    </CanvasPage>
  );
}
