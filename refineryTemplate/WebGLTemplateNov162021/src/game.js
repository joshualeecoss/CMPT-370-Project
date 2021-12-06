class Game {
    constructor(state) {
        this.state = state;
        this.spawnedObjects = [];
        this.collidableObjects = [];
        this.flag = 0;
        
    }

    // example - we can add our own custom method to our game and call it using 'this.customMethod()'
    customMethod() {
        console.log("Custom method!");
    }

    // example - create a collider on our object with various fields we might need (you will likely need to add/remove/edit how this works)
    // createSphereCollider(object, radius, onCollide = null) {
    //     object.collider = {
    //         type: "SPHERE",
    //         radius: radius,
    //         onCollide: onCollide ? onCollide : (otherObject) => {
    //             console.log(`Collided with ${otherObject.name}`);
    //         }
    //     };
    //     this.collidableObjects.push(object);
    // }

    // example - function to check if an object is colliding with collidable objects
    // checkCollision(object) {
    //     // loop over all the other collidable objects 
    //     this.collidableObjects.forEach(otherObject => {
    //         // do a check to see if we have collided, if we have we can call object.onCollide(otherObject) which will
    //         // call the onCollide we define for that specific object. This way we can handle collisions identically for all
    //         // objects that can collide but they can do different things (ie. player colliding vs projectile colliding)
    //         // use the modeling transformation for object and otherObject to transform position into current location
    //     });
    // }


    // runs once on startup after the scene loads the objects
    async onStart() {
        console.log("On start");

        // this just prevents the context menu from popping up when you right click
        // document.addEventListener("contextmenu", (e) => {
        //     e.preventDefault();
        // }, false);

        
        

        // example - set an object in onStart before starting our render loop!
        this.player = getObject(state, "spacecraft");
        this.bulletL = getObject(state, "bulletL");
        this.bulletR = getObject(state, "bulletR");   
        this.mainCamera = state.settings.camera;
        


        /*this.mainCamera.right = vec3.fromValues(-1.0, 0.0, 0.0);
        this.mainCamera.center = vec3.fromValues(0.5, 0.5, 0.0);
        vec3.subtract(this.mainCamera.front, this.mainCamera.center, this.mainCamera.position);
        vec3.normalize(this.mainCamera.front, this.mainCamera.front);
        vec3.cross(this.mainCamera.right, this.mainCamera.front, this.mainCamera.up);*/

        /* vec3.subtract(this.mainCamera.front, this.mainCamera.center, this.mainCamera.position);
        vec3.normalize(this.mainCamera.front, this.mainCamera.front);
        vec3.cross(this.mainCamera.right, this.mainCamera.front, this.mainCamera.up);
        vec3.cross(this.mainCamera.up, this.mainCamera.right, this.mainCamera.front);
        vec3.multiply(this.mainCamera.right, this.mainCamera.right, vec3.fromValues(0.1, 0.1, 0.1));
        vec3.subtract(this.mainCamera.center, this.mainCamera.center, this.mainCamera.up); */

        /*vec3.subtract(this.mainCamera.front, this.mainCamera.center, this.mainCamera.position);
        vec3.normalize(this.mainCamera.front, this.mainCamera.front);
        vec3.cross(this.mainCamera.right, this.mainCamera.front, this.mainCamera.up);
        vec3.multiply(this.mainCamera.right, this.mainCamera.right, vec3.fromValues(0.1, 0.1, 0.1));
        vec3.add(this.mainCamera.center, this.mainCamera.center, this.mainCamera.right);*/

        
        //console.log(state.settings);
        //console.log(this.secondcamera);
        //console.log(this.player);
        
        //console.log(this.bulletL.position);


        // example - create sphere colliders on our two objects as an example, we give 2 objects colliders otherwise
        // no collision can happen
        // this.createSphereCollider(this.cube, 0.5, (otherObject) => {
        //     console.log(`This is a custom collision of ${otherObject.name}`)
        // });
        // this.createSphereCollider(otherCube, 0.5);
        /*if (this.flag == 0) { // flag = 0 ; top view    
                
            this.mainCamera.position = vec3.fromValues(0, 113, 0); 
            this.mainCamera.front = vec3.fromValues(0, -1, 0);
        }
        else if (this.flag == 1) { // flag = 1 ; spaceship view
            
            this.mainCamera.position[0] = this.player.model.position[0];
            this.mainCamera.position[1] = this.player.model.position[1] + 1.2;
            this.mainCamera.position[2] = this.player.model.position[2] + 1.5;
            this.mainCamera.front = this.player.centroid;
        }*/
        // example - setting up a key press event to move an object in the scene
        document.addEventListener("keydown", (e) => {
            e.preventDefault();
            console.log(this.flag);
           

            switch (e.code) {
                case "Enter": // camera change 
                    //e.preventDefault();
                    if (this.flag == 0){                      
                        
                        this.mainCamera.position[0] = this.player.model.position[0];
                        this.mainCamera.position[1] = this.player.model.position[1] + 1.2;
                        this.mainCamera.position[2] = this.player.model.position[2] + 1.5;
                        this.mainCamera.front = this.player.centroid;  
                        this.flag = 1;   
                        
                    } else {  
                        this.mainCamera.position = vec3.fromValues(0, 113, 0); 
                        this.mainCamera.front = vec3.fromValues(0, -1, 0);                   
                        this.flag = 0;
                                                   
                    }                                       
                    break;

                case "KeyA":
                    console.log(this.player.model);
                    console.log(this.mainCamera);
                    if (e.getModifierState("Shift")) {
                        mat4.rotateY(this.player.model.rotation,this.player.model.rotation, -0.1);
                        // need camera rotation
                        

                    } else {
                        this.player.translate(vec3.fromValues(0.3, 0, 0));
                        vec3.add(this.mainCamera.position, this.mainCamera.position, vec3.fromValues(0.3, 0, 0));
                    }
                    break;

                case "KeyD":
                    if (e.getModifierState("Shift")) {
                        mat4.rotateY(this.player.model.rotation,this.player.model.rotation, 0.1);
                        // need camera rotation

                    } else {
                        this.player.translate(vec3.fromValues(-0.3, 0, 0));
                        vec3.add(this.mainCamera.position, this.mainCamera.position, vec3.fromValues(-0.3, 0, 0));
                    }
                    break;

                case "KeyW":
                    if (e.getModifierState("Shift")) {
                        mat4.rotateX(this.player.model.rotation,this.player.model.rotation, 0.1);
                        
                        // need camera rotation                                                                 
                   
                    } else {
                        this.player.translate(vec3.fromValues(0, 0.3, 0));
                        if (this.flag == 1) {
                            vec3.add(this.mainCamera.position, this.mainCamera.position, vec3.fromValues(0, 0.3, 0));
                        }
                    }
                    break;

                case "KeyS":
                    if (e.getModifierState("Shift")) {
                        mat4.rotateX(this.player.model.rotation,this.player.model.rotation, -0.1);                    
                        // need camera rotation                                                                 
                   
                    } else {
                        this.player.translate(vec3.fromValues(0, -0.3, 0));
                        
                        if (this.flag == 1) {
                            vec3.add(this.mainCamera.position, this.mainCamera.position, vec3.fromValues(0, -0.3, 0));
                   
                        }
                    }
                    break;
                
                case "KeyQ":
                    if (e.getModifierState("Shift")) {
                        mat4.rotateZ(this.player.model.rotation,this.player.model.rotation, 0.1); 
                        // need camera rotation                                                                 
                   
                    } else {
                        this.player.translate(vec3.fromValues(0, 0, 0.3));
                        vec3.add(this.mainCamera.position, this.mainCamera.position, vec3.fromValues(0, 0, 0.3));
                    }
                    break;
                
                case "KeyE": 
                    if (e.getModifierState("Shift")) {
                     mat4.rotateZ(this.player.model.rotation,this.player.model.rotation, -0.1);                    
                    // need camera rotation                                                                 
               
                    } else {
                        this.player.translate(vec3.fromValues(0, 0, -0.3));
                        vec3.add(this.mainCamera.position, this.mainCamera.position, vec3.fromValues(0, 0, -0.3));
                    }
                    break;

                /*case "Space":
                    console.log(this.bulletL.position);
                    //e.preventDefault();
                    console.log(this.bulletL);
                    // if not collide with wall or meteors
                    //this.bulletL.translate(vec3.fromValues(0,0,0.1));
                    //this.bulletR.translate(vec3.fromValues(0,0,0.1));                  
                    
                    break;*/



                default:
                    break;
            }
        });

        this.customMethod(); // calling our custom method! (we could put spawning logic, collision logic etc in there ;) )

        //example: spawn some stuff before the scene starts
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                for (let k = 0; k < 2; k++) {
                    spawnObject({
                        name: `new-Object${i}${j}${k}`,
                        type: "spacecraft",
                        material: {
                            diffuse: randomVec3(0, 1)
                        },
                        position: vec3.fromValues(4 - i, 1.0, 4 - k),
                        scale: vec3.fromValues(1.0, 1.0, 1.0),
                    }, this.state);
                }
            }
        }

        for (let i = 0; i < 10; i++) {
            let tempObject = await spawnObject({
                name: `new-Object${i}`,
                type: "spacecraft",
                material: {
                    diffuse: randomVec3(0, 1)
                },
                position: vec3.fromValues(4 - i, 0, 0),
                scale: vec3.fromValues(0.5, 0.5, 0.5)
            }, this.state);

        //console.log(tempObject);
        //tempObject.constantRotate = true; // lets add a flag so we can access it later
        //this.spawnedObjects.push(tempObject); // add these to a spawned objects list

        // tempObject.collidable = true;
        // tempObject.onCollide = (object) => { // we can also set a function on an object without defining the function before hand!
        //     console.log(`I collided with ${object.name}!`);
        // };
        }
    }

    // Runs once every frame non stop after the scene loads
    onUpdate(deltaTime) {
        // TODO - Here we can add game logic, like moving game objects, detecting collisions, you name it. Examples of functions can be found in sceneFunctions

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


        // example - call our collision check method on our cube
        // this.checkCollision(this.cube);
    }
}
