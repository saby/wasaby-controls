import { IBaseRenderAspects } from 'Controls/_tileRender/interface/IRenderAspects';
import { TemplateFunction } from 'UICommon/Base';
import { TileCollectionItem } from 'Controls/tile';

export interface ITileItemCompatibleLayerProps extends IBaseRenderAspects {
    itemTemplate?: TemplateFunction;
    collectionItem: TileCollectionItem;
}

export interface IItemTemplateCompatibleProps extends IBaseRenderAspects {
    itemActions: string;
}

export function TileItemCompatibleLayer({
    itemTemplate, // ...renderProps
}: ITileItemCompatibleLayerProps) {
    // renderProps.itemActions = '<ItemActionComponent />';
    // return loadTemplate(itemTemplate, renderProps);
    return itemTemplate;
}
