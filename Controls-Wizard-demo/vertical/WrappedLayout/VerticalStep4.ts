import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import { Memory } from 'Types/source';
import { IDemoStepOptions } from './IDemoStepOptions';
import * as template from 'wml!Controls-Wizard-demo/vertical/WrappedLayout/VerticalStep4';

const STEP = 3;

export default class VerticalStep4 extends Control<IDemoStepOptions> {
    protected _template: TemplateFunction = template;
    protected _viewSource: Memory;

    protected _beforeMount(options: IDemoStepOptions): void {
        this._viewSource = options.getDataOptions(STEP).data.source;
    }

    protected _finishStepHandler(event: SyntheticEvent<Event>): void {
        this._options.finishStepHandler(event, STEP);
    }

    protected _stepBackHandler(event: SyntheticEvent<Event>): void {
        this._options.stepBackHandler(event, STEP);
    }
}
