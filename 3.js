let frames = 0
const sfx = new Audio("https://res.cloudinary.com/dlb3jof8w/video/upload/v1576013993/codepen/259515__missteik__viento-y-olas-voces-lejanas.mp3")
const spotImage = new Image()
const c = document.createElement('canvas').getContext('2d')
const canvas = c.canvas
const vertexBuffer = []
const renderConfig = {
   perspective: 500,
   quality: 2, // 0 - low, 3 - high,
   wireframe: true,
   fill: true,
   postProcess: true,
   bloomSize: 8
}

const sceneConfig = {
   polygonSize: 24
}


const resolutionDivider = 4 - Math.max(0, Math.min(3, renderConfig.quality))
const resizeCanvas = () => {
   const ox = canvas.width / resolutionDivider
   const oy = canvas.height / resolutionDivider
   const nx = window.innerWidth / resolutionDivider
   const ny = window.innerHeight / resolutionDivider
   if ( ox !== nx || oy !== ny) {
      canvas.width = nx
      canvas.height = ny
   }
}

const renderVertices = () => {
   const X = 0, Y = 1, Z = 2, pixelInaccuracy = 1.5;
   c.beginPath()
   for (let i = 0, l = vertexBuffer.length; i < l; i++) {
      const vertex = vertexBuffer[i]
      let vx = vertex[X]
      let vy = vertex[Y]
      let vz = vertex[Z]
      let initialVx = vx
      let initialVy = vy
      let initialVz = vz
      let dist = 0
      const centerDist = Math.max(0, 300 - Math.abs(vx))
      
      const moveOcean = () => {
         const zOffset = frames / 2 % sceneConfig.polygonSize * 4
         vz -= zOffset
      }
      
      const oceanWave = () => {
         const wavesFunction = Math.sin(frames / 20 + vx / vz * 5 + vz / 100) * 16
         const waveWiggle = -32 + Math.cos(frames / 50) * 8
         vy += wavesFunction + waveWiggle
      }
      
      const applyPerspective = () => {
         vx /= vz / renderConfig.perspective * resolutionDivider
         vy /= vz / renderConfig.perspective * resolutionDivider
      }
      
      moveOcean()
      oceanWave()
      
      initialVy = vy
      vz = Math.max(0, vz)
      
      applyPerspective()
      
      dist = Math.sqrt(vx ** 2 + vz ** 2)
      
      if (i % 4 === 0) {
         const intense = Math.max(0, 1 - dist / renderConfig.perspective / 2)
         c.save()
         c.fillStyle = `hsl(${220}deg, ${ intense * 50 }%, ${ intense * 20 }%)`
         c.strokeStyle =`hsl(185deg, 90%, 61%)`
         c.lineWidth = 4 / resolutionDivider
         
         renderConfig.fill ? c.fill() : null
         renderConfig.wireframe ? c.stroke() : null
         
         c.restore()
         c.beginPath()
         c.moveTo(vx, vy)
      } else {
         c.lineTo(vx, vy)
      }
   }
}

const generatePlane = (x, y, z, rows, cols, sizeX, sizeY) => {
    const polygons = []
    for (let j = 0; j < rows; j++) {
       for (let i = 0; i < cols; i++) {
          polygons.push(...[
             [x + i * sizeX,     y, z + j * sizeY],
             [x + i * sizeX,     y, z + j * sizeY + sizeY],
             [x + i * sizeX + sizeX, y, z + j * sizeY],
             [x + i * sizeX,     y, z + j * sizeY],
             [x + i * sizeX,     y, z + j * sizeY + sizeY],
             [x + i * sizeX + sizeX, y, z + j * sizeY],
             [x + i * sizeX + sizeX, y, z + j * sizeY + sizeY],
             [x + i * sizeX,     y, z + j * sizeY + sizeY]
          ])
       }
    }
   vertexBuffer.push(...polygons)
}

const renderSunset = (x, y, r) => {
   const stripesCount = 8;
   const stripeWidth = r / 8 / resolutionDivider
   x /= resolutionDivider
   y /= resolutionDivider
   r /= resolutionDivider
   
   y -= Math.cos(frames / 50) * 2
   
   c.fillStyle = c.createLinearGradient(x, y - r, x, y + r)
   c.fillStyle.addColorStop(0, "#EFAA4F")
   c.fillStyle.addColorStop(1, "#F529A5")
   
   c.beginPath()
   c.arc(x, y, r, 0, Math.PI * 2)
   c.fill()
   
   c.fillStyle = "#000"
   for (let i = 0; i < 8; i++) {
      const width = stripeWidth - (stripeWidth / 8) * i
      c.fillRect(x - r, y + r - stripeWidth * i, r * 2, width)
   }
}

