/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';

interface ICurrentDateLine {
    style?: '';
    className?: '';
}

/**
 * Линия текущего дня
 */
export function DateLine(props: ICurrentDateLine): React.ReactElement {
    let computedClassName = 'ControlsLists-dateLine__line ';
    if (props.className) {
        computedClassName += props.className;
    }
    return <div className={computedClassName} style={props.style} />;
}
