import { createRoot } from "react-dom/client";
import App from "./app";
import Background from "./bg";

import { createTheme, MantineProvider } from "@mantine/core"
import "@mantine/core/styles.css"
import "./style.css";
import { TextBoxProvider } from "./components/providers/text-box/provider";
import { StateMachineProvider } from "./components/providers/state-machine";

const theme = createTheme({
    primaryColor: "violet",
    components: {
        Button: {
            defaultProps: {
                variant: "light"
            }
        },
        ActionIcon: {
            defaultProps: {
                variant: "light"
            }
        }
    }
})

const root = document.getElementById("root")!;

createRoot(root).render(
    <MantineProvider theme={theme} forceColorScheme="dark">
        <TextBoxProvider>
            <Background />
            <StateMachineProvider />
        </TextBoxProvider>
    </MantineProvider>,
);
