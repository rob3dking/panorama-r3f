import { useSnapshot } from "valtio"
import { store } from "../store"


export const UI = () => {
    const snap = useSnapshot(store);
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
        <div className="panoText">
            <button 
                onClick={onClickComment}
                onPointerEnter={() => onHoverButton(true)}
                onPointerLeave={() => onHoverButton(false)}
                disabled={store.setPanoText}
            >
                Add Comment
            </button>
        </div>
    </div>
}