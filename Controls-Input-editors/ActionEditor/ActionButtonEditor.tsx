import { forwardRef } from 'react';
import { Button } from 'Controls/buttons';

export default forwardRef(function ActionButtonEditor(props: Record<string, unknown>, ref) {
    if (!props.buttonCaption) {
        return null;
    }
    return (
        <div ref={ref} className="tw-flex">
            <Button
                data-qa="controls-Header_button__link"
                viewMode="link"
                fontColorStyle="link"
                caption={props.buttonCaption}
                onClick={props.buttonClickHandler}
            />
            {props.closeButtonVisible && (
                <Button
                    className="controls-margin_left-3xs"
                    data-qa="controls-stack-Button__close"
                    icon="icon-Close"
                    viewMode="link"
                    iconStyle="label"
                    iconSize="s"
                    onClick={props.closeClickHandler}
                />
            )}
        </div>
    );
});
