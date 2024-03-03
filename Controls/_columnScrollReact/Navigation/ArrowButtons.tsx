/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import * as React from 'react';
import { ArrowButton } from 'Controls/extButtons';
import { INavigationInnerComponentProps } from './interface';

export interface IArrowButtonsNavigationComponentProps extends INavigationInnerComponentProps {
    isLeftEnabled?: boolean;
    isRightEnabled?: boolean;
    onArrowClick?: (direction: 'backward' | 'forward') => void;
}

function ArrowButtonsNavigationComponent(
    props: IArrowButtonsNavigationComponentProps
): React.FunctionComponentElement<IArrowButtonsNavigationComponentProps> {
    return (
        <div className={props.className || ''}>
            <ArrowButton
                direction="left"
                contrastBackground={true}
                readOnly={!props.isLeftEnabled}
                className="controls-margin_right-xs"
                onClick={() => {
                    props.onArrowClick?.('backward');
                }}
                attrs={{
                    'data-qa': 'ColumnScroll__scrollToButton-left',
                }}
            />
            <ArrowButton
                direction="right"
                contrastBackground={true}
                readOnly={!props.isRightEnabled}
                onClick={() => {
                    props.onArrowClick?.('forward');
                }}
                attrs={{
                    'data-qa': 'ColumnScroll__scrollToButton-right',
                }}
            />
        </div>
    );
}

export default React.memo(ArrowButtonsNavigationComponent);
