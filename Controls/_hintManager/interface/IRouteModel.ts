/**
 * @kaizen_zone 6ccf0789-a238-4656-86f6-d0eff65e12f9
 */
import type { RecordSet } from 'Types/collection';
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
     * Функция или путь до функции обратного вызова перед показом шага маршрута. Функция обратного вызова должна возвращать Promise.
     * @cfg {String | Function}
     */
    onBeforeOpenCallback?: string | Function;

    /**
     * Объект с аргументами, который будет передан в функцию, указанную в опции {@link onBeforeOpenCallback}.
     * Дополнительно в поле объекта "step" будет передана модель шага маршрута, который будет показан сразу после
     * выполнения функции.
     * @cfg {Object}
     */
    onBeforeOpenCallbackArguments?: Record<string, unknown>;
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
