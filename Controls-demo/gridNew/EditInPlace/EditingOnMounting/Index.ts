import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/gridNew/EditInPlace/EditingOnMounting/EditingOnMounting';
import * as EditingTemplate from 'wml!Controls-demo/gridNew/EditInPlace/EditingOnMounting/EditingTemplate';
import { Memory } from 'Types/source';
import { Model } from 'Types/entity';
import { IColumn } from 'Controls/grid';
import { IEditingConfig, TColspanCallbackResult } from 'Controls/display';
import { Countries } from 'Controls-demo/gridNew/DemoHelpers/Data/Countries';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;
    protected _columns: IColumn[] = Countries.getColumns();
    protected _editingConfig: IEditingConfig = null;

    protected _colspanCallback(
        item: Model,
        column: IColumn,
        columnIndex: number,
        isEditing: boolean
    ): TColspanCallbackResult {
        return isEditing ? 'end' : undefined;
    }

    protected _beforeMount(props: IProps): Promise<void> {
        this._columns[0].template = EditingTemplate;
        const source = props._dataOptionsValue.EditInPlaceEditingOnMounting.source;
        return source.create().then((record) => {
            this._editingConfig = {
                toolbarVisibility: true,
                item: record,
                editOnClick: true,
            };
        });
    }
}

export default Object.assign(connectToDataContext(Demo), {
    getLoadConfig(): Record<string, IDataConfig<IListDataFactoryArguments>> {
        return {
            EditInPlaceEditingOnMounting: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: [],
                    }),
                },
            },
        };
    },
});
