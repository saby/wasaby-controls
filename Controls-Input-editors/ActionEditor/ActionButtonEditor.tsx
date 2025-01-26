import { forwardRef, memo, MouseEventHandler } from 'react';
import { Button } from 'Controls/buttons';
import ActionSelectButton from './ActionSelectButton';

interface IActionButtonEditorProps {
    buttonCaption: string;
    closeButtonVisible: boolean;
    buttonClickHandler: MouseEventHandler;
    closeClickHandler?: MouseEventHandler;

    frequentActions?: string[];
    permittedActions?: string[];
    dropdownApplyHandler?: (actionType: string) => void;
}

const ActionButtonEditor = forwardRef(function ActionButtonEditor(
    props: IActionButtonEditorProps,
    ref
) {
    const {
        buttonCaption,
        closeButtonVisible,
        buttonClickHandler,
        closeClickHandler,

        frequentActions,
        permittedActions,
        dropdownApplyHandler,
    } = props;
    if (!buttonCaption) {
        return null;
    }
    return (
        <div ref={ref} className="tw-flex tw-min-w-0 tw-items-baseline">
            <ActionSelectButton
                caption={buttonCaption}
                frequentActions={frequentActions}
                permittedActions={permittedActions}
                dropdownApplyHandler={dropdownApplyHandler}
                buttonClickHandler={buttonClickHandler}
            />
            {closeButtonVisible && (
                <Button
                    className="controls-margin_left-3xs"
                    data-qa="controls-stack-Button__close"
                    icon="icon-Close"
                    viewMode="linkButton"
                    iconStyle="unaccented"
                    iconSize="s"
                    fontSize="s"
                    inlineHeight="s"
                    onClick={closeClickHandler}
                />
            )}
        </div>
    );
});

export default memo(ActionButtonEditor);
