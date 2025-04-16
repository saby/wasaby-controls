import { HorizontalItem } from 'Controls-Templates/HorizontalItem';

export function HorizontalItemDemoTile(props: any) {
    return (
        <HorizontalItem
            markerVisible={true}
            imageEffect={'custom'}
            imageViewMode={'rectangle'}
            descriptionFontColorStyle={'unaccented'}
            descriptionFontSize={'m'}
            descriptionHAlign={'left'}
            imageProportion={'1:1'}
            descriptionVAlign={'top'}
            paddingBottom={'xl'}
            paddingLeft={'xl'}
            paddingRight={'xl'}
            captionFontWeight={'bold'}
            captionFontSize={'xl'}
            captionHAlign={'left'}
            backgroundColorStyle={'danger'}
            description={'Очень длинное описание, которое поместится в несколько строк'}
            imageSize={'half'}
            shadowVisibility={'visible'}
            markerSize={'image-l'}
            borderVisibility={'visible'}
            borderStyle={'default'}
            footer="Большой большой подвал"
            {...props}
        />
    );
}
