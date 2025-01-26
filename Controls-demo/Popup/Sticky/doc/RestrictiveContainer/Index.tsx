import { StickyOpener } from 'Controls/popup';
import { forwardRef, useRef, useCallback, RefObject } from 'react';
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
            restrictiveContainer: '.controlsDemo-Sticky__restrictiveContainer',
            target: targetRef.current,
            width: 400,
            height: 200,
        });
    }, []);

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div
                className="tw-flex tw-flex-col controls-background-unaccented controlsDemo-Sticky__restrictiveContainer"
                style={{ width: '450px', height: '400px' }}
            >
                <Button
                    ref={targetRef}
                    caption="Открыть прилипающее окно с ограничивающим контейнером"
                    onClick={openSticky}
                />
            </div>
        </div>
    );
}

export default forwardRef(Index);
