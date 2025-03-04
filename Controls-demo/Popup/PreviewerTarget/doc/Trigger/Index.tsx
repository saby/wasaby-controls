import { forwardRef, useCallback, useRef } from 'react';
import { PreviewerTarget } from 'Controls/popupTargets';
import { Button } from 'Controls/buttons';
import { Label } from 'Controls/input';

function Previewer(props, ref) {
    const previewerRef = useRef();

    const getPreviewerTarget = useCallback((props) => {
        return (
            <div
                {...props}
                style={{ userSelect: 'none' }}
                ref={props.forwardedRef}
                className={`controls-fontsize-xl controls-text-label ${props.className}`}
            >
                Двойной клик откроет окно
            </div>
        );
    }, []);

    const openPopup = useCallback(() => {
        previewerRef.current.open();
    }, []);

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex tw-flex-col tw-items-center">
                <PreviewerTarget
                    ref={previewerRef}
                    className="tw-cursor-pointer"
                    trigger="demand"
                    onDoubleClick={openPopup}
                    content={getPreviewerTarget}
                    template="Controls-demo/Popup/PreviewerTarget/doc/Template/Index"
                />
            </div>
        </div>
    );
}

export default forwardRef(Previewer);
