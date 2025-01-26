import { StackOpener } from 'Controls/popup';
import { forwardRef, useRef, useCallback, RefObject } from 'react';
import { Button } from 'Controls/buttons';

function Index(props, ref) {
    const popupOpenerRef: RefObject<StackOpener> = useRef();

    const openStack = useCallback(() => {
        if (!popupOpenerRef.current) {
            popupOpenerRef.current = new StackOpener();
        }
        if (popupOpenerRef.current.isOpened()) {
            popupOpenerRef.current.open({
                template: 'Controls-demo/Popup/Stack/doc/LeftContentTemplate/Template',
                width: 600,
            });
            return;
        }
        popupOpenerRef.current.open({
            template: 'Controls-demo/Popup/Stack/doc/Template/Index',
            width: 500,
        });
    }, []);

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex tw-flex-col" style={{ width: '400px' }}>
                <Button caption="Открыть стековое окно" onClick={openStack} />
            </div>
        </div>
    );
}

export default forwardRef(Index);
