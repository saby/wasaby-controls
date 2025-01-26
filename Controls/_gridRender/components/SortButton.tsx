/**
 * @kaizen_zone 059ef172-edfb-4214-a336-72b5349ef7f0
 */
import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { ArrowTemplate } from 'Controls/sorting';
import { TSortingValue } from 'Controls/interface';

/**
 * Значения для обрезки текста
 * @typedef {String} Controls/_gridRender/SortingButtonComponent/TOverflow
 * @variant ellipsis Текст обрезается и добавляется многоточие
 * @variant none Текст не обрезается, но разбивается на несколько строк
 */
export type TOverflow = 'ellipsis' | 'none';

export type TWhiteSpace = 'nowrap' | 'normal';

/**
 * Значения для положения подписи кнопки
 * @typedef {String} Controls/_gridRender/SortingButtonComponent/TAlign
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
 * @typedef {Function} Controls/_gridRender/SortingButtonComponent/TOnSortingClick
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
    whiteSpace: TWhiteSpace;
}

export function getTruncateClasses(textOverflow: TOverflow, whiteSpace: TWhiteSpace): string {
    if (textOverflow === 'ellipsis' && !whiteSpace) {
        return ' tw-truncate';
    } else {
        return (
            (textOverflow === 'ellipsis' ? ' tw-text-ellipsis tw-overflow-hidden' : ' ') +
            (whiteSpace === 'nowrap' ? ' tw-whitespace-nowrap' : ' tw-whitespace-normal')
        );
    }
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

function SortButton(props: IProps, ref: React.ForwardedRef<HTMLDivElement>): React.ReactElement {
    let wrapperClassName = `js-controls-SortingButton controls-SortingButton controls_list_theme-${props.theme}`;
    const getContentClassName = () => {
        if (props.sortingIcon !== undefined) {
            return ` controls-icon tw-cursor-pointer tw-self-center controls-icon_size-s controls-icon_style-label ${props.sortingIcon}`;
        } else
            return (
                'controls-SortingButton__caption' +
                ` ${getTruncateClasses(props.textOverflow, props.whiteSpace)}`
            );
    };
    const getArrowClassName = () => {
        let spacingClassName;
        if (props.sortingIcon !== undefined) {
            spacingClassName = ` controls-margin_${props.align !== 'left' ? 'right' : 'left'}-3xs`;
        } else {
            spacingClassName = ` controls-SortingButton__arrow-spacing-${
                props.align !== 'left' ? 'right' : 'left'
            }`;
        }
        return ' tw-cursor-pointer' + spacingClassName;
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

export default React.forwardRef(SortButton);

/**
 * Кнопка сортировки в заголовках таблицы
 * @class Controls/_gridRender/SortButton
 * @author Аверкиев П.А.
 * @public
 * @see Controls/sorting:Selector
 */

/**
 * @name Controls/_gridRender/SortingButtonComponent#value
 * @cfg {String} Направление сортировки: DESC (по убыванию) или ASC (по возрастанию)
 */

/**
 * @name Controls/_gridRender/SortingButtonComponent#caption
 * @cfg {String} Подпись кнопки
 */

/**
 * @name Controls/_gridRender/SortingButtonComponent#align
 * @cfg {Controls/_gridRender/SortButton/TAlign.typedef} положение подписи left (слева) или right (справа)
 */

/**
 * @name Controls/_gridRender/SortingButtonComponent#textOverflow
 * @cfg {Controls/_gridRender/SortButton/TOverflow.typedef} Обрезка/перехлёст текста (многоточие или нет)
 */

/**
 * @name Controls/_gridRender/SortingButtonComponent#className
 * @cfg {String} Дополнительный CSS класс
 */

/**
 * @name Controls/_gridRender/SortingButtonComponent#property
 * @cfg {String} Поле для сортировки.
 */

/**
 * Функция-бработчик клика по кнопке сортировки
 * Чтобы не срабатывал обработчик по умолчанию в списке, функция должна вернуть false.
 * @name Controls/_gridRender/SortingButtonComponent#onSortingClick
 * @cfg {Controls/_gridRender/SortButton/TOnSortingClick.typedef}
 */
