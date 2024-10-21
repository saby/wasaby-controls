import { Control, TemplateFunction } from 'UI/Base';
import * as controlTemplate from 'wml!Controls-demo/Menu/Control/SubMenuTemplate/Index';
import { Memory } from 'Types/source';

class Source extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _source: Memory;

    protected _beforeMount(): void {
        this._source = new Memory({
            data: [
                {
                    key: 1,
                    title: 'Administrator',
                    icon: 'icon-AdminInfo',
                    parent: null,
                    node: null,
                },
                {
                    key: 2,
                    title: 'Moderator',
                    parent: null,
                    node: null,
                },
                {
                    key: 3,
                    title: 'Participant',
                    parent: null,
                    node: null,
                },
                {
                    key: 4,
                    title: 'Subscriber',
                    icon: 'icon-Subscribe',
                    headingCaption: 'Subscriber',
                    subMenuTemplate: 'wml!Controls-demo/Menu/Control/SubMenuTemplate/Template',
                    subMenuTemplateOptions: {
                        subMenuCaption: 'Menu template',
                    },
                    parent: null,
                    node: true,
                },
                {
                    key: 5,
                    title: 'Vk',
                    parent: 4,
                    node: null,
                },
            ],
            keyProperty: 'key',
        });
    }
}
export default Source;
