const Input = ({ value, onChange, type='text', children }) => (
    <input type={type} value={value} onChange={onChange} placeholder={children} className='input' />
);
export default Input;
