import { Model, format } from 'Types/entity';

export default class HiddenItemsModel extends Model {
    protected _moduleName: string = 'Controls-Templates/itemTemplates:HiddenItemModel';
    protected _$adapter = 'adapter.sbis';
    protected _$format: format.FormatDeclaration = [
        { name: 'isExpandedFlag', type: 'boolean', defaultValue: false },
    ];
}
