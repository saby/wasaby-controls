import { IStickyPopupOptions, StackOpener, StickyOpener } from 'Controls/popup';
import { IEditors } from 'Controls-editors/object-type';
import { ObjectMeta, loadEditors } from 'Types/meta';
import { useState } from 'react';
import type { Slice } from 'Controls-DataEnv/slice';

const POPUP_MARGIN_SIZE = 28; // --inline_height_l
const DEFAULT_POPUP_WIDTH = 350 + POPUP_MARGIN_SIZE;

/**
 * Опции опенера PropertyGrid
 */
interface IObjectEditorOpenerProps {
    metaType: ObjectMeta<object>;
    value: object;
    onChange: (value: object) => void;
    editorContext?: IEditors;
    popupOptions: IStickyPopupOptions;
    dataContext?: Record<string, Slice<unknown>>;
    refresh: boolean;
    autoSave?: boolean;
    opener?: IOpener;
}

/*
 * Перечисление поддерживаемых опенеров на PG
 */
export enum OpenerTypeEnum {
    /*
     * Открывает редактор в стековом окне
     */
    Stack = 'stack',
    /*
     * Открывает редактор в прилипающем окне
     */
    Sticky = 'sticky',
}
/*
 * Тип свойств компонента-редактора
 */
export interface IComponentLoaderProps {
    opener: OpenerTypeEnum;
    width: number;
}
/*
 * Тип описания компонента-редактора на мета-типе
 */
export type TComponentLoader = {
    props: IComponentLoaderProps;
};

/*
 * Общий тип для опенеров
 * FIXME: перейти на общий тип из Controls/popup
 */
type IOpener = StackOpener | StickyOpener;

/**
 * Опенер редактора типа "Объект"
 * @remark
 * <b>Открытие кастомного редактора вместо {@link Controls-editors/propertyGridPopup:PropertyGridPopup}</b>
 * 1. Создаем редактор, соответствующий интерфейсу {@link Controls-editors/propertyGridPopup:IPropertyGridPopup}
 * 2. На мета-типе редактируемого объекта указываем редактор
 * Если нужно открыть в прилипающем окне:
 * <pre>
 *     import { ObjectType } from 'Types/meta';
 *
 *     const MyType = ObjectType
 *         .id('...')
 *         .attributes({...})
 *         .editor('MyModule/MyEditor');
 * </pre>
 * Если нужно открыть в стековом окне:
 * <pre>
 *     import { ObjectType } from 'Types/meta';
 *     import { OpenerTypeEnum } from 'Controls-editors/objectEditorOpener';
 *
 *     const MyType = ObjectType
 *         .id('...')
 *         .attributes({...})
 *         .editor(
 *             'MyModule/MyEditor',
 *             {
 *                 opener: OpenerTypeEnum.Stack
 *             }
 *         )
 * </pre>
 *
 * @class Controls-editors/objectEditorOpener
 * @public
 */
export default class ObjectEditorOpener {
    protected _opener: IOpener;

    /**
     * Открывает панель с PropertyGrid для редактирования объекта
     * @param {IObjectEditorOpenerProps} options Конфигурация окна
     */
    async open({
        metaType,
        value,
        onChange,
        refresh,
        editorContext = null,
        dataContext = null,
        popupOptions = {},
        autoSave = false,
    }: IObjectEditorOpenerProps): Promise<void> {
        const openerType = getOpenerType(metaType);
        const metaWidth = getOpenerWidth(metaType);
        if (!this._opener) {
            this._opener = getOpener(openerType);
        }

        if (!refresh) {
            if (this._opener?.isOpened()) {
                this._opener.close();
            }
        }

        await loadEditors(metaType);

        if (refresh && !this._opener.isOpened()) {
            return;
        }

        this._opener.open({
            template: await getContentTemplate(metaType),
            templateOptions: {
                autoSave,
                metaType,
                value,
                onChange,
                editorContext,
                dataContext,
            },
            opener: popupOptions.opener || null,
            ...popupOptions,
            className: popupOptions.className || '',
            width:
                openerType === OpenerTypeEnum.Stack && metaWidth
                    ? metaWidth
                    : DEFAULT_POPUP_WIDTH,
        });
    }

    /**
     * Закрывает панель редактирования
     */
    close(): void {
        if (this._opener) {
            this._opener.close();
        }
    }

    /**
     * Возвращает информацию о том, открыто ли панель редактирования
     */
    isOpened(): boolean {
        return this._opener && this._opener.isOpened();
    }

    /**
     * Разрушает экземпляр класса
     */
    destroy(): void {
        if (this._opener) {
            this._opener.destroy();
        }
    }
}

async function getContentTemplate(metaType: ObjectMeta<object>): Promise<string | any> {
    const typeEditor = metaType.getEditor();

    if (typeEditor?.component) {
        return Promise.resolve(typeEditor.component);
    }
    if (typeEditor?.loader) {
        return typeEditor.load();
    }
    return Promise.resolve('Controls-editors/propertyGridPopup:PropertyGridPopup');
}

function getOpener(openerType: OpenerTypeEnum): IOpener {
    if (openerType) {
        switch (openerType) {
            case 'stack':
                return new StackOpener();
            case 'sticky':
            default:
                return new StickyOpener();
        }
    }

    return new StickyOpener();
}

function getOpenerType(metaType: ObjectMeta<object>): OpenerTypeEnum {
    const typeEditor = metaType.getEditor() as any as TComponentLoader;
    return typeEditor?.props?.opener || OpenerTypeEnum.Sticky;
}

function getOpenerWidth(metaType: ObjectMeta<object>): number {
    const typeEditor = metaType.getEditor() as any as TComponentLoader;
    return typeEditor?.props?.width || DEFAULT_POPUP_WIDTH;
}

/**
 * Хук состояния загрузки редакторов метата
 * @param meta метатип
 * @returns Можно ли отображать конент с редакторами метатипа
 */
export function useEditorsLoader(meta: ObjectMeta<object>): boolean {
    const [value, setValue] = useState(false);
    loadEditors(meta).then(() => {
        setValue(true);
    });

    return value;
}
