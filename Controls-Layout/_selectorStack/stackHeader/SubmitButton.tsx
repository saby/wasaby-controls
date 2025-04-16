import { ForwardedRef, forwardRef } from 'react';
import { Button } from 'Controls/buttons';
import { useSelectSlice } from 'Controls/selector';
import { useSubmit } from '../hooks/useSubmit';
import 'css!Controls-Layout/selectorStack';

interface ISubmitButton {
    isAdaptive?: boolean;
}

const SubmitButton = forwardRef(
    (props: ISubmitButton, ref: ForwardedRef<HTMLDivElement>): JSX.Element | null => {
        const selectSlice = useSelectSlice();
        const submit = useSubmit();

        return selectSlice.state.isSelectionChanged ? (
            <Button
                viewMode={'filled'}
                icon={'icon-Yes'}
                iconSize={props.isAdaptive ? 'l' : 's'}
                inlineHeight={props.isAdaptive ? '7xl' : 'mt'}
                iconStyle="contrast"
                buttonStyle={'success'}
                onClick={() => submit()}
                className={
                    props.isAdaptive
                        ? 'controls-Layout-SelectorStack__adaptiveButton'
                        : 'controls-margin_left-m'
                }
                ref={ref}
            />
        ) : null;
    }
);

export default SubmitButton;
