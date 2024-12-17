/**
 * @kaizen_zone 4efc1ffa-202d-406f-befe-efa4a5d4ee0c
 */
import { forwardRef, ReactElement } from 'react';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { IArrow } from './Arrow';

export default forwardRef(function ArrowStretched(props: IArrow, _): ReactElement {
    const attrs = props.attrs ? wasabyAttrsToReactDom(props.attrs) || {} : {};
    return (
        <svg
            viewBox="0 0 16 14"
            xmlns="http://www.w3.org/2000/svg"
            className={` controls-ArrowButton_icon controls-ArrowButton_stretched_icon_direction-${
                props.direction
            } ${attrs.className || props.className}`}
        >
            <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M 8 4 L 15 9 H 14 L 8 5 L 2 9 H 1 L 8 4 Z"
            />
        </svg>
    );
});
