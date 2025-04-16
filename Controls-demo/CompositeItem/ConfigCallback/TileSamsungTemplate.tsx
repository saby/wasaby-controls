import { HorizontalItem } from 'Controls-Templates/itemTemplates';
import { TInternalProps } from 'UICore/Executor';
import { TreeItem } from 'Controls/tree';
import { INewTileConfig } from 'Controls-widgets/newBrowser';

interface IProps extends INewTileConfig, TInternalProps {
    item: TreeItem;
}

export default function TileSamsungTemplate(props: IProps) {
    return (
        <HorizontalItem
            // @ts-ignore
            item={props.item}
            {...props}
            className={`${props.className} Controls-Templates-demo__catalog-item-size Controls-Templates-demo__itemsSpacing`}
            description={props.item.contents.get('title')}
            imageViewMode={'rectangle'}
            imageSrc={props.item.contents.get('image')}
            borderStyle={'default'}
            borderVisibility={'visible'}
            shadowVisibility={'onhover'}
            paddingLeft={'s'}
            paddingRight={'s'}
            paddingTop={'s'}
            paddingBottom={'s'}
            captionPosition={'on-image'}
            captionFontColorStyle={'contrast'}
        />
    );
}
