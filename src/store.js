import {proxy} from 'valtio';

const store = proxy({
    currentState: 'explore',
    onBlur: false,
    hoverButton: false,
    setBlurEffect: false,
    blurPositions: [],
    setPanoText: false,
    panoTextPosition: [],
    panoText: [],

})

export {store}