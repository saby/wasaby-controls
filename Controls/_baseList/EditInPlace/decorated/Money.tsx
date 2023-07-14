/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
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
