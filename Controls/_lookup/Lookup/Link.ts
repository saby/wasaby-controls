/**
 * @kaizen_zone 1194f522-9bc3-40d6-a1ca-71248cb8fbea
 */
import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as template from 'wml!Controls/_lookup/Lookup/Link/LookUp_Link';
import { SyntheticEvent } from 'Vdom/Vdom';
import 'css!Controls/lookup';

/**
 * Кнопка-ссылка для использования внутри подсказки поля связи.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_lookup.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 * @implements Controls/interface:ICaption
 * @implements Controls/interface:IHeight
 * @implements Controls/interface:IUnderline
 *
 * @demo Controls-demo/Lookup/MultipleInputNew/MultipleInputNew
 *
 * @public
 */

export default class Link extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;

    protected _keyUpHandler(e: SyntheticEvent<KeyboardEvent>): void {
        if (e.nativeEvent.keyCode === 13 && !this._options.readOnly) {
            this._notify('linkClick');
        }
    }

    protected _clickHandler(e: SyntheticEvent<MouseEvent>): void {
        if (this._options.readOnly) {
            e.stopPropagation();
        } else {
            this._notify('linkClick');
        }

        if (this._options.lookupName) {
            this._notify('showSelector', [this._options.lookupName], {
                bubbling: true,
            });
        }
    }

    protected _mousedown(e: SyntheticEvent<MouseEvent>): void {
        e.preventDefault();
        e.stopPropagation();
    }

    static defaultProps: object = {
        fontSize: 'lookupLink',
        underline: 'fixed',
    };
}
