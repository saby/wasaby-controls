/**
 * @kaizen_zone fd2f64a5-d515-49d2-8fef-3e6af047ff0a
 */
import { IItemAction, TFontSize } from 'Controls/interface';

/**
 * Расширенный интерфейс IItemAction с полями для использования в шаблоне
 * @interface Controls/_itemActions/interface/IItemActionsObject/IShownItemAction
 * @private
 */

/*
 * Extended interface for itemActions to use it inside of template
 * @interface
 * @private
 * @author Аверкиев П.А.
 */
export interface IShownItemAction extends IItemAction {
    /**
     * Текст кнопки операции над записью
     */
    caption?: string;

    /**
     * Флаг определяющий, надо ли показывать иконку кнопки операции над записью
     */
    hasIcon?: boolean;

    /**
     * Флаг определяющий, является ли текущая кнопка операции над записью кнопкой вызова меню (Кнопка с тремя точками)
     */
    isMenu?: boolean;

    /**
     * Высота базовой линии для равнивания иконки внутри кнопки
     */
    inlineHeight?: string;

    /**
     * Размер шрифта для выравнивания иконки
     */
    fontSize?: TFontSize;

    /**
     * Рассчитанный флаг, означающий, что иконка передана в формате SVG
     */
    isSVGIcon?: boolean;

    /**
     * Возможность активировать фокус на кнопке операций над записью. По умолчанию выключен.
     */
    hasFocus?: boolean;

    /**
     * Метод для исполнения действия с записью, когда действия с записью заданы в формате действий тулбара
     */
    execute?: (meta: object) => Promise<unknown> | void;
}

export interface IItemActionsObject {
    all: IItemAction[];
    showed: IShownItemAction[];
}
