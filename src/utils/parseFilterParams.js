export function parseFilterParams(query) {
    const filter = {};

    const validTypes = ['work', 'home', 'personal'];

    if (query.type && validTypes.includes(query.type)) {
        filter.contactType = query.type;
    }

    if (query.isFavourite !== undefined) {
        if (query.isFavourite === 'true') {
            filter.isFavourite = true;
        } else if (query.isFavourite === 'false') {
            filter.isFavourite = false;
        }
    }

    return filter;
}
