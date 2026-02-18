import { Vec2, Vec3 } from "./vec2"

export const chooseRand = <T>(arr: T[]): T =>
    arr[Math.floor(Math.random() * arr.length)]

export const mod = (x: number, m: number) =>
    (x % m + m) % m

export const randRange = (x: number, y: number) =>
    x + Math.random() * y

export const clamp = (value: number, min: number, max: number) =>
    Math.max(Math.min(value, max), min)

export const lerp = (a: number, b: number, t: number): number =>
    a * (1 - t) + b * t


export const approach = (current: number, target: number, dt: number) =>
    current < target
        ? Math.min(current + dt, target)
        : Math.max(current - dt, target)

export const add = <V extends Vec2 | Vec3>(x: V, y: V): V =>
    "z" in x && "z" in y
        ? new Vec3(x.x + y.x, x.y + x.y, x.z + x.z) as V
        : new Vec2(x.x + y.x, x.y + x.y) as V
export const sub = <V extends Vec2 | Vec3>(x: V, y: V): V =>
    "z" in x && "z" in y
        ? new Vec3(x.x - y.x, x.y - x.y, x.z - x.z) as V
        : new Vec2(x.x - y.x, x.y - x.y) as V
export const mul = <V extends Vec2 | Vec3>(x: V, y: V): V =>
    "z" in x && "z" in y
        ? new Vec3(x.x * y.x, x.y * x.y, x.z * x.z) as V
        : new Vec2(x.x * y.x, x.y * x.y) as V
export const div = <V extends Vec2 | Vec3>(x: V, y: V): V =>
    "z" in x && "z" in y
        ? new Vec3(x.x / y.x, x.y / x.y, x.z / x.z) as V
        : new Vec2(x.x / y.x, x.y / x.y) as V
