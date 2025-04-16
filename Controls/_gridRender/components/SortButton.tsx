/**
 * @kaizen_zone 059ef172-edfb-4214-a336-72b5349ef7f0
 */
import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';
import { ArrowTemplate } from 'Controls/sorting';
import { TSortingValue } from 'Controls/interface';

/**
 * Значения для обрезки текста
 * @typedef TOverflow
 * @variant ellipsis Текст обрезается и добавляется многоточие
 * @variant none Текст не обрезается, но разбивается на несколько строк
 */
export type TOverflow = 'ellipsis' | 'none';

/**
 * Значения для способа управления пробельными символами
 * @typedef TWhiteSpace
 * @variant normal Текст не обрезается, но разбивается на несколько строк. Последовательности пробелов объединяются в один пробел.
 * @variant nowrap Текст не обрезается и не разбивается на несколько строк. Последовательности пробелов объединяются в один пробел.
 */
export type TWhiteSpace = 'normal' | 'nowrap';

/**
 * Значения для положения подписи кнопки
 * @typedef TAlign
 * @variant left Текст слева от иконки сортировки
 * @variant right Текст справа от иконки сортировки
 */
export type TAlign = 'left' | 'right';

/**
 * Тип для функции-обработчика клика по кнопке сортировки. Используется для смены направления сортировки.
 * обработчик принимает следющие аргументы:
 * * event Событие клика по кнопке.
 * * property Имя поля, по которому производится сортировка.
 * @typedef TOnSortingClick
 */
export type TOnSortingClick = (event: React.MouseEvent, property: string) => boolean;

/**
 * Интерфейс пропсов стрелки для кнопки сортировки
 * @public
 */
export interface IArrowProps {
    /**
     * Направление сортировки: DESC (по убыванию) или ASC (по возрастанию)
     * @cfg
     */
    value: TSortingValue;
    /**
     * Иконка, используемая вместо подписи
     * @cfg
     */
    sortingIcon: string;
    /**
     * Положение подписи left (слева) или right (справа)
     * @cfg
     */
    align?: TAlign;
    /**
     * Дополнительный CSS класс
     * @cfg
     */
    className?: string;
}

/**
 * Интерфейс пропсов кнопки сортировки
 * @public
 */
export interface ISortButtonProps extends TInternalProps, IArrowProps {
    theme: string;
    /**
     * Способ управления пробельными символами
     * @cfg
     */
    whiteSpace: TWhiteSpace;
    /**
     * Подпись кнопки
     * @cfg
     */
    caption: string;
    /**
     * Переполнение текста (многоточие или нет)
     * @cfg
     */
    textOverflow: TOverflow;
    /**
     * Поле для сортировки (Отправляется в обработчик клика).
     * @cfg
     */
    property: string;
    /**
     * Функция-бработчик клика по кнопке сортировки
     * Чтобы не срабатывал обработчик по умолчанию в списке, функция должна вернуть false.
     * @cfg
     */
    onSortingClick: TOnSortingClick;
    /**
     * Подпись при наведении на кнопку
     * @cfg
     */
    tooltip?: string;
}

function getTruncateClasses(textOverflow: TOverflow, whiteSpace: TWhiteSpace): string {
    return textOverflow === 'ellipsis' && !whiteSpace
        ? ' tw-truncate'
        : (textOverflow === 'ellipsis' ? ' tw-text-ellipsis tw-overflow-hidden' : '') +
              ` tw-whitespace-${whiteSpace || 'normal'}`;
}

function Arrow(props: IArrowProps): React.ReactElement {
    let className = 'controls-SortingButton__icon controls-SortingButton__icon tw-cursor-pointer';
    if (props.sortingIcon !== undefined) {
        className += ` controls-margin_${props.align !== 'left' ? 'right' : 'left'}-3xs`;
    } else {
        className += ` controls-SortingButton__arrow-spacing-${
            props.align !== 'left' ? 'right' : 'left'
        }`;
    }
    return (
        <div className={className}>
            <ArrowTemplate className={'controls-SortingButton_arrow'} value={props.value} />
        </div>
    );
}

/**
 * Кнопка сортировки в заголовках таблицы
 * @public
 * @see Controls/sorting:Selector
 */
function SortButtonRef(
    props: ISortButtonProps,
    ref: React.ForwardedRef<HTMLDivElement>
): React.ReactElement {
    const wrapperClassName =
        `js-controls-SortingButton controls-SortingButton controls_list_theme-${props.theme}` +
        `${props.className ? ' ' + props.className : ''}`;

    const contentClassName =
        props.sortingIcon !== undefined
            ? `controls-icon tw-cursor-pointer tw-self-center controls-icon_size-s controls-icon_style-label ${props.sortingIcon}`
            : 'controls-SortingButton__caption' +
              ` ${getTruncateClasses(props.textOverflow, props.whiteSpace)}`;
    const onClick = React.useCallback(
        (event: React.MouseEvent) => {
            // В списках обрабатываем клик по Sorting через делегирование событий.
            // Прикладникам даём возможность самостоятельно обрабатывать через колбек.
            if (props.onSortingClick?.(event, props.property) === false) {
                event.stopPropagation();
            }
        },
        [props]
    );
    const dataQa = props.attrs?.['data-qa'] ?? 'controls-SortingButton';

    const arrow = React.useMemo(() => {
        return <Arrow value={props.value} sortingIcon={props.sortingIcon} align={props.align} />;
    }, [props.value, props.sortingIcon, props.align]);

    return (
        <div className={wrapperClassName} ref={ref} data-property={props.property} data-qa={dataQa}>
            <div
                className={'controls-SortingButton__content'}
                title={props.title || props.tooltip || props.caption}
            >
                {props.value && props.align !== 'left' ? arrow : null}
                <div className={contentClassName} onClick={onClick}>
                    {props.sortingIcon !== undefined ? null : props.caption}
                </div>
                {props.value && props.align === 'left' ? arrow : null}
            </div>
        </div>
    );
}

const SortButton = React.forwardRef(SortButtonRef);
export default SortButton;
