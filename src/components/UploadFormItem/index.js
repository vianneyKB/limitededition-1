import { PlusOutlined, LoadingOutlined, UploadOutlined } from "@ant-design/icons";
import { Modal, Upload, message } from "antd";
import React, { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import {REACT_APP_BASE_URL} from '../../utils/axiosConfig'
import './styles.css'

// reading files
const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => resolve(reader.result);

        reader.onerror = (error) => reject(error);
    });

// checking if file type is jpg or png and size
const beforeUpload = (file) => 
{
    // const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";

    // if (!isJpgOrPng) {
    //     message.error("You can only upload JPG/PNG file!");
    // }
    const isJpgOrPng = true;
    const isLt2M = file.size / 1024 / 1024 < 50;

    if (!isLt2M) {
        message.error("Image must smaller than 50MB!");
    }

    return isJpgOrPng && isLt2M;
};

// eslint-disable-next-line no-undef
const UploadFormItem = forwardRef((props, ref) => {
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState("");
    const [previewTitle, setPreviewTitle] = useState("");
    const [fileList, setFileList] = useState([]);

    useImperativeHandle(ref, () => ({
        getFileList: () => fileList.map(f => {
            return f.response ? f.response.data.Location : f.url
        }),
        clearFileList: () => {
            setFileList([])
            setPreviewImage('')
        }
    }));

    useEffect(() => {
        
        if(props.value){
            let list = []
            let value
            try {
                value = JSON.parse(props.value)
            } catch (error) {
                value = [props.value]
            }
            if(!Array.isArray(value)){
                list = [value]
            }
            else{
                list = value
            }
            setFileList(list.map(v => ({
                status: 'done',
                url: v
            })))
        }
    } ,[props])
    

    const handleCancel = () => setPreviewVisible(false);

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }

        setPreviewImage(file.url || file.preview);
        setPreviewVisible(true);
        setPreviewTitle(
            file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
        );
    };

    const handleChange = async (info, a, b) => {
        setFileList(info.fileList);

        console.log('info.fileList', info)

        if(props.onFileChange && info.fileList){
            let inComplete = false
            let _fileList = []
            for (const f of info.fileList) {
                if(f.status !== 'done'){
                    inComplete = true
                    break
                }

                _fileList.push(f.response ? { id: f.response.data?.id, url: f.response.data?.location} : f.url)
            }

            if(!inComplete){
                props.onFileChange(_fileList)
            }
        }
    };
    
// upload button 
    const uploadButton = (
        <div className="upload-button">
            <UploadOutlined className='upload-button-icon'/>
            <div className="upload-button-title">
                {props.title}
            </div>
            <div className="upload-button-content">
                {props.content}
            </div>
        </div>
    );
    return (
        <div className="form-upload-item">
            <Upload
                action={`${REACT_APP_BASE_URL}/api/uploadImg`}
                headers={{ 'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwZjA5YTJkNi01NGZjLTQxZWEtYTg3My04NzgyMjI4ZDMwMmMiLCJyb2xlIjoibm9uZSIsImlhdCI6MTY2MDM5MDc5NywiZXhwIjoxNjYyOTgyNzk3fQ.cgMwjAxQnzC_M7KyNB2rOwcqUr2lRkNi83yaBlslTVc' }}
                listType="picture-card"
                fileList={fileList}
                showUploadList={true}
                beforeUpload={beforeUpload}
                onPreview={handlePreview}
                onChange={handleChange}
                multiple={props.multiple}
                accept={props.accept ? props.accept : ''}
            >
                {(props.multiple || (!props.multiple && fileList.length === 0)) && uploadButton}
            </Upload>
            <Modal
                visible={previewVisible}
                title={previewTitle}
                footer={null}
                onCancel={handleCancel}
            >
                <img
                    alt="example"
                    style={{
                        width: "100%",
                    }}
                    src={previewImage}
                />
            </Modal>
        </div>
    );
})

export default UploadFormItem;
