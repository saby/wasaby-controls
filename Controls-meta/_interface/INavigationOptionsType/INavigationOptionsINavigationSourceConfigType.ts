import { ObjectType } from 'Types/meta';
import { INavigationOptions, INavigationSourceConfig } from 'Controls/interface';
import { INavigationSourceConfigType } from './INavigationSourceConfigType';
import { TNavigationSourceType } from './TNavigationSourceType';
import { TNavigationViewType } from './TNavigationViewType';
import { INavigationViewConfigType } from './INavigationViewConfigType';

export const INavigationOptionsINavigationSourceConfigType = ObjectType.id(
    'Controls/meta:INavigationOptionsINavigationSourceConfigType'
).attributes<INavigationOptions<INavigationSourceConfig>>({
    navigation: ObjectType.attributes({
        sourceConfig: INavigationSourceConfigType.optional(),
        source: TNavigationSourceType.optional(),
        view: TNavigationViewType.optional(),
        viewConfig: INavigationViewConfigType.optional(),
    }).optional(),
});
