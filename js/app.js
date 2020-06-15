let width = window.innerWidth
let height = window.innerHeight

let score = document.getElementById('score')

let snakeSpeed = 0.250
let increaseSpeed = 0.001
let maxSpeed = 0.025

let snakeBody = [], snakeLength = 0
let currentDir = new THREE.Vector3(0, 0, 0)
let lastDir = new THREE.Vector3(0, 0, 0)
let outerWidth = 20
let lastRenderTime = 0

let scene = new THREE.Scene()
let camera = new THREE.PerspectiveCamera(45, width / height, 1, 1000)

camera.position.z = 45

let renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(width, height)
renderer.setClearColor(0x484848)

document.body.appendChild(renderer.domElement)

let parentContainer = new THREE.Group()

let directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
directionalLight.position.set(0, 0, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);

let outerBox = new THREE.BoxGeometry(outerWidth, outerWidth, outerWidth)
let outerBoxMaterial = new THREE.LineBasicMaterial({ color: 0xFFFFFF })

let outerMesh = new THREE.Mesh(outerBox, outerBoxMaterial)
let edges = new THREE.EdgesGeometry(outerMesh.geometry)

let outerScene = new THREE.LineSegments(edges, outerBoxMaterial)
parentContainer.add(outerScene)


let snakeFood = new THREE.BoxGeometry(1, 1, 1)
let snakeFoodMaterial = new THREE.MeshLambertMaterial({ color: 0xffbe87 })
let food = new THREE.Mesh(snakeFood, snakeFoodMaterial)
parentContainer.add(food)

parentContainer.rotateOnAxis(new THREE.Vector3(1, 0, 0), 0.5)

const restart = () => {
    window.location = window.location.href
}

const display = (currentTime) => {
    requestAnimationFrame(display)
    const secondsSinceLastRender = (currentTime - lastRenderTime) / 1000
    if (secondsSinceLastRender < snakeSpeed) return
    lastRenderTime = currentTime

    snakeBody[0].material.color.setHex(0x00ffb7)

    for (let i = 0; i < snakeLength; i++) {
        parentContainer.add(snakeBody[i])
    }
    scene.add(parentContainer)
    runSnake()
    renderer.render(scene, camera)
}

const createSnakeBody = () => {
    let snakeBodyDim = new THREE.BoxGeometry(1, 1, 1)
    let snakeBodyMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff })
    let snake = new THREE.Mesh(snakeBodyDim, snakeBodyMaterial)
    if (snakeLength > 0) {
        snake.position.y = snakeBody[snakeBody.length - 1].position.y + (1 * currentDir.y)
        snake.position.x = snakeBody[snakeBody.length - 1].position.x + (1 * currentDir.x)
        snake.position.z = snakeBody[snakeBody.length - 1].position.z + (1 * currentDir.z)
    }
    snakeBody.push(snake)
    snakeLength += 1
}

const log = () => {
    for (let i = 0; i < snakeBody.length; i++) {
        console.log(`${i} => ${snakeBody[i].position.x}, ${snakeBody[i].position.y}, ${snakeBody[i].position.z}`)
    }
}

const runSnake = () => {
    if (checkEnd()) {
        alert(`Game Over ! Your score is ${(snakeBody.length - 1) * 5}`)
        restart()
        return
    }
    if (checkMatch()) {
        setFoodPosition()
        createSnakeBody()
        score.innerHTML = (snakeBody.length - 1) * 5
        
        snakeSpeed -= increaseSpeed

        if (snakeSpeed < maxSpeed) snakeSpeed = maxSpeed        
    }

    for (let i = snakeBody.length - 2; i >= 0; i--) {
        snakeBody[i + 1].position.x = snakeBody[i].position.x
        snakeBody[i + 1].position.y = snakeBody[i].position.y
        snakeBody[i + 1].position.z = snakeBody[i].position.z
    }

    move(snakeBody[0])
}

const handleKeys = (event) => {
    switch (event.key) {
        case "ArrowUp":
            if (lastDir.y == -1) break
            currentDir = new THREE.Vector3(0, 1, 0)
            break;
        case "ArrowDown":
            if (lastDir.y == 1) break
            currentDir = new THREE.Vector3(0, -1, 0)
            break;
        case "ArrowRight":
            if (lastDir.x == -1) break
            currentDir = new THREE.Vector3(1, 0, 0)
            break;
        case "ArrowLeft":
            if (lastDir.x == 1) break
            currentDir = new THREE.Vector3(-1, 0, 0)
            break;
        case "w":
            if (lastDir.z == -1) break
            currentDir = new THREE.Vector3(0, 0, 1)
            break;
        case "s":
            if (lastDir.z == 1) break
            currentDir = new THREE.Vector3(0, 0, -1)
            break;
    }

    lastDir = new THREE.Vector3(currentDir.x, currentDir.y, currentDir.z)
}

const move = (head) => {
    if (head.position.z < -9) {
        head.position.z = 9
    } else if (head.position.z > 9) {
        head.position.z = -9
    }

    if (head.position.x < -9.5) {
        head.position.x = 9
    } else if (head.position.x > 9.5) {
        head.position.x = -9.5
    }

    if (head.position.y < -9.5) {
        head.position.y = 9.5
    } else if (head.position.y > 9.5) {
        head.position.y = -9.5
    }

    head.position.x += (currentDir.x * 1)
    head.position.y += (currentDir.y * 1)
    head.position.z += (currentDir.z * 1)
}

const setFoodPosition = () => {
    const x = Math.floor(Math.random() * 19) - 9;
    const y = Math.floor(Math.random() * 19) - 9;
    const z = Math.floor(Math.random() * 19) - 9.5;

    if (x == snakeBody[0].position.x || y == snakeBody[0].position.y || z == snakeBody[0].position.z) {
        setFoodPosition()
    }

    food.position.set(x, y, z);
}

const checkEnd = () => {
    let end = false
    for (let i = 1; i < snakeBody.length; i++) {
        const x = snakeBody[0].position.x - snakeBody[i].position.x
        const y = snakeBody[0].position.y - snakeBody[i].position.y
        const z = snakeBody[0].position.z - snakeBody[i].position.z
        end = (Math.sqrt(x * x + y * y + z * z)) < 1
        if (end) {
            break
        }
    }
    return end
}

const checkMatch = () => {
    const x = snakeBody[0].position.x - food.position.x
    const y = snakeBody[0].position.y - food.position.y
    const z = snakeBody[0].position.z - food.position.z
    return (Math.sqrt(x * x + y * y + z * z)) < 1
}

const onResize = () => {
    width = window.innerWidth
    height = window.innerHeight
    camera.aspect = width / height
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
}

createSnakeBody()
setFoodPosition()
display()
document.body.addEventListener('keyup', handleKeys)
window.addEventListener('resize', onResize)