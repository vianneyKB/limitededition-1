import { Suspense, useState, useEffect } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import { ContactShadows, Environment, useGLTF, OrbitControls, Html, useProgress } from "@react-three/drei"
import MaterialEditorPanel from './MaterialEditorPanel/MaterialEditorPanel';
import ModelBrowser from "./ModelBrowser";
import {getBackgroundUrl, getSavedModels, getSelectedWare, getTempTextures, selectedModel, setBackgroundUrl, setCurrentModel, setSelectedWare, setTempTexture} from "../store/modelBrowserSlice"
import { useDispatch, useSelector } from "react-redux";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import {DRACOLoader} from 'three/examples/jsm/loaders/DRACOLoader'
import UploadTexture from "./UploadTexture/UploadTexture";
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { CubeTextureLoader, CylinderGeometry, MeshNormalMaterial, MeshStandardMaterial, Vector3, DoubleSide, TextureLoader } from "three";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { Spin } from "antd";
import { LoadingOutlined } from '@ant-design/icons';
import { throttle } from 'lodash-es';
const Model = ({model}) => {
  const { setSize } = useThree();
  useEffect(() => {
    window.addEventListener("resize", () => {
      resize();
    });
  }, [])

  const resize = () => {
    const container = document.getElementById("canvas-container");
    if(container){
      // setSize(container.clientWidth, container.clientHeight)
    }
    
  }

  if(!model){ return <Html style={{zIndex: 1, flexWrap: 'nowrap'}}>No selected</Html>}

  console.log('load xong roi', model)

  return <>
    <primitive object={model.scene} scale={model.url && (model.url.includes("Female_Hat") || model.url.includes("Female_Glasses")) ? 0.7 : 1}/>
    <Environment preset="city" />
    <ContactShadows position={[0, -0.8, 0]} opacity={0.25} scale={10} blur={1.5} far={0.8} />    
  </>
}

const SkyBox = ({url}) => {
  const { scene } = useThree();
  const cubeLoader = new CubeTextureLoader();
  useEffect(() => {
    if(url) {
      const texture = cubeLoader.load([url,url,url,url,url,url]);
      scene.background = texture;
    }
    else {
      scene.background = null;
    }
  }, [url])
  return null;
}

const ResetCamera = ({isCustomizeMode = false}) => {
  const { camera, gl } = useThree();
  const resizeUpdateInterval = 500;

  function setCanvasDimensions(
    canvas,
    width,
    height,
    set2dTransform = false
  ) {
    const ratio = window.devicePixelRatio;
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    if (set2dTransform) {
      canvas.getContext('2d').setTransform(ratio, 0, 0, ratio, 0, 0);
    }
  }

  const onWindowResize = () => {

    const el = document.getElementById('canvas-container');
      if(el) {
        camera.aspect = el.offsetWidth / el.offsetHeight;
        camera.updateProjectionMatrix();
        gl.setSize( el.offsetWidth, el.offsetHeight );
        setCanvasDimensions(gl.domElement, el.offsetWidth, el.offsetHeight);
      }
    }

  useEffect(() => {
    window.addEventListener( 'resize', () => throttle(onWindowResize, resizeUpdateInterval, { trailing: true }), false );

    return (() => {
      window.removeEventListener( 'resize', () => throttle(onWindowResize, resizeUpdateInterval, { trailing: true }), false );
    })
  }, [])

  useEffect(() => {
    if(!isCustomizeMode) {
      camera.position.set(0,0,10);
    }
  }, [isCustomizeMode])
  return null;
}

const FallbackCustom = ({onSuccess}) => {
  
  const { progress } = useProgress();
  console.log("progress ", progress)

  if(progress == 100) {
    onSuccess()
  }

  return <Html>
  <Spin indicator={
    <LoadingOutlined style={{ fontSize: 36 }} spin />
  } />
</Html>
}

