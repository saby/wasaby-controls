/**
 * @kaizen_zone 36a75113-dfe7-4e08-9a93-ea06b26981f4
 */
import * as React from 'react';
import { ICompatibleCellComponentProps as ICellProps } from 'Controls/_grid/compatibleLayer/cell/interface';
import { templateLoader } from 'Controls/_grid/compatibleLayer/utils/templateLoader';

/*
 * Функция возвращает пропсы, с которыми создаётся wasaby-совместимый компонент ячейки подвала списка
 * Часть этих пропсов может быть прокинута в рендер внутри компонента ячейки.
 * @private
 * @param props
 */
function getCompatibleFooterCellComponentProps(props: ICellProps) {
    const compatibleProps: ICellProps = {
        ...props,
    };

    delete compatibleProps.contentTemplate;
    delete compatibleProps.content;
    delete compatibleProps.className;
    delete compatibleProps.attrs;
    delete compatibleProps.style;

    return compatibleProps;
}

/*
 * Wasaby-совместимый компонент ячейки подвала списка.
 * Вставляется прикладником в опцию footerTemplate.
 * @param props
 */
export function CompatibleFooterCellComponent(props: ICellProps): React.ReactElement {
    if (props.contentTemplate) {
        const contentTemplate = templateLoader(
            props.contentTemplate,
            getCompatibleFooterCellComponentProps(props)
        );
        return contentTemplate;
    }

    // Совместимость с wasaby-способом передачи контентной опции. Правильно - задавать contentTemplate, но многие просто
    // передают content. Ранее на wasaby-уровне это автоматически конвертировалось в контентную опцию. Пример ошибок:
    // https://online.sbis.ru/opendoc.html?guid=68cc8aa7-f778-4d7b-9a8f-6f188a636ddb&client=3
    // https://online.sbis.ru/opendoc.html?guid=b26ecce7-0dd1-4486-9537-a4a7542af13f&client=3
    if (props.content) {
        const content = templateLoader(props.content, getCompatibleFooterCellComponentProps(props));
        return content;
    }

    if (props.children) {
        return props.children;
    }
    return null;
}
