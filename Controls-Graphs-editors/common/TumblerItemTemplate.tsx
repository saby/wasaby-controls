import { Icon } from 'Controls/icon';
import { Model } from 'Types/entity';

export function TumblerItemTemplate(props: { item: Model }): JSX.Element {
    return (
        <div className="tw-flex tw-items-center tw-justify-center">
            <Icon icon={props.item.get('icon')} iconSize="s" iconStyle="default" />
        </div>
    );
}
