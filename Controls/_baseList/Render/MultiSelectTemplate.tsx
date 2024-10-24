/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import * as React from 'react';

import { TInternalProps } from 'UICore/Executor';

import { CheckboxMarker } from 'Controls/checkbox';
import { IItemPadding } from 'Controls/display';
import { ICheckboxItem } from '../interface/ICheckboxItem';

interface IProps extends TInternalProps {
    item: ICheckboxItem;
    content: React.Component | React.FunctionComponent;
    value?: null | boolean | undefined;
    backgroundColorStyle: string;
    cursor: string;
    highlightOnHover: boolean;
    itemPadding: IItemPadding;
    baseline: 'none' | 'default';

    className: string;
    viewMode?: 'filled' | 'outlined' | 'ghost';
    horizontalPadding?: string;
    contrastBackground: boolean;
    position: 'default' | 'custom';
}

export default function MultiSelectTemplate(props: IProps): JSX.Element {
    if (!props.item.isVisibleCheckbox()) {
        return null;
    }

    let className = props.item.getMultiSelectClasses(
        props.backgroundColorStyle,
        props.cursor,
        props.highlightOnHover,
        props.itemPadding,
        props.baseline,
        props.position
    );

    if (props.attrs?.className || props.className) {
        className += ` ${props.attrs?.className} ${props.className}`;
    }

    return (
        <CheckboxMarker
            value={props.value !== undefined ? props.value : props.item.isSelected()}
            readOnly={props.item.isReadonlyCheckbox()}
            triState={true}
            viewMode={'outlined'}
            horizontalPadding={props.horizontalPadding}
            contrastBackground={props.contrastBackground}
            $wasabyRef={props.$wasabyRef}
            attrs={{ ...props.attrs, className, tabindex: -1 }}
        />
    );
}
