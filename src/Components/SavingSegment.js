import { useCallback, useMemo, useState } from 'react'
import M from 'materialize-css'

import Header from './Header'
import Loader from './Loader'
import '../styles/SavingSegment.css'

const SavingSegment = () =>{

    const [segmentName, setSegmentName] = useState('')

    const schemaObj = useMemo(()=>[
        { label: 'First Name', value: 'first_name', trait: 'user', selected: false },
        { label: 'Last Name', value: 'last_name', trait: 'user', selected: false },
        { label: 'Gender', value: 'gender', trait: 'user', selected: false },
        { label: 'Age', value: 'age', trait: 'user', selected: false },
        { label: 'Account Name', value: 'account_name', trait: 'group', selected: false },
        { label: 'City', value: 'city', trait: 'user', selected: false },
        { label: 'State', value: 'state', trait: 'user', selected: false }
    ],[]) 

    const [schema, setSchema] = useState(schemaObj)
    const [schemaValue, setSchemaValue] = useState({})
    const [schemaSelectCount, setSchemaSelectCount] = useState([1])

    const [showloading, setShowLoading] = useState(false)

    const clearForm = useCallback(()=> {
        setSchema(schemaObj)
        setSchemaValue({})
        setSchemaSelectCount([1])
        setSegmentName('')
        // eslint-disable-next-line 
    },[])

    const handleSelect = (e,index) =>{
        setSchemaValue((prevState)=>{
            prevState[index] = e.target.value
            return prevState
        })
        setSchema((prevState)=>(
            prevState.map((item)=>{
                if(item.value === e.target.value){ 
                    return { ...item, selected: true} 
                }
                else if(schemaValue[index] && schemaValue[index]===item.value && item.selected){
                    item.selected = false
                }
                return item
            })
        ))
    }

    const handleAddSchema = () =>{
        if(schemaSelectCount.length < 7){
            setSchemaSelectCount((prevState)=>(
                [...prevState, prevState[prevState.length-1]+1]
            ))
        }
    }

    const handleRemoveScheme = (index) =>{
        if(schemaSelectCount.length > 1){
            setSchemaSelectCount((prevState)=>prevState.slice(0,prevState.length-1))
            setSchemaValue((prevState)=>{
                prevState[index] = undefined
                return prevState
            })
            setSchema((prevState)=>(
                prevState.map((item)=>{
                    if(item.value === schemaValue[index]){
                        item.selected = false
                    }
                    return item
                })
            ))
        }
    }

    const handleSaveSegment = async (e) =>{
        M.Toast.dismissAll()
        e.preventDefault()
        const schemaValueKeys = Object.keys(schemaValue)
        if(segmentName===''){ 
            M.toast({html: 'Segment name cannot be empty!', classes: '#ff3d00 deep-orange accent-3'}) 
        }
        else if(schemaValueKeys.length!==0)
        {
            const data = {}
            data["segment_name"] = segmentName
            data["schema"] = []
            schemaValueKeys.forEach((idx)=>{
                schema.forEach((item)=>{
                    if(schemaValue[idx]===item.value){
                        const schm = {}
                        schm[item.value] = item.label
                        data["schema"].push(schm)
                    }
                })
            })
            setShowLoading(true)
            const res = await fetch('https://webhook.site/35f5712e-6470-4c7e-9948-dd6040710736',{
                method: "POST",
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            setShowLoading(false)
            if(res.status===200){
                M.toast({html: 'Data posted to server successfully!', classes: '#388e3c green darken-2'})
                clearForm()
            }
            else{
                M.toast({html: "Error posting data to server!", classes: '#ff3d00 deep-orange accent-3'})
            }
        }
        else{
            M.toast({html: 'Select a Schema before saving!', classes: '#ff3d00 deep-orange accent-3'})
        }
    }

    return(
        <div className="saving-segment">
            <Header title="Saving Segment" />
            {showloading && <Loader style={{top:57+'px'}} />}
            <form className="segment-form" onSubmit={(e)=>handleSaveSegment(e)}>
                <div className="segment-name">
                    <p> Enter the Name of the Segment </p>
                    <div className="input-div">
                        <input placeholder="Name of the Segment" id="segment-name"
                        value={segmentName} type="text" className="browser-default" 
                        onChange={e=>setSegmentName(e.target.value)}></input>
                    </div>
                    <p> To save your segment, you need to add the schemas to build the query </p>
                    <div className="schema-legends">
                        <div className="legend">
                            <p className="user-trait #ffc107 amber"> </p>
                            <small> - User Traits </small>
                        </div>
                        <div className="legend">
                            <p className="group-trait #4caf50 green"> </p>
                            <small> - Group Traits </small>
                        </div>
                    </div>
                </div>
                <div className="segment-schema">
                    <div className="schema-select">
                    {
                        schemaSelectCount.map((count,idx)=>(
                            <div className="select-row" key={count}>
                               <p className={schema.find((item)=>item.value===schemaValue[idx])?.trait==='user' ? ' #ffc107 amber':
                                schema.find((item)=>item.value===schemaValue[idx])?.trait==='group'? '#4caf50 green': ''}> 
                               </p>
                                <select value={schemaValue[idx] || 'Add schema to segment'}
                                    className="browser-default" onChange={(e)=>handleSelect(e,idx)}> 
                                        <option value='Add schema to segment' disabled> Add schema to segment </option>
                                        {
                                            schema.map((item)=>(
                                                <option value={item.value} key={item.value} hidden={item.selected?true:false}> 
                                                    {item.label} 
                                                </option>
                                            ))
                                        }
                                </select>
                                <i className="material-icons">keyboard_arrow_down</i>
                                <div className="remove-schema">
                                    <i className="material-icons" onClick={()=>handleRemoveScheme(idx)}
                                    style={schemaSelectCount.length===1?{color:'#999', cursor:'default'}:{}}>
                                        remove
                                    </i>
                                </div>
                            </div>
                        ))
                    }
                    </div>
                    {
                        schemaSelectCount.length < 7 && 
                        <p onClick={handleAddSchema}> 
                            + 
                            <span> Add new Schema </span> 
                        </p>
                    }
                    <div className="segment-btns">
                        <button type="submit" className="btn #1de9b6 teal accent-3"> Save the Segment </button>
                        <button type="button" className="btn sidenav-close #ffffff white" onClick={clearForm}> 
                        Cancel </button>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default SavingSegment

