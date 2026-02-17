import { HEIGHT, WIDTH } from "."
import { chooseRand, lerp, randRange } from "../../math"
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

    constructor(strandsCount: number) {
        let strands = []
        for (let i = 0; i < strandsCount; i++) {
            strands.push(new Strand())
        }

        let particles: Particle[] = []
        for (let i = 0; i < particles.length; i++) {
            const particle: Particle = {
                pos: new Vec2(randRange(0, WIDTH), randRange(0, HEIGHT)),
                speed: randRange(4, 14),
                color: chooseRand(NorthernLights.colors)!
            }
            particles.push(particle)
        }

        this.strands = strands
        this.particles = particles
    }

    update(dt: number) {
        this.timer += dt
        for (const strand of this.strands) {
            strand.percent += dt / strand.duration
            // strand.alpha = approach(strand.alpha, strand.percent < 1 ? 1 : 0, dt)

            if (strand.alpha <= 0 && strand.percent >= 1) {
                strand.reset(0)
            }

            for (const node of strand.nodes) {
                node.sineOffset += dt
            }
        }
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i].pos.y += this.particles[i].speed * dt
        }
    }

    beforeRender() {
        let vertexCount = 0
        for (const strand of this.strands) {
            let node = strand.nodes[0]

            for (let i = 1; i < strand.nodes.length; i++) {
                const node2 = strand.nodes[i]

                const num = Math.min(1, (i / 4)) * this.northernLightsAlpha
                const num2 = Math.min(1, (strand.nodes.length - i) / 4) * this.northernLightsAlpha
                const num3 = this.offsetY + Math.sin(node.sineOffset) * 3
                const num4 = this.offsetY + Math.sin(node2.sineOffset) * 3

                this.verts[vertexCount] = { pos: new Vec2(node.pos.x, node.pos.y + num3), texCoord: new Vec2(node.texOffset, 1), color: node.color.mul(node.bottomAlpha * strand.alpha * num) }; vertexCount++;
                this.verts[vertexCount] = { pos: new Vec2(node.pos.x, node.pos.y - node.height + num3), texCoord: new Vec2(node.texOffset, 0.05), color: node.color.mul(node.topAlpha * strand.alpha * num) }; vertexCount++;
                this.verts[vertexCount] = { pos: new Vec2(node2.pos.x, node2.pos.y - node2.height + num4), texCoord: new Vec2(node2.texOffset, 0.05), color: node2.color.mul(node2.topAlpha * strand.alpha * num2) }; vertexCount++;
                this.verts[vertexCount] = { pos: new Vec2(node.pos.x, node.pos.y + num3), texCoord: new Vec2(node.texOffset, 1), color: node.color.mul(node.bottomAlpha * strand.alpha * num) }; vertexCount++;
                this.verts[vertexCount] = { pos: new Vec2(node2.pos.x, node2.pos.y - node2.height + num4), texCoord: new Vec2(node2.texOffset, 0.05), color: node2.color.mul(node2.topAlpha * strand.alpha * num2) }; vertexCount++;
                this.verts[vertexCount] = { pos: new Vec2(node2.pos.x, node2.pos.y + num4), texCoord: new Vec2(node2.texOffset, 1), color: node2.color.mul(node2.bottomAlpha * strand.alpha * num2) }; vertexCount++;
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

    constructor() {
        this.reset(Math.random())
    }

    reset(startPercent: number) {
        this.percent = startPercent
        this.duration = randRange(12, 32)
        this.alpha = 0
        this.nodes = []

        const vector = new Vec2(randRange(-40, 60), randRange(40, 90))
        let num = Math.random()
        const value = chooseRand(NorthernLights.colors)

        for (let i = 0; i < 40; i++) {
            const randColor = chooseRand(NorthernLights.colors)
            const item: Node = {
                pos: vector,
                texOffset: num,
                height: randRange(10, 80),
                topAlpha: randRange(0.3, 0.8),
                bottomAlpha: randRange(0.5, 1),
                sineOffset: Math.random() * 6.2831855,
                color: value
            }
            num += randRange(0.02, 0.2)
            vector.add(new Vec2(randRange(4.0, 20.0), randRange(15.0, 15.0)))
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
