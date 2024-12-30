export const identifyRoutePermission = (route: string): string => {
    let parts = route.replace(/^\/|\/$/g, '').split('/');

    const isListingPage = parts.length === 1;

    if (isListingPage) {
        return `${parts[0]}:list`;
    }

    const isViewPage = parts[parts.length - 1].length === 24;

    // Remove the UUID from the route
    parts = parts.filter((part) => part.length !== 24);

    return `${parts.join(':')}${isViewPage ? ':view' : ''}`;
};
