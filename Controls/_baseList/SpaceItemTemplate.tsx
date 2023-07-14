import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';

interface ISpaceItem {
    getWrapperClasses(): string;
}

interface IProps extends TInternalProps {
    item: ISpaceItem;
}

export default function SpaceItemTemplate(props: IProps): React.ReactElement {
    return (
        <div
            className={props.item.getWrapperClasses()}
            item-key={props.item.key}
            data-qa={props.item.listElementName}
        />
    );
}
