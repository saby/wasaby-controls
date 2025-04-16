import { ItemTemplate } from 'Controls/dropdown';

export default function FilterDropdownItemTpl(props) {
    return (
        <ItemTemplate
            {...props}
            contentTemplate={
                <ContentTemplate withRegion={props.withRegion} item={props.item.contents} />
            }
        />
    );
}

function ContentTemplate(props) {
    return (
        <div className="tw-flex">
            <span className="controls-margin_right-s">{props.item.get('title')}</span>
            {props.withRegion ? (
                <span className="controls-text-unaccented">{props.item.get('region')}</span>
            ) : null}
        </div>
    );
}
