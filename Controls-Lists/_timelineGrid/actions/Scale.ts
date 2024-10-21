/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import { IActionExecuteParams, IListActionOptions, ListAction } from 'Controls/actions';
import { getNextQuantum, getNextQuantumScale, TScaleDirection } from '../utils';
import type TimelineGridSlice from 'Controls-Lists/_timelineGrid/factory/Slice';
import * as rk from 'i18n!Controls-Lists';

export interface IScaleActionOptions extends IListActionOptions {
    listId: string;
    direction: TScaleDirection;
}

export interface IScaleActionExecuteArguments extends IScaleActionOptions, IActionExecuteParams {}

const scaleActions = {
    increase: {
        id: 'increaseScale',
        title: rk('Увеличить масштаб'),
        icon: 'icon-ZoomIn',
    },
    decrease: {
        id: 'decreaseScale',
        title: rk('Уменьшить масштаб'),
        icon: 'icon-ZoomOut',
    },
};

/**
 * Действие "Переключение масштаба сетки таймлайн таблицы"
 * @extends Controls/actions:ListAction
 * @public
 */
export default class Scale extends ListAction<IScaleActionOptions, IScaleActionExecuteArguments> {
    constructor(props: IScaleActionOptions) {
        super({
            ...props,
            id: props.id || scaleActions[props.direction].id,
            icon: scaleActions[props.direction].icon,
            tooltip: scaleActions[props.direction].title,
            title: scaleActions[props.direction].title,
        });
    }

    updateContext(newContext: IScaleActionOptions['context']): void {
        const slice = newContext[this._options.listId];
        const quantum = slice.state.quantum;
        const quantums = slice.state.quantums;
        const step = slice.state.step;
        // Кнопка была недоступна
        if (this.readOnly) {
            const nextStep = getNextQuantumScale(quantum, quantums, step, this._options.direction);
            // Если снова есть куда масштабировать, меняем доступность
            if (nextStep) {
                this.readOnly = false;
            }
        }
    }

    execute(options?: IScaleActionExecuteArguments): Promise<unknown> | void {
        let quantum = this._getSlice().state.quantum;
        const quantums = this._getSlice().state.quantums;
        const quantumScale = this._getSlice().state.quantumScale;
        let nextScale = getNextQuantumScale(
            quantum,
            quantums,
            quantumScale,
            this._options.direction
        );
        // При увеличении масштаба меняем квант в глубину.
        // При уменьшении - возвращаем обратно.
        if (
            !nextScale &&
            ((quantumScale === 1 && this._options.direction === 'increase') || quantumScale !== 1)
        ) {
            quantum = getNextQuantum(quantum, quantums, this._options.direction);
            nextScale =
                this._options.direction === 'decrease'
                    ? 1
                    : getNextQuantumScale(quantum, quantums, quantumScale, this._options.direction);
        }
        if (nextScale) {
            this._getSlice().setQuantumScale(nextScale, quantum, this._options.direction);
        }
    }

    protected _getSlice(): TimelineGridSlice {
        return this._options.context[this._options.listId] as TimelineGridSlice;
    }
}

Object.assign(Scale.prototype, {
    iconStyle: 'secondary',
});

/**
 * @name Controls-Lists/_timelineGrid/actions/Scale#listId
 * @cfg {string} Уникальный идентификатор поля в контексте данных
 */
/**
 * @name Controls-Lists/_timelineGrid/actions/Scale#direction
 * @cfg {Controls-Lists/_timelineGrid/utils/TScaleDirection.typedef} Направление масштабирования
 */
