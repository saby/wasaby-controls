/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
 */
import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { IItemPadding } from 'Controls/display';
import { ICheckboxItem } from '../interface/ICheckboxItem';

interface IProps extends TInternalProps {
    item: ICheckboxItem;

    backgroundColorStyle: string;
    cursor: string;
    highlightOnHover: boolean;
    itemPadding: IItemPadding;
    baseline: 'none' | 'default';

    className?: string;
    selected?: boolean;
    style?: 'master' | 'default';
}

function CircleTemplate(
    props: IProps,
    ref: React.ForwardedRef<HTMLOrSVGElement>
): React.ReactElement {
    if (props.item.isVisibleCheckbox()) {
        let className = props.item.getMultiSelectClasses(
            props.backgroundColorStyle,
            props.cursor,
            props.highlightOnHover,
            props.itemPadding,
            props.baseline
        );

        className +=
            ' controls-icon_size-2xs controls-ListView__multiSelect__circle' +
            ` controls-ListView__multiSelect__circle_style-${props.style}`;

        if (props.attrs && props.attrs.className) {
            className += ` ${props.attrs.className}`;
        }

        const isSelected = props.selected || props.item.isSelected();
        const style = props.style || 'default';
        const innerCircleClassName =
            'controls-ListView__multiSelect__innerCircle' +
            ` controls-ListView__multiSelect__innerCircle_${
                isSelected ? 'selected-' + style : ''
            }` +
            ` controls-ListView__multiSelect__innerCircle_${
                isSelected ? 'selected' : 'unselected'
            }`;

        return (
            <svg
                ref={ref}
                xmlns={'http://www.w3.org/2000/svg'}
                className={className}
                data-qa={'ListView__multiSelect__circle'}
                viewBox={'0 0 12 12'}
                tabIndex={-1}
            >
                <circle
                    xmlns={'http://www.w3.org/2000/svg'}
                    className={'controls-ListView__multiSelect__borderCircle'}
                    cx={'6'}
                    cy={'6'}
                    r={'3.5'}
                />
                <circle
                    xmlns={'http://www.w3.org/2000/svg'}
                    className={innerCircleClassName}
                    cx="6"
                    cy="6"
                    r="3"
                />
            </svg>
        );
    }
    return null;
}

export default React.forwardRef(CircleTemplate);

/**
 * Шаблон круглого чекбокса
 *
 * @class Controls/list:MultiSelectCircleTemplate
 *
 * @public
 * @demo Controls-demo/PropertyGridEditor/MultiSelect/MultiSelectTemplate/Circle/Index
 */
