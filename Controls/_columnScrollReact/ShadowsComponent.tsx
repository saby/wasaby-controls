/**
 * @kaizen_zone f2525ebd-e747-4591-b4c8-935558e9eb48
 */
import * as React from 'react';
import { EdgeState } from './common/types';
import { ColumnScrollContext } from './context/ColumnScrollContext';
import { QA_SELECTORS } from './common/data-qa';

/**
 * Опции компонента ShadowsComponent.
 * @private
 */
export interface IShadowsComponentProps {
    /**
     * CSS класс левой тени.
     */
    leftShadowClassName?: string;
    /**
     * CSS класс правой тени.
     */
    rightShadowClassName?: string;

    /**
     * Видима ли левая тень.
     */
    isLeftVisible: boolean;
    /**
     * Видима ли правая тень.
     */
    isRightVisible: boolean;
}

function getShadowClassName(
    direction: 'left' | 'right',
    isVisible: boolean,
    userClassName?: string
): string {
    const baseClassName = 'controls-ColumnScrollReact__shadow';

    return (
        `${baseClassName} ` +
        `${baseClassName}_${direction} ` +
        (isVisible ? `${baseClassName}_visible ` : '') +
        `${userClassName || ''}`
    ).trim();
}

/**
 * Компонент, отображающий тени скролла.
 * @private
 */
export function ShadowsComponent(
    props: IShadowsComponentProps
): React.FunctionComponentElement<IShadowsComponentProps> {
    return (
        <>
            <div
                data-qa={QA_SELECTORS.LEFT_SHADOW}
                className={getShadowClassName(
                    'left',
                    props.isLeftVisible,
                    props.leftShadowClassName
                )}
            />
            <div
                data-qa={QA_SELECTORS.RIGHT_SHADOW}
                className={getShadowClassName(
                    'right',
                    props.isRightVisible,
                    props.rightShadowClassName
                )}
            />
        </>
    );
}

const ShadowsComponentMemo = React.memo(ShadowsComponent);

export interface IShadowsComponentConsumerProps {
    leftShadowClassName?: string;
    rightShadowClassName?: string;
}

export function ShadowsComponentConsumer({
    leftShadowClassName = '',
    rightShadowClassName = '',
}: IShadowsComponentConsumerProps): React.FunctionComponentElement<{}> {
    const context = React.useContext(ColumnScrollContext);

    if (!context.isNeedByWidth) {
        return null;
    }

    // При плавной, анимированной прокрутке тени должны отражать текущее состояние анимации.
    // Тень видна:
    // СРАЗУ при старте анимации скролирования от края;
    // ПОСЛЕ ЗАВЕРШЕНИЯ АНИМАЦИИ при скролировании к краю.
    // Состояния leftEdgeState и rightEdgeState отражают текущее состояние границы,
    // видна ли она или происходит анимация прокрутки к/от нее.

    return (
        <ShadowsComponentMemo
            leftShadowClassName={`${leftShadowClassName} ${context.SELECTORS.OFFSET_FOR_START_FIXED_ELEMENT}`}
            rightShadowClassName={`${rightShadowClassName} ${context.SELECTORS.OFFSET_FOR_END_FIXED_ELEMENT}`}
            isLeftVisible={context.leftEdgeState !== EdgeState.Visible}
            isRightVisible={context.rightEdgeState !== EdgeState.Visible}
        />
    );
}

export default React.memo(ShadowsComponentConsumer);
