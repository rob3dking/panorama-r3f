import { useSnapshot } from "valtio"
import { store } from "../store"


export const UI = () => {
    const snap = useSnapshot(store);
    const onClickBlur = () => {
        console.log('blur clicked')
    }

    const onClickComment = () => {
        let value = store.setPanoText;
        store.setPanoText = !store.setPanoText;
        if (value) store.currentState = 'explore';
        else store.currentState = 'add';
    }

    const onHoverButton = (value) => {
        store.hoverButton = value;
    }

    return <div className="container">
        <div className="FaceBlur">
            <button 
                onClick={onClickBlur}
                onPointerEnter={() => onHoverButton(true)}
                onPointerLeave={() => onHoverButton(false)}
            >
                Add Blur-Effect
            </button>
        </div>
        <div className="panoText">
            <button 
                onClick={onClickComment}
                onPointerEnter={() => onHoverButton(true)}
                onPointerLeave={() => onHoverButton(false)}
                disabled={snap.setPanoText}
            >
                Add Comment
            </button>
        </div>
    </div>
}