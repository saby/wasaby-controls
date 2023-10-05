import { Control, IControlOptions, TemplateFunction } from 'UI/Base';
import * as Template from 'wml!Controls-demo/list_new/EditInPlace/AutoAddOnMount/AutoAddOnMount';
import { Memory } from 'Types/source';
import { getFewCategories } from '../../DemoHelpers/DataCatalog';
import { IEditingConfig } from 'Controls/display';
import { IDataConfig, IListDataFactoryArguments } from 'Controls/dataFactory';
import { connectToDataContext, IContextOptionsValue } from 'Controls/context';

interface IProps extends IControlOptions {
    _dataOptionsValue: IContextOptionsValue;
}

function getData() {
    return getFewCategories().slice(0, 3);
}

class Demo extends Control<IProps> {
    protected _template: TemplateFunction = Template;

    protected _editingConfig: IEditingConfig = null;

    protected _beforeMount(props: IProps): Promise<void> {
        // Это нужно только для третьей демки (EditInPlaceAutoAddOnMount)
        const source = props._dataOptionsValue.EditInPlaceAutoAddOnMount.source;
        return source.read(1).then((record) => {
            this._editingConfig = {
                autoAddOnInit: true,
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
            EditInPlaceAutoAddOnMount0: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: [],
                    }),
                },
            },
            EditInPlaceAutoAddOnMount: {
                dataFactoryName: 'Controls/dataFactory:List',
                dataFactoryArguments: {
                    displayProperty: 'title',
                    source: new Memory({
                        keyProperty: 'key',
                        data: getData(),
                    }),
                },
            },
        };
    },
});
