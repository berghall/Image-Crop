import React from 'react';
import styled from 'styled-components'

const RenderInput = styled.input`
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.16) 0px 5px 6px;
    color: #3499F0;
    border: 4px solid #3499F0;
    border-radius: 56px;
`

const Input = ({ value, onChange, type='text', children }) => (
    <RenderInput type={type} value={value} onChange={onChange} placeholder={children} className="input"/>
);
export default Input;
