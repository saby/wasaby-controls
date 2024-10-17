/**
 * @kaizen_zone 039c82f1-a0a3-4548-82d6-c9e1dbaf5de0
 */
import type { ITileCollectionOptions } from 'Controls/tile';
// TODO: Сейчас тип из листа, но должен стать из абстракта.
import type { IListState } from '../../../List/_interface/IListState';
import getListOptions from './_getListOptions';

export default function (state: IListState): ITileCollectionOptions {
    return {
        ...getListOptions(state),

        tileMode: undefined,
        tileSize: undefined,
        tileHeight: undefined,
        tileWidth: undefined,
        tileWidthProperty: undefined,
        tileFitProperty: undefined,
        tileScalingMode: undefined,

        orientation: undefined,
        itemsContainerPadding: undefined,
        roundBorder: undefined,
        imageProperty: undefined,
        imageFit: undefined,
        imageHeightProperty: undefined,
        imageWidthProperty: undefined,
        imageUrlResolver: undefined,
        fallbackImage: undefined,
        afterItemsTemplate: undefined,
        beforeItemsTemplate: undefined,
        usingCustomItemTemplates: undefined,
        canShowActions: undefined,

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ...({} as any),
    };
}
