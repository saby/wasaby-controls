import { forwardRef } from 'react';
import { Button } from 'Controls/buttons';

export default forwardRef(function ActionButtonEditor(props: Record<string, unknown>, ref) {
    if (!props.buttonCaption) {
        return null;
    }
    return (
        <div ref={ref} className="tw-flex tw-min-w-0">
            <Button
                data-qa="controls-Header_button__link"
                viewMode="link"
                fontColorStyle="link"
                className='ws-ellipsis'
                caption={props.buttonCaption}
                onClick={props.buttonClickHandler}
            />
            {props.closeButtonVisible && (
                <Button
                    className="controls-margin_left-3xs"
                    data-qa="controls-stack-Button__close"
                    icon="icon-CloseNew"
                    viewMode="link"
                    iconStyle="unaccented"
                    iconSize="s"
                    onClick={props.closeClickHandler}
                />
            )}
        </div>
    );
});
