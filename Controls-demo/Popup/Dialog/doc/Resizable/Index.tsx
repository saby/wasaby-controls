import { DialogOpener } from 'Controls/popup';
import { forwardRef, useRef, useCallback, RefObject, useEffect } from 'react';
import { Label } from 'Controls/input';
import { Button } from 'Controls/buttons';

function Index(props, ref) {
    const popupOpenerRef: RefObject<DialogOpener> = useRef();

    const openDialog = useCallback(() => {
        if (!popupOpenerRef.current) {
            popupOpenerRef.current = new DialogOpener();
        }
        popupOpenerRef.current.open({
            template: 'Controls-demo/Popup/Dialog/doc/Template/Index',
            width: 400,
            height: 200,
            minWidth: 200,
            maxWidth: 700,
            minHeight: 200,
            maxHeight: 700,
            // Обязательно убедитесь, что опция дойдет до шаблона Controls/popupTemplate:Dialog
            templateOptions: {
                resizable: true,
            },
        });
    }, []);

    useEffect(() => {
        openDialog();
    }, [openDialog]);

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex tw-flex-col" style={{ width: '250px' }}>
                <Label caption="Окно с возможностью" />
                <Label caption="изменить размер resizable=true" />
                <Button caption="Открыть диалоговое окно" onClick={openDialog} />
            </div>
        </div>
    );
}

export default forwardRef(Index);
