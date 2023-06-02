import { isEmail, IValidator } from 'Controls/validate';

interface IArgs {
    value: string;
}

function isCustomTemplate(args: IArgs): IValidator | boolean {
    const result = isEmail(args);
    if (typeof result !== 'boolean') {
        return {
            templateName:
                'wml!Controls-demo/Validate/TemplateName/resources/TemplateName',
        };
    }
    return result;
}

function isCustomTemplateOptions(args: IArgs): IValidator | boolean {
    const result = isEmail(args);
    if (typeof result !== 'boolean') {
        return {
            templateName:
                'wml!Controls-demo/Validate/TemplateName/resources/TemplateOptions',
            templateOptions: {
                currentValue: args.value,
                msg: 'Вместо адреса электронной почты введено',
            },
        };
    }
    return result;
}

export { isCustomTemplate, isCustomTemplateOptions };
