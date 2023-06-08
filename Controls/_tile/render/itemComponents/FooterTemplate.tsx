/**
 * @kaizen_zone a366fb75-0c89-4edd-9ba7-43558b9859ce
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
