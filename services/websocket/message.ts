export const messageFactory = {
    request: (
        type: string,
        payload: unknown,
        channel: string
    ) => {
        return {
            type,
            payload,
            channel,
            timestamp: Date.now()
        };
    }
};