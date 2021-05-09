import '../styles/Header.css'

const Header = ({title}) =>{
    return(   
        <nav>
            <div className="nav-wrapper nav #00bfa5 teal accent-4">
                <p> 
                    <i className="material-icons"> keyboard_arrow_left </i> 
                    {title} 
                </p>
            </div>
        </nav>
    )
}

export default Header