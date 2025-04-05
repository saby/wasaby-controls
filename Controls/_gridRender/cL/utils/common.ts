import { ICompatibleCellComponentProps as ICellProps } from 'Controls/_gridRender/cL/cell/interface';

/*
 * Функция возвращает общие пропсы, с которыми создаётся wasaby-совместимый компонент ячейки.
 * Часть этих пропсов может быть прокинута в рендер внутри компонента ячейки.
 * @private
 * @param props
 */
export function prepareCommonCompatibleProps(props: ICellProps) {
    const { column } = props;

    const compatibleProps: ICellProps = {
        ...props,
        ...props.attrs,
        gridColumn: column,
        itemData: column,
        colData: column,
    };

    return compatibleProps;
}

/*
 * Функция удаляет пропсы, которые нельзя прокидывать в wasaby-совместимый компонент ячейки.
 * @private
 * @param props
 */
export function filterCommonCompatibleProps(props: ICellProps, deleteClassName: boolean = true) {
    delete props.getCCCP;
    delete props.compatibleMultiSelectTemplate;
    delete props._$FCC;
    delete props.contentTemplateOptions;
    delete props.resolvedTemplate;
    delete props.contentTemplate;
    delete props.contentRender;
    delete props.children;
    delete props.content;
    delete props.attrs;
    delete props.style;

    if (deleteClassName) {
        delete props.className;
    }

    return props;
}
