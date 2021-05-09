import { useRef } from 'react'
import useEventListener from 'react-event-handler-global'
import M from 'materialize-css'

import SavingSegment from '../Components/SavingSegment'
import '../styles/viewAudience.css'

const ViewAudience = () =>{

    const sidenavRef = useRef()

    useEventListener('DOMContentLoaded', ()=>{
        M.Sidenav.init(sidenavRef?.current,{
            edge: 'right',
            inDuration: 500,
            outDuration: 500
        })
    })

    return(
        <div className="view-audience">
            <div className="save-segment">
                <button className="btn sidenav-trigger #00acc1 cyan darken-1" 
                data-target="slide-out"> 
                    Save Segment 
                </button>
            </div>
            <div id="slide-out" className="sidenav" ref={sidenavRef}>
                <SavingSegment />
            </div>
        </div>
    )
}

export default ViewAudience