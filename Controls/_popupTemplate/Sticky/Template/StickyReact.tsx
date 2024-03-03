import Sticky from './Sticky';
import { useContext, forwardRef, useCallback } from 'react';
import { Context } from 'Controls/popup';
import { checkWasabyEvent } from 'UI/Events';

const CUSTOM_EVENTS = ['onClose'];

// Есть много мест, где прикладники завязались на on:close и стопают его, чтобы совершить свою логику
// Если в пропсы не придет коллбек onClose, работаем через контекст
function StickyReact(props, ref) {
    const context = useContext(Context);
    return (
        <Sticky
            {...props}
            ref={ref}
            onClose={useCallback(() => {
                if (props.onClose) {
                    if (checkWasabyEvent(props.onClose)) {
                        props.onClose();
                    }
                } else {
                    context?.close();
                }
            }, [])}
            customEvents={CUSTOM_EVENTS}
        />
    );
}

export default forwardRef(StickyReact);
