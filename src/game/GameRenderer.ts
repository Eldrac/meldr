import {
    BoxGeometry,
    BufferGeometry,
    DirectionalLight,
    Line,
    LineBasicMaterial,
    Mesh,
    MeshBasicMaterial,
    MeshPhysicalMaterial,
    PerspectiveCamera,
    Scene,
    Vector3,
    WebGLRenderer
} from "three";
import { BOARD_HEIGHT, BOARD_WIDTH } from "../utils/constants";
import { Cube, CubeColor } from "../types/Cube";
import { GameState } from "../types/GameState";

const colors = {
    [CubeColor.White]: 0xfaf2e4,
    [CubeColor.Orange]: 0xff8b3d,
    [CubeColor.Purple]: 0x9d2168,
    [CubeColor.Teal]: 0x0cebc9
};

export class GameRenderer {
    camera: PerspectiveCamera;
    scene: Scene;
    renderer: WebGLRenderer;
    meshDict: Record<number, Mesh>;

    constructor() {
        this.scene = new Scene();
        this.camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new WebGLRenderer();
        this.meshDict = {};

        this.camera.position.x = BOARD_WIDTH / 2;
        this.camera.position.y = BOARD_HEIGHT / 2 + 0.5;
        this.camera.position.z = 10;
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        this.initLighting();
        this.initGrid();

        document.body.appendChild(this.renderer.domElement);

        window.addEventListener('resize', this.onWindowResize.bind(this), false);
    }

    private onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private initLighting() {
        const directionalLight = new DirectionalLight(0xffffff, 1.3);
        directionalLight.position.set(5, -40, 50);
        this.scene.add(directionalLight);
    }

    private initGrid() {
        const material = new LineBasicMaterial({ color: 0xffffff, opacity: 0.25, transparent: true });
        for (let row = 0; row <= BOARD_WIDTH; row++) {
            const points = [];
            points.push(new Vector3(row, 0, 0));
            points.push(new Vector3(row, BOARD_HEIGHT, 0));

            const geometry = new BufferGeometry().setFromPoints(points);
            const line = new Line(geometry, material);
            this.scene.add(line);
        }

        for (let col = 0; col <= BOARD_HEIGHT; col++) {
            const points = [];
            points.push(new Vector3(0, col, 0));
            points.push(new Vector3(BOARD_WIDTH, col, 0));

            const geometry = new BufferGeometry().setFromPoints(points);
            const line = new Line(geometry, material);
            this.scene.add(line);
        }
    }

    private createMesh(cube: Cube) {
        const width = 0.95;

        const geometry = new BoxGeometry(width, width, width);


        let material = new MeshPhysicalMaterial({
            metalness: 0,
            roughness: 1,
            transparent: true
        });

        const mesh = new Mesh(geometry, material);

        this.meshDict[cube.id] = mesh;
        this.scene.add(mesh);
    }

    private updateMesh(cube: Cube, state: GameState) {
        const mesh = this.meshDict[cube.id];
        const material = mesh.material as MeshBasicMaterial;
        const geometry = mesh.geometry as BoxGeometry;

        material.color.setHex(colors[cube.color]);
        let opacity = 1;
        let width = 0.95;
        if (cube.startFadeDelay && cube.fadeDelay !== undefined) {
            opacity = (cube.fadeDelay / cube.startFadeDelay) * 0.9 + 0.1;
            width = 1;
        }
        if (state.gameOver) {
            opacity = 0.5;
        }
        material.opacity = opacity;

        if (width !== geometry.parameters.width) {
            geometry.dispose();
            mesh.geometry = new BoxGeometry(width, width, width);
        }

        mesh.position.x = cube.x + 0.5;
        mesh.position.y = cube.y + 0.5;
        mesh.position.z = 0.5;
    }

    render(state: GameState) {
        const staleMeshIds = new Set(Object.keys(this.meshDict).map(key => parseInt(key)));

        const cubes = [...state.activeCubes, ...state.fallingCubes, ...state.stableCubes];
        for (const cube of cubes) {
            if (!this.meshDict[cube.id]) {
                this.createMesh(cube);
            }

            this.updateMesh(cube, state);
            staleMeshIds.delete(cube.id);
        }

        for (const id of staleMeshIds) {
            this.scene.remove(this.meshDict[id]);
            delete this.meshDict[id];
        }

        this.renderer.render(this.scene, this.camera);
    }
}