import { Box, Image, MantineColor, Text } from "@mantine/core";
import { useEffect, useState } from "react";

type Pos = "bottomleft" | "bottomright" | "topleft" | "topright"

export type TextBoxTy = {
    sprite?: string,
    color?: MantineColor,
    position?: Pos,
    text: string
}

function getPos(pos: Pos) {
    switch (pos) {
        case "bottomleft":
            return { bottom: 10, left: 10 }
        case "bottomright":
            return { bottom: 10, right: 10 }
        case "topleft":
            return { top: 10, left: 10 }
        case "topright":
            return { top: 10, right: 10 }
    }
}

export const TextBox = ({ text, sprite, color, position = "topleft" }: TextBoxTy) => {
    const [content, setContent] = useState("");

    useEffect(() => {
        let i = 0;

        const interval = setInterval(() => {
            i++;
            setContent(text.slice(0, i));

            if (i >= text.length) {
                clearInterval(interval);
            }
        }, 30);

        return () => clearInterval(interval);
    }, [text]);

    return (
        <Box
            bg="dark"
            pos="fixed"
            color="gray"
            p="md"
            display="flex"
            style={{
                borderColor: color ?? "whitesmoke",
                border: "3px solid",
                ...getPos(position)

            }}
        >
            {sprite && <Image src={sprite} w={100} h={100} mr="sm" radius="md" />}
            <Text size="xl" style={{
                whiteSpace: "pre-line"
            }}>
                {content}
            </Text>
        </Box>
    );
};
