import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import template = require('wml!Controls/_event/Listener');
import { descriptor } from 'Types/entity';

export interface IListenerOptions extends IControlOptions {
    event?: string;
    listenAll?: boolean;
    listenItself?: boolean;
    id?: string;
}

const getConfig = (options: IListenerOptions): IListenerOptions => {
    return {
        listenAll: !!options.listenAll,
    };
};

/**
 * Позволяет реагировать на события родителя, использующего {@link Controls/events:Register} в своем шаблоне.
 * @class Controls/_event/Listener
 * @extends UI/Base:Control
 *
 * @public
 * @remark
 * Подробнее о работе с контролом читайте <a href="/doc/platform/developmentapl/interface-development/controls/tools/autoresize/">здесь</a>.
 */
class EventListener extends Control<IListenerOptions> {
    protected _template: TemplateFunction = template;
    protected config: IListenerOptions = null;
    protected _beforeMount(options: IListenerOptions): void {
        this.config = getConfig(options);
    }

    protected _afterMount(): void {
        this._notify('register', [this._options.event, this, this.callback, this.config], {
            bubbling: true,
        });
    }

    protected _beforeUnmount(): void {
        this._notify('unregister', [this._options.event, this, this.config], {
            bubbling: true,
        });
    }

    protected callback(): void {
        this._notify(this._options.event, Array.prototype.slice.call(arguments));
    }

    static getOptionTypes(): object {
        return {
            event: descriptor(String).required(),
            listenAll: descriptor(Boolean),
        };
    }
}
/**
 * @name Controls/_event/Listener#event
 * @cfg {String} Имя события, на которое нужно среагировать.
 */

/**
 * @name Controls/_event/Listener#listenAll
 * @cfg {Boolean} Нужно ли реагировать на события всех родительских контролов с Register в шаблоне,
 * либо же только на события ближайшего такого контрола.
 */
export default EventListener;
