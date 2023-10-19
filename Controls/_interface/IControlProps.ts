/**
 * @kaizen_zone 125406bf-1a36-46c5-a630-82966fed8357
 */

export interface IControlProps {
    className?: string;
    style?: object;
    dataQa?: string;
    theme?: string;
    readOnly?: boolean;
}

/**
 * Базовый интерфейс для контролов.
 *
 * @public
 */
export default interface IControl {
    readonly '[Controls/_interface/IControl]': boolean;
}

/**
 * @name Controls/_interface/IControl#className
 * @cfg {string} Имя класса, которое навесится на корневой контейнер компонента
 */
/**
 * @name Controls/_interface/IControl#dataQa
 * @cfg {string} Имя атрибута data-qa, которое навесится на корневой контейнер компонента. Используется для автотестирования.
 */
/**
 * @name Controls/_interface/IControl#theme
 * @cfg {String} Название темы оформления. В зависимости от темы загружаются различные таблицы стилей и применяются различные стили к контролу.
 */
/**
 * @name Controls/_interface/IControl#readOnly
 * @cfg {boolean} Определяет режим отображения 'только для чтения'.
 */
