/**
 * @kaizen_zone ddbc0bdc-0710-4e01-9472-8d1982a63a4e
 */
import { IActionExecuteParams, IListActionOptions, ListAction } from 'Controls/actions';
import { getRangePresets, getRangeSize, TScaleDirection } from '../utils';
import type TimelineGridSlice from 'Controls-Lists/_timelineGrid/factory/Slice';
import * as rk from 'i18n!Controls-Lists';

export interface IScaleActionOptions extends IListActionOptions {
    listId: string;
    direction: TScaleDirection;
    // Зафиксированная для тестов дата текущего дня
    _fixedTimelineDate: Date;
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
        const slice = newContext?.[this._options.listId] as TimelineGridSlice;
        const { quantum, quantums, range } = slice.state || {};
        const isIncrease = this._options.direction === 'increase';
        // Берём все кванты и в направлении increase/decrease берём самый крайний,
        const veryLastQuantum = quantums[isIncrease ? 0 : quantums.length - 1];
        // Получаем список его scale и в направлении increase/decrease берём самый крайний,
        const veryLastScale =
            veryLastQuantum.scales?.[isIncrease ? veryLastQuantum.scales?.length - 1 : 0];
        let veryLastScaleRangeSize;

        // Если зумить некуда, то не надо делать кнопки зума активными
        if (veryLastScale) {
            const veryLastScaleRange = getRangePresets(quantum, range.start);
            veryLastScaleRangeSize =
                veryLastScaleRange &&
                getRangeSize(veryLastScaleRange[veryLastScale.value], quantum);
        }

        // Получаем название пресета для range.
        const currentRangeSize = getRangeSize(range, quantum);

        // Кнопка недоступна, если квант === самый крайний
        // И	нет scale ИЛИ scale === самый крайний
        // И	нет range ИЛИ range === самый крайний (по названию)
        this.readOnly =
            veryLastQuantum.name === quantum &&
            (veryLastScaleRangeSize === undefined || veryLastScaleRangeSize === currentRangeSize);
    }

    execute(): Promise<unknown> | void {
        if (this._options.direction === 'increase') {
            return this._getSlice().zoomIn(this._options._fixedTimelineDate);
        }
        return this._getSlice().zoomOut(this._options._fixedTimelineDate);
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
