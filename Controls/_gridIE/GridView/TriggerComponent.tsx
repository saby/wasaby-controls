import type { Trigger } from 'Controls/grid';

interface IProps {
    trigger: Trigger;
}

export default function TriggerComponent(props: IProps) {
    return (
        <tr>
            <td colSpan={props.trigger.getColspan()}>
                <div className="controls-BaseControl__loadingTrigger">
                    <div
                        className="tw-relative"
                        data-qa={`${props.trigger.listElementName}-${props.trigger.getPosition()}`}
                    ></div>
                </div>
            </td>
        </tr>
    );
}
