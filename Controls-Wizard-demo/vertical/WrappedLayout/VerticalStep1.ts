import { Control, TemplateFunction } from 'UI/Base';
import { SyntheticEvent } from 'UICommon/Events';
import { Memory } from 'Types/source';
import { IDemoStepOptions } from './IDemoStepOptions';
import * as template from 'wml!Controls-Wizard-demo/vertical/WrappedLayout/VerticalStep1';

const STEP = 0;

export default class VerticalStep1 extends Control<IDemoStepOptions> {
    protected _template: TemplateFunction = template;
    protected _textInputValue: string;
    protected _viewSource: Memory;

    protected _beforeMount(options: IDemoStepOptions): void {
        this._viewSource = options.getDataOptions(STEP).data.source;
    }

    protected _finishStepHandler(event: SyntheticEvent<Event>): void {
        this._options.finishStepHandler(event, STEP);
    }

    protected _afterMount(): void {
        this._textInputValue = this._options.textInputValue;
    }
}
