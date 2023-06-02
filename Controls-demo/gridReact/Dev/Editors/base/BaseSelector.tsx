import * as React from 'react';

interface IProps {
    header?: string;
    children: React.ReactElement | React.ReactElement[];
    className?: string;
}

export default function BaseSelector(props: IProps): React.ReactElement {
    return (
        <div
            className={
                'controls__block-layout-item controls-padding-s ws-flexbox ' +
                (props.className || '')
            }
        >
            {props.header && (
                <h4 className={'controls-margin_right-s'}>{props.header}</h4>
            )}
            {props.children}
        </div>
    );
}
