/**
 * @kaizen_zone 6ccf0789-a238-4656-86f6-d0eff65e12f9
 */
import { IoC } from 'Env/Env';
import { Model } from 'Types/entity';
import { IRouteModel } from 'Controls/_hintManager/interface/IRouteModel';
import { IStepModel } from 'Controls/_hintManager/interface/IStepModel';

/**
 * Класс, предоставляющий методы работы с моделью маршрута подсказок.
 * @public
 */
class RouteModel {
    private _route: Model | null;

    constructor(route: Model<IRouteModel>) {
        if (route instanceof Model) {
            this._route = route;
        } else {
            IoC.resolve('ILogger').error('Controls/_hintManager/RouteModel:constructor - маршрут должен быть моделью');
        }
    }

    /**
     * Метод разрушает экземпляр класса, предоставляющего методы работы с моделью маршрута подсказок.
     */
    destroy(): void {
        this._route = null;
    }

    /**
     * Метод получает текущую модель маршрута подсказок.
     * @return {Types/entity:Model}
     */
    getRoute(): Model<IRouteModel> {
        return this._route;
    }

    /**
     * Метод получает путь до функции обратного вызова перед показом шага маршрута.
     * @return {String}
     */
    getOnBeforeOpenCallback(): string {
        return this._route.get('onBeforeOpenCallback');
    }

    /**
     * Метод проверяет, является маршрут циклическим.
     * @return {Boolean}
     */
    isCycleRoute(): boolean {
        return !!this._route.get('display')?.isCycle;
    }

    /**
     * Метод проверяет, разрешено в маршруте ли отображение выделения целевого элемента без окна подсказки.
     * @return {Boolean}
     */
    isOnlyHighlightAllowed(): boolean {
        return !!this._route.get('display')?.isOnlyHighlightAllowed;
    }

    /**
     * Метод получает количество шагов в маршруте подсказок.
     * @return {Number}
     */
    getStepsCount(): number {
        return this._route.get('scheme').getCount();
    }

    /**
     * Метод получает индекс шага маршрута по его идентификатору.
     * @param {String} id идентификатор шага подсказки.
     * @return {Number}
     */
    getStepIndexById(id: string): number {
        return this._route.get('scheme').getIndexByValue('id', id);
    }

    /**
     * Метод получает шаг маршрута по индексу.
     * @param {Number} index Индекс шага маршрута.
     * @return {Types/entity:Model}
     */
    getStepByIndex(index: number): Model<IStepModel> {
        return this._route.get('scheme').at(index);
    }

    /**
     * Метод добавляет шаг в конец маршрута.
     * @remark Если в маршруте имеется шаг с таким же идентификатором, имеющийся шаг будет удалён.
     * @param {Types/entity:Model} step Добавляемый шаг.
     * @return {Types/entity:Model} Добавленный шаг маршрута.
     */
    addStep(step: Model<IStepModel>): Model<IStepModel> {
        const id = step.get('id');
        const scheme = this._route.get('scheme');
        const index = scheme.getIndexByValue('id', id);
        if (index > -1) {
            scheme.removeAt(index);
        }
        return scheme.add(step);
    }

    /**
     * Метод обновляет модель шага маршрута по его идентификатору.
     * @param {String} id Идентификатор шага маршрута.
     * @param {Types/entity:Model} step Новая модель шага маршрута.
     * @return {Types/entity:Model} Обновленный шаг маршрута.
     */
    updateStep(id: string, step: Model<IStepModel>): Model<IStepModel> {
        const scheme = this._route.get('scheme');
        const index = scheme.getIndexByValue('id', id);
        if (index === -1) {
            IoC.resolve('ILogger').error(
                `Controls/_hintManager/RouteModel:updateStep - в маршруте отсутствует шаг с идентификатором ${id}`
            );
        }
        return scheme.replace(step, index);
    }

    /**
     * Метод удаляет шаг маршрута по его идентификатору.
     * @param {String} id Идентификатор шага маршрута.
     * @return {Types/entity:Model} Удаленный шаг маршрута.
     */
    removeStep(id: string): Model<IStepModel> {
        const scheme = this._route.get('scheme');
        const index = scheme.getIndexByValue('id', id);
        if (index === -1) {
            IoC.resolve('ILogger').error(
                `Controls/_hintManager/RouteModel:removeStep - в маршруте отсутствует шаг с идентификатором ${id}`
            );
        }
        return scheme.removeAt(index);
    }
}

export default RouteModel;
