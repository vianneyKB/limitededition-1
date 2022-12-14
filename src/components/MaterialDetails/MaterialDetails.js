import { Button } from 'antd';
import { useEffect, useState } from 'react';
import { SketchPicker } from 'react-color';
import RainbowColor from '../../assets/icons/rainbowcolor.png';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import './style.css';
import { setRotation } from '../../store/materialPanelSlice';
import { useDispatch } from 'react-redux';
import { Color, RepeatWrapping } from 'three';
// import { global } from '../../store'

const MaterialDetails = ({item, onChangeColor}) => {
    const dispatch = useDispatch()
    const [scale, setScale] = useState(0)
    const [rotate, setRotation] = useState(0)
    const [posX, setPosX] = useState(0)
    const [posY, setPosY] = useState(0)
    const [metallic, setMetallic] = useState(0)
    const [roughness, setRoughness] = useState(0)

    useEffect(() => {
        console.log(item)
        if(item && item.map){
            item.map.wrapS = item.map.wrapT = RepeatWrapping
            setScale(1 - item.map.repeat.x)
            setRotation(item.map.rotation)
            setPosX(item.map.offset.x)
            setPosX(item.map.offset.y)
        }

        if(item) {
            item.skinning = true;
            setMetallic(item.metalness)
            setRoughness(item.roughness)
        }
    }, [item])

    const [color, setColor] = useState(item.color? {
        r: item.color.r*255,
        g: item.color.g*255,
        b: item.color.b*255
    }: null);
    const [tempColor, setTempColor] = useState(item.color?{
        r: item.color.r*255,
        g: item.color.g*255,
        b: item.color.b*255
    }: null);
    const [isShowColorPicker, setIsShowColorPicker] = useState(false);

    const onShowColorPicker = () => {
        setIsShowColorPicker(!isShowColorPicker);
    }

    const onChangeComplete = (e) => {
        setTempColor(e);
        // onShowColorPicker();
    }

    const onFinishPickColor = () => {
        setColor(tempColor);
        const color = new Color();
        color.r = tempColor.r/255;
        color.g = tempColor.g/255;
        color.b = tempColor.b/255;
        color.isColor = true;
        item.color = color;
        // onChangeColor({r: tempColor.r/255, g: tempColor.g/255, b: tempColor.b/255});
        onShowColorPicker();
    }

    const onCancelPickColor = () => {
        setTempColor(color);
        onShowColorPicker();
    }

    const changeRotation = (e) => {
        setRotation(e.target.value)
        item.map.rotation = e.target.value
    }
    const changeScale = (e) => {
        setScale(e.target.value)
        item.map.repeat.set(1 - e.target.value, 1 - e.target.value)
        console.log('scale', 1 - e.target.value, 1 - e.target.value)
    }
    const changePositionX = (e) => {
        setPosX(e.target.value)
        item.map.offset.setX(e.target.value)
    }
    const changePositionY = (e) => {
        setPosY(e.target.value)
        item.map.offset.setY(e.target.value)
    }
    const changeMetallic = (e) => {
        setMetallic(e.target.value)
        item.metalness = +e.target.value
    }
    const changeRoughness = (e) => {
        setRoughness(e.target.value)
        item.roughness = +e.target.value
    }

    return <div className='material-details__container'>
        <div className='material-details__color mb--15'>
            <div className='title w-40'>Color</div>
            <div className='w-60 color-parent'>
                {
                    !tempColor && <img
                        className='color-picker__show'
                        src={RainbowColor}
                        alt='rainbow-color'
                        onClick={onShowColorPicker}/>
                }
                {
                    tempColor && <div
                        className='color-picker__show bold-border'
                        style={{ background: `rgb(${tempColor.r},${tempColor.g},${tempColor.b})`}}
                        onClick={onShowColorPicker}
                        ></div>
                }
                {
                    isShowColorPicker &&  <div className='material-details__color-picker'>
                        <SketchPicker
                            color={ tempColor ? tempColor : {r: 255, g: 255, b: 255}}
                            onChangeComplete={ (e) => onChangeComplete(e.rgb) }
                        />
                        <div className='control-container'>
                            <Button
                                className='mb--5'
                                size='small'
                                type="default"
                                icon={<CheckOutlined />}
                                onClick={onFinishPickColor}/>
                            <Button
                                size='small'
                                type="default"
                                icon={<CloseOutlined />}
                                onClick={onCancelPickColor}/>
                        </div>
                    </div>
                }
            </div>
        </div>
        {/* <div className='material-details__material mb--15'>
            <div className='title'>Material</div>
            <div className='d-flex mt--10'>
                <div className='material-btn mr--18'>Metal</div>
                <div className='material-btn mr--18 actived'>Cloth</div>
                <div className='material-btn'>Plastic</div>
            </div>
        </div> */}
        <div className='material-details__slider mb--15'>
            <div className='title w-40'>Pattern Scale</div>
            <div className='w-60'>
                <input className='slider__range-input' type="range" value={scale} min="0" max="0.8" step="0.05" onChange={changeScale}/>
            </div>
        </div>
        <div className='material-details__slider mb--15'>
            <div className='title w-40'>Pattern Position X</div>
            <div className='w-60'>
                <input className='slider__range-input' type="range" value={posX} min="0" max="1" step="0.05" onChange={changePositionX}/>
            </div>
        </div>
        <div className='material-details__slider mb--15'>
            <div className='title w-40'>Pattern Position Y</div>
            <div className='w-60'>
                <input className='slider__range-input' type="range" value={posY} min="0" max="1" step="0.05" onChange={changePositionY}/>
            </div>
        </div>
        <div className='material-details__slider mb--15'>
            <div className='title w-40'>Pattern Rotation</div>
            <div className='w-60'>
                <input className='slider__range-input' type="range" value={rotate} min="0" max="3.14" step="0.01" onChange={changeRotation}/>
            </div>
        </div>
        <div className='material-details__slider mb--15'>
            <div className='title w-40'>Metallic factor</div>
            <div className='w-60'>
                <input className='slider__range-input' type="range" value={metallic} min="0" max="1" step="0.05" onChange={changeMetallic}/>
            </div>
        </div>
        <div className='material-details__slider mb--15'>
            <div className='title w-40'>Roughness factor</div>
            <div className='w-60'>
                <input className='slider__range-input' type="range" value={roughness} min="0" max="1" step="0.05" onChange={changeRoughness}/>
            </div>
        </div>
    </div>
}

export default MaterialDetails