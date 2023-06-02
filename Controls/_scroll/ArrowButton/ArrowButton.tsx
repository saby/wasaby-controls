import * as React from 'react';

interface IArrowButton {
    orientation: 'horizontal' | 'vertical';
    direction: string;
    onClick: Function;
    className?: string;
}

export default function ArrowButton(props: IArrowButton): React.ReactElement {
    const {orientation, direction, onClick} = props;
    return (
        <div
            className={`controls_Scroll__ArrowButton controls_Scroll__ArrowButton__${orientation}` +
                ` controls_Scroll__ArrowButton_direction_${direction} ${props.className || ''}`}
            data-qa={`controls_Scroll__ArrowButton_direction_${direction}`}
            onClick={() => {
                let btnDirection = props.direction;
                if (orientation === 'vertical') {
                    btnDirection = direction === 'up' ? 'prev' : 'next';
                }
                return onClick(btnDirection, orientation);
            }}
        >
            <svg
                viewBox="0 0 16 14"
                xmlns="http://www.w3.org/2000/svg"
                className={`controls_Scroll__ArrowButton_icon controls_Scroll__ArrowButton_icon_direction-${direction}`}>
                <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M 8 4 L 15 9 H 14 L 8 5 L 2 9 H 1 L 8 4 Z"
                />
            </svg>
        </div>
    );
};
