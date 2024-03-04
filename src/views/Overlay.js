import { useSnapshot } from "valtio"
import { store } from "../store"
import { useEffect } from "react";


export const UI = () => {
    const snap = useSnapshot(store);
    console.log(snap.setBlurEffect);
    const onClickBlur = () => {
        store.setBlurEffect = !store.setBlurEffect;
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

    const changeBlurSetting = (key, value) => {
        switch (key) {
            case 'size':
                store.blurSize[store.blurSize.length - 1] = value;
                break;
            case 'density':
                store.blurDensity[store.blurDensity.length - 1] = value;
                break;
            case 'roughness':
                store.blurRoughness[store.blurRoughness.length - 1] = value;
                break;
            case 'thickness':
                store.blurThickness[store.blurThickness.length - 1] = value;
                break;
            default:
                break;
        }
    }

    useEffect(() => {
        if (snap.setBlurEffect) {
            store.blurSize.push(200);
            store.blurDensity.push(0.8);
            store.blurRoughness.push(0.4);
            store.blurThickness.push(0.1);
        }
    }, [snap.setBlurEffect])
    return <div className="container">
        <div className="FaceBlur">
            <button 
                onClick={onClickBlur}
                onPointerEnter={() => onHoverButton(true)}
                onPointerLeave={() => onHoverButton(false)}
                disabled={snap.setBlurEffect}
            >
                Add Blur Effects
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
        {
            snap.setBlurEffect && 
            <div 
                className="blurEffectSetting" 
                onPointerEnter={() => onHoverButton(true)}
                onPointerLeave={() => onHoverButton(false)}
            >
                <h3>Blur Effect Setting</h3>
                <div>
                    <label className="blurEffectLabel">Blur Effect Size</label>
                    <input className="controlBlurEffect" type="range" max={400} min={100} step={10} defaultValue={200} onChange={(e) => changeBlurSetting('size', e.target.value)}/>
                </div>
                <div>
                    <label className="blurEffectLabel">Blur Density</label>
                    <input className="controlBlurEffect" type="range" max={1} min={0} step={0.1} defaultValue={0.8} onChange={(e) => changeBlurSetting('density', e.target.value)}/>
                </div>
                <div>
                    <label className="blurEffectLabel">Roughness</label>
                    <input className="controlBlurEffect" type="range" max={1} min={0} step={0.1} defaultValue={0.4} onChange={(e) => changeBlurSetting('roughness', e.target.value)}/>
                </div>
                <div>
                    <label className="blurEffectLabel">Thickness</label>
                    <input className="controlBlurEffect" type="range" max={1} min={0} step={0.1} defaultValue={0.1} onChange={(e) => changeBlurSetting('thickness', e.target.value)}/>
                </div>
            </div>
        }
    </div>
}