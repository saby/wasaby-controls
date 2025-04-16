import { format, getValueType } from 'Types/entity';

function getFieldDeclaration(name: string, value: unknown): format.IFieldDeclaration {
    const type = getValueType(value);

    if (type !== null && typeof type === 'object') {
        return {
            name,
            ...type,
        };
    }

    return {
        name,
        //@ts-ignore
        type,
    };
}

export { getFieldDeclaration };
