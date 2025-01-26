import { Control, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-ListEnv-demo/Filter/NotConnectedView/resources/Panel';
import 'Controls-ListEnv-demo/Filter/NotConnectedView/resources/Editors/HierarchyLookup';
import 'wml!Controls-ListEnv-demo/Filter/NotConnectedView/resources/Editors/Dropdown';
import 'wml!Controls-ListEnv-demo/Filter/NotConnectedView/resources/Editors/DateRange';
import 'wml!Controls-ListEnv-demo/Filter/NotConnectedView/resources/Editors/Link';
import 'Controls-ListEnv-demo/Filter/NotConnectedView/resources/Editors/Additional/Select';
import 'Controls-ListEnv-demo/Filter/NotConnectedView/resources/Editors/Lookup';
import 'wml!Controls-ListEnv-demo/Filter/NotConnectedView/resources/Editors/Additional/Link';
import 'Controls-ListEnv-demo/Filter/NotConnectedView/resources/Editors/Additional/Dropdown';

export default class extends Control {
    _template: TemplateFunction = Template;
}
