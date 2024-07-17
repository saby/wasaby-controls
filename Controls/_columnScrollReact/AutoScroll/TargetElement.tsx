/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import * as React from 'react';
import { QA_SELECTORS } from '../common/data-qa';
import { ColumnScrollContext } from '../context/ColumnScrollContext';

/**
 * Опции компонента TargetElement.
 * @private
 */
export type TTargetElementProps = {
    /**
     * Кастомные CSS стили компонента.
     */
    style?: React.CSSProperties;
    /**
     * Кастомный CSS класс компонента.
     */
    className?: string;
};

/**
 * Компонент, обозначающий границы автоподскрола при завершении скроллирования.
 * Применяется для обозначения размеченной области скроллирования на части, к которым должен совершаться автоподскрол.
 * Данный компонент размещается пользователем скролла.
 * При завершении скроллирования, механизм ищет первый неполностью показанный TargetElement в направлении скроллирования
 * и совершает синхронный доскролл к нему.
 * @private
 */
function TargetElement(props: TTargetElementProps): JSX.Element {
    const ctx = React.useContext(ColumnScrollContext);

    let className = ctx.SELECTORS.AUTOSCROLL_TARGET;
    if (props.className) {
        className += ` ${props.className}`;
    }

    return (
        <div style={props.style} data-qa={QA_SELECTORS.AUTOSCROLL_TARGET} className={className} />
    );
}

export default TargetElement;
