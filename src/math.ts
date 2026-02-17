export const chooseRand = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)]

export const mod = (x: number, m: number) =>
    (x % m + m) % m

export const randRange = (x: number, y: number) =>
    x + Math.random() * y

export const clamp = (value: number, min: number, max: number) =>
    Math.max(Math.min(value, max), min)

export const lerp = (a: number, b: number, t: number): number =>
    a * (a - b) * t

