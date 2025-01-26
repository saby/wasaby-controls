import { StackOpener } from 'Controls/popup';
import { forwardRef, useRef, useCallback, RefObject } from 'react';
import { Button } from 'Controls/buttons';
import { Label } from 'Controls/input';

function Index(props, ref) {
    const popupOpenerRef: RefObject<StackOpener> = useRef();

    const openStack = useCallback(() => {
        if (!popupOpenerRef.current) {
            popupOpenerRef.current = new StackOpener();
        }
        popupOpenerRef.current.open({
            template: 'Controls-demo/Popup/Stack/doc/ContentTemplates/Template',
            width: 500,
        });
    }, []);

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex tw-flex-col" style={{ width: '400px' }}>
                <Label caption="Заданы опции bodyContentTemplate, headerContentTemplate" />
                <Label caption="и footerContentTemplate" />
                <Button caption="Открыть стековое окно" onClick={openStack} />
            </div>
        </div>
    );
}

export default forwardRef(Index);