const renderMountains = () => {
   const mountainsY = 64 / resolutionDivider - Math.cos(frames / 50) * 16 / resolutionDivider
   const drawTriangle = (x, y, s) => {
      y -= s / 2
      const angle = Math.PI * 2 / 3
      c.beginPath()
      for (let i = 0; i < 3; i++) {
         c[i ? 'lineTo' : 'moveTo'](
            x + Math.cos(angle / 4 + i * angle) * s, 
            y + Math.sin(angle / 4 + i * angle) * s
         )
      }
      c.fill()
      c.beginPath()
      s -= c.lineWidth * 2
      for (let i = 1; i < 3; i++) {
         c[i ? 'lineTo' : 'moveTo'](
            x + Math.cos(angle / 4 + i * angle) * s, 
            y + Math.sin(angle / 4 + i * angle) * s
         )
      }
      c.stroke()
      
   }
   c.save()
   c.fillStyle = "#111"
   c.strokeStyle = "#D354DF"
   c.lineWidth = 3
   c.lineCap = "round"
   c.shadowBlur = 32
   c.shadowColor = "rgba(239, 170, 79, 0.2)"
   c.shadowOffsetY = -16
   drawTriangle(0, mountainsY / resolutionDivider, 128 / resolutionDivider)
   drawTriangle(128 / resolutionDivider, mountainsY / resolutionDivider, 92 / resolutionDivider)
   drawTriangle(-128 / resolutionDivider, mountainsY / resolutionDivider, 64 / resolutionDivider)
   c.restore()
}

const renderSky = () => {
   c.fillStyle = c.createLinearGradient(-canvas.width / 2, -canvas.height / 2, -canvas.width / 2, canvas.height / 2)
   c.fillStyle.addColorStop(0, "#54155B")
   c.fillStyle.addColorStop(0.5, "#1D0628")
   c.save()
   c.globalCompositeOperation = "screen"
   c.fillRect(-canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height)
   c.restore()
}

const renderLight = () => {
   const blendMode = "screen"
   c.save()
   c.translate(0, 0)
   c.rotate(-Math.PI / 3 + Math.cos(frames / 30) * 0.6)
   c.scale(1 / resolutionDivider, 1 / resolutionDivider)
   c.globalCompositeOperation = blendMode
   c.drawImage(spotImage, 0, -spotImage.height / 2)
   c.restore()
   c.save()
   c.translate(0, 0)
   c.rotate(-Math.PI / 1.5 - Math.cos(frames / 34) * 0.6)
   c.scale(1 / resolutionDivider, 1 / resolutionDivider)
   c.globalCompositeOperation = blendMode
   c.drawImage(spotImage, 0, -spotImage.height / 2)
   c.restore()
}

const postProcessing = () => {
   c.save()
   c.globalCompositeOperation = "lighten"
   c.filter = `blur(${ renderConfig.bloomSize }px)`
   c.drawImage(c.canvas, 0, 0)
   c.restore()
}


let oldTimeStamp = performance.now();
const render = (timeStamp = performance.now()) => {
   const deltaTime = (timeStamp - oldTimeStamp) / 1000;
   oldTimeStamp = timeStamp;
   
   frames += deltaTime * 50;
   requestAnimationFrame(render)
   resizeCanvas()
   c.fillStyle = "#000"
   c.fillRect(0, 0, canvas.width, canvas.height)
   
   c.save()
   c.translate(canvas.width / 2, canvas.height / 2)
   renderSunset(0, -192, 128)
   renderLight()
   renderMountains()
   renderVertices()
   renderSky()
   c.restore()
   
   
   renderConfig.postProcess ? postProcessing() : false
}



spotImage.src = "http://www.ishootshows.com/wp-content/uploads/2011/01/quark-aa-r5-edition-5985-Edit.jpg"
spotImage.onload = () => {
   generatePlane(-sceneConfig.polygonSize * 60, 100, 20, 20, 20, sceneConfig.polygonSize * 6, sceneConfig.polygonSize * 2)
   document.body.appendChild(canvas)
   render()
}

sfx.oncanplay = () => {
   sfx.isLoaded = true
   window.addEventListener('click', () => {
      sfx.play()
      sfx.loop = true
      sfx.isPlaying = true
   }, { once: true })
}