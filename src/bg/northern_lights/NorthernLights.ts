import { HEIGHT, WIDTH } from "."
import { approach, chooseRand, lerp, mul, randRange } from "../../math"
import { Vec2, Vec3 } from "../../vec2"
import { VertexPositionColorTexture } from "../utils"

export class NorthernLights {
    strands: Strand[]
    particles: Particle[]
    timer: number = 0
    verts: VertexPositionColorTexture[] = []
    northernLightsAlpha = 1
    offsetY = 0

    static colors = [
        Vec3.fromHex("2de079").map(v => v / 255),
        Vec3.fromHex("62f4f6").map(v => v / 255),
        Vec3.fromHex("45bc2e").map(v => v / 255),
        Vec3.fromHex("3856f0").map(v => v / 255),
    ]

    constructor() {
        let strands = []
        for (let i = 0; i < 3; i++) {
            strands.push(new Strand())
        }

        let particles: Particle[] = []
        for (let i = 0; i < 50; i++) {
            const particle: Particle = {
                pos: new Vec2(randRange(0, WIDTH), randRange(0, HEIGHT)),
                speed: randRange(4, 14),
                color: chooseRand(NorthernLights.colors)
            }
            particles.push(particle)
        }

        this.strands = strands
        this.particles = particles
    }

    update(dt: number) {
        this.timer += dt * 0.3
        for (const strand of this.strands) {
            strand.percent += dt / strand.duration

            if (!strand.fadingOut && strand.percent >= 1) {
                strand.fadingOut = true
            }

            const target = strand.fadingOut ? 0 : 1
            strand.alpha = approach(strand.alpha, target, dt * 0.5)

            if (strand.fadingOut && strand.alpha < 0.01) {
                strand.reset(0)
            }

            for (const node of strand.nodes) {
                node.sineOffset += dt
            }
        }
        for (let i = 0; i < this.particles.length; i++) {
            if (this.particles[i].pos.y > HEIGHT) {
                this.particles[i].pos.y = -3
                this.particles[i].pos.x = randRange(0, WIDTH)
            } else {
                this.particles[i].pos.y += this.particles[i].speed * dt
            }

        }
    }

    beforeRender() {
        let vertexCount = 0;
        for (const strand of this.strands) {
            let node = strand.nodes[0]

            for (let i = 0; i < strand.nodes.length; i++) {
                const node2 = strand.nodes[i]

                const num = Math.min(1.0, i / 4.0) * this.northernLightsAlpha
                const num2 = Math.min(1, (strand.nodes.length - 1) / 4) * this.northernLightsAlpha
                const num3 = this.offsetY + Math.sin(node.sineOffset) * 3.0
                const num4 = this.offsetY + Math.sin(node2.sineOffset) * 3.0
                this.verts[vertexCount] = { pos: new Vec2(node.pos.x, node.pos.y + num3), uv: new Vec2(node.texOffset, 1), color: mul(node.color, Vec3.initial(node.bottomAlpha * strand.alpha * num)), alpha: node.bottomAlpha * strand.alpha * num }; vertexCount++;
                this.verts[vertexCount] = { pos: new Vec2(node.pos.x, node.pos.y - node.height + num3), uv: new Vec2(node.texOffset, 0.05), color: mul(node.color, Vec3.initial(node.topAlpha * strand.alpha * num)), alpha: node.topAlpha * strand.alpha * num }; vertexCount++;
                this.verts[vertexCount] = { pos: new Vec2(node2.pos.x, node2.pos.y - node2.height + num4), uv: new Vec2(node2.texOffset, 0.05), color: mul(node2.color, Vec3.initial(node2.topAlpha * strand.alpha * num2)), alpha: node2.topAlpha * strand.alpha * num2 }; vertexCount++;
                this.verts[vertexCount] = { pos: new Vec2(node.pos.x, node.pos.y + num3), uv: new Vec2(node.texOffset, 1), color: mul(node.color, Vec3.initial(node.bottomAlpha * strand.alpha * num)), alpha: node.bottomAlpha * strand.alpha * num }; vertexCount++;
                this.verts[vertexCount] = { pos: new Vec2(node2.pos.x, node2.pos.y - node2.height + num4), uv: new Vec2(node2.texOffset, 0.05), color: mul(node2.color, Vec3.initial(node2.topAlpha * strand.alpha * num2)), alpha: node2.topAlpha * strand.alpha * num2 }; vertexCount++;
                this.verts[vertexCount] = { pos: new Vec2(node2.pos.x, node2.pos.y + num4), uv: new Vec2(node2.texOffset, 1), color: mul(node2.color, Vec3.initial(node2.bottomAlpha * strand.alpha * num2)), alpha: node2.topAlpha * strand.alpha * num2 }; vertexCount++;
                node = node2
            }
        }
    }
}

class Strand {
    percent: number = 0
    duration: number = 0
    alpha: number = 0
    nodes: Node[] = []
    fadingOut = false

    constructor() {
        this.reset(Math.random())
    }

    reset(startPercent: number) {
        this.percent = startPercent
        this.duration = randRange(12, 32)
        this.alpha = 0
        this.nodes = []
        this.fadingOut = false

        const vector = new Vec2(randRange(-40, 60), randRange(40, 90))
        let num = Math.random()
        const value = chooseRand(NorthernLights.colors)

        for (let i = 0; i < 40; i++) {
            const randColor = chooseRand(NorthernLights.colors)
            const item: Node = {
                pos: new Vec2(vector.x, vector.y),
                texOffset: num,
                height: randRange(10, 80),
                topAlpha: randRange(0.3, 0.8),
                bottomAlpha: randRange(0.5, 1),
                sineOffset: Math.random() * 6.2831855,
                color: new Vec3(
                    lerp(value.x, randColor.x, randRange(0, 0.3)),
                    lerp(value.y, randColor.y, randRange(0, 0.3)),
                    lerp(value.z, randColor.z, randRange(0, 0.3)),
                )
            }
            num += randRange(0.02, 0.2)
            vector.add(new Vec2(randRange(4, 10), randRange(-10, 15)))
            this.nodes.push(item)
        }
    }
}

type Particle = {
    pos: Vec2,
    speed: number,
    color: Vec3
}

type Node = {
    pos: Vec2,
    texOffset: number,
    height: number,
    topAlpha: number,
    bottomAlpha: number,
    sineOffset: number,
    color: Vec3
}
