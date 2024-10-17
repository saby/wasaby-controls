import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/FilterOld/FilterPopup/resources/Panel';
import 'Controls-demo/FilterOld/FilterPopup/resources/Editors/HierarchyLookup';
import 'wml!Controls-demo/FilterOld/FilterPopup/resources/Editors/Dropdown';
import 'wml!Controls-demo/FilterOld/FilterPopup/resources/Editors/DateRange';
import 'wml!Controls-demo/FilterOld/FilterPopup/resources/Editors/Link';
import 'Controls-demo/FilterOld/FilterPopup/resources/Editors/Additional/Select';
import 'Controls-demo/FilterOld/FilterPopup/resources/Editors/Lookup';
import 'wml!Controls-demo/FilterOld/FilterPopup/resources/Editors/Additional/Link';
import 'Controls-demo/FilterOld/FilterPopup/resources/Editors/Additional/Dropdown';

export default class extends Control {
    _template: TemplateFunction = Template;
}
