/**
 * @kaizen_zone 54264d06-aeee-417a-83fc-b192e24178b2
 */
import { Number, INumberOptions } from 'Controls/baseDecorator';
import {
    default as EditingTemplate,
    IBaseEditingTemplateProps,
} from 'Controls/_baseList/EditInPlace/EditingComponent';

interface IProps extends IBaseEditingTemplateProps, INumberOptions {}

export default function MoneyEditingTemplate(props: IProps): JSX.Element {
    const viewTemplate = <Number {...props} />;
    return <EditingTemplate {...props} viewTemplate={viewTemplate} />;
}
