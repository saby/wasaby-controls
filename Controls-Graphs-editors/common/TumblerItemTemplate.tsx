import { Icon } from 'Controls/icon';
import { Model } from 'Types/entity';

export function TumblerItemTemplate(props: { item: Model }): JSX.Element {
    return (
        <div className="tw-flex tw-items-center tw-justify-center">
            {props.item.get('icon') ? (
                <Icon icon={props.item.get('icon')} iconSize="s" iconStyle="default" />
            ) : null}
            {props.item.get('caption') ? <div>{props.item.get('caption')}</div> : null}
        </div>
    );
}
