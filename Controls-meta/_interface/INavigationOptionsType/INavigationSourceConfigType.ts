import { UnionType } from 'Types/meta';
import { INavigationPositionSourceConfigType } from './INavigationPositionSourceConfigType';
import { INavigationPageSourceConfigType } from './INavigationPageSourceConfigType';
import { IIgnoreNavigationConfigType } from './IIgnoreNavigationConfigType';

export const INavigationSourceConfigType = UnionType.of([
    INavigationPositionSourceConfigType,
    INavigationPageSourceConfigType,
    IIgnoreNavigationConfigType,
]).id('Controls/meta:INavigationSourceConfigType');
