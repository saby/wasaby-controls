/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */

export interface IControlProps {
    className?: string;
    style?: object;
    dataQa?: string;
    'data-qa'?: string;
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