const ModelViewer = ({isCustom = false}) => {
    const [isSuccessLoad, setIsSuccessLoad] = useState(true);
    const [isCustomizeMode, setIsCustomizeMode] = useState(false);
    const selectedWare = useSelector(getSelectedWare)
    const savedModels = useSelector(getSavedModels)
    const [model, setModel] = useState(null);
    const loaders = new GLTFLoader();
    const location = useLocation();
    const dispatch = useDispatch();
    const backgroundUrl = useSelector(getBackgroundUrl);
    const [isActionControls, setIsActionControl] = useState(true);

    useEffect(() => {
      setIsCustomizeMode(location.pathname.includes("customize-model"))
    }, [location.pathname])

    useEffect(() => {
      if(selectedWare) {
        dispatch(setSelectedWare({...selectedWare}))
      }
      setIsActionControl(isCustomizeMode);
    }, [isCustomizeMode])

    useEffect(() => {
      setModel(null)

      if(!selectedWare) return;

      const existItem = savedModels.find(item => item.id === selectedWare.id);

      if(existItem && existItem.textures) {
        dispatch(setTempTexture(existItem.textures));
      }
      else {
        dispatch(setTempTexture(null));
        dispatch(setBackgroundUrl(null));
      }

      loaders.load(selectedWare.modelUrl, (gltf) => {
        let data = Object.assign(gltf, buildGraph(gltf.scene));
        data.url = selectedWare.modelUrl;

        const background = new MeshStandardMaterial();
        background.name = 'Background';
        const floor = new MeshStandardMaterial();
        floor.name = 'Floor';
        data.materials = {
          Background: background,
          Floor: floor,
          ...data.materials
        }

        if(existItem && existItem.textures) {
          Object.keys(existItem.textures).forEach(key => {
            const activeTexture = existItem.textures[key].find(item => item.actived);
            if(activeTexture) {
              if(activeTexture.url) {
                const loader = new TextureLoader()
                loader.setCrossOrigin("");
                const texture = loader.load(activeTexture.url);
                data.materials[key].map = texture
                data.materials[key].needsUpdate = true
                data.materials[key].url = activeTexture.url;
              }
              else {
                data.materials[key].map = null
                data.materials[key].needsUpdate = true
                data.materials[key].url = null
              }
            }
            if(key === 'Background') {
              dispatch(setBackgroundUrl(activeTexture.url))
            }
          })

          if(!existItem.textures['Background'] || !existItem.textures['Background'].find(item => item.actived)) {
            dispatch(setBackgroundUrl(null))
          }
        }

        setModel(data)
      })
    }, [selectedWare])

    const buildGraph = (object) => {
      const data = { nodes: {}, materials: {} }
      if (object) {
        object.traverse((obj) => {
          if (obj.name) data.nodes[obj.name] = obj
          if (obj.material && !data.materials[obj.material.name]) data.materials[obj.material.name] = obj.material
        })
      }
      return data
    }
    
    const getFloorMap = () => {
      if(model && model.materials && model.materials.Floor) {
        return model.materials.Floor;
      }
      return new MeshStandardMaterial();
    }

  return (
    <Row className={"g-0 h-100 bg-w" + (isCustomizeMode ? " h-100": " plr-4 h-100")}>
    {!isCustomizeMode && <Col className="p-0" xl={3} sm={12}><ModelBrowser /></Col>}
    <Col className="p-0" xl={isCustomizeMode ? 8 :5} lg={12} sm={12}>
      <div className={(isCustomizeMode ? "canvas-column pl-0" : "canvas-column pt-3") + ' relative-parent h-100 w-100'}>
        {!isCustomizeMode && <div className="header-text-big">
          CASUAL HIGH TOP
        </div>}
        {!isCustomizeMode && <div className="pt-2 header-text-medium">
          Minimum Textures:
        </div>}
        <div
          className={isCustomizeMode ? "canvas-container" : "canvas-container mt-2"}
          id="canvas-container"
        >
          {isCustomizeMode && <Link to="/"><button className="btn-model-browser">Model Browser</button></Link>}
          <Canvas shadows camera={{ position: [0, 0, 10], fov: 80 }} className={"w-100"} style={{ minHeight: 300 }}>
            <ambientLight intensity={0.7} />
            <spotLight intensity={0.5} angle={0.1} penumbra={1} position={[10, 15, 10]} castShadow />
            {
              model && <Suspense fallback={
                <FallbackCustom onSuccess={() => setIsSuccessLoad(true)}/>
              }>
                <ResetCamera isCustomizeMode={isCustomizeMode} />
                <SkyBox url={backgroundUrl} />
                <Model model={model} />
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, -0.8, 0]} material={getFloorMap()}>
                  <boxBufferGeometry args={[20, 20, 0.1]} />
                </mesh>
              </Suspense>
            }
            {
              !model && <Html>
                <Spin indicator={
                  <LoadingOutlined style={{ fontSize: 36 }} spin />
                } />
              </Html>
            }
            
            <OrbitControls minPolarAngle={Math.PI / 2} maxPolarAngle={Math.PI / 2} enableZoom={false} enablePan={false} enableRotate={isActionControls} />
          </Canvas>
        </div>
        {!isCustomizeMode && <div className={"tl-r pt-2 pb-44 pr-2 " + (!isSuccessLoad ? 'no-action': '')}>
          <Link to="/customize-model"><button className="btn-custom-model cursor-pointer">Customize Model</button></Link>
        </div>}
        <UploadTexture materials={model ? model.materials : null}></UploadTexture>
      </div>
    </Col>
    <Col className={isCustomizeMode ? "plr-38 h-100" : "p-0 h-100"} xl={4} lg={12} sm={12}>
      <MaterialEditorPanel materials={model ? model.materials : null} />
    </Col>
  </Row>
  )
};

export default ModelViewer