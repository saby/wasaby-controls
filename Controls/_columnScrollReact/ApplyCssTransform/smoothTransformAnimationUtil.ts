/**
 * @kaizen_zone 9a7cef37-31b7-49ee-a384-22b66a35929b
 */
import { getTransformCSSRule } from '../common/helpers';

/**
 * Интерфейс описывает анимацию плавного скроллирования с использованием keyframe, которую генерирует утилита.
 */
export interface IAnimation {
    /**
     * Сгенерированный идентификатор анимации.
     */
    id: string;
    /**
     * Сгенерированный keyframe анимации.
     */
    keyframe: string;
    /**
     * Сгенерированное CSS правило для применения анимации.
     */
    rule: string;
}

/**
 * Интерфейс описывает анимацию плавного скроллирования для скроллируемого и фиксированного контента.
 */
interface ICreateAnimationResult {
    /**
     * Анимация скроллируемого контента.
     */
    scrollAnimation: IAnimation;
    /**
     * Анимация фиксированного контента.
     */
    fixationAnimation: IAnimation;
}

/**
 * Возвращает объект, описывающий анимацию плавного скроллирования.
 * @param {string} animationId Уникальный идентификатор анимации. Используется, для множественной одновременной анимации разных элементов.
 * @param {number} from Позиция от которой должна происходить анимация скроллирования.
 * @param {number} to Позиция к которой должна происходить анимация скроллирования.
 * @param {string} animationDuration Длительность анимации в формате значения CSS свойства animation-duration([n]s или [n]ms).
 * @return {ICreateAnimationResult}
 */
export function createAnimation(
    animationId: string,
    from: number,
    to: number,
    animationDuration: string
): ICreateAnimationResult {
    const scrollAnimationId = `scrollAnimation_${animationId}`;
    const fixationAnimationId = `fixationAnimation_${animationId}`;

    return {
        scrollAnimation: {
            id: scrollAnimationId,
            keyframe: _buildTransformKeyFrame(scrollAnimationId, -from, -to),
            rule: _buildRule(scrollAnimationId, animationDuration),
        },
        fixationAnimation: {
            id: fixationAnimationId,
            keyframe: _buildTransformKeyFrame(fixationAnimationId, from, to),
            rule: _buildRule(fixationAnimationId, animationDuration),
        },
    };
}

/**
 * Возвращает кейфрейм анимации плавного скроллирования с заданными позициями и идентификатором анимации.
 * @param {string} animationId Уникальный в рамках приложения идентификатор анимации.
 * @param {number} from Позиция от которой должна происходить анимация скроллирования.
 * @param {number} to Позиция к которой должна происходить анимация скроллирования.
 * @return {string}
 */
function _buildTransformKeyFrame(animationId: string, from: number, to: number): string {
    return (
        `@keyframes ${animationId} {` +
        `from{${getTransformCSSRule(from)}}` +
        `to{${getTransformCSSRule(to)}}` +
        '}'
    );
}

/**
 * Возвращает CSS правило для применения анимации с определенной длительностью.
 * @param {string} animationId Уникальный в рамках приложения идентификатор анимации.
 * @param {string} animationDuration Длительность анимации в формате значения CSS свойства animation-duration([n]s или [n]ms).
 * @return {string}
 */
function _buildRule(animationId: string, animationDuration: string): string {
    return `animation-name: ${animationId};animation-duration: ${animationDuration};`;
}
