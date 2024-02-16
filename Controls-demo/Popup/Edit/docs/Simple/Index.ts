import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import { Memory } from 'Types/source';
import template = require('wml!Controls-demo/Popup/Edit/docs/Simple/Template');
import { data, gridColumns, gridHeader } from 'Controls-demo/Popup/Edit/docs/resources/data';
import 'wml!Controls-demo/List/Grid/DemoName';
import 'wml!Controls-demo/List/Grid/DemoItem';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

function getData() {
    return data.slice(0, 1);
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = template;
    protected _gridColumns: object[];
    protected _gridHeader: object[];
    protected _viewSource: Memory;
    protected _beforeMount(props: IProps): void {
        this._viewSource = props._dataOptionsValue.PopupEditSimple.source;
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

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            PopupEditSimple: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'id',
                        data: getData(),
                    }),
                    keyProperty: 'id',
                },
            },
        };
    },
});
