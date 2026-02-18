import { createContext, PropsWithChildren, use, useState, SetStateAction, Dispatch } from "react";
import App from "../../../app";

export enum GameState {
    Start,

}

const StateMachineContext = createContext<{
    currentState: GameState,
    setState: Dispatch<SetStateAction<GameState>>
}>({
    currentState: GameState.Start,
    setState: () => { }
})

export const StateMachineProvider = () => {
    const [currentState, setState] = useState(0)

    return <StateMachineContext value={{
        currentState,
        setState
    }}>
        <App />
    </StateMachineContext>
}

export const useStateMachine = () => {
    const ctx = use(StateMachineContext)
    if (!ctx) throw new Error("Couldn't access to the `StateMachineContext`")
    return ctx
}
