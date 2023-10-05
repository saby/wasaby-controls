/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import { Control, IControlOptions } from 'UI/Base';
import template = require('wml!Controls/_scroll/HotKeysContainer');
import { SyntheticEvent } from 'Vdom/Vdom';

/**
 * Контрол настраивает Controls/scroll:Container на перехват клавиш "up", "down", "page up", "page down", "home", "end" по умолчанию.
 * @remark
 * Полезные ссылки:
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/aliases/_scroll.less переменные тем оформления}
 * * {@link https://wi.sbis.ru/doc/platform/developmentapl/interface-development/controls/content-managment/scroll/keyboard/ руководство разработчика}
 *
 * @extends UI/Base:Control
 * @public
 */

/*
 * Control makes Controls/scroll:Container to handle up, down, page up, page down, home, end keys by default
 * @class Controls/_scroll/HotKeysContainer
 * @extends UI/Base:Control
 * @author Шипин А.А.
 * @public
 */
class HotKeysContainer extends Control<IControlOptions> {
    protected _template: Function = template;
    protected _defaultActions = [
        { keyCode: 33 },
        { keyCode: 34 },
        { keyCode: 35 },
        { keyCode: 36 },
        { keyCode: 38 },
        { keyCode: 40 },
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
