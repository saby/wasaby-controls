import { Control, TemplateFunction } from 'UI/Base';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import 'css!Controls-demo/list_new/Navigation/Cut/CutNavigation';
import controlTemplate = require('wml!Controls-demo/list_new/Navigation/Cut/CutNavigation');

import ListCut from 'Controls-demo/list_new/Navigation/Cut/ListCut/Index';

export default class CutNavigation extends Control {
    protected _template: TemplateFunction = controlTemplate;

    static getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            ...ListCut.getLoadConfig(),
        }
    }
}
