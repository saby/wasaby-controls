import { DialogOpener } from 'Controls/popup';
import { forwardRef, useRef, useCallback, RefObject, useEffect } from 'react';
import { Button } from 'Controls/buttons';

function Index(props, ref) {
    const popupOpenerRef: RefObject<DialogOpener> = useRef();

    const openDialog = useCallback(() => {
        if (!popupOpenerRef.current) {
            popupOpenerRef.current = new DialogOpener();
        }
        popupOpenerRef.current.open({
            template: 'Controls-demo/Popup/Dialog/doc/Draggable/Template',
            width: 400,
            height: 200,
        });
    }, []);

    useEffect(() => {
        openDialog();
    }, [openDialog]);

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex tw-flex-col" style={{ width: '250px' }}>
                <Button caption="Открыть диалоговое окно" onClick={openDialog} />
            </div>
        </div>
    );
}

export default forwardRef(Index);
