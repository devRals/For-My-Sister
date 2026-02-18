import a00 from "./a00.png"
import a01 from "./a01.png"
import a02 from "./a02.png"
import a03 from "./a03.png"

import b00 from "./b00.png"
import b01 from "./b01.png"
import b02 from "./b02.png"
import b03 from "./b03.png"

import c00 from "./c00.png"
import c01 from "./c01.png"
import c02 from "./c02.png"
import c03 from "./c03.png"

const textures = [
    [a00, a01, a02, a03],
    [b03, b02, b01, b00],
    [c00, c01, c02, c03],
] as const

export default textures
