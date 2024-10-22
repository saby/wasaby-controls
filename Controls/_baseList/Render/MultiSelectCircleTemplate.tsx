/**
 * @kaizen_zone b3b3d041-8fb2-4abe-a87a-caade6edf0de
 */
import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { IItemPadding } from 'Controls/display';
import { ICheckboxItem } from '../interface/ICheckboxItem';
import { FocusRoot } from 'UICore/Focus';

/**
 * Конфигурация компонента круглого чекбокса.
 * @interface Controls/_baseList/Render/MultiSelectCircleTemplate/ICheckboxCircleMarkerProps
 * @public
 */
export interface ICheckboxCircleMarkerProps {
    /**
     * Пользовательский CSS класс
     */
    className?: string;
    /**
     * Состояние чекбокса
     */
    value?: boolean;
    /**
     * Отступ слева и справа от чекбокса
     */
    horizontalPadding?: 'default' | '3xs';
    /**
     * Размер иконки
     */
    size?: 'm' | 's';
}

export interface IProps extends ICheckboxCircleMarkerProps, TInternalProps {
    baseline: 'none' | 'default';
    itemPadding: IItemPadding;
    highlightOnHover: boolean;
    cursor: string;
    backgroundColorStyle: string;
    item: ICheckboxItem;

    // Предпочтительней использовать decorationStyle, т.к. он не конфликтует со style в реакте
    decorationStyle?: 'master' | 'default';
    style?: 'master' | 'default';

    position?: 'default' | 'custom';
    selected?: boolean;
}

export function CheckboxCircleMarker(
    props: ICheckboxCircleMarkerProps & { forwardedRef?: React.ForwardedRef<HTMLDivElement> }
) {
    const { horizontalPadding = 'default', size = 's' } = props;
    const svgClassName =
        'controls-CheckboxMarker__icon-checked controls-ListView__multiSelect__circle' +
        ` controls-CheckboxMarker__icon-size-${size}` +
        ` controls-CheckboxMarker__icon-checked-horizontalPadding-${horizontalPadding}`;

    const innerCircleClassName =
        'controls-ListView__multiSelect__innerCircle' +
        ` controls-ListView__multiSelect__innerCircle_${props.value ? 'selected' : 'unselected'}`;

    return (
        <FocusRoot
            ref={props.forwardedRef}
            className={props.className}
            as="div"
            data-qa="ListView__multiSelect__circle"
        >
            <svg
                xmlns={'http://www.w3.org/2000/svg'}
                className={svgClassName}
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
        </FocusRoot>
    );
}

function MultiSelectCircleTemplate(
    props: IProps,
    ref: React.ForwardedRef<SVGSVGElement>
): React.ReactElement | null {
    if (props.item.isVisibleCheckbox()) {
        const decorationStyle = props.decorationStyle || props.style;
        let className = props.item.getMultiSelectClasses(
            props.backgroundColorStyle,
            props.cursor,
            props.highlightOnHover,
            props.itemPadding,
            props.baseline,
            props.position
        );
        if (props.attrs && props.attrs.className) {
            className += ` ${props.attrs.className}`;
        }
        return (
            <CheckboxCircleMarker
                {...props}
                value={props.value || props.selected || props.item.isSelected()}
                forwardedRef={ref}
                className={className}
                decorationStyle={decorationStyle}
                horizontalPadding={decorationStyle === 'master' ? '3xs' : 'default'}
            />
        );
    }
    return null;
}

export default React.forwardRef(MultiSelectCircleTemplate);

/**
 * Компонент круглого чекбокса
 *
 * @class Controls/list:CheckboxCircleMarker
 * @implements Controls/_baseList/Render/MultiSelectCircleTemplate/ICheckboxCircleMarkerProps
 *
 * @public
 * @demo Controls-demo/PropertyGridEditor/MultiSelect/MultiSelectTemplate/Circle/Index
 */

/**
 * Шаблон круглого чекбокса
 *
 * @class Controls/list:MultiSelectCircleTemplate
 *
 * @public
 * @demo Controls-demo/PropertyGridEditor/MultiSelect/MultiSelectTemplate/Circle/Index
 */
