/**
 * @kaizen_zone 6ccf0789-a238-4656-86f6-d0eff65e12f9
 */
import { loadAsync } from 'WasabyLoader/ModulesLoader';
import { IoC } from 'Env/Env';
import { default as Player } from 'Controls/_hintManager/Player';
import { default as RouteModel } from 'Controls/_hintManager/RouteModel';
import type { Model } from 'Types/entity';
import { IRouteModel } from 'Controls/_hintManager/interface/IRouteModel';
import { IStepModel } from 'Controls/_hintManager/interface/IStepModel';

/**
 * Контроллер, управляющий маршрутами подсказок.
 * @public
 */
class Controller {
    private _player: Player | null;
    private _routeModel: RouteModel | null;

    private _currentStepIndex: number;
    private _beforeOpenCallback: Function | null;

    constructor(route: Model<IRouteModel>) {
        this._player = new Player();
        this._routeModel = new RouteModel(route);
    }

    /**
     * Метод разрушает экземпляр класса контроллера маршрутов подсказок.
     */
    destroy(): void {
        this._player.destroy();
        this._player = null;

        this._routeModel.destroy();
        this._routeModel = null;

        this._beforeOpenCallback = null;
    }

    /**
     * Метод запускает маршрут, начиная с шага, идентификатор которого был передан в параметрах.
     * @remark По умолчанию маршрут запускается с первого шага.
     * @param {String} [id] Идентификатор получаемого маршрута подсказок.
     */
    activate(id?: string): void {
        const route = this.getRoute();
        this._player.activateViewMode(route.get('id'));

        this._currentStepIndex = id ? this._routeModel.getStepIndexById(id) : 0;
        this._showStep();
    }

    /**
     * Метод прерывает текущий маршрут.
     */
    abort(): void {
        this._player.abortViewMode();
        this._currentStepIndex = 0;
    }

    /**
     * Метод получает текущую модель маршрута подсказок.
     * @return {Types/entity:Model}
     */
    getRoute(): Model<IRouteModel> {
        return this._routeModel.getRoute();
    }

    /**
     * Метод осуществляет навигацию к предыдущему шагу маршрута подсказок.
     */
    prev(): void {
        if (this._currentStepIndex) {
            this._currentStepIndex--;
            this._showStep();
        } else if (this._currentStepIndex === 0 && this._routeModel.isCycleRoute()) {
            this._currentStepIndex = this._routeModel.getStepsCount() - 1;
            this._showStep();
        } else {
            this.abort();
        }
    }

    /**
     * Метод осуществляет навигацию к следующему шагу маршрута подсказок.
     */
    next(): void {
        const stepsCount = this._routeModel.getStepsCount();
        if (this._currentStepIndex < stepsCount - 1) {
            this._currentStepIndex++;
            this._showStep();
        } else if (this._currentStepIndex === stepsCount - 1 && this._routeModel.isCycleRoute()) {
            this._currentStepIndex = 0;
            this._showStep();
        } else {
            this.abort();
        }
    }

    /**
     * Метод открывает произвольный шаг маршрута по его идентификатору.
     * @param {String} id Идентификатор шага маршрута.
     */
    openStep(id: string): void {
        const index = this._routeModel.getStepIndexById(id);
        if (index > -1) {
            this._currentStepIndex = index;
            this._showStep();
        } else {
            IoC.resolve('ILogger').error(
                `Controls/_hintManager/Controller:openStep - в маршруте отсутствует шаг с идентификатором ${id}`
            );
        }
    }

    /**
     * Метод добавляет шаг в конец маршрута.
     * @remark Если в маршруте имеется шаг с таким же идентификатором, имеющийся шаг будет удалён.
     * @param {Types/entity:Model} step Добавляемый шаг.
     * @return {Types/entity:Model} Добавленный шаг.
     */
    addStep(step: Model<IStepModel>): Model<IStepModel> {
        return this._routeModel.addStep(step);
    }

    /**
     * Метод обновляет модель шага маршрута по его идентификатору.
     * @param {String} id Идентификатор шага маршрута.
     * @param {Types/entity:Model} step Новая модель шага маршрута.
     * @return {Types/entity:Model} Обновленный шаг маршрута.
     */
    updateStep(id: string, step: Model<IStepModel>): Model<IStepModel> {
        return this._routeModel.updateStep(id, step);
    }

    /**
     * Метод удаляет шаг маршрута по его идентификатору.
     * @param {String} id Идентификатор шага маршрута.
     * @return {Types/entity:Model} Удаленный шаг.
     */
    removeStep(id: string): Model<IStepModel> {
        const index = this._routeModel.getStepIndexById(id);
        if (index === this._currentStepIndex) {
            this._player.abortViewMode();
        }
        return this._routeModel.removeStep(id);
    }

    private _showStep(): void {
        this._callBeforeOpenCallback().then(() => {
            const step = this._routeModel.getStepByIndex(this._currentStepIndex);
            this._player.showStep(step, this._routeModel.isOnlyHighlightAllowed());
        });
    }

    private _callBeforeOpenCallback(): Promise<void> {
        if (this._beforeOpenCallback) {
            return this._beforeOpenCallback();
        }

        const callbackPath = this._routeModel.getOnBeforeOpenCallback();
        if (callbackPath) {
            return loadAsync(callbackPath).then((callback: Function) => {
                this._beforeOpenCallback = callback;
                return callback();
            }, (err: Error) => {
                IoC.resolve('ILogger').error(
                    'Controls/_hintManager/Controller:_callBeforeOpenCallback - ошибка загрузки onBeforeOpenCallback',
                    err
                );
            });
        }
        return Promise.resolve();
    }
}

export default Controller;
