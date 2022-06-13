import * as THREE from 'three';
import metaversefile from 'metaversefile';
const {useApp, useFrame, useLoaders, usePhysics, useCleanup, useActivate} = metaversefile;

const baseUrl = import.meta.url.replace(/(\/)[^\/\\]*$/, '$1');

export default () => {
  const app = useApp();
  const physics = usePhysics();
  let sphere = null;

  app.name = 'ball';

  useFrame(() => {

    if(physicsIds[0] && sphere) {
      sphere.position.copy(physicsIds[0].position);
      sphere.quaternion.copy(physicsIds[0].quaternion);
      app.updateMatrixWorld();
    }

  });

  useActivate(() => {
    if(physicsIds[0]) {
      physics.addForce(physicsIds[0], new THREE.Vector3(0,1000,0), true);
    }
  });

  let physicsIds = [];
  (async () => {
    const u = `${baseUrl}ball.glb`;
    let o = await new Promise((accept, reject) => {
      const {gltfLoader} = useLoaders();
      gltfLoader.load(u, accept, function onprogress() {}, reject);
    });
    sphere = o.scene;
    app.add( sphere );

    const radius = 0.8;
    const halfHeight = 0.08;
    const physicsMaterial = new THREE.Vector3(0.5, 0.5, 0.1); //static friction, dynamic friction, restitution
    
    const physicsId = physics.addCapsuleGeometry(
      new THREE.Vector3(0,0,0),
      new THREE.Quaternion(0,0,0,1),
      radius,
      halfHeight,
      physicsMaterial,
      true
    );
    physicsIds.push(physicsId);
    //physicsId.setMassAndInertia(0, new THREE.Vector3(0,0,0));
    app.updateMatrixWorld();
  })();
  
  useCleanup(() => {
    for (const physicsId of physicsIds) {
      physics.removeGeometry(physicsId);
    }
  });

  return app;
};
