/**
 * @kaizen_zone 7b8de38d-e1ec-4fa2-93a5-7dca9e28a25a
 */
import { ITileItemProps, TFooterPlace } from 'Controls/_tile/display/mixins/TileItem';
import { createElement } from 'UICore/Jsx';

interface IFooterProps extends ITileItemProps {
    place: TFooterPlace;
}

export default function FooterTemplate(props: IFooterProps): JSX.Element {
    if (
        !props.item.shouldDisplayFooterTemplate(props.itemType, props.footerTemplate, props.place)
    ) {
        return null;
    }

    return createElement(
        props.footerTemplate,
        { item: props.item, itemData: props.item },
        { class: props.item.getFooterClasses(props) }
    );
}
