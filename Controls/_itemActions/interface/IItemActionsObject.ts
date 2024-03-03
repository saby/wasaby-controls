/**
 * @kaizen_zone 9beb6001-b33d-4e7f-87af-c7bc9798e225
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
}

export interface IItemActionsObject {
    all: IItemAction[];
    showed: IShownItemAction[];
}
