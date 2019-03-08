import React from 'react';
import ReactCrop from 'react-image-crop';
import download from 'downloadjs';
import 'react-image-crop/dist/ReactCrop.css';

import crops from '../crops.json';
import resizeImage from '../util/resizeImage';
import Button, { FileSelect } from '../components/Button';
import Input from '../components/Input';

class Index extends React.Component {
  constructor(props) {
    super(props);

    // Default values
    const width = crops[0].width;
    const height = crops[0].height;

    this.state = {
      src: null,
      fileName: '',
      organizationName: '',
      width,
      height,
      crop: {
        aspect: width / height
      }
    };

    this.onSelectFile = this.onSelectFile.bind(this);
    this.onImageLoaded = this.onImageLoaded.bind(this);
    this.onCropComplete = this.onCropComplete.bind(this);
    this.onCropChange = this.onCropChange.bind(this);
    this.makeClientCrop = this.makeClientCrop.bind(this);
    this.getCroppedImg = this.getCroppedImg.bind(this);
    this.selectCrop = this.selectCrop.bind(this);
    this.downloadImage = this.downloadImage.bind(this);
    this.onFileNameChange = this.onFileNameChange.bind(this);
    this.onOrganizationNameChange = this.onOrganizationNameChange.bind(this);
  }

  onSelectFile(e) {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener('load', () =>
        this.setState({ src: reader.result })
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

  onCropChange(crop) {
    this.setState({ crop });
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
    this.setState({
      crop: {
        aspect: width / height
      }
    });
    this.setState({ width, height })
  }

  selectCrop(e) {
    this.setCrop(crops[e.target.value].width, crops[e.target.value].height);
  }

  downloadImage() {
    const resizedImage = resizeImage(this.fileUrl, this.state.width, this.state.height);
    
    resizedImage.then(base64 => {
      download(base64, `${this.state.organizationName}_${this.state.fileName}_${this.state.width}x${this.state.height}.jpg`);
    });
  }

  onFileNameChange(e) {
    this.setState({
      fileName: e.target.value
    });
  }

  onOrganizationNameChange(e) {
    this.setState({
      organizationName: e.target.value.toUpperCase()
    });
  }

  render() {
    const { crop, croppedImageUrl, src, fileName, width, height, organizationName } = this.state;

    return (
      <div>
        <h1>Image Crop Tool</h1>
        <div className='buttons'>
          <FileSelect onChange={this.onSelectFile} />

          <select onChange={this.selectCrop} className='button'>
            {crops.map((crop, index) => (
              <option value={index} key={`${crop.name}${crop.width}${crop.height}`}>{`${crop.name} - ${crop.width} x ${crop.height}`}</option>
            ))}
          </select>
          
          <Input value={fileName} onChange={this.onFileNameChange}>Filename</Input>

          <Input type='number' value={width} onChange={(e) => this.setCrop(e.target.value, height)}>Width</Input>
          <Input type='number' value={height} onChange={(e) => this.setCrop(width, e.target.value)}>Height</Input>

          <Input value={organizationName} onChange={this.onOrganizationNameChange}>Organization name</Input>

          {croppedImageUrl && (
            <Button onClick={this.downloadImage}>Download image</Button>
          )}
        </div>

        {src && (
          <ReactCrop
            src={src}
            crop={crop}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
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

export default Index;
