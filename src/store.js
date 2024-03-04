import {proxy} from 'valtio';

const store = proxy({
    currentState: 'explore',
    onBlur: false,
    hoverButton: false,
    setPanoText: false,
    panoTextPosition: [],
    panoText: [],

})

export {store}