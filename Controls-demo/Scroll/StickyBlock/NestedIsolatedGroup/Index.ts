import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/StickyBlock/NestedIsolatedGroup/Index');
import 'css!DemoStand/Controls-demo';
import 'css!Controls-demo/Scroll/StickyBlock/IsolatedGroup/Style';

export default class IsolatedGroup extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;
}
