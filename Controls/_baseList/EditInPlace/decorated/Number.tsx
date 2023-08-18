/**
 * @kaizen_zone b9244594-2ac8-4db9-8c67-cd873d12a1c4
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
