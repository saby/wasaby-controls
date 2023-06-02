import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import template = require('wml!Controls-demo/Popup/Edit/docs/Simple/Template');
import {
    data,
    gridColumns,
    gridHeader,
} from 'Controls-demo/Popup/Edit/docs/resources/data';
import 'wml!Controls-demo/List/Grid/DemoName';
import 'wml!Controls-demo/List/Grid/DemoItem';

class Simple extends Control<IControlOptions> {
    protected _template: TemplateFunction = template;
    protected _gridColumns: object[];
    protected _gridHeader: object[];
    protected _viewSource: Memory;
    protected _beforeMount(): void {
        this._viewSource = new Memory({
            keyProperty: 'id',
            data,
            filter: (item) => {
                return item.get('id') === '0';
            },
        });
        this._gridColumns = gridColumns;
        this._gridHeader = gridHeader;
    }

    protected _clickHandler(): void {
        this._children.confirmation.open({
            message:
                'Упс...\nДанный демо-пример демонстрирует добавление записи, нажми + что бы создать новую' +
                ' запись; Для настройки редактирования записи смотри следующий урок',
            type: 'ok',
        });
    }

    protected _addRecord(): void {
        this._children.EditOpener.open(null, this._getOpenConfig());
    }

    protected _getOpenConfig(): object {
        return {
            opener: this,
            width: 400,
            templateOptions: {
                type: 'Simple',
                source: this._viewSource,
                initializingWay: 'create',
            },
        };
    }
}
export default Simple;
