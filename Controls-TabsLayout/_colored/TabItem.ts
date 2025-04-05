import { Control, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls-TabsLayout/_colored/TabItem';
import {IItemTab} from 'Controls-TabsLayout/_colored/IColored';


export default class HeadCounter extends Control {
    readonly _template: TemplateFunction = template;

    protected _getBackgroundStyleClass(item: IItemTab): string {
        return `controls-ColoredTabs__background-${item?.backgroundStyle}`;
    }

    protected _tabHasContent(): boolean {
        if (!this._options.tabHasContent) {
            return true;
        }
    }

    static defaultProps = {
        useRoundings: true,
        position: 'right'
    };
}
