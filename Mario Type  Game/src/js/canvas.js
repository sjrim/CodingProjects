import platform from '../img/platform.png'
import background from '../img/background.png'
import hills from '../img/hills.png'
import platformSmallTall from '../img/platformsmalltall.png'

import spriteRunLeft from '../img/spriteRunLeft.png'
import spriteRunRight from '../img/spriteRunRight.png'
import spriteStandLeft from '../img/spriteStandLeft.png'
import spriteStandRight from '../img/spriteStandRight.png'

const canvas = document.querySelector('canvas')

const c = canvas.getContext('2d')

canvas.width = 1024
canvas.height = 576

const gravity = 1.5

class Player {
  constructor () {
    this.speed = 5
    this.position = {
      x: 100,
      y: 100
    }
    this.velocity = {
      x: 0,
      y: 0
    }
    this.width = 66
    this.height = 150

    this.image = createImage(spriteStandRight)
    this.frames = 0
    this.sprites ={
      stand: {
        right: createImage(spriteStandRight),
        left: createImage(spriteStandLeft),
        cropWidth: 177,
        width: 66
      },
      run: {
        right: createImage(spriteRunRight),
        left: createImage(spriteRunLeft),
        cropWidth: 341,
        width: 127.875
      }
    }

    this.currentSprite = this.sprites.stand.right
    this.currentCropWidth = 177
  }

  draw() {
    c.drawImage(
      this.currentSprite,
      this.currentCropWidth * this.frames,
      0,
      177,
      400,
      this.position.x,
      this.position.y,
      this.width,
      this.height)
  }

  update() {
    this.frames++
    if (this.frames > 59 && (this.currentSprite === this.sprites.stand.right || this.currentSprite === this.sprites.stand.left)) this.frames =0
    else if (this.frames > 29 && (this.currentSprite === this.sprites.run.right || this.currentSprite === this.sprites.run.left)) this.frames = 0
    this.draw()
    this.position.y += this.velocity.y
    this.position.x += this.velocity.x

    if(this.position.y + this.height + this.velocity.y <= canvas.height)
      this.velocity.y += gravity
  }
}

class Platform {
  constructor ({x, y, image}) {
    this.position = {
      x,
      y
    }
    this.image = image
    this.width = image.width
    this.height = image.height
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}

class GenericObject {
  constructor ({x, y, image}) {
    this.position = {
      x,
      y
    }
    this.image = image
    this.width = image.width
    this.height = image.height
  }

