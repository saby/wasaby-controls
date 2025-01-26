import { StackOpener } from 'Controls/popup';
import { forwardRef, useRef, useCallback, RefObject } from 'react';
import { Button } from 'Controls/buttons';

function Index(props, ref) {
    const popupOpenerRef: RefObject<StackOpener> = useRef();

    const openStack = useCallback(() => {
        if (!popupOpenerRef.current) {
            popupOpenerRef.current = new StackOpener();
        }
        popupOpenerRef.current.open({
            template: 'Controls-demo/Popup/Stack/doc/ToolbarContentTemplate/Template',
            width: 500,
            maxWidth: 800,
            minWidth: 300,
            templateOptions: {
                maximizeButtonVisibility: true,
            },
        });
    }, []);

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex tw-flex-col" style={{ width: '500px' }}>
                <Button
                    caption="Открыть стековое окно с тулбаром и кнопкой изменения размеров"
                    onClick={openStack}
                />
            </div>
        </div>
    );
}

export default forwardRef(Index);
