/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import { Money, IMoneyOptions } from 'Controls/baseDecorator';
import {
    default as EditingTemplate,
    IBaseEditingTemplateProps,
} from 'Controls/_baseList/EditInPlace/EditingComponent';

interface IProps extends IBaseEditingTemplateProps, IMoneyOptions {}

export default function MoneyEditingTemplate(props: IProps): JSX.Element {
    const viewTemplate = <Money {...props} />;
    return <EditingTemplate {...props} viewTemplate={viewTemplate} />;
}
