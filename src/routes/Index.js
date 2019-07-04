import React from 'react';
import ReactCrop from 'react-image-crop';
import download from 'downloadjs';
import 'react-image-crop/dist/ReactCrop.css';
import { observer } from 'mobx-react'
import { toJS } from 'mobx';

import store from '../store'
import resizeImage from '../util/resizeImage';
import Button, { FileSelect, DropSelect } from '../components/Button';
import { SizeContainer } from '../components/Container'
import Input from '../components/Input';

class Index extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      croppedImageUrl: null
    }

    this.onSelectFile = this.onSelectFile.bind(this);
    this.onImageLoaded = this.onImageLoaded.bind(this);
    this.onCropComplete = this.onCropComplete.bind(this);
    this.makeClientCrop = this.makeClientCrop.bind(this);
    this.getCroppedImg = this.getCroppedImg.bind(this);
    this.selectCrop = this.selectCrop.bind(this);
    this.downloadImage = this.downloadImage.bind(this);
  }

  onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        store.setSource(reader.result),
        store.setInputFileName(e.target.files[0].name)
      );
      reader.readAsDataURL(e.target.files[0]);
    }
  }

  onImageLoaded(image) {
    this.imageRef = image;
  }

  onCropComplete(crop, pixelCrop) {
    this.makeClientCrop(crop, pixelCrop);
  }

  async makeClientCrop(crop, pixelCrop) {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.getCroppedImg(
        this.imageRef,
        pixelCrop,
        'newFile.jpeg'
      );
      this.setState({ croppedImageUrl });
    }
  }

  getCroppedImg(image, pixelCrop, fileName) {
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    ctx.drawImage(
      image,
      pixelCrop.x,
      pixelCrop.y,
      pixelCrop.width,
      pixelCrop.height,
      0,
      0,
      pixelCrop.width,
      pixelCrop.height
    );

    return new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        blob.name = fileName;
        window.URL.revokeObjectURL(this.fileUrl);
        this.fileUrl = window.URL.createObjectURL(blob);
        resolve(this.fileUrl);
      }, 'image/jpeg');
    });
  }

  setCrop(width, height) {
    store.setCrop({
      crop: {
        aspect: width / height
      }
    });
    this.setState({ width, height })
  }

  selectCrop(e) {
    store.setValuesByIndex(e.target.value);
  }

  downloadImage() {
    const resizedImage = resizeImage(this.fileUrl, store.width, store.height);
    
    resizedImage.then(base64 => {
      download(base64, `${store.organizationName}_${store.fileName}_${store.width}x${store.height}.jpg`);
    });
  }

  render() {
    const { croppedImageUrl } = this.state;

    return (
      <div>
        <div className='buttons'>
          <h1>Rajaustyökalu M19</h1>
          
          <FileSelect onChange={this.onSelectFile} />

          <DropSelect onChange={this.selectCrop} className='button' value={store.currentIdx}/>
          
          <SizeContainer>
            <Input type='number' value={store.width} onChange={(e) => store.setWidth(e.target.value)}>Width</Input>
            <Input type='number' value={store.height} onChange={(e) => store.setHeight(e.target.value)}>Height</Input>
          </SizeContainer>

          <Input value={store.fileName} onChange={(e) => store.setFileName(e.target.value)}>Filename</Input>

          <Input value={store.organizationName} onChange={(e) => store.setOrgName(e.target.value)}>Organization name</Input>

          {croppedImageUrl && (
            <Button disabled={ (store.organizationName && store.fileName) == "" } onClick={this.downloadImage}>Download image</Button>
          )}
        </div>

        {store.src && (
          <ReactCrop
            src={store.src}
            crop={toJS(store.crop)}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={(crop) => store.setCrop(crop)}
          />
        )}
        {croppedImageUrl && (
          <img
            alt='Crop'
            style={{ maxWidth: '100%' }}
            src={croppedImageUrl}
          />
        )}
      </div>
    );
  }
}

export default observer(Index);
