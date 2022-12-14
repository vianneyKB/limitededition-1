import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { getModels } from '../services/modelBrowserService';

const initialState = {
  models: [],
  selectedModel: '',
  status: 'idle',
  selectedWare: null,
  listWares: [
    {
        id: 1,
        modelUrl: 'Male_shoes.glb',
        imageUrl: 'Male_shoes.png'
    },
    {
        id: 2,
        modelUrl: 'Male_glasses.glb',
        imageUrl: 'Male_glasses.png'
    },
    {
        id: 3,
        modelUrl: 'Male_Hat.glb',
        imageUrl: 'Male_Hat.png'
    },
    {
        id: 4,
        modelUrl: 'Male_Hoodie.glb',
        imageUrl: 'Male_Hoodie.png'
    },
    {
        id: 5,
        modelUrl: 'Male_Jersey.glb',
        imageUrl: 'Male_Jersey.png'
    },
    {
        id: 6,
        modelUrl: 'Male_Pants.glb',
        imageUrl: 'Male_Pants.png'
    },
    {
        id: 7,
        modelUrl: 'Female_Glasses.glb',
        imageUrl: 'Female_Glasses.png'
    },
    {
        id: 8,
        modelUrl: 'Female_Hat.glb',
        imageUrl: 'Female_Hat.png'
    },
    {
        id: 9,
        modelUrl: 'Female_Pants.glb',
        imageUrl: 'Female_Pants.png'
    },
    {
        id: 10,
        modelUrl: 'Female_Shirt.glb',
        imageUrl: 'Female_Shirt.png'
    },
    {
        id: 11,
        modelUrl: 'Female_Shoes.glb',
        imageUrl: 'Female_Shoes.png'
    },
    {
        id: 12,
        modelUrl: 'Female_Weather_Jacket.glb',
        imageUrl: 'Female_Weather_Jacket.png'
    }
  ],
  listCategories: [
    {
      value: 1,
      name: "FOOTWARE",
    },
    {
        value: 2,
        name: "HEADWARE",
    }
  ],
  isShowUploadDialog: false,
  selectedMaterialName: null,
  tempTextures: null,
  tempTextureUrl: null,
  rarityList: [
    {
      id: 1,
      name: 'Common'
    },
    {
      id: 2,
      name: 'Rare'
    },
    {
      id: 3,
      name: 'Mythical'
    },
    {
      id: 4,
      name: 'Legendary'
    }
  ],
  backgroundUrl: null,
  savedModels: [],
  listType: [],
  listLibraryModels: []
};


export const getModelsAsync = createAsyncThunk(
  'modelBrowser/getModels',
  async () => {
    const response = await getModels();
    return response.data;
  }
);

export const modelBrowserSlice = createSlice({
  name: 'modelBrowser',
  initialState,
  reducers: {
    setSelectedModel: (state, action) => {
      state.selectedModel = action.payload;
    },
    setListWares: (state, action) => {
      state.listWares = action.payload;
    },
    setListTypes: (state, action) => {
      state.listType = action.payload;
    },
    setListLibraryModels: (state, action) => {
      state.listLibraryModels = action.payload;
    },
    setListCategories: (state, action) => {
      state.listCategories = action.payload;
    },
    setSelectedWare: (state, action) => {
      if(state.selectedWare) {
        const existItem = state.savedModels.find(item => item.id === state.selectedWare.id);
        if(existItem) {
          state.savedModels = state.savedModels.map(item => {
            if(item.id === state.selectedWare.id) {
              return {
                ...item,
                textures: state.tempTextures ? {...state.tempTextures} : null
              }
            }
            return item;
          })
        }
        else {
          state.savedModels = [...state.savedModels, {
            id: state.selectedWare.id,
            textures: state.tempTextures ? {...state.tempTextures} : null
          }]
        }
      }

      state.selectedWare = action.payload;
    },
    setShowUploadDialog: (state, action) => {
      state.isShowUploadDialog = action.payload;
    },
    setSelectedMaterialName: (state, action) => {
      state.selectedMaterialName = action.payload;
    },
    setTempTexture: (state, action) => {
      state.tempTextures = action.payload;
    },
    setTempTextureUrl: (state, action) => {
      state.tempTextureUrl = action.payload;
    },
    setBackgroundUrl: (state, action) => {
      state.backgroundUrl = action.payload;
    },
    setSavedModels: (state, action) => {
      const existItem = state.savedModels.find(item => item.id === action.payload.id);
      if(!existItem) {
        state.savedModels = [...state.savedModels, action.payload]
      }
      else {
        state.savedModels = state.savedModels.map(item => {
          if(item.id === action.payload.id) {
            return action.payload
          }
          return item;
        })
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getModelsAsync.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getModelsAsync.fulfilled, (state, action) => {
        state.status = 'idle';
        state.models = action.payload;
      });
  }
});

export const {
  setSelectedModel,
  setlistWares,
  setListCategories,
  setSelectedWare,
  setShowUploadDialog,
  setSelectedMaterialName,
  setTempTexture,
  setTempTextureUrl,
  setBackgroundUrl,
  setSavedModels,
  setListTypes,
  setListLibraryModels,
  setListWares
} = modelBrowserSlice.actions;
export const selectModels = (state) => state.modelBrowser.models;
export const selectedModel = (state) => state.modelBrowser.selectedModel;
export const listWares = (state) => state.modelBrowser.listWares;
export const listTypes = (state) => state.modelBrowser.listType;
export const listLibraryModels = (state) => state.modelBrowser.listLibraryModels;
export const listCategories = (state) => state.modelBrowser.listCategories;
export const getSelectedWare = (state) => state.modelBrowser.selectedWare;
export const getIsShowUploadDialog = (state) => state.modelBrowser.isShowUploadDialog;
export const getSelectedMaterialName = (state) => state.modelBrowser.selectedMaterialName;
export const getTempTextures = (state) => state.modelBrowser.tempTextures;
export const getTempTextureUrl = (state) => state.modelBrowser.tempTextureUrl;
export const getRarityList = (state) => state.modelBrowser.rarityList;
export const getBackgroundUrl = (state) => state.modelBrowser.backgroundUrl;
export const getSavedModels = (state) => state.modelBrowser.savedModels;


export default modelBrowserSlice.reducer;
