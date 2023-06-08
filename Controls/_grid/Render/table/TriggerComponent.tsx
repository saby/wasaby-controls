import { default as Trigger } from 'Controls/_grid/display/Trigger';

interface IProps {
    trigger: Trigger;
}
export default function TriggerComponent(props: IProps) {
    return (
        <tr>
            <td colspan={props.trigger.getColspan()}>
                <div className={'controls-BaseControl__loadingTrigger'}>
                    <div
                        className={
                            'controls-GridView__loadingTrigger_notFullGridSupport'
                        }
                        data-qa={`${
                            props.trigger.listElementName
                        }-${props.trigger.getPosition()}`}
                    ></div>
                </div>
            </td>
        </tr>
    );
}
