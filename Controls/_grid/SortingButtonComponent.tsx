/**
 * @kaizen_zone ed546588-e113-4fa9-a709-b37c7f5cc99c
 */
import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { ArrowTemplate } from 'Controls/sorting';
import { TSortingValue } from 'Controls/interface';

/**
 * Значения для обрезки текста
 * @typedef {String} Controls/_grid/SortingButtonComponent/TOverflow
 * @variant ellipsis Текст обрезается и добавляется многоточие
 * @variant none Текст не обрезается, но разбивается на несколько строк
 */
export type TOverflow = 'ellipsis' | 'none';

/**
 * Значения для положения подписи кнопки
 * @typedef {String} Controls/_grid/SortingButtonComponent/TAlign
 * @variant left Текст слева от иконки сортировки
 * @variant right Текст справа от иконки сортировки
 */
export type TAlign = 'left' | 'right';

interface IArrowProps {
    // Значение сортировки
    value: TSortingValue;
    // CSS класс для стрелки
    className: string;
}

/**
 * Функция-обработчик клика по кнопке сортировки. Используется для смены направления сортировки.
 * @typedef {Function} Controls/_grid/SortingButtonComponent/TOnSortingClick
 * @param {React.MouseEvent} event Событие клика по кнопке.
 * @param {String} property Свойство, по которому производится сортировка.
 */
type TOnSortingClick = (event: React.MouseEvent, property: string) => boolean;

interface IProps extends TInternalProps, IArrowProps {
    theme: string;
    // Подпись кнопки
    caption: string;
    // Положение подписи - слева/справа
    align?: TAlign;
    // Обрезка/перехлёст текста (многоточие или нет)
    textOverflow: TOverflow;
    // Обработчик клика
    onSortingClick: TOnSortingClick;
    // Поле сортировки для отправки в обработчик клика
    property: string;
    // Иконка, используемая вместо подписи
    sortingIcon: string;
}

function Arrow(props: IArrowProps): React.ReactElement {
    let className = 'controls-SortingButton__icon controls-SortingButton__icon';
    if (props.className) {
        className += ` ${props.className}`;
    }
    return (
        <div className={className}>
            <ArrowTemplate className={'controls-SortingButton_arrow'} value={props.value} />
        </div>
    );
}

/**
 * В списках обрабатываем клик по Sorting через делегирование событий.
 * Прикладникам даём возможность самостоятельно обрабатывать через колбек.
 * @param event
 * @param property
 * @param onSortingClick
 */
function clickHandler(
    event: React.MouseEvent,
    property: string,
    onSortingClick?: TOnSortingClick
): void {
    if (onSortingClick?.(event, property) === false) {
        event.stopPropagation();
    }
}

function SortingButtonComponent(
    props: IProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    let wrapperClassName = `js-controls-SortingButton controls-SortingButton controls_list_theme-${props.theme}`;
    const getContentClassName = () => {
        if (props.sortingIcon !== undefined) {
            return ` controls-icon tw-cursor-pointer tw-self-center controls-icon_size-s controls-icon_style-label ${props.sortingIcon}`;
        } else
            return (
                'controls-SortingButton__caption' +
                ` controls-Grid__header-cell__content-${props.textOverflow}`
            );
    };
    const getArrowClassName = () => {
        let spacingClassName;
        if (props.sortingIcon !== undefined){
            spacingClassName= ` controls-margin_${props.align !== 'left' ? 'right' : 'left'}-3xs`;
        }
        else {
            spacingClassName=` controls-SortingButton__arrow-spacing-${
                props.align !== 'left' ? 'right' : 'left'
            }`;
        }
        return spacingClassName;
    };
    if (props.attrs?.className || props.className) {
        wrapperClassName += ` ${props.attrs?.className || props.className}`;
    }
    const dataQa = props.attrs?.['data-qa'] ?? 'controls-SortingButton';
    return (
        <div className={wrapperClassName} ref={ref} data-property={props.property} data-qa={dataQa}>
            <div className={'controls-SortingButton__content'} title={props.caption}>
                {props.value && props.align !== 'left' ? (
                    <Arrow value={props.value} className={getArrowClassName()} />
                ) : null}
                <div
                    className={getContentClassName()}
                    onClick={(event) => {
                        return clickHandler(event, props.property, props.onSortingClick);
                    }}
                >
                    {props.sortingIcon !== undefined ? null : props.caption}
                </div>
                {props.value && props.align === 'left' ? (
                    <Arrow value={props.value} className={getArrowClassName()} />
                ) : null}
            </div>
        </div>
    );
}

export default React.forwardRef(SortingButtonComponent);

/**
 * Кнопка сортировки в заголовках таблицы
 * @class Controls/_grid/SortingButtonComponent
 * @author Аверкиев П.А.
 * @public
 * @see Controls/sorting:Selector
 */

/**
 * @name Controls/_grid/SortingButtonComponent#value
 * @cfg {String} Направление сортировки: DESC (по убыванию) или ASC (по возрастанию)
 */

/**
 * @name Controls/_grid/SortingButtonComponent#caption
 * @cfg {String} Подпись кнопки
 */

/**
 * @name Controls/_grid/SortingButtonComponent#align
 * @cfg {Controls/_grid/SortingButtonComponent/TAlign.typedef} положение подписи left (слева) или right (справа)
 */

/**
 * @name Controls/_grid/SortingButtonComponent#textOverflow
 * @cfg {Controls/_grid/SortingButtonComponent/TOverflow.typedef} Обрезка/перехлёст текста (многоточие или нет)
 */

/**
 * @name Controls/_grid/SortingButtonComponent#className
 * @cfg {String} Дополнительный CSS класс
 */

/**
 * @name Controls/_grid/SortingButtonComponent#property
 * @cfg {String} Поле для сортировки.
 */

/**
 * Функция-бработчик клика по кнопке сортировки
 * Чтобы не срабатывал обработчик по умолчанию в списке, функция должна вернуть false.
 * @name Controls/_grid/SortingButtonComponent#onSortingClick
 * @cfg {Controls/_grid/SortingButtonComponent/TOnSortingClick.typedef}
 */
