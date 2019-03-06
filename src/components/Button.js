const Button = ({ onClick, children }) => (
    <button onClick={onClick} className='button'>{children}</button>
);

const FileSelect = ({ onChange }) => (
    <input type='file' onChange={onChange} className='button' />
)

export default Button;
export { FileSelect };