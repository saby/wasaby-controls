/**
 * @kaizen_zone 916d4071-6bb4-4800-b3ff-2ee6725c9fdc
 */
/**
 * @typedef {String} Controls/_interface/ITagStyle/TTagStyle
 * @description Стиль тега
 * @variant info
 * @variant danger
 * @variant primary
 * @variant success
 * @variant warning
 * @variant secondary
 */
/*
 * @typedef {String} Controls/_interface/ITagStyle/TTagStyle
 * @variant info
 * @variant danger
 * @variant primary
 * @variant success
 * @variant warning
 * @variant secondary
 */
export type TTagStyle =
    | 'info'
    | 'danger'
    | 'primary'
    | 'success'
    | 'warning'
    | 'secondary'
    | string;

/**
 * @typedef {String} Controls/_interface/ITagStyle/TTagPosition
 * @description Положение тега-уголка.
 * @variant content В правом верхнем углу контента.
 * @variant border В правом верхнем углу ячейки.
 */
export type TTagPosition = 'content' | 'border';

/**
 * Интерфейс для сущностей, обладающих настройкой тега-уголка
 * @public
 */
export interface ITagProps {
    /**
     * Стиль заливки тега-уголка.
     * @cfg
     */
    tagStyle?: TTagStyle;

    /**
     * Положение тега-уголка.
     * @cfg
     */
    tagPosition?: TTagPosition;

    /**
     * css-класс тега-уголка.
     * @cfg
     */
    tagClassName?: string;
}

/**
 * Интерфейс для конфигурации колонки c тегом в {@link Controls/grid:View таблице} и {@link Controls/treeGrid:View дереве с колонками}.
 *
 * @public
 */
/*
 * Interface for column with enabled tagTemplate in controls {@link Controls/grid:View Таблица} & {@link Controls/treeGrid:View Дерево}.
 *
 * @interface Controls/_interface/ITagStyle
 * @public
 * @author Аверкиев П.А.
 */
export interface ITagStyle {
    /**
     * @cfg {String} Имя свойства, содержащего стиль тега.
     */
    /*
     * @name Controls/_interface/ITagStyle#tagStyleProperty
     * @cfg {String} Name of the property that contains tag style
     */
    tagStyleProperty?: string;
}
