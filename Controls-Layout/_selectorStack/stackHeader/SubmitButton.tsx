import { ForwardedRef, forwardRef } from 'react';
import { Button } from 'Controls/buttons';
import { useSelectSlice } from 'Controls/selector';
import { useSubmit } from '../hooks/useSubmit';
import 'css!Controls-Layout/selectorStack';

const SubmitButton = forwardRef((_props, ref: ForwardedRef<HTMLDivElement>): JSX.Element | null => {
    const selectSlice = useSelectSlice();
    const submit = useSubmit();

    return selectSlice.state.isSelectionChanged ? (
        <Button
            viewMode={'filled'}
            icon={'icon-Yes'}
            iconSize={'s'}
            iconStyle="contrast"
            buttonStyle={'success'}
            onClick={() => submit()}
            className={'controls-margin_left-m'}
            ref={ref}
        />
    ) : null;
});

export default SubmitButton;
