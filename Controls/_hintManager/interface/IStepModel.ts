/**
 * @kaizen_zone 6ccf0789-a238-4656-86f6-d0eff65e12f9
 */
/**
 * Интерфейс модели шага маршрута.
 * @public
 */

export interface IStepModel {
    /**
     * Идентификатор шага маршрута.
     * @cfg {String}
     */
    id: string;

    /**
     * Порядок шага в маршруте.
     * @cfg {Number}
     */
    order: number;

    /**
     * Объект с характеристиками отображения шага.
     * @cfg {IStepDisplay}
     */
    display: IStepDisplay;

    /**
     * Простой текст подсказки.
     * @cfg {String}
     */
    message?: string;

    /**
     * Фрейм контента подсказки.
     * @cfg {Array}
     */
    widgets?: [];
}

export interface IStepDisplay {
    /**
     * Идентификатор целевого элемента подсказки. Например, '[data-name="some-Element"]'.
     * @cfg {String}
     */
    targetId: string;

    /**
     * Css-селектор области, внутри которой будет производиться поиск целевого элемента подсказки.
     * @cfg {String}
     */
    targetSearchAreaSelector?: string;

    /**
     * Стиль отображения подсказки. По умолчанию 'info'.
     * @cfg {String}
     */
    style?: string;

    /**
     * Конфигурация отступов от границ целевого элемента подсказки до выделяющей рамки.
     * @cfg {IHighlighterOffset}
     */
    highlighterOffset?: IHighlighterOffset;
}

export interface IHighlighterOffset {
    /**
     * Отступ сверху.
     * @cfg {Number}
     */
    top?: number;

    /**
     * Отступ справа.
     * @cfg {Number}
     */
    right?: number;

    /**
     * Отступ снизу.
     * @cfg {Number}
     */
    bottom?: number;

    /**
     * Отступ слева.
     * @cfg {Number}
     */
    left?: number;
}
