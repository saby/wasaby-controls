import { ObjectType } from 'Meta/types';
import { IBackgroundStyleOptions } from 'Controls/interface';
import { TBackgroundStyleType } from './TBackgroundStyleType';

export const IBackgroundStyleOptionsType = ObjectType.id(
    'Controls/meta:IBackgroundStyleOptionsType'
).attributes<IBackgroundStyleOptions>({
    backgroundStyle: TBackgroundStyleType,
});
