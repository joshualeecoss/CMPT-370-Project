class Game {
    constructor(state) {
        this.state = state;
        this.spawnedObjects = [];
        this.collidableObjects = [];
    }

    // example - we can add our own custom method to our game and call it using 'this.customMethod()'
    customMethod() {
        console.log("Custom method!");
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
                var x = Math.max(otherObject.model.position[0] - otherObject.collider.width / 2, Math.min(object.model.position[0], otherObject.model.position[0] + otherObject.collider.width / 2));
                var y = Math.max(otherObject.model.position[1] - otherObject.collider.height / 2, Math.min(object.model.position[1], otherObject.model.position[1] + otherObject.collider.height / 2));
                var z = Math.max(otherObject.model.position[2] - otherObject.collider.depth / 2, Math.min(object.model.position[2], otherObject.model.position[2] + otherObject.collider.depth / 2));
                
                var distance = Math.sqrt((x - object.model.position[0]) * (x - object.model.position[0]) +
                                        (y - object.model.position[1]) * (y - object.model.position[1]) +
                                        (z - object.model.position[2]) * (z - object.model.position[2]));
                
                
                if (distance < object.collider.radius) {
                    object.onCollide(otherObject);
                }
            }
        });
    }


    // runs once on startup after the scene loads the objects
    async onStart() {
        console.log("On start");

        // this just prevents the context menu from popping up when you right click
        // document.addEventListener("contextmenu", (e) => {
        //     e.preventDefault();
        // }, false);

        // example - set an object in onStart before starting our render loop!
        this.player = getObject(state, "spacecraft");
        this.meteor = getObject(state, "meteorL");
        this.camera = state.settings.camera;

        this.wall1 = getObject(state, "wall4");
        this.createBoxCollider(this.wall1, this.wall1.model.scale[0], this.wall1.model.scale[1], this.wall1.model.scale[2]);

        // example - create sphere colliders on our two objects as an example, we give 2 objects colliders otherwise
        // no collision can happen
        this.createSphereCollider(this.player, 1.5);
        this.createSphereCollider(this.meteor, 1);
        // this.createSphereCollider(this.cube, 0.5, (otherObject) => {
        //     console.log(`This is a custom collision of ${otherObject.name}`)
        // });
        // this.createSphereCollider(otherCube, 0.5);

        // example - setting up a key press event to move an object in the scene
        document.addEventListener("keypress", (e) => {
            e.preventDefault();

            switch (e.key) {
                case "a":
                    this.player.translate(vec3.fromValues(5, 0, 0));
                    break;

                case "d":
                    this.player.translate(vec3.fromValues(-5, 0, 0));
                    break;

                case "w":
                    this.player.translate(vec3.fromValues(0, 0, 5));
                    break;
                
                case "s":
                    this.player.translate(vec3.fromValues(0, 0, -5));
                    break;



                default:
                    break;
            }
        });

        console.log(this.collidableObjects);
        

        //example: spawn some stuff before the scene starts
        // for (let i = 0; i < 2; i++) {
        //     for (let j = 0; j < 2; j++) {
        //         for (let k = 0; k < 2; k++) {
        //             spawnObject({
        //                 name: `new-Object${i}${j}${k}`,
        //                 type: "spacecraft",
        //                 material: {
        //                     diffuse: randomVec3(0, 1)
        //                 },
        //                 position: vec3.fromValues(4 - i, 1.0, 4 - k),
        //                 scale: vec3.fromValues(1.0, 1.0, 1.0),
        //             }, this.state);
        //         }
        //     }
        // }

        // for (let i = 0; i < 10; i++) {
        //     let tempObject = await spawnObject({
        //         name: `new-Object${i}`,
        //         type: "spacecraft",
        //         material: {
        //             diffuse: randomVec3(0, 1)
        //         },
        //         position: vec3.fromValues(4 - i, 0, 0),
        //         scale: vec3.fromValues(0.5, 0.5, 0.5)
        //     }, this.state);


        //tempObject.constantRotate = true; // lets add a flag so we can access it later
        // this.spawnedObjects.push(tempObject); // add these to a spawned objects list

        // tempObject.collidable = true;
        // tempObject.onCollide = (object) => { // we can also set a function on an object without defining the function before hand!
        //     console.log(`I collided with ${object.name}!`);
        // };
        // }

        this.player.onCollide = (object) => {
            if (object.name === "meteorL") {
                console.log("You died!");
            } else if (object.collider.type === "BOX") {
                console.log("Out of Bounds");
            }
            
        };
    }

    // Runs once every frame non stop after the scene loads
    onUpdate(deltaTime) {
        // TODO - Here we can add game logic, like moving game objects, detecting collisions, you name it. Examples of functions can be found in sceneFunctions

        // example: Rotate a single object we defined in our start method
        // this.cube.rotate('x', deltaTime * 0.5);

        // example: Rotate all objects in the scene marked with a flag
        // this.state.objects.forEach((object) => {
        //     if (object.constantRotate) {
        //         object.rotate('y', deltaTime * 0.5);
        //     }
        // });

        // simulate a collision between the first spawned object and 'cube' 
        // if (this.spawnedObjects[0].collidable) {
        //     this.spawnedObjects[0].onCollide(this.cube);
        // }

        // example: Rotate all the 'spawned' objects in the scene
        // this.spawnedObjects.forEach((object) => {
        //     object.rotate('y', deltaTime * 0.5);
        // });


        // example - call our collision check method on our cube
        // this.checkCollision(this.cube);
        this.checkCollision(this.player);
    }
}
