export function canonical_json_stringify(data: any) {
    const replacer = (key: string, value: any) =>
        value instanceof Object && !(value instanceof Array) ?
            Object.keys(value)
                .sort()
                .reduce((sorted: any, key) => {
                    sorted[key] = value[key];
                    return sorted
                }, {}) :
            value;


    return JSON.stringify(data, replacer);
}

