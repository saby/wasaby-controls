import { DialogOpener } from 'Controls/popup';
import { forwardRef, useRef, useCallback, RefObject } from 'react';
import { Button } from 'Controls/buttons';

function Index(props, ref) {
    const popupOpenerRef: RefObject<DialogOpener> = useRef();
    const targetRef: RefObject<HTMLElement> = useRef();

    const openDialog = useCallback(() => {
        if (!popupOpenerRef.current) {
            popupOpenerRef.current = new DialogOpener();
        }
        popupOpenerRef.current.open({
            template: 'Controls-demo/Popup/Dialog/doc/Template/Index',
            target: targetRef.current,
            width: 400,
            height: 200,
        });
    }, []);

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex tw-flex-col" style={{ width: '300px' }}>
                <Button
                    ref={targetRef}
                    caption="Открыть диалоговое окно с таргетом"
                    onClick={openDialog}
                />
            </div>
        </div>
    );
}

export default forwardRef(Index);
