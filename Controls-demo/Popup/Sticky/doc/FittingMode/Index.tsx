import { StickyOpener } from 'Controls/popup';
import { forwardRef, useRef, useCallback, RefObject, useEffect } from 'react';
import { Button } from 'Controls/buttons';

function Index(props, ref) {
    const popupOpenerRef: RefObject<StickyOpener> = useRef();
    const targetRefOverflow: RefObject<HTMLElement> = useRef();
    const targetRefAdaptive: RefObject<HTMLElement> = useRef();

    const openStickyOverflow = useCallback(() => {
        if (!popupOpenerRef.current) {
            popupOpenerRef.current = new StickyOpener();
        }
        popupOpenerRef.current.open({
            template: 'Controls-demo/Popup/Sticky/doc/Template/Index',
            width: 400,
            height: 200,
            target: targetRefOverflow.current,
            fittingMode: 'overflow',
        });
    }, []);

    useEffect(() => {
        openStickyOverflow();
    }, [openStickyOverflow]);

    const openStickyAdaptive = useCallback(() => {
        if (!popupOpenerRef.current) {
            popupOpenerRef.current = new StickyOpener();
        }
        popupOpenerRef.current.open({
            template: 'Controls-demo/Popup/Sticky/doc/Template/Index',
            width: 400,
            height: 200,
            target: targetRefAdaptive.current,
            fittingMode: 'adaptive',
        });
    }, []);

    useEffect(() => {
        openStickyAdaptive();
    }, [openStickyAdaptive]);

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex tw-flex-col">
                <Button
                    caption="Открыть прилипающее окно fittingMode='overflow'"
                    ref={targetRefOverflow}
                    onClick={openStickyOverflow}
                    style={{ position: 'fixed', right: 10, bottom: 50 }}
                />
                <Button
                    caption="Открыть прилипающее окно fittingMode='adaptive'"
                    ref={targetRefAdaptive}
                    onClick={openStickyAdaptive}
                    style={{ position: 'fixed', right: 10, bottom: 100 }}
                />
            </div>
        </div>
    );
}

export default forwardRef(Index);
