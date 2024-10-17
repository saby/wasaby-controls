export default {
    async loadData(args: Record<string, unknown>): Promise<typeof args> {
        return Promise.resolve(args);
    },
};
