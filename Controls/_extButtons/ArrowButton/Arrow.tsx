/**
 * @kaizen_zone 4efc1ffa-202d-406f-befe-efa4a5d4ee0c
 */
import * as React from 'react';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { TInternalProps } from 'UICore/Executor';

export type TArrowButtonDirection = 'right' | 'left' | 'up' | 'down';

export interface IArrow extends TInternalProps {
    direction: TArrowButtonDirection;
    className?: string;
}

export default React.forwardRef(function Arrow(props: IArrow, _): React.ReactElement {
    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};
    const verticalTemplate = (
        <svg
            viewBox="0 0 16 14"
            xmlns="http://www.w3.org/2000/svg"
            className={` controls-ArrowButton_icon controls-ArrowButton_icon_direction-${
                props.direction
            } ${attrs.className || props.className}`}
        >
            <path fillRule="evenodd" clipRule="evenodd" d="M8 3.5L15 9H13L8 5.3L3 9H1L8 3.5Z" />
        </svg>
    );
    const horizontalTemplate = (
        <svg
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            className={`controls-ArrowButton_icon controls-ArrowButton_icon_direction-${
                props.direction
            } ${attrs.className || props.className}`}
        >
            <path fillRule="evenodd" clipRule="evenodd" d="M11 8L7 14L6 14L10 8L6 2L7 2L11 8Z" />
        </svg>
    );
    return props.direction === 'up' || props.direction === 'down'
        ? verticalTemplate
        : horizontalTemplate;
});
