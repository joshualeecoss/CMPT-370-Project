function getObject(state, name) {
    let objectToFind = null;

    for (let i = 0; i < state.objects.length; i++) {
        if (state.objects[i].name === name) {
            objectToFind = state.objects[i];
            break;
        }
    }

    return objectToFind;
}

async function spawnObject(object, state) {
    if (object.type === "mesh") {
        return await addMesh(object);
    } else if (object.type === "cube") {
        return await addCube(object, state);
    } else if (object.type === "plane") {
        return await addPlane(object, state);
    } else if (object.type.includes("Custom")) {
        return await addCustom(object, state);
    } else if (object.type === "sphere") {
        return await addSphere(object, state);
    }
}

function randomVec3(min, max) {
    return vec3.fromValues(
        Math.random(min, max),
        Math.random(min, max),
        Math.random(min, max),
    )
}

function translate(bullet, translateVec) {
    vec3.add(bullet.model.position, bullet.model.position, vec3.fromValues(translateVec[0], translateVec[1], translateVec[2]));
  }


