/**
 * @kaizen_zone 69fe1fdb-6718-4f49-a543-3ddd8385ec17
 */
import { IControlOptions, TemplateFunction } from 'UI/Base';
import { Control } from 'UI/Base';
import { ReactElement } from 'react';

export interface IPreviewerOptions<T = any> extends IControlOptions {
    opener?: Control;
    content?: Function;
    trigger: string;
    stopPreviewerOnClick?: boolean;
    actionOnScroll?: string;
    template?: string | ReactElement | TemplateFunction;
    templateOptions?: T;
    isCompoundTemplate?: boolean; // TODO Compatible
    targetPoint?: any; // why?
    direction?: any; // why?
    offset?: any; // why?
    delay?: number;
    width?: number;
    height?: number;
    shouldWaitCursorToStop?: boolean;
}

/**
 * Интерфейс для опций окна предпросмотра.
 * @interface Controls/_popup/interface/IPreviewer
 * @public
 */

export interface IPreviewer {
    readonly '[Controls/_popup/interface/IPreviewer]': boolean;
}

/**
 * @name Controls/_popup/interface/IPreviewer#content
 * @cfg {Content} Контент, при взаимодействии с которым открывается окно.
 */

/**
 * @name Controls/_popup/interface/IPreviewer#template
 * @cfg {Content} Содержимое окна.
 */

/**
 * @name Controls/_popup/interface/IPreviewer#trigger
 * @cfg {String} Название события, которое запускает открытие или закрытие окна.
 * @variant click Открытие кликом по контенту. Закрытие кликом "мимо" - не по контенту или шаблону.
 * @variant demand Закрытие кликом по контенту или шаблону.
 * @variant hover Открытие по ховеру - по наведению курсора на контент. Закрытие по ховеру - по навердению курсора на контент или шаблон.
 * @variant hoverAndClick Открытие по клику или ховеру на контент. Закрытие по клику или или ховеру "мимо" - не по контенту или шаблону.
 * @default hoverAndClick
 */

/**
 * @name Controls/_popup/interface/IPreviewer#stopPreviewerOnClick
 * @cfg {Boolean} Определяет, нужно ли прервать показ окна, если произошел клик на таргет.
 * @remark
 * Работает только со значением hover в опции trigger
 * @default false
 * @see Controls/_popup/interface/IPreviewer#trigger
 */

/**
 * @typedef {Object} direction
 * @property {vertical} vertical
 * @property {horizontal} horizontal
 */

/**
 * @typedef {Object} offset
 * @property {Number} vertical
 * @property {Number} horizontal
 */

/**
 * @typedef {Enum} vertical
 * @variant top
 * @variant bottom
 * @variant center
 */

/**
 * @typedef {Enum} horizontal
 * @variant left
 * @variant right
 * @variant center
 */

/**
 * @name Controls/_popup/interface/IPreviewer#direction
 * @cfg {direction} Устанавливает выравнивание всплывающего окна относительно точки позиционнирования.
 */

/**
 * @name Controls/_popup/interface/IPreviewer#targetPoint
 * @cfg {direction} Точка позиционнирования всплывающего окна относительно вызывающего элемента.
 */

/**
 * @name Controls/_popup/interface/IPreviewer#offset
 * @cfg {offset} Устанавливает отступы от точки позиционнирования до всплывающего окна
 */

/**
 * @name Controls/_popup/interface/IPreviewer#templateOptions
 * @cfg {T|Object} Опции для контрола, переданного в {@link template}
 * @remark Также есть возможность описания опций шаблона с помощью дженерика IPreviewerOptions<T>
 */

/**
 * @name Controls/_popup/interface/IPreviewer#actionOnScroll
 * @cfg {String} Определяет реакцию всплывающего окна на скролл родительской области
 * @variant close Всплывающее окно закрывается
 * @variant none Всплывающее окно остается на месте расположения, вне зависимости от движения точки позиционнирования
 * @default close
 */

/**
 * @name Controls/_popup/interface/IPreviewer#actionOnScroll
 * @cfg {String} Определяет реакцию всплывающего окна на скролл родительской области
 * @variant close Всплывающее окно закрывается
 * @variant none Всплывающее окно остается на месте расположения, вне зависимости от движения точки позиционнирования
 * @default close
 */

/*
 * @name Controls/_popup/interface/IPreviewer#trigger
 * @cfg {String} Event name trigger the opening or closing of the template.
 * @variant click Opening by click on the content. Closing by click not on the content or template.
 * @variant demand Closing by click not on the content or template.
 * @variant hover Opening by hover on the content. Closing by hover not on the content or template.
 * @variant hoverAndClick Opening by click or hover on the content. Closing by click or hover not on the content or template.
 * @default hoverAndClick
 */

/**
 * @name Controls/_popup/interface/IPreviewer#close
 * @function
 * @description Метод для закрытия всплывающего окна.
 * @remark Используется для закрытия окна, если опция {@link trigger} установлена в значении demand
 */

/**
 * @name Controls/_popup/interface/IPreviewer#open
 * @function
 * @description Метод для открытия всплывающего окна.
 * @remark Используется для открытия окна, если опция {@link trigger} установлена в значении demand
 */

/**
 * @name Controls/_popup/interface/IPreviewer#width
 * @cfg {number} Ширина всплывающего окна.
 */

/**
 * @name Controls/_popup/interface/IPreviewer#height
 * @cfg {number} Высота всплывающего окна.
 */

/**
 * @name Controls/_popup/interface/IPreviewer#delay
 * @cfg {number} Задержка перед появлением всплываюещго окна при заданной опции trigger, принимающей значение hover или hoverAndClick. Задаётся в мс.
 */

/**
 * @name Controls/_popup/interface/IPreviewer#shouldWaitCursorToStop
 * @cfg {boolean} Определяет необходимость открытия окна сразу при наведении на контрол. При значении равном true, окно открывается только после остановки курсора на контроле.
 * @default true
 */
