import * as React from 'react';
import { useReadonly, useTheme } from 'UI/Contexts';

interface IRadioCircleProps {
    theme: string;
    readOnly: boolean;
    selected: boolean;
    className?: string;
    onClick?: React.MouseEventHandler;
}

export default React.forwardRef(function RadioCircle(
    props: IRadioCircleProps,
    forwardedRef: React.LegacyRef<SVGSVGElement>
): React.ReactElement {
    const theme = useTheme(props);
    const readOnly = useReadonly(props);
    return (
        <svg
            onClick={props.onClick}
            ref={forwardedRef}
            xmlns="http://www.w3.org/2000/svg"
            id="Слой_1"
            data-name="Слой 1"
            className={
                `controls_toggle_theme-${theme} controls-RadioCircle__svg` + ' ' + props.className
            }
            viewBox="0 0 12 12"
        >
            <circle
                xmlns="http://www.w3.org/2000/svg"
                className={
                    'controls-RadioCircle__borderCircle' +
                    ` controls-RadioCircle__borderCircle_${readOnly ? 'disabled' : 'enabled'}` +
                    ` controls-RadioCircle__borderCircle_${
                        props.selected ? 'selected' : 'unselected'
                    }${readOnly ? '_disabled' : ''}`
                }
                cx="6"
                cy="6"
                r="5.5"
            />
            <rect
                xmlns="http://www.w3.org/2000/svg"
                className={
                    'controls-RadioCircle__innerCircle' +
                    ` controls-RadioCircle__innerCircle_${
                        props.selected
                            ? readOnly
                                ? 'selected_disabled'
                                : 'selected_enabled'
                            : 'unselected'
                    }`
                }
                x="2"
                y="2"
                width="8"
                height="8"
                rx="4"
                ry="4"
            />
        </svg>
    );
});
