import React from 'react';
import styled from 'styled-components'

import Input from './Input'
import store from '../store'

const SizeContainer = styled.div`
    background-color: #3499F0;
    display:inline-block;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 5px 6px;
    color: white;
    border-radius: 56px;
`

const RenderButton = styled.button`
    background-color: #3499F0;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 5px 6px;
    color: white;
    border-radius: 56px;
`

const RenderLabel = styled.label`
    background-color: #3499F0;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 5px 6px;
    color: white;
    border-radius: 56px;
`

const RenderSelect = styled.select`
    background-color: #3499F0;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 5px 6px;
    color: white;
    border-top-left-radius: 20px;
    border-top-right-radius: 20px;
`

const Button = ({ onClick, children, disabled }) => (
    <RenderButton onClick={onClick} className='button' disabled={disabled}>{children}</RenderButton>
);

const FileSelect = ({ onChange }) => (
    <>
        <RenderLabel htmlFor="files" className="button">Valitse tiedosto</RenderLabel>
        <input type='file' onChange={onChange} className='button' id="files" style={{ visibility: 'hidden', display: 'none' }}/>
    </>
);

const DropSelect = ({ onChange,  className, value }) => (
    <RenderSelect onChange={onChange} className={className} value={value}>
        {store.settings.map((crop, index) => (
            <option 
            value={index} 
            key={`${crop.name}${crop.width}${crop.height}`}>
                {`${crop.name} - ${crop.width} x ${crop.height}`}
            </option>
        ))}
    </RenderSelect>
)

const WidthHeightSelect = () => (
    <SizeContainer>
        <Input type='number' value={store.width} onChange={(e) => store.setWidth(e.target.value)}>Width</Input>
        <Input type='number' value={store.height} onChange={(e) => store.setHeight(e.target.value)}>Height</Input>
    </SizeContainer>
)

export default Button;
export { FileSelect, DropSelect, WidthHeightSelect };