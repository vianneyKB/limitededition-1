import "./styles.css"
import { PlusCircleOutlined } from '@ant-design/icons'
import {Col, Row, Input, Select } from 'antd'
import RSelect from '../RSelect/RSelect'
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { listCategories, listWares, setListTypes, listTypes, listLibraryModels, setListLibraryModels } from "../../store/modelBrowserSlice"
import UploadFormItem from "../UploadFormItem";
import DownArrow from '../../assets/icons/down-arrow.png';
import { getTypes, postNewModel, getAllModels } from '../../services/libraryService'

const { Search } = Input;
const { Option } = Select;
const Library = ({}) => {
    const dispatch = useDispatch();
    const upModel = useRef();
    const upImage = useRef();
    const [selectedCategory, setSelectedCategory] = useState(1);
    const [selectedType, setSelectedType] = useState();
    const listCategory = useSelector(listCategories)
    const listWare = useSelector(listWares)
    const [previewImage, setPreviewImage] = useState({});
    const [modelUploadUrl, setModelUploadUrl] = useState();
    const [modelName, setModelName] = useState('');
    const [isPrivate, setIsPrivate] = useState(false)
    const listType = useSelector(listTypes)
    const listLibraryModel = useSelector(listLibraryModels)

    useEffect(() => {
        getTypes().then(data => {
            console.log('getTypes', data)
            dispatch(setListTypes(data.data))
        })
        loadAllModels()
    }, [])

    const loadAllModels = () => {
        getAllModels().then(data => {
            console.log('getTypes', data)
            dispatch(setListLibraryModels(data.data))
        })
    }

    const onSearch = (value) => {
        console.log('onSearch', value)
    }

    const onUploadChange = (e, name) => {
        console.log('onUploadChange', e)
        if(name == 'images'){
            if(e && e.length > 0){
                setPreviewImage(e[0])
            }
        } else if(name == 'model'){
            if(e && e.length > 0){
                setModelUploadUrl(e[0])
            }
        }

        try {

        } catch (error) {
            
        }
    }

    const onSubmit = () => {
        if(!modelUploadUrl || !modelUploadUrl.id){
            alert('Please upload model.')
            return
        }

        if(!modelName){
            alert('Please enter model name.')
            return
        }

        if(!selectedType){
            alert('Please choose model type.')
            return
        }

        if(!previewImage || !previewImage.id){
            alert('Please upload model.')
            return
        }

        const data = {
            "file3D": modelUploadUrl.id,
            "modelTypeId": selectedType,
            "previewImg": previewImage.id,
            "isPrivate": isPrivate,
            "name": modelName
        }

        postNewModel(data).then(res => {
            console.log('response', res)
            if(res?.status == "success"){
                alert('Upload success.')
                clearForm()
                loadAllModels()
            }
        }).catch(err => {
            alert('Upload fail success. Please try again!')
        })

    }

    const clearForm = () => {
        upImage.current.clearFileList();
        upModel.current.clearFileList();

        setModelName('')
        setSelectedType(null)
        setIsPrivate(false)
        setPreviewImage({})
        setModelUploadUrl({})
    }

    return (<div className="library-page container">
        <Row gutter={[{lg: 50, md: 30, sm: 13, xs: 13},13]}>
            <Col md={8} sm={24} xs={24}>
                <div className="header-text pt-2">
                    MY LIBRARY
                </div>
                <Search 
                    placeholder="Search" 
                    onSearch={onSearch} 
                    className="pt-2 pr-2 library-search"
                />
                <div className='mt-2 group-footware'>
                    <RSelect 
                        className='ware-select'
                        options={listType} 
                        valueOptionName='id'
                        value={selectedCategory}  
                        onChange={(value) => setSelectedCategory(value)}
                    />
                </div>
                <div className='mt-2 group-footware-image'>
                    <div className="list-image" style={{ margin: 0 }}>
                        {listLibraryModel.filter(o => o.location && o['3durl']).map((el, idx) => {
                            return( <div key={idx} className="gutter-row fit-row col-image">
                                <div>
                                    <img alt=""
                                        src={el.location} 
                                        className='image-footware'
                                        onClick={() => {

                                        }}
                                    ></img>
                                </div>
                            </div>)
                        })}
                    </div>
                </div>
                <div className="label-text mt-2">
                    Terms & Conditions
                </div>
            </Col>
            <Col md={7} sm={24} xs={24}>
                <div className="header-text pt-2">
                    UPLOAD NEW MODEL
                </div>
                <div className="mt-2">
                    <UploadFormItem ref={upModel} title='GLB / GLTF' accept='.glb,.gltf' content='All Models should be in GLB or GLTF format, drop your asset above or click to upload.' multiple={false} onFileChange={(e) => {onUploadChange(e, 'model')}}/>
                </div>
                <div className="mt-2">
                    <Input placeholder="Name" className="library-input" value={modelName} onChange={(e) => {setModelName(e.target.value)}}/>
                </div>
                <div className="mt-2">
                    <Select
                        showSearch
                        className="library-select"
                        placeholder="Type"
                        optionFilterProp="children"
                        filterOption={(input, option) => option.children.includes(input)}
                        filterSort={(optionA, optionB) =>
                            optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                        }
                        suffixIcon={<img src={DownArrow} alt='' style={{width: 20}}/>}
                        onChange={(value) => {setSelectedType(value)}}
                        value={selectedType}
                    >
                        {listType && listType.map(el => {
                            return (<Option value={el.id} key={el.id}>{el.name}</Option>)
                        })}
                        
                    </Select>
                </div>
                <div className="mt-2">
                    <UploadFormItem ref={upImage} title='Preview Image' accept='.png,.jpg' content='Drop your preview image in JPG or PNG format above or click to upload.' multiple={false} onFileChange={(e) => {onUploadChange(e, 'images')}}/>
                </div>
                <div className="mt-2 library-private">
                    <span className="label-text-big mr-2">Private</span>
                    <label className="switch">
                        <input type="checkbox" value={isPrivate} onChange={(value) => {setIsPrivate(value.target.checked)}}/>
                        <span className="slider round"></span>
                    </label>
                </div>
                <div className="mt-4 text-align-center">
                    <PlusCircleOutlined className="btn-reset" onClick={() => {clearForm()}}/>
                </div>
            </Col>
            <Col md={9} sm={24} xs={24}>
                <div className="header-text pt-2">
                    PREVIEW
                </div>
                <div className="mt-2 preview-container">
                    {previewImage.url && <img src={previewImage.url} alt='' className="library-preview-image"/>}
                    {!previewImage.url && <span className="preview-no-image">NO IMAGE</span>}
                </div>
                <button className="library-submit-button mt-2" onClick={() => {onSubmit()}}>Submit</button>
            </Col>
        </Row>
    </div>)
}
export default Library;