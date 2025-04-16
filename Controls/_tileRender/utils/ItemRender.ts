import type { TileCollectionItem } from 'Controls/tile';
import { TileCollection } from 'Controls/tile';
import { Model } from 'Types/entity';

import { getCheckboxProps } from 'Controls/_tileRender/item/utils/Props/Checkbox';
import { getActionsProps } from 'Controls/_tileRender/item/utils/Props/Actions';
import { getRoundBorder } from 'Controls/_tileRender/item/utils/Props/RoundBorder';
import { getItemSizeStyle } from 'Controls/_tileRender/item/utils/Props/ItemSize';
import { getImageProps } from 'Controls/_tileRender/item/utils/Props/Image';
import { getMarkerProps } from 'Controls/_tileRender/item/utils/Props/Marker';
import { getItemFaded } from 'Controls/_tileRender/item/utils/Props/Faded';
import { getSearchProps } from 'Controls/_tileRender/item/utils/Props/Search';
import { getEditingState } from 'Controls/_tileRender/item/utils/Props/IsEditing';

import { IItemRenderProps } from 'Controls/_tileRender/interface/IRenderAspects';
import { getClassName } from 'Controls/_tileRender/item/utils/Props/ClassNameUtil';

interface IGetItemRenderProps {
    collectionItem: TileCollectionItem;
    collection: TileCollection<Model<any>>;
}

/*
    // ТУТ НАХОДЯТСЯ ПАРАМЕТРЫ ПУБЛИЧНЫХ ШАБЛОНОВ ("Controls-Templates\_itemTemplates\BaseItem.tsx")
    export interface IBaseItemProps
        extends TInternalProps,
            IMarkerProps,
            ICheckboxProps,
            IShadowProps,
            IBorderProps,
            IActionsProps,
            IRoundAnglesProps,
            IItemEventHandlers,
            IItemActionsHandler,
            IItemTemplateProps,
            IZenProps,
            ICursorProps {
        className?: string;
        children?: React.ReactNode;
        content?: TemplateFunction;
        style?: React.CSSProperties;
        item?: CollectionItem;
        isEditing?: boolean;
        contentClassName?: string;
    }
*/

/*
    // ПАРАМЕТРЫ СТАРОГО ШАБЛОНА "Controls/tile:ItemTemplate" ("Controls\_tile\render\items\Default.tsx")
    export interface ITileItemProps<TItem extends TileCollectionItem = TileCollectionItem>
        // [-] Наследник базовых списочных пропсов. Максимум от него events нужны.
        extends IItemTemplateProps<Model, TItem>

            // [-] extends IBaseItemTemplateOptions
                hasTitle?: boolean;
                staticHeight?: boolean;
                height?: 'auto';
                    shadowVisibility?: TShadowVisibility;
                    border?: boolean;
                    borderStyle?: TBorderStyle;
                    nodeContentTemplate?: TemplateFunction;
                    width?: number | string;
            IItemTemplateOptions,

            // [-] Наркомания, все интерфейсы мешаются и замешиваются в супер-интерфейс. Так не должно быть
            IRichTemplateOptions,
            IPreviewTemplateOptions,
            ISmallTemplateOptions,
            IMediumTemplate,

            // [-] Ядерная дикуха
            TInternalProps {
        itemWidth: number;
        folderWidth?: number;
        itemType: TTileItem;
        fallbackImage: string;
        isEditing: boolean;
        // styleProp, чтобы не конфликтовать с опцией style, которая в контролах обозначает совсем другое
        styleProp?: React.CSSProperties;
    }
*/

/**
 * Утилита, вычисляющая параметры для рендера элемента плитки
 * @param props
 */
export function getItemRenderProps(props: IGetItemRenderProps): IItemRenderProps {
    const { collectionItem, collection } = props;

    const { markerVisible } = getMarkerProps({ collectionItem });

    const { checkboxValue, checkboxVisibility, checkboxClassName } = getCheckboxProps({
        collectionItem,
        collection,
    });

    const { actionsPosition, actions, actionsVisibility, actionsDisplayDelay } = getActionsProps({
        collectionItem,
        collection,
    });

    const { roundAngleTL, roundAngleBL, roundAngleBR, roundAngleTR } = getRoundBorder({
        collection,
    });

    const { styleProp } = getItemSizeStyle({ collectionItem });

    const faded = getItemFaded({ collectionItem });

    const { imageSrc } = getImageProps({ collectionItem });

    const { searchValue } = getSearchProps({ collectionItem });

    const { isEditing } = getEditingState({ collectionItem });

    const { className } = getClassName({
        collectionItem: collectionItem as TileCollectionItem,
    });

    const preparedItemRenderProps = {
        item: collectionItem,

        markerVisible,

        imageSrc,

        caption: collectionItem.getDisplayValue(),

        faded,

        actions,
        actionsVisibility,
        actionsPosition,
        actionsDisplayDelay,

        checkboxValue,
        checkboxVisibility,
        checkboxClassName,

        styleProp,
        className,

        roundAngleTL,
        roundAngleBL,
        roundAngleBR,
        roundAngleTR,

        searchValue,
        isEditing,
    };

    return { ...preparedItemRenderProps };
}
