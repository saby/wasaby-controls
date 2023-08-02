/**
 * @kaizen_zone 3f785aa8-d36c-4b57-946a-a916e51ded4d
 */
import * as React from 'react';
import { IControlOptions } from 'UI/Base';
import { ICheckableOptions } from 'Controls/interface';
import { wasabyAttrsToReactDom } from 'UICore/Jsx';
import { IWasabyAttributes } from 'UICore/Executor';
import 'css!Controls/Separator';

export interface ISeparatorProps extends IControlOptions, ICheckableOptions {
    style?: 'primary' | 'secondary' | 'unaccented';
    bold?: boolean;
    onValuechanged?: (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, value: boolean) => void;
    attrs?: IWasabyAttributes;
}

/**
 * Кнопка-разделитель с поддержкой различных стилей отображения и жирным шрифтом. Может использоваться как самостоятельно, так и в составе {@link Controls/heading сложных заголовков}.
 *
 * @remark
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FHeaders%2FstandartDemoHeader демо-пример}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_toggle.less переменные тем оформления}
 *
 *
 * @class Controls/Separator
 * @extends UI/Base:Control
 *
 * @public
 * @implements Controls/interface:ICheckable
 *
 * @demo Controls-demo/toggle/Separator/Index
 *
 */

/*
 * Button separator with support different display styles and can be bold thickness. Can be used independently or as part of complex headers(you can see it in Demo-example)
 * consisting of a <a href="/docs/js/Controls/Heading/?v=3.18.500">header</a>, a <a href="/docs/js/Controls/Heading/Separator/?v=3.18.500">header-separator</a> and a <a href="/docs/js/Controls/Heading/Counter/?v=3.18.500">counter</a>.
 *
 * <a href="/materials/DemoStand/app/Controls-demo%2FHeaders%2FstandartDemoHeader">Demo-example</a>.
 *
 * @class Controls/Separator
 * @extends UI/Base:Control
 *
 * @public
 * @author Мочалов М.А.
 * @implements Controls/interface:ICheckable
 *
 * @demo Controls-demo/toggle/Separator/Index
 *
 */
const Separator = React.memo(function (props: ISeparatorProps): React.ReactElement {
    const clickHandler = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>) => {
        if (props.onValuechanged) {
            props.onValuechanged(e, !value);
        }
    };
    let icon;
    const { value = false, bold = false } = props;
    if (value) {
        icon = 'icon-' + (bold ? 'MarkCollapseBold ' : 'CollapseLight ');
    } else {
        icon = 'icon-' + (bold ? 'MarkExpandBold ' : 'ExpandLight ');
    }
    const attrs = wasabyAttrsToReactDom(props.attrs || {});
    const attrsClassName =
        `controls_toggle_theme-${props.theme || 'default'} controls-Separator__icon` +
        ' ' +
        (attrs.className || '');
    return (
        <span
            onClick={clickHandler}
            {...attrs}
            className={attrsClassName + ' ' + (props.className || '')}
            data-qa="controls-Separator"
        >
            <span className="controls-Separator__wrapper controls-Separator__wrapper">
                <i
                    className={
                        `controls-icon controls-Separator__icon_style-${
                            props.style || 'secondary'
                        }` + ` ${icon} controls-icon controls-Separator__icon_size`
                    }
                    data-qa={`controls-Separator__${props.value ? 'collapse' : 'expand'}`}
                ></i>
            </span>
        </span>
    );
});

/**
 * @name Controls/Separator#style
 * @cfg {String} Стиль отображения разделителя.
 * @variant secondary
 * @variant unaccented
 * @variant primary
 */

/*
 * @name Controls/Separator#style
 * @cfg {String} Separator display style.
 * @variant secondary
 * @variant additional
 * @variant primary
 */

/**
 * @name Controls/Separator#bold
 * @cfg {Boolean} Определяет толщину двойного разделителя.
 */

/*
 * @name Controls/Separator#bold
 * @cfg {Boolean} Determines the double separator thickness.
 */
export default Separator;
