import { IModelProperty, Model } from 'Types/entity';
import { IHashMap } from 'Types/declarations';
import { register } from 'Types/di';

const DynamicTitleModelName =
    'Controls-demo/treeGridNew/Mover/WithDynamicProperty/DynamicTitleModel';

class DynamicTitleModel extends Model {
    protected _moduleName: string = DynamicTitleModelName;

    protected _$properties: IHashMap<IModelProperty> = {
        dynamicTitle: {
            get: (): string => {
                return `${this.get('title')}${
                    this.get('rating') ? ' - ' + this.get('rating') : ''
                }`;
            },
            set: (value: string): void => {
                this.set('title', value);
            },
        },
    };
}

register(DynamicTitleModelName, DynamicTitleModel, { instantiate: false });

export { DynamicTitleModel, DynamicTitleModelName };
