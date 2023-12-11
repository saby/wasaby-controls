/**
 * @kaizen_zone 8b0c561c-3828-4d71-9a2b-d2a18b8b4ceb
 */
import { Control, IControlOptions } from 'UI/Base';
import template = require('wml!Controls/_list/HotKeysContainer');
import { constants } from 'Env/Env';
import { SyntheticEvent } from 'Vdom/Vdom';

/**
 * Контрол добавляет обработку клавиш KeyUp и KeyDown в контрол {@link Controls/list:Container}.
 *
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_list.less переменные тем оформления}
 *
 * @extends UI/Base:Control
 * @public
 */

/*
 * Control makes Controls.list:Container to handle up, down keys by default
 * @class Controls/_list/HotKeysContainer
 * @extends UI/Base:Control
 * @author Шипин А.А.
 * @public
 */
class HotKeysContainer extends Control<IControlOptions> {
    protected _template: Function = template;
    protected _defaultActions = [
        { keyCode: constants.key.up },
        { keyCode: constants.key.down },
        { keyCode: constants.key.enter },
        { keyCode: constants.key.pageUp },
        { keyCode: constants.key.pageDown },
        { keyCode: constants.key.home },
        { keyCode: constants.key.end },
        { keyCode: constants.key.space },
        { keyCode: constants.key.del },
    ];
    // Этого кода не будет, когда добавится еще один хук жизненного цикла - "заморозка".
    // https://online.sbis.ru/opendoc.html?guid=ba32a992-5f5b-4f00-9b6a-73f62871a193
    protected _afterMount(): void {
        this._notify('registerKeyHook', [this], { bubbling: true });
    }
    protected _beforeUnmount(): void {
        this._notify('unregisterKeyHook', [this], { bubbling: true });
    }
    register(): void {
        this._children.KeyHook.register();
    }
    unregister(): void {
        this._children.KeyHook.unregister();
    }
    protected _keyDown(event: SyntheticEvent<KeyboardEvent>): void {
        const hotKeys = this._defaultActions.map((e) => {
            return e.keyCode;
        });
        if (hotKeys.includes(event.nativeEvent.keyCode)) {
            event.preventDefault();
        }
    }
}

export default HotKeysContainer;
