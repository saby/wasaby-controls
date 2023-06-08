/**
 * @kaizen_zone 32467cda-e824-424f-9d3b-3faead248ea2
 */
import * as React from 'react';
import * as rk from 'i18n!Controls';
import { TInternalProps } from 'UICore/Executor';

export interface IButtonsProps extends TInternalProps {
    theme: string;
    className?: string;
    onApplyClick: (event: React.MouseEvent<HTMLDivElement>) => void;
    onCloseClick: (event: React.MouseEvent<HTMLDivElement>) => void;
}

export default function Buttons(props: IButtonsProps): JSX.Element {
    let className = `controls_editableArea_theme-${props.theme} controls_popupTemplate_theme-${props.theme}`;
    className += ' controls-EditableArea__Toolbar';
    if (props.className) {
        className += ` ${props.className}`;
    }
    if (props.attrs?.className) {
        className += ` ${props.attrs.className}`;
    }

    return (
        <div
            data-qa={'controls-EditableArea__Toolbar'}
            className={className}
            ref={props.$wasabyRef}
        >
            <div
                data-qa={'controls-EditableArea__applyButton'}
                className={'controls-EditableArea__applyButton'}
                title={rk('Подтвердить')}
                onClick={props.onApplyClick}
            >
                <div
                    className={
                        'controls-EditableArea__applyButton-icon controls-icon_style-contrast icon-Yes'
                    }
                />
            </div>
            <div
                data-qa={'controls-EditableArea__closeButton'}
                className={'controls-EditableArea__closeButton'}
                title={rk('Закрыть')}
                onClick={props.onCloseClick}
            >
                <svg
                    className={'controls-EditableArea__closeButton-icon'}
                    xmlns={'http://www.w3.org/2000/svg'}
                    viewBox={'0 0 12 12'}
                >
                    <path
                        xmlns={'http://www.w3.org/2000/svg'}
                        d={
                            'M12.7,12l5.16-5.16a0.49,0.49,0,0,0-.7-0.7L12,11.3,6.84,6.14a0.49,0.49,0,0,0-.7.7L11.3,12,6.14,17.16a0.49,0.49,0,1,0,.7.7L12,12.7l5.16,5.16a0.49,0.49,0,0,0,.7-0.7Z'
                        }
                        transform={'translate(-6 -6)'}
                    />
                </svg>
            </div>
        </div>
    );
}
