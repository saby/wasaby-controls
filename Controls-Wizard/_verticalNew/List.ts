import * as template from 'wml!Controls-Wizard/_verticalNew/List/List';
import { Control, TemplateFunction } from 'UI/Base';
import IStep from 'Controls-Wizard/IStep';
import { IWizardItem, IWizardOptions } from 'Controls-Wizard/_verticalNew/ILayout';
import { SyntheticEvent } from 'UICommon/Events';
import { Record } from 'Types/entity';
import { Memory } from 'Types/source';
import { IItemPadding } from 'Controls/list';
import 'css!Controls-Wizard/verticalNew';
import 'css!Controls/CommonClasses';

interface IChangedRecords {
    [key: number]: boolean;
}

/**
 * Контрол для отображения списка шагов
 *
 * @class Controls-Wizard/_verticalNew/List
 * @extends UI/Base:Control
 * @demo Controls-Wizard-demo/verticalNew/List/Index
 * @implements Controls-Wizard/_verticalNew/ILayout
 * @public
 */
export default class Layout extends Control<IWizardOptions> implements IStep {
    protected _template: TemplateFunction = template;
    readonly '[Controls-Wizard/IStep]': boolean = true;

    protected _maxSelectedIndex: number;
    protected _changedRecords: IChangedRecords = {};
    protected _stepsSource: Memory;
    protected _markedStepKey?: number;
    protected _stepPadding: IItemPadding = { right: 'null', left: 'L' };

    protected _beforeMount(options?: IWizardOptions): void {
        this._recordChangeHandler = this._recordChangeHandler.bind(this);
        this._getProperties(options.items);
        this._toggleSubscribeOnRecordChange(true, options.items);
        this._updateStepSource(options);
    }

    protected _beforeUpdate(options?: IWizardOptions): void {
        if (this._options.items !== options.items) {
            this._toggleSubscribeOnRecordChange(false, this._options.items);
            this._toggleSubscribeOnRecordChange(true, options.items);
            this._updateStepSource(options);
        }
        if (options.currentStepIndex !== this._options.currentStepIndex) {
            this._updateStepSource(options);
        }
        if (options.selectedStepIndex !== this._options.selectedStepIndex) {
            this._markedStepKey = options.selectedStepIndex;
        }
        this._getProperties(options.items);
    }

    protected _beforeUnmount(): void {
        this._toggleSubscribeOnRecordChange(false, this._options.items);
    }

    protected _getProperties(items: IWizardItem[]): void {
        this._maxSelectedIndex = items.length - 1;
    }

    protected _toggleSubscribeOnRecordChange(toggle: boolean, items: IWizardItem[]): void {
        const method = toggle ? 'subscribe' : 'unsubscribe';
        for (const item of items) {
            item.record[method]('onPropertyChange', this._recordChangeHandler);
        }
    }

    protected _onMarkedStepKeyChanged(event: SyntheticEvent, key: number): void {
        if (key <= this._options.currentStepIndex && key !== this._options.selectedStepIndex) {
            this._notify('selectedStepIndexChanged', [key]);
        }
    }

    protected _recordChangeHandler(event: { getTarget: () => Record }): void {
        const record = event.getTarget();
        const index = this._getIndexByRecord(record);
        const changedRecords = { ...this._changedRecords };
        changedRecords[index] = record.isChanged();
        this._changedRecords = changedRecords;
    }

    protected _clickHandler(event: SyntheticEvent<MouseEvent>, index: number): void {
        if (index <= this._options.currentStepIndex && index !== this._options.selectedStepIndex) {
            this._notify('selectedStepIndexChanged', [index]);
        }
    }

    protected _nextStepHandler(event: SyntheticEvent<MouseEvent>, index: number): void {
        this._notify('selectedStepIndexChanged', [index + 1, true]);
    }

    /**
     * Функция возвращает текущее состояние шага в зависимости от отображаемого шага и пройденых шагов
     * @param {number} stepIndex
     * @returns {string}
     */
    protected _getItemStatus(stepIndex: number): string {
        let stepStatus: string;

        if (stepIndex === this._options.selectedStepIndex) {
            stepStatus = 'active';
        } else if (stepIndex > this._options.currentStepIndex) {
            stepStatus = 'future';
        } else if (stepIndex <= this._options.currentStepIndex) {
            stepStatus = 'completed';
        }

        return stepStatus;
    }

    protected _switchChangesRecord = (
        event: SyntheticEvent<Event>,
        index: number,
        newValue: boolean
    ): void => {
        this._notify('changeRecord', [index, newValue]);
    };

    private _updateStepSource(options: IWizardOptions): void {
        const countInList = Math.max(options.selectedStepIndex, options.currentStepIndex);
        const data = [];
        for (let i = 0; i <= countInList; i++) {
            data.push({
                key: i,
                title: options.items[i].title,
                required: options.items[i].required,
            });
        }
        this._stepsSource = new Memory({
            keyProperty: 'key',
            data,
        });
        this._markedStepKey = options.selectedStepIndex;
    }

    private _getIndexByRecord(record: Record): number {
        const emptyIndex = -1;
        const items = this._options.items;
        for (let i = 0; i < items.length; i++) {
            if (items[i].record === record) {
                return i;
            }
        }
        return emptyIndex;
    }
}
