import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls-demo/FormController/RegisterFromOperations/Content');

class Content extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _logsInfo: string[] = [];

    protected _afterMount(_options?: IControlOptions) {
        this._notify(
            'registerFormOperation',
            [
                {
                    save: () => {
                        this._logsInfo.push('save data');
                    },
                    cancel: () => {
                        this._logsInfo.push('cancel data');
                    },
                    isDestroyed: () => {
                        return false;
                    },
                },
            ],
            { bubbling: true }
        );
    }
}

export default Content;
