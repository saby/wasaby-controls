import { Control, TemplateFunction } from 'UI/Base';
import controlTemplate = require('wml!Controls-demo/Menu/Control/GroupProperty/Simple/Index');
import { RecordSet } from 'Types/collection';

class GroupProperty extends Control {
    protected _template: TemplateFunction = controlTemplate;
    protected _items: RecordSet;

    protected _beforeMount(): void {
        this._items = new RecordSet({
            rawData: [
                {
                    key: 1,
                    title: 'Add',
                    icon: 'icon-Bell',
                    group: '1',
                },
                {
                    key: 2,
                    title: 'Vacation',
                    iconStyle: 'success',
                    icon: 'icon-Vacation',
                    group: '2',
                },
                {
                    key: 3,
                    title: 'Time off',
                    icon: 'icon-SelfVacation',
                    group: '2',
                },
                {
                    key: 4,
                    title: 'Hospital',
                    icon: 'icon-Sick',
                    group: '2',
                },
                {
                    key: 5,
                    title: 'Business trip',
                    icon: 'icon-statusDeparted',
                    group: '2',
                },
            ],
            keyProperty: 'key',
        });
    }
}
export default GroupProperty;
