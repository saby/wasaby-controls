import { ObjectType } from 'Meta/types';
import { INumberLengthOptions } from 'Controls/input';
import { IIntegersLengthOptionsType } from './IIntegersLengthOptionsType';
import { IPrecisionOptionsType } from './IPrecisionOptionsType';

export const INumberLengthOptionsType = ObjectType.id(
    'Controls-Input-meta/input:INumberLengthOptionsType'
)
    .properties<INumberLengthOptions>({
        ...IIntegersLengthOptionsType.properties(),
        ...IPrecisionOptionsType.properties(),
    })
    .defaultValue({});
