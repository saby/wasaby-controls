import * as React from 'react';
import { SyntheticEvent } from 'react';
import * as rk from 'i18n!Controls';
import { Button } from 'Controls/buttons';

interface IAddButtonProps {
    onClick: (e: SyntheticEvent) => void;
}

function AddButton(props: IAddButtonProps, ref: React.ForwardedRef<HTMLDivElement>) {
    const { onClick } = props;

    return (
        <Button
            ref={ref}
            className="controls-margin_left-m"
            data-qa="controls-Suggest__addButton"
            caption={rk('Создать')}
            viewMode="linkButton"
            icon="icon-Add"
            iconSize="s"
            iconStyle="label"
            fontColorStyle="label"
            onClick={onClick}
        />
    );
}

export default React.forwardRef(AddButton);
