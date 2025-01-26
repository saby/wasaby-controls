import { DialogOpener } from 'Controls/popup';
import { forwardRef, useRef, useCallback, RefObject } from 'react';
import { Button } from 'Controls/buttons';

function Index(props, ref) {
    const popupOpenerRef: RefObject<DialogOpener> = useRef();

    const openDialog = useCallback(() => {
        if (!popupOpenerRef.current) {
            popupOpenerRef.current = new DialogOpener();
        }
        popupOpenerRef.current.open({
            template: 'Controls-demo/Popup/Dialog/doc/Template/Index',
            restrictiveContainer: '.controlsDemo-Dialog__restrictiveContainer',
            width: 400,
            height: 200,
        });
    }, []);

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div
                className="tw-flex tw-flex-col controls-background-unaccented controlsDemo-Dialog__restrictiveContainer"
                style={{ width: '450px', height: '400px' }}
            >
                <Button
                    caption="Открыть диалоговое окно с ограничивающим контейнером"
                    onClick={openDialog}
                />
            </div>
        </div>
    );
}

export default forwardRef(Index);
