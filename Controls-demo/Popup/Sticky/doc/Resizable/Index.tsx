import { StickyOpener } from 'Controls/popup';
import { forwardRef, useRef, useCallback, RefObject, useEffect } from 'react';
import { Button } from 'Controls/buttons';

function Index(props, ref) {
    const popupOpenerRef: RefObject<StickyOpener> = useRef();
    const targetRef: RefObject<HTMLElement> = useRef();

    const openSticky = useCallback(() => {
        if (!popupOpenerRef.current) {
            popupOpenerRef.current = new StickyOpener();
        }
        popupOpenerRef.current.open({
            template: 'Controls-demo/Popup/Sticky/doc/Template/Index',
            minHeight: 200,
            minWidth: 400,
            maxWidth: 700,
            maxHeight: 500,
            target: targetRef.current,
            templateOptions: {
                resizable: true,
            },
        });
    }, []);

    useEffect(() => {
        openSticky();
    }, [openSticky]);

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex tw-flex-col">
                <Button caption="Открыть прилипающее окно" ref={targetRef} onClick={openSticky} />
            </div>
        </div>
    );
}

export default forwardRef(Index);
