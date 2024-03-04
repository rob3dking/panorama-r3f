import { useSnapshot } from "valtio";
import { store } from "../store"
import { Html } from "@react-three/drei";
import { useState } from "react";

export const PanoText = (props) => {
    const snap = useSnapshot(store);
    const [editState, setEditState] = useState(false);
    
    const onEditClick = () => {
        setEditState(!editState);
    }

    const onDeleteClick = (index) => {
        store.panoText.splice(index, 1);
        store.panoTextPosition.splice(index, 1);
    }

    const changePanoText = (value, index) => {
        store.panoText[index] = value;
    }
    return (
        <group>
            {  
                snap.panoTextPosition.length > 0 && 
                snap.panoTextPosition.map((textPosition, index) => {
                    return <group
                        key={"panoText" + index + Date.now()}
                        position={textPosition}
                    > 
                        <Html center>
                            <div className="item-hints" >
                                <div className="hint" data-position="4" >
                                    <p style={{position: 'absolute', marginBottom: '12vh', color: 'white', textAlign: 'center', width: '10vw'}}>
                                        {store.panoText[index]?store.panoText[index]:'comment here'}
                                    </p>
                                    <span className="hint-radius"></span>
                                    <span className="hint-dot"></span>
                                    <div className="hint-content do--split-children" style={{position: 'absolute', width: "auto", zIndex: '7'}}>
                                        <textarea 
                                            style={{ width: '10vw', marginBottom: 0}}
                                            defaultValue={store.panoText[index]?store.panoText[index]:'Comment here'} 
                                            onChange={(e) => changePanoText(e.target.value, index)}
                                            multiple
                                        />
                                        <br/>
                                        <span style={{display: 'flex', float: "right"}}>
                                            <button onClick={onEditClick}>OK</button>
                                            <button onClick={() => onDeleteClick(index)}>Delete</button>
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Html>
                    </group>
                })
            }
        </group>
        
    )
}