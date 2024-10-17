/**
 * @kaizen_zone 0e107c1a-ee17-427f-b2a9-c869f977e22d
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-TabsLayout/_colored/HeadCounter/HeadCounter';
import 'css!Controls-TabsLayout/_colored/HeadCounter/HeadCounter';
import { IItemTab } from 'Controls-TabsLayout/_colored/IColored';

interface IHeadCounterOptions extends IControlOptions {
    items: IItemTab[];
    counter: number;
}

export default class HeadCounter extends Control<IHeadCounterOptions> {
    readonly _template: TemplateFunction = template;
    protected _minHeaderWidth: number = 0;

    _beforeMount(options: IHeadCounterOptions): void {
        this._options = options;
    }

    protected _getCounterOffset(): string {
        if (!this._options.isCompact) {
            return 'm';
        } else if (this._options.item.icon) {
            return 'xs';
        }
    }

    protected _isCounterVisible(): boolean {
        return this._options.item.counter !== undefined && this._options.item.counter !== null;
    }

    static defaultProps: IHeadCounterOptions = {
        headPosition: 'right',
    };
}
