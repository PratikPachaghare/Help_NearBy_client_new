export const SERVER_URL = "http://localhost:5000";
export const BASE_URL = `${SERVER_URL}/api`;

export const Endpoints = {
    Auth: {
        Login: "/auth/login",
        Register: "/auth/register",
        VerifyToken: "/auth/verify-token",
        Refresh: "/auth/refresh"
    },
    User: {
        Me: "/users/me",
        Kyc: "/users/me/kyc",
        ShopkeeperKyc: "/users/me/shopkeeper-kyc",
        NearbyWorkers: "/users/nearby-workers"
    },
    Workers: {
        List: "/workers",
        Suggestions: "/workers/getSuggestion"
    },
    Products: {
        List: "/products",
        ById: (id) => `/products/${id}`
    },
    Cart: {
        Get: "/cart",
        AddItem: "/cart/items",
        UpdateItem: (itemId) => `/cart/items/${itemId}`,
        RemoveItem: (itemId) => `/cart/items/${itemId}`,
        Clear: "/cart"
    },
    Orders: {
        Create: "/orders",
        My: "/orders/my",
        ById: (id) => `/orders/${id}`,
        UpdateStatus: (id) => `/orders/${id}/status`
    },
    Delivery: {
        Online: "/delivery/me/online",
        Available: "/delivery/tasks/available",
        MyTasks: "/delivery/tasks/my",
        AcceptTask: (id) => `/delivery/tasks/${id}/accept`,
        UpdateTask: (id) => `/delivery/tasks/${id}/status`,
        VerifyOtp: (id) => `/delivery/tasks/${id}/verify-otp`
    },
    Tracking: {
        UpdateLocation: "/tracking/location",
        Latest: (type, id) => `/tracking/${type}/${id}/latest`,
        OrderParticipants: (orderId) => `/tracking/order/${orderId}/participants`
    },
    Shop: {
        Create: "/shops",
        UpdateMe: "/shops/me",
        Dashboard: "/shops/me/dashboard",
        MyOrders: "/shops/me/orders",
        SalesAnalytics: "/shops/me/sales-analytics",
        DeliveryBoys: "/shops/me/delivery-boys",
        AssignDelivery: (id) => `/shops/me/orders/${id}/assign-delivery`,
        UpdateOrderStatus: (id) => `/shops/me/orders/${id}/status`
    },
    Medical: {
        Products: "/medical/products",
        UploadPrescription: "/medical/prescriptions",
        MyPrescriptions: "/medical/prescriptions/my",
        PrescriptionDetail: (id) => `/medical/prescriptions/${id}`,
        QuoteAction: (id) => `/medical/prescriptions/${id}/quote-action`,
        PlaceOrder: (id) => `/medical/prescriptions/${id}/place-order`,
        AssignedPrescriptions: "/medical/shop/prescriptions/assigned",
        VerifyPrescription: (id) => `/medical/prescriptions/${id}/verify`,
        QuotePrescription: (id) => `/medical/prescriptions/${id}/quote`
    },
    Admin: {
        Overview: "/admin/overview",
        Users: "/admin/users",
        UserStatus: (id) => `/admin/users/${id}/status`,
        KycQueue: "/admin/kyc",
        KycRequests: "/admin/kyc-requests",
        KycUpdate: (id) => `/admin/users/${id}/kyc`,
        KycStatus: (id) => `/admin/users/${id}/shopkeeper-kyc`,
        AreaSummary: "/admin/area-summary",
        MapEntities: "/admin/map-entities",
        Disputes: "/admin/disputes",
        ResolveDispute: (id) => `/admin/disputes/${id}/resolve`
    }
};
