import { ItemTemplate, ITumblerItem } from 'Controls/Tumbler';
import { Model } from 'Types/entity';

type TumblerItemIconTemplateProps = {
    item: Model<ITumblerItem>;
    fontSize: string;
};

type ContentTemplatePropsType = {
    item: Model<ITumblerItem>;
};

function ContentTemplate(props: ContentTemplatePropsType) {
    const { item } = props;

    const title = item.get('title');
    const tooltip = item.get('tooltip') as string;

    const iconClassName =
        `${title ? 'controls-margin_left-s' : ''} controls-icon ` +
        `controls-icon-${item.get('iconStyle')} ` +
        `controls-icon_size-${item.get('iconSize') || 's'} ${item.get('icon')} `;

    return (
        <div title={tooltip}>
            {title ? <span>{title}</span> : null}

            {item.get('icon') ? (
                <span className="ws-align-self-center ws-inline-flexbox ws-align-items-center">
                    <i className={iconClassName} />
                </span>
            ) : null}
        </div>
    );
}

function TumblerItemIconTemplate(props: TumblerItemIconTemplateProps) {
    return (
        <ItemTemplate
            item={props.item}
            fontSize={props.fontSize}
            contentTemplate={ContentTemplate}
        />
    );
}

export default TumblerItemIconTemplate;
