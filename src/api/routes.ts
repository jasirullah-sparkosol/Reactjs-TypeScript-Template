const API_ROUTES = {
    auth: {
        sign_in: '/auth/sign-in',
        profile: '/auth/profile?withPopulate=true'
    },
    file: {
        post: '/save-file',
        delete: '/delete-file/:name'
    },
    gift: {
        list: '/gifts',
        post: '/gifts',
        get: '/gifts/:id',
        update: '/gifts/:id',
        delete: '/gifts/:id'
    },
    person: {
        list: '/persons?withPopulate=:withPopulate&page=:page&pageSize=:pageSize&usedFor=:usedFor',
        listFilter: '/persons/filters',
        customerPost: '/persons',
        post: '/auth/admin/sign-up', // for creating sub roles users.
        get: '/persons/:id',
        update: '/persons/:id',
        delete: '/persons/:id'
    },
    role: {
        list: '/roles',
        post: '/roles',
        get: '/roles/:id',
        update: '/roles/:id',
        delete: '/roles/:id'
    },
    userGift: {
        list: '/user-gifts?withPopulate=:withPopulate',
        listFilter: '/user-gifts/filters',
        get: '/user-gifts/:id?withPopulate=:withPopulate',
        verifyCode: '/user-gifts/qr-code',
        redeem: '/user-gifts/redeem',
        post: '/user-gifts'
    }
};

export default API_ROUTES;
