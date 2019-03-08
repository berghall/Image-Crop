import React from 'react';

const Button = ({ onClick, children, disabled }) => (
    <button onClick={onClick} className='button' disabled={disabled}>{children}</button>
);

const FileSelect = ({ onChange }) => (
    <input type='file' onChange={onChange} className='button' />
)

export default Button;
export { FileSelect };