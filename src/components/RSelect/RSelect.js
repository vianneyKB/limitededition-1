import { Select } from 'antd';
import DownArrow from '../../assets/icons/down-arrow.png';
import WhiteDownArrow from '../../assets/icons/down-arrow-white.png';
import './style.css'

const { Option } = Select;
const RSelect = ({
        options=[],
        value,
        onChange,
        valueOptionName='value',
        valueName='name',
        className='',
        themes='light',
        minWidth=0,
        placeholder='Select...'
    }) => {

    return  <Select
    value={value}
    bordered={false}
    style={{ flexGrow: 1, minWidth: minWidth}}
    className={'name-select '+ className + (themes == 'light' ? '' : ' dark')}
    onChange={onChange}
    placeholder={placeholder}
    suffixIcon={
      <img className='down-arrow-icon' src={themes == 'light'? DownArrow : WhiteDownArrow} alt='down-arrow'/>
    }>
        {
            options && options.map((item, idx) => {
                return <Option key={item[valueOptionName]} value={item[valueOptionName]}>{ item[valueName] }</Option>
            })
        }
    </Select>
}

export default RSelect