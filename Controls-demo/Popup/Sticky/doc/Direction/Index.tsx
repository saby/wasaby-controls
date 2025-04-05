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
            width: 400,
            height: 200,
            target: targetRef.current,
            direction: {
                horizontal: 'left',
                vertical: 'top',
            },
            targetPoint: {
                horizontal: 'right',
                vertical: 'bottom',
            },
        });
    }, []);

    useEffect(() => {
        openSticky();
    }, [openSticky]);

    return (
        <div className="tw-flex tw-justify-center" style={{ marginTop: '300px' }} ref={ref}>
            <div className="tw-flex tw-flex-col">
                <Button caption="Открыть прилипающее окно" ref={targetRef} onClick={openSticky} />
            </div>
        </div>
    );
}

export default forwardRef(Index);
