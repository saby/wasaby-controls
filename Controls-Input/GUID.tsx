/**
 * @kaizen_zone 3771544b-250a-4646-9a2f-63335c27415a
 */
import { Mask, IMaskOptions } from 'Controls/input';
export type IGUIDInputProps = Omit<IMaskOptions, 'mask'>;

const _formatMaskChars = {
    x: '[A-Fa-f0-9]',
};
/**
 * Поле ввода guid.
 * @remark
 * Каждый вводимый символ проходит проверку на соответствие формату {@link mask маски guid}.
 * Контрол поддерживает возможность показа или скрытия формата маски в незаполненном поле ввода, регулируемую с помощью опции {@link replacer}.
 * Если {@link replacer символ замены} определен, то поле ввода вычисляет свою ширину автоматически по контенту. При этом во всех режимах поддерживается возможность установки ширины поля ввода через CSS.
 *
 * Полезные ссылки:
 * * {@link /materials/DemoStand/app/Controls-demo%2FExample%2FInput демо-пример}
 * * {@link /doc/platform/developmentapl/interface-development/controls/input-elements/input/mask/ руководство разработчика}
 * * {@link https://github.com/saby/wasaby-controls/blob/rc-20.4000/Controls-default-theme/variables/_input.less переменные тем оформления}
 *
 * @extends Controls/input:Mask
 *
 * @public
 * @demo Controls-Input-demo/GUID/Index
 */
function GUID(props: IGUIDInputProps) {
    return (
        <Mask
            {...props}
            formatMaskChars={_formatMaskChars}
            mask="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            maxLength={14}
        />
    );
}

GUID.defaultProps = {
    replacer: '0',
};

/**
 * @name Controls-input/GUID#replacer
 * @cfg {string}
 * @demo Engine-demo/GUID/Replacer/Index
 */

export default GUID;
