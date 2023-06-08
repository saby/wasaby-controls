/**
 * @kaizen_zone 6ccf0789-a238-4656-86f6-d0eff65e12f9
 */
import { RecordSet } from 'Types/collection';
import { IStepModel } from 'Controls/_hintManager/interface/IStepModel';

/**
 * Интерфейс модели маршрута.
 * @public
 */

export interface IRouteModel {
    /**
     * Идентификатор маршрута.
     * @cfg {String}
     */
    id: string;

    /**
     * Рекордсет шагов маршрута.
     * @cfg {Number}
     */
    scheme: RecordSet<IStepModel>;

    /**
     * Объект с характеристиками отображения маршрута.
     * @cfg {IStepDisplay}
     */
    display?: IRouteDisplay;

    /**
     * Путь до функции обратного вызова перед показом шага маршрута.
     * @cfg {String}
     */
    onBeforeOpenCallback?: string;
}

export interface IRouteDisplay {
    /**
     * Признак необходимости зацикливания навигации по маршруту.
     * @cfg {Boolean}
     */
    isCycle?: boolean;

    /**
     * Признак разрешенности отображения выделения целевого элемента без окна подсказки.
     * @cfg {Boolean}
     */
    isOnlyHighlightAllowed?: boolean;
}
