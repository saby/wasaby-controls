/**
 * @kaizen_zone 7932f75e-2ad3-49ad-b51a-724eb5c140eb
 */
import { CrudEntityKey, ICrud, IDecorator } from 'Types/source';
import { Record } from 'Types/entity';

interface IAddFieldsOptions {
    passAddFieldsFromMeta?: boolean;
}

interface IOptions {
    getOptions(): object;
    setOptions(options: object): void;
}

export function readWithAdditionalFields(
    source: ICrud | IDecorator | IOptions,
    key: CrudEntityKey,
    metaData?: unknown
): Promise<Record> {
    const targetSource = (source as IDecorator)['[Types/_source/IDecorator]']
        ? (source as IDecorator).getOriginal()
        : source;

    if ((targetSource as IOptions).getOptions) {
        const options: IAddFieldsOptions = (
            targetSource as IOptions
        ).getOptions();
        options.passAddFieldsFromMeta = true;
        (targetSource as IOptions).setOptions(options);
    }

    return (source as ICrud).read(key, metaData as object);
}
