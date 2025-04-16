export const isEqual = (obj1: unknown, obj2: unknown): boolean => {
    try {
        expect(obj1).toEqual(obj2);
        return true;
    } catch (e) {
        return false;
    }
};

export const waitErrorDescriptorsLoading = async () =>
    new Promise((r) => {
        setTimeout(r, 100);
    });
