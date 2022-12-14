import { useEffect, useState } from 'react';
import MaterialDetails from '../MaterialDetails/MaterialDetails';
import RSelect from '../RSelect/RSelect';
import { TextureLoader } from "three";
import { useLocation } from 'react-router-dom'
import './style.css';
import { useDispatch, useSelector } from "react-redux";
import { routeUrl } from '../../constants/constants';
import { getBackgroundUrl, getRarityList, getTempTextures, setBackgroundUrl, setSelectedMaterialName, setShowUploadDialog, setTempTexture } from '../../store/modelBrowserSlice';

const MaterialEditorPanel = ({ materials }) => {

  const location = useLocation();
  const dispatch = useDispatch();
  const [step, setStep] = useState(0);
  const tempTextures = useSelector(getTempTextures);
  const [openingKeys, setOpeningKeys] = useState([]);
  const rarityList = useSelector(getRarityList);
  const backgroundUrl = useSelector(getBackgroundUrl);
  const [materialsList, setMaterialsList] = useState({
    // Background: {
    //   name: 'Background',
    //   color: null,
    //   material: null,
    //   valueSelect: 'name'
    // },
    // Floor: {
    //   name: 'Floor',
    //   color: null,
    //   material: null,
    //   valueSelect: 'name'
    // },
    ...materials
  })

  useEffect(() => {
    setMaterialsList({ ...materials })
  }, [materials])

  useEffect(() => {
    if (location.pathname && location.pathname.toLowerCase().includes(routeUrl.CUSTOMIZE_MODEL.toLowerCase())) {
      setStep(1);
    }
    else {
      setStep(0);
    }
  }, [location.pathname])

  const updateValOfItem = (objName, key, val) => {
    setMaterialsList({
      ...materialsList,
      [objName]: {
        ...materialsList[objName],
        [key]: val
      }
    })

    if (materials[objName]) {
      materials[objName][key] = val;
    }
  }

  const onExpandEditor = (key) => {
    const isExist = !!openingKeys.find(item => item === key);
    if (isExist) {
      setOpeningKeys([]);
    }
    else {
      setOpeningKeys([key]);
    }
  }

  const openUploadDlg = (key) => {
    dispatch(setSelectedMaterialName(key))
    dispatch(setShowUploadDialog(true))
  }

  const onSelectTexture = (id, key) => {

    let url = null;

    if (id == -1) {
      const newData = {
        ...tempTextures,
        [key]: [...tempTextures[key]].map(item => {
          return {
            ...item,
            actived: false
          }
        })
      }

      if (key === 'Background') {
        dispatch(setBackgroundUrl(url));
      }


      if (url) {
        const loader = new TextureLoader()
        loader.setCrossOrigin("");
        const texture = loader.load(url);
        materials[key].map = texture
        materials[key].needsUpdate = true
      }
      else {
        materials[key].map = null
        materials[key].needsUpdate = true
      }

      dispatch(setTempTexture(newData));
    }
    else {
      const newData = {
        ...tempTextures,
        [key]: [...tempTextures[key]].map(item => {
          if (item.id === id) {
            url = item.url;
            return {
              ...item,
              actived: true
            }
          }

          return {
            ...item,
            actived: false
          }
        })
      }

      if (key === 'Background') {
        dispatch(setBackgroundUrl(url));
      }


      if (url) {
        const loader = new TextureLoader()
        loader.setCrossOrigin("");
        const texture = loader.load(url);
        materials[key].map = texture
        materials[key].needsUpdate = true
      }
      else {
        materials[key].map = null
        materials[key].needsUpdate = true
      }

      dispatch(setTempTexture(newData));
    }
  }

  const isOpening = (key) => {
    return !!openingKeys.find(item => item == key);
  }

  return (
    <div className="material-panel h-100 w-100">
      <header className='header__material-panel'>YOUR TEXTURES
        {
          step === 0 && <div className='preview-btn'>Preview</div>
        }
      </header>
      <main className='main__material-panel'>
        {
          step === 0 && <div className='scroll-class'>
            <div className='wrap-row-container'>
              {
                materialsList && Object.keys(materialsList).map((key, idx) => {
                  if (key === 'Background') {
                    if (backgroundUrl) {
                      return <div key={idx} className='center-box'><img style={{ background: 'white' }} className='box-test' src={backgroundUrl} alt='texture'></img></div>
                    }
                  }

                  if (materialsList[key].url) {
                    return <div key={idx} className='center-box'><img className='box-test' src={materialsList[key].url} alt='texture'></img></div>
                  }

                  return <div key={idx} className='center-box'><div className='box-test'></div></div>
                })
              }
            </div>
          </div>
        }
        {
          step === 1 && <ul className='parent-list'>
            {
              materialsList && Object.keys(materialsList).map((key, idx) => {

                const item = materialsList[key];
                let name = item.name;
                name = name.replace('Male', '')
                  .replace("M_Pants", '')
                  .replace("M_Jacket", '')
                  .replace("M_Jersey", '')
                  .replace("Fem_Diamond", '')
                  .replace("Fem_", '')
                  .replace("Hat_", '')
                  .replace("Pants_", '')
                  .replace("fem_", '')
                  .replace('Shoes_', '')
                  .replace('shoe_', '')
                  .replace('Shoe', '')
                  .replace('Weather_', '')
                  .replace('M_', '')
                  .replace('.001', '')
                  .replace('_', ' ')

                name = name.replace('_', ' ');

                const texture = tempTextures && tempTextures[key] ? tempTextures[key].find(item => item.actived) : null
                const rarity = texture ? rarityList.find(r => r.id === texture['rarityId']) : null;

                return <li key={idx} className='mb--30'>
                  <div className='d-flex align-center'>
                    {
                      texture && texture.url && <img style={{ background: 'white' }} className='box-test mr--30 cursor-pointer' src={texture.url} onClick={() => openUploadDlg(key)} alt='texture'></img>
                    }
                    {
                      (!texture || !texture.url) && <div className='box-test mr--30 cursor-pointer' onClick={() => openUploadDlg(key)}></div>
                    }
                    <div className={'type-btn mr--22' + ((isOpening(key)) ? ' actived' : '')} onClick={() => onExpandEditor(key)}>{name}</div>
                    <div className='name-texture__select'>
                      <RSelect
                        className='w-100'
                        options={tempTextures && tempTextures[key] ? [{
                          id: -1,
                          name: 'None'
                        }, ...tempTextures[key]] : [{
                          id: -1,
                          name: 'None'
                        }]}
                        value={texture ? texture.id : -1}
                        valueOptionName='id'
                        valueName='name'
                        onChange={(e) => onSelectTexture(e, key)}
                      ></RSelect>
                      {
                        rarity && <div className='p-h--11 rarity-name'>Rarity: {rarity.name}</div>
                      }
                    </div>
                  </div>
                  {
                    isOpening(key) && key !== 'Background' && <MaterialDetails item={item} onChangeColor={(val) => updateValOfItem(key, 'color', val)}></MaterialDetails>
                  }
                </li>
              })
            }
          </ul>
        }
      </main>
      {
        step != 0 && <footer className='d-flex justify-content-center h-0 w-100 footer-detail-panel'>
        
        <button className='submit-btn'>Submit</button>
        
      </footer>
      }
      
    </div>
  );
};

export default MaterialEditorPanel;
