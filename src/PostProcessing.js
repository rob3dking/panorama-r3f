import { useSnapshot } from "valtio"
import { Effects } from "./Effects"
import { store } from "./store"

export const PostProcessing = () => {
    const snap = useSnapshot(store);

    return (
        snap.onBlur? <Effects />:
        <></>

    )
}

