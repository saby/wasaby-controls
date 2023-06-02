import * as React from 'react';
import { TInternalProps } from 'UICore/Executor';

/**
 * Значения направления сортировки
 * @typedef {String} Controls/_sorting/SortingArrow/TSortingDirection
 * @variant ASC По возрастанию
 * @variant DESC По убыванию
 */
export type TSortingDirection = 'ASC' | 'DESC';

interface IProps extends TInternalProps {
    // направление сортировки - по убыванию или по возрастанию
    value: TSortingDirection;
    // Дополнительный CSS класс
    className: string;
}

function SortingArrow(
    props: IProps,
    ref: React.ForwardedRef<SVGSVGElement>
): React.ReactElement {
    let className = `controls-SortingArrow_${
        props.value === 'DESC' ? 'desc' : 'asc'
    }`;
    if (props.attrs?.className || props.className) {
        className += ` ${props.attrs?.className || props.className}`;
    }
    return (
        <svg
            ref={ref}
            className={className}
            id={'Layer_1'}
            xmlns={'http://www.w3.org/2000/svg'}
            width={'7'}
            viewBox={'0 0 7 16'}
        >
            <path
                className="cls-1"
                d="M3 15.5a.5.5 0 001 0v-13.83l2.15 2.18a.5.5 0 10.7-.71l-3-3a.5.5 0 00-.4-.14a.5.5 0 00-.31.14l-3 3a.5.5 0 10.7.71l2.16-2.18v13.83z"
            />
        </svg>
    );
}

export default React.forwardRef(SortingArrow);

/**
 * Иконка сортировки
 * @class Controls/_sorting/SortingArrow
 * @author Аверкиев П.А.
 * @public
 */

/**
 * @name Controls/_sorting/SortingArrow#value
 * @cfg {Controls/_sorting/SortingArrow/TSortingDirection.typedef} Направление сортировки: DESC (по убыванию) или ASC (по возрастанию)
 */

/**
 * @name Controls/_sorting/SortingArrow#className
 * @cfg {String} Дополнительный CSS класс
 */
