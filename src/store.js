import {proxy} from 'valtio';

const store = proxy({
    currentState: 'explore',
    onBlur: false,
    hoverButton: false,
    
    setBlurEffect: false,
    blurPositions: [],
    blurSize: [],
    blurDensity: [],
    blurRoughness: [],
    blurThickness: [],

    setPanoText: false,
    panoTextPosition: [],
    panoText: [],

})

export {store}