import { useMemo } from 'react';
import { HelpPerson, Wrapper as HintWrapper } from 'Hint/Template';
import type { IHintWrapperOptions } from 'Hint/interface';
import rk = require('i18n!Controls-editors');

const FIELDS_EMPTY_TEMPLATE_OPTIONS = {
    image: HelpPerson.common.wowNothing,
    size: 'l',
    imageSize: 'm',
    alignment: 'top',
    layout: 'column',
    offset: { top: 'l', left: 's' },
    title: rk('Не найдено ни одной записи'),
    content: [
        {
            type: 'paragraph',
            data: {
                content: [
                    { type: 'link', data: { value: rk('Сбросьте'), id: 'reset' } },
                    {
                        type: 'text',
                        data: { value: ' ' + rk('или измените введенное значение поиска') },
                    },
                ],
            },
        },
    ],
};

const NO_FIELDS_TEMPLATE_OPTIONS = {
    ...FIELDS_EMPTY_TEMPLATE_OPTIONS,
    title: rk('Нет полей для добавления'),
    image: undefined,
    size: 'm',
    offset: { top: 's' },
    content: [],
};

export function DataMapTreeEmptyTemplate(props: IHintWrapperOptions): JSX.Element {
    const emptySearchedTemplateOptions = useMemo(() => {
        return {
            ...FIELDS_EMPTY_TEMPLATE_OPTIONS,
            size: 'm',
            offset: { top: 's' },
            clickHandlers: { reset: { handler: props.resetSearchCallback } },
        };
    }, [props.resetSearchCallback]);

    return (
        <HintWrapper
            {...props}
            emptySearchedTemplateOptions={emptySearchedTemplateOptions}
            emptyTemplateOptions={NO_FIELDS_TEMPLATE_OPTIONS}
            emptyTemplateName="Hint/Template:EmptyView"
            emptySearchedTemplateName="Hint/Template:EmptyView"
            emptyFilteredTemplateName="Hint/Template:EmptyView"
        />
    );
}
