import * as React from 'react';

export function MyComponent(props): JSX.Element {
    return (
        <div className="myComponent">
            {props.contentVisible && <div className="myComponent__first">Скрываемая область</div>}
            <div className="myComponent__second"></div>
        </div>
    );
}

MyComponent.defaultProps = {
    contentVisible: true,
};
