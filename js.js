const canvas = document.getElementById("inCanvas")
const ctx = canvas.getContext("2d")
const h1 = document.querySelector("h1")
const score = document.querySelector(".scorevalue")
const finalscore = document.querySelector(".finalscore > span")
const menu = document.querySelector(".menuscreen")
const play = document.querySelector(".replay")
const size = 30
const toque = new Audio("audiolegal.mp3")
let python = [
    { x: 0, y: 0 },
]
let AX = 0, AY = 0, speed = 300, trueover = false, directionex, loopset, wallimit, moble


const updatedscore = () => {
    score.innerHTML = +score.innerHTML + 10
}
const speedcontrol = () => {
    if (score.innerHTML < 50) {
        speed = 300
    }
    if (score.innerHTML >= 50 && score.innerHTML <= 80) {
        speed = 250
    }
    if (score.innerHTML > 80 && score.innerHTML <= 100) {
        speed = 200
    }
    if (score.innerHTML > 100 && score.innerHTML <= 120) {
        speed = 150
    }
    if (score.innerHTML > 130 && score.innerHTML <= 140) {
        speed = 140
    }
    if (score.innerHTML > 140 && score.innerHTML <= 160) {
        speed = 130
    }
    if (score.innerHTML > 160 && score.innerHTML <= 180) {
        speed = 120
    }
    if (score.innerHTML > 180 && score.innerHTML <= 200) {
        speed = 100
    }
}
const mathnumber = (min, max) => {
    return Math.round(Math.random() * (max - min) + min)
}
const foodposition = () => {
    const number = mathnumber(0, canvas.width - size)
    return Math.round(number / 30) * 30
}
const foodpy = {
    x: foodposition(),
    y: foodposition(),
    color: "green"
}
const checkfood = () => {
    const head = python[python.length - 1]
    if (head.x == foodpy.x && head.y == foodpy.y) {//evita que a comida apareça na cobrinha.

        let x = foodposition()
        let y = foodposition()

        while (python.find((position) => (position.x == x && position.y == y))) { //garante que a comida não apareça dentro da cobrinha
            let x = foodposition()
            let y = foodposition()
        }
        foodpy.x = x
        foodpy.y = y
    }
}
const food = () => {
    const { x, y, color } = foodpy
    ctx.shadowColor = color
    ctx.shadowBlur = 6
    ctx.fillStyle = color

    ctx.fillStyle = foodpy.color
    ctx.fillRect(x, y, size, size)
    ctx.shadowBlur = 0
}
const inside = () => {
    ctx.fillStyle = "#ddd"
    python.forEach((cordenadas, index) => {
        if (index == python.length - 1) {
            ctx.fillStyle = "white"
        }
        ctx.fillRect(cordenadas.x, cordenadas.y, size, size)
    })
}
const move = () => {
    if (!directionex || directionex == undefined) {
        return
    } else {
        const head = python[python.length - 1]
        if (directionex == "up" || directionex == "W") {
            python.push({ x: head.x, y: head.y - size })
        }
        if (directionex == "right" || directionex == "D") {
            python.push({ x: head.x + size, y: head.y })
        }
        if (directionex == "left" || directionex == "A") {
            python.push({ x: head.x - size, y: head.y })
        }
        if (directionex == "down" || directionex == "S") {
            python.push({ x: head.x, y: head.y + size })
        }
        python.shift()
    }
}
const grid = () => {
    ctx.lineWidth = 1
    ctx.strokeStyle = "black"

    for (let i = 0; i < canvas.width; i += 30) {
        ctx.beginPath() //Evita bugar as linhas
        ctx.lineTo(i, 0) // (X, Y)
        ctx.lineTo(i, 600)
        ctx.stroke()
        //referênte ao X

        ctx.beginPath() //Evita bugar as linhas
        ctx.lineTo(0, i) // (X, Y)
        ctx.lineTo(600, i)
        ctx.stroke()
        //referênte ao Y 

    }
}
const eat = () => {
    const head = python[python.length - 1]
    if (head.x == foodpy.x && head.y == foodpy.y) {
        updatedscore()
        python.push(head)
        toque.play()
        foodpy.x = foodposition()
        foodpy.y = foodposition()
    }
}
const crash = () => {
    const head = python[python.length - 1]
    const canvasLimit = canvas.width - size
    const neck = python.length - 2

    let wallimit = (head.x < -30 || head.x > canvasLimit || head.y < -30 || head.y > canvasLimit)

    const headcrash = python.find((position, index) => {

        return index < neck && position.x == head.x && position.y == head.y
    })
    if (wallimit || headcrash) {
        gameover()
    }
}
const gameover = () => {
    trueover = true
    AX = python.x
    AY = python.y
    python = [
        { x: AX, y: AY } // Reinicia a cobra para a posição inicial
    ]
    directionex = undefined
    menu.style.display = "flex"
    finalscore.innerHTML = score.innerHTML
    canvas.style.filter = "blur(3px)"
}
const loop = () => {
    if (trueover == true) {
        return
    } else {
        clearInterval(loopset)
        ctx.clearRect(0, 0, 600, 600)
        food()
        inside()
        grid()
        move()
        eat()
        crash()
        speedcontrol()
        loopset = setTimeout(() => {
            loop()
        }, speed)
    }

}
loop()
document.addEventListener("keydown", ({ key }) => {
    const KeY = key.toLowerCase()
    if ((KeY === "arrowright" || (KeY === "d" && directionex !== "a")) && directionex !== "left") {
        directionex = "right"
    } else if ((KeY === "arrowleft" || (KeY === "a" && directionex !== "d")) && directionex !== "right") {
        directionex = "left"
    } else if ((KeY === "arrowdown" || (KeY === "s" && directionex !== "w")) && directionex !== "up") {
        directionex = "down"
    } else if ((KeY === "arrowup" || (KeY === "w" && directionex !== "s")) && directionex !== "down") {
        directionex = "up"
    }
})

play.addEventListener("click", () => {
    trueover = false
    score.innerHTML = "000"
    menu.style.display = "none"
    canvas.style.filter = "none"
    python = [{ x: 270, y: 240 }]
    loop()
})
/*if (button.style.display == "flex") {

}*/
//Programação para usuários moble
const moveleft = () => {
    if (directionex !== "right") {
        directionex = "left"
    }
}
const moveup = () => {
    if (directionex !== "down") {
        directionex = "up"
    }
}
const movedown = () => {
    if (directionex !== "up") {
        directionex = "down"
    }
}
const moveright = () => {
    if (directionex !== "left") {
        directionex = "right"
    }
}
const bleft = document.getElementById("left")
const bup = document.getElementById("up")
const bdown = document.getElementById("down")
const bright = document.getElementById("right")
let lastclick = 0
const click = () => {
    const now = Date.now()
    if (now - lastclick < 300) {
        return
    }
}

bleft.addEventListener("click", () => {
    moveleft()
})
bup.addEventListener("click", () => {
    moveup()
})
bdown.addEventListener("click", () => {
    movedown()
})
bright.addEventListener("click", () => {
    moveright()
})
document.addEventListener("DOMContentLoaded", function () {
    const modoMobileBtn = document.getElementById("modoMobileBtn")
    const controlesContainer = document.getElementById("controls")
    const controlButtons = document.querySelectorAll(".control-button")

    let controlsVisible = false

    modoMobileBtn.addEventListener("click", function () {
        controlsVisible = !controlsVisible;

        controlButtons.forEach(button => {
            button.style.display = controlsVisible ? "flex" : "none"
        })
    })
})
