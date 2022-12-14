import { Input, Space, Col, Divider, Row } from 'antd';
import { useEffect, useState } from 'react';
import IconDown from '../assets/icon/sort-down-solid.png'
import RSelect from './RSelect/RSelect'
import { setSelectedModel, listWares, listCategories, getSelectedWare, setSelectedWare, setListWares } from "../store/modelBrowserSlice"
import { useDispatch, useSelector } from "react-redux";
import { getTypes, getAllModels } from '../services/libraryService'

const { Search } = Input;
const ModelBrowser = ({}) => {
    const dispatch = useDispatch()
    const listWare = useSelector(listWares)
    const listCategory = useSelector(listCategories)
    const selectedWare = useSelector(getSelectedWare);
    const [selectedCategory, setSelectedCategory] = useState(1);

    useEffect(() => {
        loadAllModels()
    }, [])

    const loadAllModels = () => {
        getAllModels().then(data => {
            console.log('getAllModels', data)
            dispatch(setListWares(data.data.filter(el => el.location && el['3dFile']).map(el => {
                return {
                    id: el.id,
                    modelUrl: el['3durl'],
                    imageUrl: el.location
                }
            })))
        })
    }

    useEffect(() => {
        if( listWare && listWare.length > 0){
            dispatch(setSelectedWare(listWare[0]))
            dispatch(setSelectedModel(listWare[0].modelUrl))
        }
    }, [listWare])

    const onSearch = (value) => {
        console.log('onSearch', value)
    }
    return (
        <aside className="model-browser h-100">
        <header className="model-browser-header pt-2">MODEL BROWSER</header>
        <main>
            <Search 
                placeholder="Search" 
                onSearch={onSearch} 
                className="pt-2 pr-2 model-browser-search"
            />
            <div className='mt-2 group-footware'>
                <RSelect 
                    className='ware-select'
                    options={listCategory} 
                    value={selectedCategory}  
                    onChange={(value) => setSelectedCategory(value)}
                />
            </div>
            <div className='mt-2 group-footware-image'>
                <Row gutter={[13, 13]} className="list-image" style={{ margin: 0 }}>
                    {listWare.map((el, idx) => {
                        return( <Col key={idx} className="gutter-row fit-row col-image">
                            <div>
                                <img alt=""
                                    src={el.imageUrl} 
                                    className={selectedWare?.id == el.id ? 'image-footware active' : 'image-footware'}
                                    onClick={() => {
                                        dispatch(setSelectedWare(el))
                                        dispatch(setSelectedModel(el.modelUrl))
                                    }}
                                ></img>
                            </div>
                        </Col>)
                    })}
                </Row>
                
            </div>
        </main>
        <footer>
        </footer>
      </aside>
    );
}

export default ModelBrowser