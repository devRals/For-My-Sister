import { createContext, PropsWithChildren, use, useEffect, useState } from "react";
import { useHotkeys } from "@mantine/hooks"
import { TextBox, TextBoxTy } from ".";

type Context = {
    currentBox: TextBoxTy | null,
    showTextBox: (texts: TextBoxTy[] | TextBoxTy | string[] | string) => void
    clear: () => void
}

const TextBoxContext = createContext<Context>({
    currentBox: null,
    showTextBox: () => { },
    clear: () => { }
})

export const TextBoxProvider = ({ children }: PropsWithChildren) => {
    const [texts, setTexts] = useState<TextBoxTy[]>([])
    const [currentTextIdx, setCurrentTextIdx] = useState(0)

    const showTextBox: Context["showTextBox"] = (newTexts) => {
        let texts: TextBoxTy[];
        if (typeof newTexts === "string") {
            texts = [{ text: newTexts }]
        } else if (Array.isArray(newTexts)) {
            texts = "text" in newTexts ? newTexts as TextBoxTy[] :
                newTexts.map(v => ({ text: v }) as TextBoxTy)
        } else {
            texts = [newTexts]
        }

        setCurrentTextIdx(0)
        setTexts(texts)
    }

    const clear = () => {
        setTexts([])
        setCurrentTextIdx(0)
    }

    const currentBox = texts[currentTextIdx] ?? null

    useHotkeys([
        ["Z", () => {
            setCurrentTextIdx(v => v + 1)
        }],
        ["Enter", () => {
            setCurrentTextIdx(v => v + 1)
        }]
    ])

    useEffect(() => {
        if (currentTextIdx >= texts.length && texts.length > 0) {
            clear()
        }
    }, [currentTextIdx, texts.length])

    useEffect(() => {
        const ctrl = new AbortController()
        const { signal } = ctrl
        const update = () =>
            setCurrentTextIdx(v => v + 1)

        window.addEventListener("click", update, { signal })
        window.addEventListener("keypress", e => e.code === "Esc" && clear(), { signal })

        return () => ctrl.abort()
    }, [])

    return (
        <TextBoxContext value={{ currentBox, showTextBox, clear }}>
            {currentBox && <TextBox
                {...currentBox}
            />}
            {children}
        </TextBoxContext>
    )
}

export const useTextBox = () => {
    const ctx = use(TextBoxContext)
    if (!ctx) throw new Error("Couldn't access to the TextBoxProvider")
    return ctx
}
