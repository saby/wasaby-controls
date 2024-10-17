import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Scroll/StickyBlockReact/ForTests/AllProps/Index');
import 'css!Controls-demo/Scroll/StickyGroupReact/ForTests/ManyProps/Style';

export default class AllProps extends Control<IControlOptions> {
    protected _template: TemplateFunction = controlTemplate;

    protected _stickyProps: object = {
        backgroundStyle: 'default',
        fixedBackgroundStyle: 'default',
        wasabyContext: {},
        register: () => {
            return 0;
        },
        unregister: () => {
            return 0;
        },
        modeChanged: () => {
            return 0;
        },
        offsetChanged: () => {
            return 0;
        },
        setStickyId: () => {
            return 0;
        },
    };
    protected _stickyModel: object = {
        shadow: {
            top: true,
            bottom: true,
            left: true,
            right: true,
        },
        offset: {
            top: 0,
            left: 0,
        },
    };
}
