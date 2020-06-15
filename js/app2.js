let width = window.innerWidth
let height = window.innerHeight

let initialSpeed = 0.07
let speedIncrease = 0.008
let maxSpeed = 0.45

let snakeBody = [], snakeLength = 0
let pathToFollow = []
let outerWidth = 20

let toBeRotated = new THREE.Vector3(0, 0, 0)


let scene = new THREE.Scene()
let camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000)

camera.position.z = 40

let renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(width, height)
renderer.setClearColor(0x484848)

document.body.appendChild(renderer.domElement)

let parentContainer = new THREE.Group()

let directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
directionalLight.position.set(0, 0, 20);
directionalLight.castShadow = true;
scene.add(directionalLight);


let outerBox = new THREE.BoxGeometry(outerWidth, outerWidth, outerWidth)
let outerBoxMaterial = new THREE.LineBasicMaterial({ color: 0xffffff })

let outerMesh = new THREE.Mesh(outerBox, outerBoxMaterial)
let edges = new THREE.EdgesGeometry(outerMesh.geometry)

let outerScene = new THREE.LineSegments(edges, outerBoxMaterial)
parentContainer.add(outerScene)

let snakeFood = new THREE.BoxGeometry(1, 1, 1)
let snakeFoodMaterial = new THREE.MeshLambertMaterial({ color: 0xffbe87 })
let food = new THREE.Mesh(snakeFood, snakeFoodMaterial)
parentContainer.add(food)

parentContainer.rotateOnAxis(new THREE.Vector3(1, 0, 0), 0.6)

const display = () => {
    requestAnimationFrame(display)
    for (let i = 0; i < 4; i++) {
        let snakeBodyDim = new THREE.BoxGeometry(1, 1, 1)
        let snakeBodyMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
        let snake = new THREE.Mesh(snakeBodyDim, snakeBodyMaterial)
        snakeBody.push(snake)
    }
    for (let i = 1; i < 4; i++) {
        snakeBody[i].position.y = snakeBody[i - 1].position.y - 1
        parentContainer.add(snakeBody[i])
    }
    scene.add(parentContainer)
    run()
    renderer.render(scene, camera)
}

let headDir = new THREE.Vector3(0,1,0)

const run = () => {
    for (let path of pathToFollow) {
        let pos = new THREE.Vector3(headDir.x, headDir.y, headDir.z)
        if (path.x == 1) {
            snakeBody[1].position.x += 1            
            for (let i = 2; i < snakeBody.length; i++) {
                snakeBody[i].position.y += 1
            }
        } else if (path.x == -1) {
            snakeBody[1].position.x -= 1            
            for (let i = 2; i < snakeBody.length; i++) {
                snakeBody[i].position.y += 1
            }
        } else if (path.y == 1) {
            snakeBody[1].position.y += 1
        } else if (path.y == -1) {
            snakeBody[1].position.y -= 1
        } else if (path.z == 1) {
            snakeBody[1].position.z += 1
        } else if (path.z == -1) {
            snakeBody[1].position.z -= 1
        }
        console.log(path)

        headDir.x = path.x
        headDir.y = path.y
        headDir.z = path.z

        console.log(pos)

        if (pos.x == 1) {
            for (let i = 2; i < snakeBody.length; i++) {
                snakeBody[i].position.x += 1
            }
        } else if (pos.x == -1) {
            for (let i = 2; i < snakeBody.length; i++) {
                snakeBody[i].position.x -= 1
            }
        } else if (pos.y == 1) {
            for (let i = 2; i < snakeBody.length; i++) {
                snakeBody[i].position.y += 1
            }
        } else if (pos.y == -1) {
            for (let i = 2; i < snakeBody.length; i++) {
                snakeBody[i].position.y -= 1
            }
        } else if (pos.z == 1) {
            for (let i = 2; i < snakeBody.length; i++) {
                snakeBody[i].position.z += 1
            }
        } else if (pos.z == -1) {
            for (let i = 2; i < snakeBody.length; i++) {
                snakeBody[i].position.z -= 1
            }
        }
        pathToFollow.shift()
    }
}


const handleKeys = (event) => {
    switch (event.key) {
        case "ArrowUp":
            pathToFollow.push(new THREE.Vector3(0, 1, 0));
            break;
        case "ArrowDown":
            pathToFollow.push(new THREE.Vector3(0, -1, 0));
            break;
        case "ArrowRight":
            pathToFollow.push(new THREE.Vector3(1, 0, 0));
            break;
        case "ArrowLeft":
            pathToFollow.push(new THREE.Vector3(-1, 0, 0));
            break;
        case "w":
            pathToFollow.push(new THREE.Vector3(0, 0, 1));
            break;
        case "s":
            pathToFollow.push(new THREE.Vector3(0, 0, -1));
            break;
    }
}

display()
document.body.addEventListener('keyup', handleKeys)

