import { AnyType, Meta } from 'Meta/types';
import { TemplateFunction } from 'UI/Base';

export const TemplateFunctionOrStringType = AnyType.id(
    'Controls/meta:TemplateFunctionOrStringType'
) as Meta<TemplateFunction | string>;