  draw() {
    c.drawImage(this.image, this.position.x, this.position.y)
  }
}

function createImage(imageSrc) {
  const image = new Image()
  image.src = imageSrc
  return image
}

let platformImage = createImage(platform)
let platformSmallTallImage = createImage(platformSmallTall)
let player = new Player()
let platforms = []
let genericObjects = []

let lastKey

let keys = {
  right: {
    pressed: false
  },
  left: {
    pressed: false
  }
}

let scrollOffset = 0

function init() {
  platformImage = createImage(platform)

  player = new Player()
  platforms = [
  new Platform({x: platformImage.width *5+400 -2, y:270, image: platformSmallTallImage
  }),
  new Platform({x:-1,y:470, image: platformImage
  }), 
  new Platform({x: platformImage.width-3, y:470, image: platformImage
  }),
  new Platform({x: platformImage.width *2+100, y:470, image: platformImage
  }),
  new Platform({x: platformImage.width *3+300, y:470, image: platformImage
  }),
  new Platform({x: platformImage.width *4+300 -2, y:470, image: platformImage
  }),
  new Platform({x: platformImage.width *6+300 -2, y:470, image: platformImage
  }),
  new Platform({x: platformImage.width *7+400 -2, y:470, image: platformImage
  }),
  new Platform({x: platformImage.width *8+550 -2, y:270, image: platformSmallTallImage
  }),
  new Platform({x: platformImage.width *9+590 -2, y:470, image: platformImage
  })
  ]

  genericObjects = [
    new GenericObject({
      x:-1,
      y:-1,
      image: createImage(background)
    }),
    new GenericObject({
      x:-1,
      y:-1,
      image: createImage(hills)
    })
  ]

  scrollOffset = 0
}

function animate() {
  requestAnimationFrame(animate)
  c.fillStyle = 'white'
  c.fillRect(0, 0, canvas.width, canvas.height)

  genericObjects.forEach(genericObject => {
    genericObject.draw()
  })
  platforms.forEach(platform => {
    platform.draw()
  })
  player.update()

  if (keys.right.pressed && player.position.x < 400) {
    player.velocity.x = player.speed
  } else if ((keys.left.pressed&& player.position.x > 100)
  || keys.left.pressed && scrollOffset === 0 && player.position.x > 0) {
    player.velocity.x = -player.speed
  } else {
    player.velocity.x = 0
    
    if (keys.right.pressed) {
      scrollOffset += player.speed

      platforms.forEach(platform => {
        platform.position.x -= player.speed
      })
      genericObjects.forEach(genericObject => {
        genericObject.position.x -= player.speed *.66
      })
    } else if (keys.left.pressed && scrollOffset > 0) {
      scrollOffset -= player.speed

      platforms.forEach(platform => {
        platform.position.x += player.speed
      })

      genericObjects.forEach(genericObject => {
        genericObject.position.x += player.speed *.66
      })
    }
  }

console.log(scrollOffset)

  platforms.forEach(platform => {
    if 
      (player.position.y + player.height <= platform.position.y && player.position.y + player.height + player.velocity.y >= platform.position.y && player.position.x + player.width >= platform.position.x && player.position.x <= platform.position.x + platform.width) {
      player.velocity.y = 0
    }
  })

  //sprite switching conditional
  if (keys.right.pressed && lastKey === 'right' && player.currentSprite !== player.sprites.run.right){
    player.frames = 1
    player.currentSprite = player.sprites.run.right
    player.currentCropWidth = player.sprites.run.cropWidth
    player.width = player.sprites.run.width
  } else if (keys.left.pressed && lastKey ==='left' && currentSprite !== player.sprites.run.left) {
    player.currentSprite = player.sprites.run.left
    player.currentCropWidth = player.sprites.run.cropWidth
    player.width = player.sprites.run.width
  } else if (!keys.left.pressed && lastKey ==='left' && currentSprite !== player.sprites.stand.left) {
    player.currentSprite = player.sprites.stand.left
    player.currentCropWidth = player.sprites.run.cropWidth
    player.width = player.sprites.run.width
  } else if (!keys.right.pressed && lastKey ==='left' && currentSprite !== player.sprites.stand.right) {
    player.currentSprite = player.sprites.stand.right
    player.currentCropWidth = player.sprites.run.cropWidth
    player.width = player.sprites.run.width
  }
// win condition
  if (scrollOffset > platformImage.width *9+300 -2) {
    alert("YOU WON")
    init()
  }

  // lose condidtion
  if (player.position.y > canvas.height) {
    init()
  }
}

init()
animate()

addEventListener('keydown', ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      console.log('this is left')
      keys.left.pressed = true
      currentKey = 'left'
      break
    case 83:
      console.log('this is down')
      break
    case 68:
      console.log('this is right')
      keys.right.pressed = true
      currentKey = 'right'
      break
    case 87:
      console.log('this is up')
      player.velocity.y -= 25
      break
  }

})

addEventListener('keyup', ({ keyCode }) => {
  switch (keyCode) {
    case 65:
      console.log('this is left')
      keys.left.pressed = false
      break
    case 83:
      console.log('this is down')
      break
    case 68:
      console.log('this is right')
      keys.right.pressed = false
      break
    case 87:
      console.log('this is up')
      player.velocity.y -= 20
      break
  }
})