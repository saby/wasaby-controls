import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/Header/Header';

import HeaderAddButton from 'Controls-demo/gridNew/Header/AddButton/Index';
import HeaderAlign from 'Controls-demo/gridNew/Header/Align/Index';
import HeaderCellTemplate from 'Controls-demo/gridNew/Header/CellTemplate/Index';
import HeaderDefault from 'Controls-demo/gridNew/Header/Default/Index';
import Multiheader from 'Controls-demo/gridNew/Header/Multiheader/Index';
import HeaderNoSticky from 'Controls-demo/gridNew/Header/NoSticky/Index';
import HeaderSpacingForMoney from 'Controls-demo/gridNew/Header/SpacingForMoney/Index';
import HeaderSticky from 'Controls-demo/gridNew/Header/Sticky/Index';
import HeaderTextOverflow from 'Controls-demo/gridNew/Header/TextOverflow/Index';
import HeaderUnion from 'Controls-demo/gridNew/Header/Union/Index';
import HeaderHeaderVisibility from 'Controls-demo/gridNew/Header/HeaderVisibility/Index';
import HeaderValign from 'Controls-demo/gridNew/Header/Valign/Index';
import HeaderLongHeader from 'Controls-demo/gridNew/Header/LongHeader/Index';

export default class extends Control {
    protected _template: TemplateFunction = Template;

    static getLoadConfig() {
        return {
            ...HeaderAddButton.getLoadConfig(),
            ...HeaderAlign.getLoadConfig(),
            ...HeaderCellTemplate.getLoadConfig(),
            ...HeaderDefault.getLoadConfig(),
            ...Multiheader.getLoadConfig(),
            ...HeaderNoSticky.getLoadConfig(),
            ...HeaderSpacingForMoney.getLoadConfig(),
            ...HeaderSticky.getLoadConfig(),
            ...HeaderTextOverflow.getLoadConfig(),
            ...HeaderUnion.getLoadConfig(),
            ...HeaderHeaderVisibility.getLoadConfig(),
            ...HeaderValign.getLoadConfig(),
            ...HeaderLongHeader.getLoadConfig(),
        };
    }
}
