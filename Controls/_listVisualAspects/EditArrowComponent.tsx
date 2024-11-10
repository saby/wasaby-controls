/**
 * @kaizen_zone 96ed3176-68c2-43f7-9958-0ac21bc22bed
 */
import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import type { TItemEventHandler } from 'Controls/baseList';
import { TOverflow } from 'Controls/interface';
import { controller as localeController } from 'I18n/i18n';

export interface IProps extends TInternalProps {
    // Должна ли кнопка редактирования перекрывать тенью часть многоточия у записи при textOverflow.
    // Если указано, то на блок непосредственно перед стрелкой надо вешать
    // класс controls-Grid__editArrow-overflow-ellipsis.
    // Используется в старом гриде.
    textOverflow?: TOverflow;
    // Стиль фона стрелки
    backgroundStyle?: string;
    // Дополнительный CSS класс
    className?: string;
    // native
    onClick?: TItemEventHandler;
}

export const EDIT_ARROW_SELECTOR = 'js-controls-Grid__editArrow';

function EditArrowComponent(
    props: IProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    let rootClasses =
        'controls-Grid__editArrow-wrapper js-controls-ListView__visible-on-hoverFreeze';
    rootClasses += ` ${EDIT_ARROW_SELECTOR}`;
    const externalClassName = props.attrs?.className || props.className;
    if (externalClassName) {
        rootClasses += ` ${externalClassName}`;
    }

    const iconClasses = 'controls-Grid__editArrow-icon';
    const iconTransform =
        localeController.currentLocaleConfig.directionality === 'rtl' ? 'rotate(180, 8, 10)' : '';
    const backgroundStyle = props.backgroundStyle ?? 'default';
    return (
        <div ref={ref} className={rootClasses}>
            {props.textOverflow === 'ellipsis' && (
                <div className={'controls-Grid__editArrow-withTextOverflow'} />
            )}
            <div
                className={`controls-Grid__editArrow-blur controls-Grid__editArrow-blur_${backgroundStyle}`}
            />
            <div
                className={`controls-Grid__editArrow controls-Grid__editArrow_background_${backgroundStyle}`}
                data-qa={'edit-arrow'}
            >
                <svg
                    className={iconClasses}
                    viewBox={'0 0 16 16'}
                    xmlns={'http://www.w3.org/2000/svg'}
                >
                    <path
                        transform={iconTransform}
                        d={'M9,9.94l-6,6v-2l4-4-4-4v-2Zm5,0-6,6v-2l4-4-4-4v-2Z'}
                    />
                </svg>
            </div>
        </div>
    );
}

export default React.forwardRef(EditArrowComponent);

/**
 * Компонент "Кнопка редактирования".
 * @class Controls/_listVisualAspects/RenderReact/EditArrowComponent
 * @author Аверкиев П.А.
 * @public
 */

/**
 * Цвет фона подложки стрелки редактирования.
 * @name Controls/_listVisualAspects/RenderReact/EditArrowComponent#backgroundStyle
 * @cfg {String}
 * @default default фон соответствут фону подсветки ячейки по умолчанию.
 * @see Controls/_list/interface/IList#highlightOnHover
 * @see Controls/_list/interface/IList#hoverBackgroundStyle
 */
