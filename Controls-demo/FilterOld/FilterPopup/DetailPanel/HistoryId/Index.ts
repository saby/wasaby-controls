import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/FilterOld/FilterPopup/DetailPanel/HistoryId/HistoryId';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static _styles: string[] = ['Controls-demo/FilterOld/FilterPopup/DetailPanel/Filter'];
}
