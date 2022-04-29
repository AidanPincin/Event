const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
class Txt{
    constructor(x,y,txt,fontsize=24,color='#000000'){
        this.x = x
        this.y = y
        this.fontsize = fontsize
        ctx.font = fontsize+'px Arial'
        this.width = ctx.measureText(txt).width/2
        this.txt = txt
        this.color = color
    }
    draw(){
        ctx.fillStyle = this.color
        ctx.font = this.fontsize+'px Arial'
        ctx.fillText(this.txt,this.x-this.width,this.y+this.fontsize/3)
    }
}
class YesOrNoButton{
    constructor(x,y,which){
        this.x = x
        this.y = y
        this.which = which
        this.clicked = false
    }
    draw(){
        if(this.which == 'yes'){
            ctx.fillStyle = '#007d00'
            ctx.fillRect(this.x,this.y,55,35)
            ctx.fillStyle = '#00ff00'
            ctx.fillRect(this.x+5,this.y+5,50,30)
            ctx.beginPath()
            ctx.moveTo(this.x+39,this.y+11)
            ctx.lineTo(this.x+26,this.y+29)
            ctx.lineTo(this.x+21,this.y+24)
            ctx.stroke()
        }
        else{
            ctx.fillStyle = '#7d0000'
            ctx.fillRect(this.x,this.y,55,35)
            ctx.fillStyle = '#ff0000'
            ctx.fillRect(this.x,this.y,50,30)
            ctx.beginPath()
            ctx.moveTo(this.x+16,this.y+6)
            ctx.lineTo(this.x+34,this.y+24)
            ctx.moveTo(this.x+16,this.y+24)
            ctx.lineTo(this.x+34,this.y+6)
            ctx.lineWidth = 3
            ctx.stroke()

        }
    }
    wasClicked(e){
        const x = e.pageX-10
        const y = e.pageY-10
        if(x>=this.x && x<=this.x+55 && y>=this.y && y<=this.y+30){
            if(this.which == 'no'){
                this.which = 'yes'
            }
            else{
                this.which = 'no'
            }
        }
    }
}
class Button{
    constructor(x,y,txt,fn){
        this.x = x
        this.y = y
        this.txt = txt
        this.fn = fn
        this.clicked = 0
    }
    draw(){
        ctx.fillStyle = '#00007d'
        ctx.fillRect(this.x,this.y,145,40)
        ctx.fillStyle = '#0000ff'
        ctx.fillRect(this.x+this.clicked,this.y+this.clicked,140,35)
        ctx.font = '24px Arial'
        ctx.fillStyle = '#000000'
        const width = ctx.measureText(this.txt).width
        ctx.fillText(this.txt,this.x+70-width/2+this.clicked,this.y+25.5+this.clicked)
    }
    wasClicked(e){
        const x = e.pageX-10
        const y = e.pageY-10
        if(x>=this.x && x<=this.x+145 && y>=this.y && y<=this.y+40){
            this.fn()
            this.clicked = 5
            setTimeout(() => {
                this.clicked = 0
            },100)
        }
    }
}
class Marble{
    constructor(x,y,color,name){
        this.x = x
        this.y = y
        this.color = color
        this.gravity = 1
        this.name = name
        this.obstacle = false
        this.r = 20
        this.time = 0
        this.vy = 0
        this.move = true
        this.vx = Math.random()*10-5
    }
    draw(){
        this.time += 1
        for(let i=0; i<renderer.participants.length; i++){
            if(renderer.participants[i] != this){
                this.detectCollision(renderer.participants[i])
            }
        }
        for(let i=0; i<renderer.obstacles.length; i++){
            this.detectCollision(renderer.obstacles[i])
        }
        if(this.x>1400-this.r){
            this.vx = -Math.abs(this.vx)
        }
        if(this.x<this.r){
            this.vx = Math.abs(this.vx)
        }
        if(this.y>780-this.r){
            renderer.placements.push(this)
            renderer.participants.splice(renderer.participants.findIndex(m => m == this),1)
        }
        this.vy += 0.05
        if(this.move == true){
            this.x += this.vx
            this.y += this.vy
        }
        ctx.beginPath()
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2,false)
        ctx.fillStyle = this.color
        ctx.fill()
        ctx.fillStyle = '#000000'
        ctx.font = '24px Arial'
        const width = ctx.measureText(this.name).width
        ctx.fillText(this.name,this.x-width/2,this.y+8)
    }
    detectCollision(object){
        const {vx:vx, vy:vy, x:x, y:y, r:r} = object
        const collisionDist = this.r+r
        const distX = x-this.x
        const distY = y-this.y
        const dist = Math.sqrt(Math.pow(distX,2)+Math.pow(distY,2))
        if(dist<collisionDist){
            const dx = distX/dist
            const dy = distY/dist
            const sx = this.vx-vx
            const sy = this.vy-vy
            const speed = sx*dx+sy*dy*0.9
            if(object.obstacle == false){
                this.vx -= speed*dx
                this.vy -= speed*dy
                object.vx += speed*dx
                object.vy += speed*dy
            }
            else{
                this.vx -= speed*dx*2
                this.vy -= speed*dy*2
            }
            const d = dist-collisionDist
            if(object.obstacle == true){
                this.x -= (d/1.33)*(Math.abs(this.vx)/this.vx)
                this.y -= (d/1.33)*(Math.abs(this.vy)/this.vy)
            }
            else{
                this.x -= (d/3)*(Math.abs(this.vx)/this.vx)
                this.y -= (d/3)*(Math.abs(this.vy)/this.vy)
                object.x += (d/3)*(Math.abs(this.vx)/this.vx)
                object.y += (d/3)*(Math.abs(this.vy)/this.vy)
            }
        }
    }
}
class Obstacle{
    constructor(x,y){
        this.x = x
        this.y = y
        this.obstacle = true
        this.vy = 0
        this.vx = 0
        this.r = 30
    }
    draw(){
        ctx.beginPath()
        ctx.arc(this.x,this.y,this.r,0,Math.PI*2,false)
        ctx.fillStyle = '#000000'
        ctx.fill()
    }
}
class Renderer{
    constructor(){
        this.page = 'MainPage'
        this.participants = []
        this.obstacles = []
        this.placements = []
        this.time = 240
        for (let i=0; i<3; i++){
            for (let k=0; k<11; k++){
                this.obstacles.push(new Obstacle(100+150*k,150+i*250))
                this.obstacles.push(new Obstacle(25+150*k,275+i*250))
            }
        }
        this.mainPage = [new Txt(700,50,'Welcome To My Event!',48), new Txt(700,125,'Who will be participating?',48)]
        this.players = [['Alex','#7d7d7d'],['Greg','#007d00'],['Aidan','orange'],['Trey','tomato'],['Jessica','gold'],['Cole','purple'],['Helen','#c9c9c9'],
        ['Joyce','grey'],['Selena','#c9ffc9'],['Colten','#c9c900'],['Harlen','pink'],['Harley','blue'],['Delana','turquoise'],['Jason','teal'],['Milo','violet'],['Xavier','red']]
        this.mainPageButtons = [new Button(1100,382.5,'Start Event!',function(){
            setTimeout(() => {
                if(renderer.mainPageButtons.filter(b => b.which == 'yes').length>=2){
                    renderer.page = 'Race'
                    for (let i=0; i<renderer.mainPageButtons.length; i++){
                        if(renderer.mainPageButtons[i].which == 'yes'){
                            renderer.participants.push(new Marble(i*80,50,renderer.players[i-1][1],renderer.players[i-1][0].slice(0,1)+renderer.players[i-1][0].slice(renderer.players[i-1][0].length-1,renderer.players[i-1][0].length)))
                        }
                    }
                }
                else{
                    alert('2 or more participants are required to start the event')
                }
            },150)
        })]
        for (let i=0; i<this.players.length; i++){
            let cols = i
            let rows = 0
            while (cols>3){
                rows += 1
                cols -= 4
            }
            this.mainPageButtons.push(new YesOrNoButton(372.5+200*cols,280+150*rows,'no'))
        }
    }
    draw(){
        ctx.fillStyle = '#ffffff'
        ctx.fillRect(0,0,1400,800)
        this[('draw'+this.page)]()
    }   
    drawMainPage(){
        for (let i=0; i<this.mainPage.length; i++){
            this.mainPage[i].draw()
        }
        for (let i=0; i<this.players.length; i++){
            let cols = i
            let rows = 0
            while (cols>3){
                rows += 1
                cols -= 4
            }
            ctx.beginPath()
            ctx.arc(400+200*cols,250+150*rows,20,0,Math.PI*2,false)
            ctx.fillStyle = this.players[i][1]
            ctx.fill()
            new Txt(400+200*cols,250+150*rows,this.players[i][0]).draw()
            for (let i=0; i<this.mainPageButtons.length; i++){
                this.mainPageButtons[i].draw()
            }
        }
    }
    drawRace(){
        for (let i=0; i<this.obstacles.length; i++){
            this.obstacles[i].draw()
        }
        ctx.fillStyle = '#00ff00'
        ctx.fillRect(0,780,1400,20)
        if(this.time != 0){
            this.time -= 1
            let t = Math.floor(this.time/60)
            if(t == 3){
                ctx.fillStyle = '#ff0000'
            }
            if(t == 2){
                ctx.fillStyle = '#ffff00'
            }
            if(t == 1){
                ctx.fillStyle = '#00ff00'
            }
            ctx.font = '96px Arial'
            if(t>0){
                ctx.fillText(t,600,400)
            }
            else{
                ctx.fillStyle = '#00ff00'
                ctx.fillText('GO!',600,400)
            }
        }
        else{
            for (let i=0; i<this.participants.length; i++){
                this.participants[i].draw()
            }
        }
        if(this.participants.length == 0){
            this.page = 'Leadorboard'
        }
    }
    drawLeadorboard(){
        for(let i=0; i<this.placements.length; i++){
            ctx.beginPath()
            ctx.arc(400,25+i*50,15,0,Math.PI*2,false)
            ctx.fillStyle = this.placements[i].color
            ctx.fill()
            ctx.fillStyle = '#000000'
            ctx.font = '24px Arial'
            ctx.fillText(i+1,300,35+i*50)
            const player = this.players.find(p => p[0].slice(p[0].length-1,p[0].length) == this.placements[i].name.slice(1,2) && p[0].slice(0,1) == this.placements[i].name.slice(0,1))
            const width = ctx.measureText(player[0]).width
            ctx.fillText(player[0],400-width/2,33+i*50)
            ctx.fillText('Time -- '+(this.placements[i].time/60).toFixed(2)+' seconds',500,33+i*50)
        }
    }
}
const renderer = new Renderer()
function mainLoop(){
    renderer.draw()
    requestAnimationFrame(mainLoop)
}
mainLoop()
window.addEventListener('click',function(e){
    if(renderer.page == 'MainPage'){
        renderer.mainPageButtons.find(b => b.wasClicked(e))
    }
})
