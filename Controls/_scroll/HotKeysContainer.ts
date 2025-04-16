/**
 * @kaizen_zone 7b560386-8131-481a-b9c0-8b3ede6f29a0
 */
import { Control, IControlOptions } from 'UI/Base';
import template = require('wml!Controls/_scroll/HotKeysContainer');
import { SyntheticEvent } from 'UI/Events';

/**
 * Контрол настраивает Controls/scroll:Container на перехват клавиш "up", "down", "page up", "page down", "home", "end" по умолчанию.
 * @remark
 * Полезные ссылки:
 * * {@link https://git.sbis.ru/saby/wasaby-controls/-/blob/rc-24.6100/Controls-default-theme/variables/_scroll.less переменные тем оформления}
 * * {@link /doc/platform/developmentapl/interface-development/controls/content-managment/scroll/keyboard/ руководство разработчика}
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
