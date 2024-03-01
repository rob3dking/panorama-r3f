import {proxy} from 'valtio';

const store = proxy({
    onBlur: false
})

export {store}