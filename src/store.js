import { types, applySnapshot } from "mobx-state-tree"

import crops from './crops.json'

const ImageSettings = types.model("ImageSetting", {
    name: types.string,
    width: types.integer,
    height: types.integer
})

const CropSettings = types
    .model("CropSettings", {
        x: types.maybe(types.number),
        y: types.maybe(types.number),
        width: types.maybe(types.number),
        height: types.maybe(types.number),
        aspect: types.number
    })

const Store = types.model("Store", {
    settings: types.array(ImageSettings),
    src: types.string,
    fileName: types.string,
    organizationName: types.string,
    width: types.integer,
    height: types.integer,
    crop: CropSettings
}).actions(self => ({
    setValuesByIndex(index) {
        const { width, height } = self.settings[index];

        self.width = width;
        self.height = height;

        applySnapshot(self.crop, {
            aspect: width / height
        })
    },
    setSource(value) {
        self.src = value
    },
    setFileName(text) {
        self.fileName = text
    },
    setOrgName(text) {
        self.organizationName = text.toUpperCase()
    },
    setHeight(value) {
        self.height = parseInt(value)
    },
    setWidth(value) {
        self.width = parseInt(value)
    },
    setCrop(crop) {
        self.crop = crop
    }
}))

const store = Store.create({
    settings: crops,
    src: "",
    fileName: "",
    organizationName: "",
    width: crops[0].width,
    height: crops[0].height,
    crop: {
        aspect: crops[0].width / crops[0].height
    }
})

export default store