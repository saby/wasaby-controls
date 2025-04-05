import { ItemTemplate } from 'Controls/dropdown';

export default function (props) {
    return (
        <ItemTemplate
            {...props}
            contentTemplate={(contentTemplateProps) => (
                <ContentTemplate
                    {...contentTemplateProps}
                    item={props.item.contents}
                    expanderTemplate={props.expanderTemplate}
                />
            )}
        />
    );
}

function ContentTemplate(props) {
    return (
        <div className="tw-flexbox tw-items-center">
            <span>{props.item.get('title')}</span>
            {props.expanderTemplate ? (
                <props.expanderTemplate className="tw-pointer-events-none" />
            ) : null}
        </div>
    );
}
