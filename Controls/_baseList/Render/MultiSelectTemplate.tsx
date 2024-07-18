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

    backgroundColorStyle: string;
    cursor: string;
    highlightOnHover: boolean;
    itemPadding: IItemPadding;
    baseline: 'none' | 'default';

    className: string;
    viewMode?: 'filled' | 'outlined' | 'ghost';
    horizontalPadding?: string;
    contrastBackground: boolean;
}

export default function MultiSelectTemplate(props: IProps): JSX.Element {
    if (props.item.isVisibleCheckbox()) {
        let className = props.item.getMultiSelectClasses(
            props.backgroundColorStyle,
            props.cursor,
            props.highlightOnHover,
            props.itemPadding,
            props.baseline
        );

        if (props.attrs?.className || props.className) {
            className += ` ${props.attrs?.className} ${props.className}`;
        }

        const getAttrs = () => {
            return { ...props.attrs, class: className, tabindex: -1 };
        };

        return (
            <CheckboxMarker
                value={props.item.isSelected()}
                readOnly={props.item.isReadonlyCheckbox()}
                triState={true}
                viewMode={'outlined'}
                horizontalPadding={props.horizontalPadding}
                contrastBackground={props.contrastBackground}
                $wasabyRef={props.$wasabyRef}
                attrs={getAttrs()}
            />
        );
    }

    return null;
}
