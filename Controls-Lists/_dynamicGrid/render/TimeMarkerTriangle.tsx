/**
 * @kaizen_zone 9377bd5b-f96c-43f4-bb99-324d7bfb4363
 */
import * as React from 'react';

interface ITimeMarkerTriangleProps {
    style?: '';
    className?: '';
    text: string;
}

/**
 * Контрол - треугольник линии текущего дня
 * @param props {ITimeMarkerTriangleProps}
 * @author Крупина К.
 */
export function TimeMarkerTriangle(props: ITimeMarkerTriangleProps): React.ReactElement {
    let computedClassName = `ControlsLists-dateLine__triangle ${
        props.text
            ? 'ControlsLists-dateLine__triangle_with_text'
            : 'ControlsLists-dateLine__triangle_without_text'
    } `;
    if (props.className) {
        computedClassName += props.className;
    }

    return (
        <div className={computedClassName} style={props.style}>
            {props.text && (
                <div className={'ControlsLists-dateLine__triangle_text'}>{props.text}</div>
            )}
        </div>
    );
}
