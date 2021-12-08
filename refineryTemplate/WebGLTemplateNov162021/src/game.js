class Game {
    constructor(state) {
        this.state = state;
        this.spawnedObjects = [];
        this.collidableObjects = [];
        this.projectiles = [];
        this.canFire = false;
        this.asteroids = [];
        this.flag = 0;
        this.life = 3;
        this.bulletSpeed = 20;
        
    }

    // example - we can add our own custom method to our game and call it using 'this.customMethod()'
    customMethod() {
        console.log("Custom method!");
    }

    setMovement(speed) {
        this.speed = speed;
    }

    setDirection(direction) {
        this.direction = direction;
    }

    fire(fire) {
        this.canFire = fire;
    }

    
    move(player, camera) {
        if (this.direction === 0) {
            player.translate(vec3.fromValues(0, 0, 0));
        }
        if (this.direction === 1 && this.flag == 0) {
            player.translate(vec3.fromValues(player.model.forward[0] * this.speed, player.model.forward[1] * this.speed, player.model.forward[2] * this.speed));
        } else if (this.direction === 1 && this.flag == 1) {
            player.translate(vec3.fromValues(player.model.forward[0] * this.speed, player.model.forward[1] * this.speed, player.model.forward[2] * this.speed));
            vec3.add(camera.position, camera.position, vec3.fromValues(player.model.forward[0] * this.speed, player.model.forward[1] * this.speed, player.model.forward[2] * this.speed));
        }
        if (this.direction === 4 && this.flag == 0) {
            player.translate(vec3.fromValues(player.model.forward[0] * -this.speed, player.model.forward[1] * -this.speed, player.model.forward[2] * -this.speed));
        } else if (this.direction === 4 && this.flag == 1) {
            player.translate(vec3.fromValues(player.model.forward[0] * -this.speed, player.model.forward[1] * -this.speed, player.model.forward[2] * -this.speed));
            vec3.add(camera.position, camera.position, vec3.fromValues(player.model.forward[0] * -this.speed, player.model.forward[1] * -this.speed, player.model.forward[2] * -this.speed));
        }
        if (this.direction === 2) {
            player.rotate("y", 0.05);
        }
        if (this.direction === 3) {
            player.rotate("y", -0.05);
        }


    }

    createSphereCollider(object, radius, onCollide = null) {
        object.collider = {
            type: "SPHERE",
            radius: radius,
            onCollide: onCollide ? onCollide : (otherObject) => {
                console.log(`Collided with ${otherObject.name}`);
            }
        };
        this.collidableObjects.push(object);
    }

    createBoxCollider(object, width, height, depth, onCollide = null) {
        object.collider = {
            type: "BOX",
            width: width,
            height: height,
            depth: depth,
            onCollide: onCollide ? onCollide : (otherObject) => {
                console.log(`Collided with ${otherObject.name}`);
            }
        };
        this.collidableObjects.push(object);
    }

    checkCollision(object) {
        // loop over all the other collidable objects 
        this.collidableObjects.forEach(otherObject => {
            // do a check to see if we have collided, if we have we can call object.onCollide(otherObject) which will
            // call the onCollide we define for that specific object. This way we can handle collisions identically for all
            // objects that can collide but they can do different things (ie. player colliding vs projectile colliding)
            // use the modeling transformation for object and otherObject to transform position into current location

            // SPHERE / SPHERE COLLISION
            if (object.collider.type === "SPHERE" && otherObject.collider.type === "SPHERE") {
                var distance = Math.sqrt((object.model.position[0] - otherObject.model.position[0]) * (object.model.position[0] - otherObject.model.position[0]) + 
                                        (object.model.position[1] - otherObject.model.position[1]) * (object.model.position[1] - otherObject.model.position[1]) + 
                                        (object.model.position[2] - otherObject.model.position[2]) * (object.model.position[2] - otherObject.model.position[2]));
                
                if (distance < (object.collider.radius + otherObject.collider.radius)) {
                    object.onCollide(otherObject);
                }
            }
            // BOX / SPHERE COLLISION
            else if (object.collider.type === "SPHERE" && otherObject.collider.type === "BOX") {
                var x = Math.max(otherObject.model.position[0] - (otherObject.collider.width / 2), Math.min(object.model.position[0], otherObject.model.position[0] + (otherObject.collider.width / 2)));
                var y = Math.max(otherObject.model.position[1] - (otherObject.collider.height / 2), Math.min(object.model.position[1], otherObject.model.position[1] + (otherObject.collider.height / 2)));
                var z = Math.max(otherObject.model.position[2] - (otherObject.collider.depth / 2), Math.min(object.model.position[2], otherObject.model.position[2] + (otherObject.collider.depth / 2)));
                
                var distance = Math.sqrt((x - object.model.position[0]) * (x - object.model.position[0]) +
                                        (y - object.model.position[1]) * (y - object.model.position[1]) +
                                        (z - object.model.position[2]) * (z - object.model.position[2]));
                
                if (distance < object.collider.radius) {
                    object.onCollide(otherObject);
                }
            }
        });
    }

    async createProjectile(projectiles) {
        if (this.projectiles.length < 1) {
            let newBullet = await spawnObject({
                name: `new-Bullet`,
                type: "mesh",
                material: {
                    diffuse: randomVec3(0, 1),
                    ambient: vec3.fromValues(0.3, 0.3, 0.3),
                    specular: vec3.fromValues(0.5, 0.5, 0.5),
                },
                model: "5.56mm.obj",
                rotation: Object.assign({}, this.player.model.rotation),
                forward: vec3.fromValues(this.player.model.forward[0], this.player.model.forward[1], this.player.model.forward[2]),
                position: vec3.fromValues(this.player.model.position[0], this.player.model.position[1], this.player.model.position[2]),
                scale: vec3.fromValues(0.125, 0.125, 0.125),

            }, this.state);

            this.createSphereCollider(newBullet, 0.05);

            newBullet.onCollide = (object) => {
                if (object.collider.type === "BOX") {

                    projectiles.pop();
                    console.log("Bullet hit the ground");
                    
                    this.fire(false);
                }
            };
            projectiles.push(newBullet);      
        }
        console.log(projectiles);
        
    }

    wallBallCollider(object) {
        return (object.model.position[2] <= -75);
    }

    ballCollider(object, otherObject) {
        var distance = Math.sqrt((object.model.position[0] - otherObject.model.position[0]) * (object.model.position[0] - otherObject.model.position[0]) +
                                (object.model.position[1] - otherObject.model.position[1]) * (object.model.position[1] - otherObject.model.position[1]) +
                                (object.model.position[2] - otherObject.model.position[2]) * (object.model.position[2] - otherObject.model.position[2]));
        return distance < 5;
    }
    
    ballShipCollider(ball, r, ship) {
        //console.log("ship", ship);
        //console.log("ball", ball);
        var x = Math.max(ship.model.position[0] - 2, Math.min(ball.model.position[0], ship.model.position[0] + 2));
        var y = Math.max(ship.model.position[1] - 1, Math.min(ball.model.position[1], ship.model.position[1] + 1));
        var z = Math.max(ship.model.position[2] - 2, Math.min(ball.model.position[2], ship.model.position[2] + 2));
        var distance = Math.sqrt((x - ball.model.position[0]) * (x - ball.model.position[0]) + 
                                (y - ball.model.position[1]) * (y - ball.model.position[1]) +
                                (z - ball.model.position[2]) * (y - ball.model.position[2]));
        return distance < r;
    }

    endGame() {
        this.life--;
        if (this.life <= 1) {
            //document.getElementById("restart").innerHTML = "Press P to Restart Game";
            document.getElementById("gameEnd").innerHTML = "GAME OVER";
            //document.getElementById("life").innerHTML = "";
           
            //cancelAnimationFrame();
        }
        else {
            //document.getElementById("life").innerHTML = "You have " + this.life + " life left";
            //document.getElementById("restart").innerHTML = "Press P to Restart Game";
        }
                
    }

    // runs once on startup after the scene loads the objects 
    async onStart() {
        console.log("On start");
        this.setMovement(0.3);

        // this just prevents the context menu from popping up when you right click
        // document.addEventListener("contextmenu", (e) => {
        //     e.preventDefault();
        // }, false);

        
        

        // example - set an object in onStart before starting our render loop!
        this.player = getObject(state, "spacecraft");
        this.bulletL = getObject(state, "bulletL");
        this.bulletR = getObject(state, "bulletR");   
        this.mainCamera = state.settings.camera;
        
        this.floor = getObject(state, "wall1");
        this.wall1 = getObject(state, "wall2");
        this.wall2 = getObject(state, "wall3");
        this.wall3 = getObject(state, "wall4");
        this.wall4 = getObject(state, "wall5");
        this.ceiling = getObject(state, "wall6");
        this.createBoxCollider(this.wall1, this.wall1.model.dimensions[0], this.wall1.model.dimensions[1], this.wall1.model.dimensions[2]);
        this.createBoxCollider(this.wall2, this.wall2.model.dimensions[0], this.wall2.model.dimensions[1], this.wall2.model.dimensions[2]);
        this.createBoxCollider(this.wall3, this.wall3.model.dimensions[0], this.wall3.model.dimensions[1], this.wall3.model.dimensions[2]);
        this.createBoxCollider(this.wall4, this.wall4.model.dimensions[0], this.wall4.model.dimensions[1], this.wall4.model.dimensions[2]);
        this.createBoxCollider(this.floor, this.floor.model.dimensions[0], this.floor.model.dimensions[1], this.floor.model.dimensions[2]);
        this.createBoxCollider(this.ceiling, this.ceiling.model.dimensions[0], this.ceiling.model.dimensions[1], this.ceiling.model.dimensions[2]);

        // example - create sphere colliders on our two objects as an example, we give 2 objects colliders otherwise
        // no collision can happen
        this.createSphereCollider(this.player, 2.5);
        
        // this.createSphereCollider(this.cube, 0.5, (otherObject) => {
        //     console.log(`This is a custom collision of ${otherObject.name}`)
        // });
        // this.createSphereCollider(otherCube, 0.5);
       
        // example - setting up a key press event to move an object in the scene
        document.addEventListener("keydown", (e) => {
            if (e.defaultPrevented) {
                return; // Do nothing if the event was already processed
            }
            // console.log(this.flag);
           

            switch (e.code) {
                case "Enter": // camera change 
                    //e.preventDefault();
                    if (this.flag == 0){                      
                        
                        this.mainCamera.position[0] = this.player.model.position[0] + this.player.centroid[0];
                        this.mainCamera.position[1] = this.player.model.position[1] + this.player.centroid[1] + 1.5;
                        this.mainCamera.position[2] = this.player.model.position[2] + this.player.centroid[2];
                        this.mainCamera.front = this.player.model.forward;  
                        this.mainCamera.up = vec3.fromValues(0, 1, 0);    
                        this.flag = 1;   
                        
                    } else {  
                        this.mainCamera.position = vec3.fromValues(0, 98, 0); 
                        this.mainCamera.front = vec3.fromValues(0, -1, 0);   
                        this.mainCamera.up = vec3.fromValues(0, 0, 1);    
                                
                        this.flag = 0;
                                                   
                    }                                       
                    break;

                case "KeyA":
                    this.setDirection(2);                   
                    break;

                case "KeyD":                  
                    this.setDirection(3);                  
                    break;

                case "KeyW":                   
                    this.setDirection(1);                    
                    break;

                case "KeyS":
                    this.setDirection(4);
                    break;

                case "KeyQ":
                    this.player.translate(vec3.fromValues(0, 1, 0));
                    if (this.flag == 1) {
                        vec3.add(this.mainCamera.position, this.mainCamera.position, vec3.fromValues(0, 1, 0));
                    }
                    break;

                case "KeyE":   
                    this.player.translate(vec3.fromValues(0, -1, 0));  
                    if (this.flag == 1) {                      
                        vec3.add(this.mainCamera.position, this.mainCamera.position, vec3.fromValues(0, -1, 0));                      
                    }                
                    break;

                case "Space":
                    this.createProjectile(this.projectiles);
                    this.fire(true);
                    break;
                
                default:
                    break;
                    
            }
            e.preventDefault();
        }, true);

        document.addEventListener("keyup", (e) => {
            if (e.defaultPrevented) {
                return; // Do nothing if the event was already processed
            }
            this.setDirection(0);
            switch (e.code) {
                case "Space":
                    // this.projectiles[0].parent = null;
                    break;
            }
            
            
            e.preventDefault();
            
        });



        //tempObject.constantRotate = true; // lets add a flag so we can access it later
         // add these to a spawned objects list

        //tempObject.collidable = true;
        //tempObject.onCollide = (object) => { // we can also set a function on an object without defining the function before hand!
        //    console.log(`I collided with ${object.name}!`);
        //};

        this.player.onCollide = (object) => {
            if (object.name === "meteorL") {
                console.log("You died!");
            } else if (object.collider.type === "BOX") {
                this.setMovement(0.0);
            }
            
        };

        // spawning meteors 
        for (let i = 0; i < 30; i++) {
            this.posX = randomInt(-110, 110);
        
            this.sphere = await spawnObject({
                name: `meteor${i}`,
                type: "sphere",
                material: {
                    diffuse: randomVec3(0, 1),
                },
                position: vec3.fromValues(this.posX, 2, 90),
                scale: vec3.fromValues(5, 5, 5),
                radius: 1,
                horizSegments:25,
                vertSegments:25,
                diffuseTexture: "crater.jpg"
            }, this.state);
            
        
        this.sphere.constantRotate = true;
        this.asteroids.push(this.sphere);
       
        }  
    }

    // Runs once every frame non stop after the scene loads
    onUpdate(deltaTime) {
        // TODO - Here we can add game logic, like moving game objects, detecting collisions, you name it. Examples of functions can be found in sceneFunctions
        this.move(this.player, this.mainCamera);
        
        
        if (this.canFire) {
            let velocity = Object.assign({}, this.projectiles[0].model.forward);
            translate(this.projectiles[0], vec3.fromValues(
                velocity[0] * this.bulletSpeed * deltaTime,
                velocity[1] * this.bulletSpeed * deltaTime,
                velocity[2] * this.bulletSpeed * deltaTime));
            this.checkCollision(this.projectiles[0]);
            //this.fire();
        }

        for (let k = 0; k< this.asteroids.length; k++) {
            for (let j = 0; j < this.asteroids.length; j++){
                if (this.asteroids[k] != this.asteroids[j]){
                    if (this.ballCollider(this.asteroids[k], this.asteroids[j])) {
                        this.asteroids[j].model.position[2] += 6;
                        this.asteroids[j].model.position[1] += 6;
                        if (this.asteroids[j].model.position[1] >= 110) {
                            this.asteroids[j].model.position[1] = 2;
                        }
                       
                    }
                }
            }
        }

        for (let i = 0; i < this.asteroids.length; i++){
            //console.log("this", this.player);
            if (this.ballShipCollider(this.asteroids[i], 2.5, this.player)) {
                console.log("collision!");
                this.endGame();
                
            }
        }
        
        
        // example: Rotate a single object we defined in our start method
        // this.cube.rotate('x', deltaTime * 0.5);

        // example: Rotate all objects in the scene marked with a flag
        this.state.objects.forEach((object) => {
             if (object.constantRotate) {
                 object.rotate('y', deltaTime * 0.5);
             }
         });


        // simulate a collision between the first spawned object and 'cube' 
        // if (this.spawnedObjects[0].collidable) {
        //     this.spawnedObjects[0].onCollide(this.cube);
        // }

        // example: Rotate all the 'spawned' objects in the scene
         this.spawnedObjects.forEach((object) => {
             object.rotate('y', deltaTime * 0.5);
         });

         this.asteroids.forEach((object) => {
            object.rotate('x', deltaTime * 0.5);
           
        });

         for (let i = 0; i < this.asteroids.length; i++) {
            let time = deltaTime * (i + 1);
            
            this.asteroids[i].translate(vec3.fromValues(0,0,time * -0.3));
            if (this.wallBallCollider(this.asteroids[i])) {
                this.asteroids[i].model.position[2] = 90; 
            }
         }

        // example - call our collision check method on our cube
        // this.checkCollision(this.cube);
        this.checkCollision(this.player);
        

    }
}
