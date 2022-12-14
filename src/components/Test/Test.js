import { Suspense, useState, useEffect } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { ContactShadows, Environment, useGLTF, OrbitControls, Html, useTexture } from "@react-three/drei"
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { BoxGeometry, Color, TextureLoader, Vector2, Vector3 } from "three";


const Model = ({data}) => {
  const [model, setModel] = useState(null);
  const { scene } = useThree()

  useEffect(() => {
    //console.log(scene)
    window['scene'] = scene
    // setBackground()
  }, [])

  

  useEffect(() => {
    if(data) {
      setModel(data);
      return;
    }
    new MTLLoader()
					//.setPath( 'Popeye/' )
          //.setResourcePath('')
          .setCrossOrigin('')
					.load( 'popey/PopeyeFull_5.mtl', function ( materials ) {
            console.log('mtl', materials)

						materials.preload();

            //const tt = new TextureLoader().load('Basement_Bluto.png')

						new OBJLoader()
							.setMaterials( materials )
							// .setPath( 'Popeye/' )
							.load( 'popey/PopeyeFull_5.obj', function ( object ) {
                // object.scale.set(0.2,0.2,0.2)
                console.log("object", object)

                object.traverse(o => {
                  if(o.isMesh){
                    o.material.color = new Color('white')
                  }
                })

								setModel(object);

							} );

					} );

    // new OBJLoader()
		// 					.setPath( 'Popeye/' )
		// 					.load( 'BlutoFull_.obj', function ( object ) {
    //             // object.scale.set(0.2,0.2,0.2)
    //             console.log("object", object)
		// 						setModel(object);

		// 					} );

  }, [data])

  if(!model){ return <Html style={{zIndex: 1, flexWrap: 'nowrap'}}>No selected</Html>}

  return <>
    {
      model.children
      //.filter(o => o.name == 'BlutoFull__Hat_Group20956')
      .map(c => (<primitive postion={[100,0,-5]} object={c}/>))
    }
    {/* <primitive object={model}/> */}
    {/* <mesh position={[5,0,0]}>
      <boxGeometry args={[3, 3, 3]} attach="geometry" />
      <meshStandardMaterial color="#ff0000" attach="material" />
    </mesh> */}
  </>
}

const TestCanvas = ({}) => {

    return (
      <Canvas orthographic={true} shadows camera={{ position: [0, 0, 10], near: 0.05, far: 1000 }}>
      <ambientLight intensity={1} />
      {/* <color attach="background" args={["black"]} /> */}
      {/* <pointLight intensity={1} color={'#FFFFFF'} distance={100}/> */}
      {/* <directionalLight intensity={1} position={[20000,0,0]} /> */}
      {/* <directionalLight intensity={1} position={[0,20000,0]} />
      <directionalLight intensity={1} position={[0,0,20000]} />
      <directionalLight intensity={1} position={[-20000,0,0]} />
      <directionalLight intensity={1} position={[0,-20000,0]} />
      <directionalLight intensity={1} position={[0,0,-20000]} /> */}
      {/* <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, 10]} castShadow /> */}
      <Suspense fallback={null}>
        <Model/>
        {/* <mesh position={[0, -0.6, 0]}>
          <cylinderBufferGeometry attach="geometry" args={[7, 7, 0.1, 40]} />
          <meshNormalMaterial attach="material" />
        </mesh> */}
      </Suspense>
      <OrbitControls enableZoom={true} enablePan={true} enableRotate={true}/>
    </Canvas>
    )
};

export default TestCanvas
