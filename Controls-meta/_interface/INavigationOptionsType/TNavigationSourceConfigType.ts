import { INavigationOptionValue, INavigationSourceConfig } from 'Controls/interface';
import { ObjectType } from 'Meta/types';
import { TNavigationSourceType } from './TNavigationSourceType';
import { TNavigationViewType } from './TNavigationViewType';
import { INavigationViewConfigType } from './INavigationViewConfigType';
import { INavigationSourceConfigType } from './INavigationSourceConfigType';

export const TNavigationSourceConfigType = ObjectType.id(
    'Controls/meta:TNavigationSourceConfigType'
).attributes<INavigationOptionValue<INavigationSourceConfig>>({
    source: TNavigationSourceType.optional(),
    view: TNavigationViewType.optional(),
    viewConfig: INavigationViewConfigType.optional(),
    sourceConfig: INavigationSourceConfigType.optional(),
});
