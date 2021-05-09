import '../styles/Loader.css'

const Loader = ({style}) =>{
    return( 
        <div className="progress loader" style={style}>
            <div className="indeterminate"></div>
        </div>
    )
}

export default Loader