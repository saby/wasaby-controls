import { Button } from 'Controls/buttons';
import { useRef, forwardRef } from 'react';
import { Opener } from 'Controls/popup';
import { ContextProvider as PageContextProvider } from './resources/Context';

export default forwardRef(function Demo(props, ref) {
    const popupRef = useRef();

    const openPortal = () => {
        popupRef.current.open({});
    };

    return (
        <div ref={ref}>
            <PageContextProvider>
                <Opener
                    width={400}
                    ref={popupRef}
                    contentComponent={'Controls-demo/Popup/Opener/Portal/Template'}
                />
                <Button caption="Открыть портал" onClick={openPortal} />
            </PageContextProvider>
        </div>
    );
});
