import { forwardRef, useCallback } from 'react';
import { PreviewerTarget } from 'Controls/popupTargets';
import { Button } from 'Controls/buttons';

function Previewer(props, ref) {
    const getPreviewerTarget = useCallback((props) => {
        return (
            <Button
                {...props}
                viewMode="linkButton"
                ref={props.forwardedRef}
                icon="icon-Question"
                iconStyle="secondary"
                iconSize="m"
            />
        );
    }, []);

    return (
        <div className="tw-flex tw-justify-center" ref={ref}>
            <div className="tw-flex tw-flex-col tw-items-center">
                <PreviewerTarget
                    className="tw-cursor-pointer"
                    trigger="hover"
                    content={getPreviewerTarget}
                    template="Controls-demo/Popup/PreviewerTarget/doc/Template/Index"
                />
            </div>
        </div>
    );
}

export default forwardRef(Previewer);
