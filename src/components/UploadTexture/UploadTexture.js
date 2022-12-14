import { useEffect, useRef, useState } from 'react';
import RSelect from '../RSelect/RSelect';
import { useDispatch, useSelector } from "react-redux";
import './style.css';
import {
    getIsShowUploadDialog,
    getRarityList,
    getSelectedMaterialName,
    getTempTextures,
    setBackgroundUrl,
    setSelectedMaterialName,
    setShowUploadDialog,
    setTempTexture,
} from '../../store/modelBrowserSlice';
import { CloseOutlined } from '@ant-design/icons';
import { TextureLoader } from 'three';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const UploadTexture = ({materials}) => {

    const visible = useSelector(getIsShowUploadDialog);
    const dispatch = useDispatch();

    const [selectItem, setSelectItem] = useState(-1);
    const [idEditingItem, setIdEditingItem] = useState(null);
    const [materialOptions, setMaterialOptions] = useState([]);
    const selectedMaterial = useSelector(getSelectedMaterialName);
    const tempTextures = useSelector(getTempTextures);
    const rarityList = useSelector(getRarityList);
    const editTbRef = useRef();
    const [keyFileInput, setKeyFileInput] = useState(false);

    const onCancel = () => {
        dispatch(setShowUploadDialog(false))
    }

    const resizeUploadContainer = (e) => {
        const imgUploadContain = document.getElementById('img-upload__container');
        if(imgUploadContain) {
            imgUploadContain.setAttribute("style",`height:${imgUploadContain.offsetWidth + 'px'}`);
        }
    }

    const uuidv4 = () => {
        return ([1e7]+-1e3+-4e3+-8e3+-1e11).replace(/[018]/g, c =>
          (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
        );
      }
    
    const onInputFile = async (e) => {
        const file = e.target.files[0]
        let userImageURL = URL.createObjectURL(file);
        if(selectedMaterial && selectedMaterial === 'Background'){
            if(file.type.match(/image.*/)) {
                console.log('An image has been loaded');
        
                // Load the image
                var reader = new FileReader();
                reader.onload = function (readerEvent) {
                    var image = new Image();
                    image.onload = function (imageEvent) {
        
                        // Resize the image
                        var canvas = document.createElement('canvas'),
                            width = image.width,
                            height = image.height;
                        canvas.width = height > width ? width : height;
                        canvas.height = height > width ? width : height;
                        canvas.getContext('2d').drawImage(image, 0, 0, width, height);
                        var dataUrl = canvas.toDataURL('image/jpeg');
                        userImageURL = dataUrl;
                        const newData = JSON.parse(JSON.stringify(tempTextures[selectedMaterial])).map((item, idx) => {
                            if(idx === selectItem) {
                                item['url'] = userImageURL
                            }
                            return item;
                        });
                
                        const newTextures = {
                            ...tempTextures,
                            [selectedMaterial]: newData
                        }
                
                        setKeyFileInput(!keyFileInput);
                        dispatch(setTempTexture(newTextures));
                    }
                    image.src = readerEvent.target.result;
                }
                reader.readAsDataURL(file);
            }
        } else {
            const newData = JSON.parse(JSON.stringify(tempTextures[selectedMaterial])).map((item, idx) => {
                if(idx === selectItem) {
                    item['url'] = userImageURL
                }
                return item;
            });
    
            const newTextures = {
                ...tempTextures,
                [selectedMaterial]: newData
            }
    
            setKeyFileInput(!keyFileInput);
            dispatch(setTempTexture(newTextures));
        }
    }

    const onChangeMaterial = (val) => {
        dispatch(setSelectedMaterialName(val));
    }

    const addNewTexture = () => {

        if(!tempTextures || !tempTextures[selectedMaterial]) {
            const newTexture = {
                name: 'Name',
                rarityId: 1,
                url: null,
                actived: false,
                id: uuidv4()
            }
            dispatch(setTempTexture({
                ...tempTextures,
                [selectedMaterial]: [newTexture]
            }));
            setSelectItem(0)
        }
        else {

            if(tempTextures[selectedMaterial] && tempTextures[selectedMaterial].length === 10) return

            const newTexture = {
                name: 'Name',
                rarityId: 1,
                url: null,
                actived: false,
                id: uuidv4()
            }
            const newTextures = {
                ...tempTextures,
                [selectedMaterial]: [...tempTextures[selectedMaterial], newTexture]
            }
            setSelectItem(tempTextures[selectedMaterial].length)
            dispatch(setTempTexture(newTextures));
        }
    }

    const onSubmitTexture = () => {

        if(selectItem === -1) {
            materials[selectedMaterial].map = null
            materials[selectedMaterial].needsUpdate = true

            const newMaterial = JSON.parse(JSON.stringify(tempTextures[selectedMaterial])).map((item ,idx) => {
                return {
                    ...item,
                    actived: false
                }
            })
            const newTextures = {
                ...tempTextures,
                [selectedMaterial]: newMaterial
            }
            dispatch(setTempTexture(newTextures));
            onCancel();
            return
        }

        if(!tempTextures 
            || !tempTextures[selectedMaterial] 
            || !tempTextures[selectedMaterial][selectItem]
            || !tempTextures[selectedMaterial][selectItem].url)
            return ;
        
        let url = '';
        const newMaterial = JSON.parse(JSON.stringify(tempTextures[selectedMaterial])).map((item ,idx) => {
            if(idx === selectItem) {
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
        const newTextures = {
            ...tempTextures,
            [selectedMaterial]: newMaterial
        }

        if(selectedMaterial === 'Background') {
            dispatch(setBackgroundUrl(url));
        }

        if(url) {
            const loader = new TextureLoader()
            loader.setCrossOrigin("");
            const texture = loader.load(url);
            materials[selectedMaterial].map = texture
            materials[selectedMaterial].needsUpdate = true
        }

        dispatch(setTempTexture(newTextures));

        onCancel()
    }

    const onChangeItemData = (val, key, oldItem) => {
        const newData = JSON.parse(JSON.stringify(tempTextures[selectedMaterial])).map((item, idx) => {
            if(item.id === oldItem.id) {
                item[key] = val
            }
            return item;
        });

        const newTextures = {
            ...tempTextures,
            [selectedMaterial]: newData
        }
        dispatch(setTempTexture(newTextures));
    }

    const onOpenEditName = (id) => {
        setIdEditingItem(id);
        setTimeout(() => {
            if(editTbRef.current) {
                editTbRef.current.focus();
            }
        }, 100);
    }

    const onKeyDownEditingTb = (e, item) => {
        if(e.key === "Enter" || e.keyCode === 13) {
            onChangeItemData(editTbRef.current.value.trim(), 'name', item);
            setIdEditingItem(null);
        }
    }

    const onBlurEditText = (item) => {
        onChangeItemData(editTbRef.current.value.trim(), 'name', item);
        setIdEditingItem(null);
    }

    const onCancelEditName = (e) => {
        if(e.key === "Escape" || e.keyCode === 27) {
            setIdEditingItem(null);
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", onCancelEditName)
        return (() => {
            window.removeEventListener("keydown", onCancelEditName)
        })
    }, [])

    useEffect(() => {
        if(!tempTextures || !tempTextures[selectedMaterial]) {
            setSelectItem(-1);
        }
        else {
            const index = tempTextures[selectedMaterial].findIndex(item => item.actived);
            setSelectItem(index);
        }
    }, [selectedMaterial])

    useEffect(() => {
        if(materials) {
            setMaterialOptions(Object.keys(materials).map((key, idx) => {

                const item = materials[key];
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
    
                name = name.replace('_', ' ')
                return {
                    name,
                    value: key
                }
            }))
        }
    }, [materials])

    useEffect(() => {
        if(visible) {
            setTimeout(() => {
                const imgUploadContain = document.getElementById('img-upload__container');
                if(imgUploadContain) {
                    imgUploadContain.setAttribute("style",`height:${imgUploadContain.offsetWidth + 'px'}`);
                }
                window.addEventListener('resize', resizeUploadContainer);
            }, 200);
        }
        else {
            window.removeEventListener('resize', resizeUploadContainer);
        }
        return (() => {
             window.removeEventListener('resize', resizeUploadContainer);
        })
    }, [visible])

    if(!visible) {
        return;
    }

    return <div className='upload-texture__modal' onClick={onCancel}>
        <div className='upload-texture__modal-container relative-parent' onClick={(e) => e.stopPropagation()}>
            <div className='close-btn' onClick={onCancel}>
                <CloseOutlined />
            </div>
            <div className='upload-texture__title'>UPLOAD YOUR TEXTURE</div>
            <Row className='main-scrollbar' style={{ overflowY: 'scroll', flexGrow: 1 }}>
                <Col sm={12}>
                <div className='upload-texture__instruction'>
                    <p>Your image should be minimum of 1080x1080</p>
                    <p>All images should be square</p>
                    <p>If you upload an item that is not a square - you can select where to crop it when uploading</p>
                    <p>You can upload up to 10 items per category.</p>
                </div>
                </Col>
                <Col sm={12}>
                <div className='upload-texture__select-material'>
                    <RSelect
                    className='custom-select__materials'
                    valueName='name'
                    valueOptionName='value'
                    options={materialOptions}
                    themes='dark'
                    minWidth={188}
                    value={selectedMaterial}
                    onChange={onChangeMaterial}
                    placeholder='select...'
                    ></RSelect>
                </div>
                </Col>
                <Col sm={12} lg={4} style={{ marginBottom: 17 }}>
                <div className='main-body__container' id='img-upload__container'>
                    <label htmlFor="myfile" style={{ height: '100%', width: '100%' }} onClick={(e) => {
                        if(selectItem == null || selectItem == -1) e.preventDefault();
                    }}>
                        <div className='img-square'>
                            {
                                tempTextures && tempTextures[selectedMaterial] && tempTextures[selectedMaterial][selectItem] && tempTextures[selectedMaterial][selectItem].url ?<img 
                                src={tempTextures[selectedMaterial][selectItem].url} 
                                alt='test-img' className='img-full-box'/> : <div style={{ height: '100%', width: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>No Image</div>
                            }
                        </div>
                    </label>
                    </div>
                    <input type="file" key={keyFileInput} id="myfile" name="myfile" hidden accept="image/png, image/gif, image/jpeg" onInput={onInputFile}></input>
                </Col>
                <Col sm={12} lg={8}>
                <div className='option-materials__container'>
                        <div className='option-materials__list'>
                            <div className='option-materials__list-container'>
                                <div className='option-materials__flex'>
                                <div className='wrap-box'>
                                    <div className={'item-texture '+ (selectItem === -1 ? 'selected-item': '')}>
                                        <div className='add-texture__btn mb--13' onClick={() => setSelectItem(-1)}>None</div>
                                    </div>
                                    </div>
                                    {
                                        tempTextures && tempTextures[selectedMaterial] && tempTextures[selectedMaterial].map((item, idx) => <div className='wrap-box' key={idx}><div className={'item-texture ' + (selectItem === idx ? 'selected-item' : '')}>
                                            <div className='add-texture__btn mb--13' onClick={() => setSelectItem(idx)}>{idx + 1}</div>
                                            {
                                                idEditingItem !== item.id && <div className='add-texture__name' onDoubleClick={() => onOpenEditName(item.id)}>{item.name}</div>
                                            }
                                            {
                                                idEditingItem === item.id && <div className='add-texture__name'>
                                                    <input 
                                                        ref={editTbRef} 
                                                        className='edit-tb__upload-modal' 
                                                        type={'text'} 
                                                        defaultValue={item.name} 
                                                        onBlur={() => onBlurEditText(item)}
                                                        onKeyDown={(e) => onKeyDownEditingTb(e, item)}/>
                                                </div>
                                            }
                                            <RSelect
                                            minWidth={100}
                                            className='custom-select'
                                            placeholder='Select...'
                                            value={item['rarityId']}
                                            options={rarityList}
                                            valueName='name'
                                            valueOptionName='id'
                                            onChange={(e) => onChangeItemData(e, 'rarityId',item)}></RSelect>
                                        </div>
                                        </div>)
                                    }
                                    {
                                        (!tempTextures || !tempTextures[selectedMaterial] || (tempTextures[selectedMaterial] && tempTextures[selectedMaterial].length < 10)) && <div className='wrap-box'> <div className={'item-texture'}>
                                            <div className='add-texture__btn mb--13' onClick={addNewTexture}>+</div>
                                        </div>
                                        </div>
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <div className='option-materials__footer'>
                <div className='option-materials__submit-btn cursor-pointer' onClick={onSubmitTexture}>Submit Category Textures</div>
            </div>
        </div>
    </div>
}

export default UploadTexture