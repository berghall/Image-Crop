import { types, applySnapshot } from "mobx-state-tree"

import crops from './crops.json'

const ImageSettings = types.model("ImageSetting", {
    name: types.string,
    width: types.integer,
    height: types.integer
})

const CropSettings = types.model("CropSettings", {
    x: types.maybe(types.number),
    y: types.maybe(types.number),
    width: types.maybe(types.number),
    height: types.maybe(types.number),
    aspect: types.number
})

const Store = types.model("Store", {
    settings: types.array(ImageSettings),
    inputFileName: types.string,
    src: types.string,
    fileName: types.string,
    organizationName: types.string,
    currentIdx: types.integer,
    width: types.integer,
    height: types.integer,
    crop: CropSettings
}).actions(self => ({
    setValuesByIndex(index) {
        const { width, height } = self.settings[index];
        
        self.currentIdx = parseInt(index)
        localStorage.setItem('currentIdx', index)
        
        self.width = width;
        self.height = height;
        localStorage.setItem('width', width)
        localStorage.setItem('height', height)
        applySnapshot(self.crop, {
            aspect: width / height
        })
    },
    setSource(value) {
        self.src = value
    },
    setInputFileName(text) {
        self.inputFileName = text
    },
    setFileName(text) {
        self.fileName = text
    },
    setOrgName(text) {
        self.organizationName = text.toUpperCase()
        localStorage.setItem('organizationName', text.toUpperCase())
    },
    setHeight(value) {
        self.height = parseInt(value)
        localStorage.setItem('height', parseInt(value))
    },
    setWidth(value) {
        self.width = parseInt(value)
        localStorage.setItem('width', parseInt(value))
    },
    setCrop(crop) {
        self.crop = crop
    }
}))

const store = Store.create({
    settings: crops,
    src: "",
    inputFileName: "",
    fileName: "",
    currentIdx: !localStorage.getItem('currentIdx') ? 0 : parseInt(localStorage.getItem('currentIdx')),
    organizationName: !localStorage.getItem('organizationName') ? "PEVIESTOS" : localStorage.getItem('organizationName'),
    width: !localStorage.getItem('width') ? crops[0].width : parseInt(localStorage.getItem('width')),
    height: !localStorage.getItem('height') ? crops[0].height : parseInt(localStorage.getItem('height')),
    crop: {
        aspect: crops[0].width / crops[0].height
    }
})

export default store