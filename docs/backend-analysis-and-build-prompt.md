# HelpNearBy Frontend Analysis and Backend Design Document

## 1. What This Project Is
HelpNearBy is a multi-role local assistance platform where users can discover and book nearby services:
- Grocery orders with cart and checkout flow
- Worker services (electrician, plumber, carpenter, etc.) with request and job lifecycle
- Medical essentials and prescription-assisted orders
- Delivery rider flow for pickups and drop-offs
- Shopkeeper dashboard for inventory, orders, billing, and analytics

The frontend is implemented with React + Vite and role-based navigation.

## 2. Current Frontend State (Code Analysis)

### 2.1 App Entry and Routing
- `src/main.jsx` mounts `App`.
- `src/App.jsx` wraps app with `AuthProvider` and `BrowserRouter`.
- `src/AppRoutes.jsx` implements role-gated routes with `ProtectedRoute` and role redirects.

### 2.2 Authentication and Authorization State
- `src/utils/AuthContext.jsx` currently uses hardcoded default user (`shopkeeper`) for testing.
- `src/utils/ProtectedRoute.jsx` checks `user` and `allowedRoles`.
- `src/utils/api.js` attaches bearer token from `localStorage`.
- `src/utils/Endpiont.js` defines minimal auth/profile endpoints only.

Observation:
- Auth is currently simulated; real login/register/token verify flow is not wired.

### 2.3 API Integration State
- `src/utils/ApiCalls.js` has helper functions but also mixed mobile-specific dependency (`@react-native-async-storage/async-storage`) in web project.
- Most feature pages do not call backend APIs yet and use in-memory/mock data.

Observation:
- App is currently frontend simulation heavy (as you said, around 70% complete), backend contract is not implemented end-to-end.

### 2.4 Role Modules and Functional Intent

#### User: Grocery
Files:
- `src/User/Grocery/pages/Home/GroceryHome.jsx`
- `src/User/Grocery/pages/ProductDetails.jsx`
- `src/User/Grocery/pages/GroceryCart.jsx`
- `src/User/Grocery/pages/MyOrders.jsx`
- `src/User/Grocery/pages/data.js`

Intent:
- Browse products by category
- View product details
- Add/update cart items
- Place order
- View order history and status

Current state:
- All product and order data is local mock/static.

#### User: Worker Services
Primary simulated dashboard:
- `src/Navigatore/WorkerNavigatore.jsx`

Older worker discovery/request module:
- `src/User/worker/pages/Home.jsx`
- `src/User/worker/componets/...` (search, card, request form, request tracking)

Intent:
- Discover workers by category/search/location
- Send request with date/time/message/image/location
- Worker accepts/rejects request
- Worker updates job status (accepted, arrived, work started, completed)
- Contact/chat/track location

Current state:
- Mostly mock data and local state transitions.
- Request form simulates submit and geolocation/map handling.

#### User: Medical
Files:
- `src/User/medical/MedicalHome.jsx`
- `src/User/medical/ChatWithPharmacist.jsx`

Intent:
- Browse medical items
- Add medical items to cart/order
- Upload prescription
- Chat with pharmacist

Current state:
- UI exists; no real backend integration.

#### Delivery Rider
Files:
- `src/Navigatore/DeliveryNavigatore.jsx`
- `src/deliveryBoy/*`

Intent:
- Go online/offline
- Accept delivery tasks
- Pickup/drop progression
- OTP verification at delivery
- Earnings and history

Current state:
- Fully simulated with local arrays and state.

#### Shopkeeper
Files:
- `src/Navigatore/ShopNavigatore.jsx`
- `src/shopkiper/*`

Intent:
- Manage products/inventory
- Receive and dispatch orders
- Basic billing/invoice generation
- Dashboard analytics

Current state:
- Mock data only, including simulated incoming order popup.

## 3. Backend Requirements Inferred from Frontend

### 3.1 Core Requirements
1. Multi-role auth system (`user`, `worker`, `shopkeeper`, `delivery`, `medical`, optional `admin`).
2. Nearby discovery based on geolocation for workers and shops.
3. Product catalog for grocery and medical stores.
4. Cart and checkout.
5. Order lifecycle with status transitions.
6. Worker request lifecycle and scheduling.
7. Delivery assignment and OTP completion.
8. Real-time live tracking for delivery and service workers (mandatory).
9. Chat between user and worker/pharmacist (mandatory).
10. Notifications and event updates.
11. Ratings/reviews after completion.
12. Admin controls, moderation, and reporting.
13. Payments, settlements, and payout records.
14. Audit logs and security monitoring.
15. Observability and background jobs for production.

### 3.2 Suggested Tech Stack
- Runtime: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT (access + refresh)
- Validation: Zod or Joi
- Password hashing: bcrypt
- Uploads: multer + cloud storage (Cloudinary/S3 compatible)
- Real-time: Socket.IO (chat + status updates)
- Logging: pino or winston
- Security: helmet, cors, rate-limit, mongo-sanitize

## 4. Proposed Backend Architecture

## 4.1 Project Structure
```txt
backend/
  src/
    app.js
    server.js
    config/
      env.js
      db.js
      logger.js
      cors.js
    constants/
      roles.js
      orderStatus.js
      requestStatus.js
    models/
      User.js
      WorkerProfile.js
      Shop.js
      Product.js
      Cart.js
      Order.js
      ServiceRequest.js
      DeliveryTask.js
      ChatThread.js
      Message.js
      Review.js
      Notification.js
      Address.js
      Prescription.js
      OtpVerification.js
    controllers/
      auth.controller.js
      user.controller.js
      worker.controller.js
      shop.controller.js
      product.controller.js
      cart.controller.js
      order.controller.js
      serviceRequest.controller.js
      delivery.controller.js
      medical.controller.js
      chat.controller.js
      review.controller.js
      notification.controller.js
      upload.controller.js
      health.controller.js
    routes/
      index.js
      auth.routes.js
      users.routes.js
      workers.routes.js
      shops.routes.js
      products.routes.js
      carts.routes.js
      orders.routes.js
      serviceRequests.routes.js
      deliveries.routes.js
      medical.routes.js
      chats.routes.js
      reviews.routes.js
      notifications.routes.js
      uploads.routes.js
      health.routes.js
    middleware/
      auth.middleware.js
      role.middleware.js
      validate.middleware.js
      error.middleware.js
      notFound.middleware.js
      rateLimit.middleware.js
      upload.middleware.js
      requestId.middleware.js
    services/
      auth.service.js
      geo.service.js
      order.service.js
      delivery.service.js
      chat.service.js
      notification.service.js
      file.service.js
    validators/
      auth.schemas.js
      user.schemas.js
      product.schemas.js
      order.schemas.js
      request.schemas.js
    utils/
      apiResponse.js
      pagination.js
      distance.js
      otp.js
      asyncHandler.js
  tests/
  package.json
  .env.example
```

## 4.2 Data Models (Mongoose-level Design)

### User
Purpose:
- Common identity model for every role.

Fields:
- `_id`
- `name`
- `email` (unique)
- `phone` (unique)
- `passwordHash`
- `role` (`user|worker|shopkeeper|delivery|medical|admin`)
- `avatarUrl`
- `address` (object or ref)
- `location` (`type: Point`, `coordinates: [lng, lat]`, 2dsphere index)
- `isActive`
- `isVerified`
- `lastLoginAt`
- timestamps

### WorkerProfile
Purpose:
- Worker specific details.

Fields:
- `userId` (ref User)
- `categories` (array)
- `skills` (array)
- `experienceYears`
- `description`
- `ratingAvg`
- `ratingCount`
- `serviceRadiusKm`
- `isAvailable`
- `documents` (IDs/proofs)
- timestamps

### Shop
Purpose:
- Grocery/medical seller profile.

Fields:
- `ownerId` (ref User)
- `name`
- `shopType` (`grocery|medical|general`)
- `address`
- `location` (Point + 2dsphere)
- `openingHours`
- `isOpenNow`
- `ratingAvg`
- timestamps

### Product
Purpose:
- Sellable item for grocery/medical.

Fields:
- `shopId` (ref Shop)
- `name`
- `description`
- `category`
- `price`
- `mrp`
- `stock`
- `unit`
- `images[]`
- `isActive`
- timestamps

### Cart
Purpose:
- Per-user cart.

Fields:
- `userId`
- `items[]`:
  - `productId`
  - `shopId`
  - `qty`
  - `unitPrice`
- `subtotal`
- `deliveryFee`
- `discount`
- `total`
- timestamps

### Order
Purpose:
- Grocery/medical purchase order.

Fields:
- `orderNumber`
- `userId`
- `shopId`
- `items[]` (`productId`, `nameSnapshot`, `qty`, `price`)
- `shippingAddress`
- `paymentMethod` (`cod|upi|card|wallet`)
- `paymentStatus` (`pending|paid|failed|refunded`)
- `status` (`pending|accepted|packed|picked|out_for_delivery|delivered|cancelled`)
- `assignedDeliveryId` (User ref)
- `otpCodeHash` (for delivery confirmation)
- `subtotal`, `tax`, `deliveryFee`, `discount`, `grandTotal`
- timestamps

### ServiceRequest
Purpose:
- User to worker service booking request.

Fields:
- `requestNumber`
- `userId`
- `workerId`
- `category`
- `message`
- `scheduledDate`
- `scheduledTime`
- `problemImageUrl`
- `serviceLocation` (Point)
- `serviceAddress`
- `status` (`pending|accepted|rejected|arrived|work_started|completed|cancelled`)
- `estimatedPrice`
- `finalPrice`
- timestamps

### DeliveryTask
Purpose:
- Delivery assignment execution tracking.

Fields:
- `orderId`
- `deliveryBoyId`
- `status` (`assigned|accepted|arrived_shop|picked|arrived_customer|completed|failed`)
- `currentLocation` (Point)
- `timeline[]` (event + time)
- timestamps

### ChatThread and Message
Purpose:
- Messaging for user-worker and user-pharmacist.

ChatThread fields:
- `participants[]` (user IDs)
- `contextType` (`service_request|medical|order`)
- `contextId`
- `lastMessageAt`

Message fields:
- `threadId`
- `senderId`
- `text`
- `attachments[]`
- `isRead`
- timestamps

### Review
Purpose:
- Ratings for worker/shop/orders.

Fields:
- `authorId`
- `targetType` (`worker|shop|product|delivery`)
- `targetId`
- `rating`
- `comment`
- timestamps

### Notification
Purpose:
- In-app event notifications.

Fields:
- `userId`
- `title`
- `body`
- `type`
- `meta`
- `isRead`
- timestamps

### Prescription
Purpose:
- Medical prescription uploads.

Fields:
- `userId`
- `fileUrl`
- `notes`
- `status` (`uploaded|reviewed|approved|rejected`)
- `reviewedBy` (medical user)
- timestamps

## 4.3 Controllers and Responsibilities

### auth.controller
- `register`, `login`, `refreshToken`, `verifyToken`, `logout`
- Role-aware registration payload

### user.controller
- Profile get/update
- Address add/list/update
- Nearby recommendations

### worker.controller
- Worker profile CRUD
- Nearby worker discovery
- Worker availability toggle
- Worker dashboard summaries

### shop.controller
- Shop profile CRUD
- Shop dashboard analytics
- Shop order list/dispatch actions

### product.controller
- Product CRUD by shopkeeper
- Product list/search/filter by category/shop/nearby

### cart.controller
- Get cart
- Add/update/remove item
- Apply coupon

### order.controller
- Create order from cart
- Get user orders
- Get order details
- Cancel order
- Status transitions by shop/delivery roles

### serviceRequest.controller
- Create request to worker
- List incoming worker requests
- Accept/reject request
- Progress status updates and completion

### delivery.controller
- Go online/offline
- Fetch available delivery tasks
- Accept assignment
- Update live status
- Verify OTP and complete

### medical.controller
- Medical item listing
- Prescription upload and status
- Pharmacist queue actions

### chat.controller
- Create/get thread
- Send/list messages
- Mark read

### review.controller
- Create review
- List reviews by target

### notification.controller
- List notifications
- Mark read/unread

### upload.controller
- Upload image/prescription/profile image

## 4.4 Routes (API Contract)
Base: `/api`

Auth:
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/refresh`
- `GET /auth/verify-token`
- `POST /auth/logout`

Users:
- `GET /users/me`
- `PATCH /users/me`
- `GET /users/nearby-workers`

Workers:
- `GET /workers`
- `GET /workers/suggestions?keyword=`
- `GET /workers/:id`
- `PATCH /workers/me/availability`
- `GET /workers/me/requests`

Shops:
- `GET /shops/nearby`
- `POST /shops`
- `GET /shops/me/dashboard`

Products:
- `GET /products`
- `GET /products/:id`
- `POST /products` (shopkeeper)
- `PATCH /products/:id` (shopkeeper)
- `DELETE /products/:id` (shopkeeper)

Cart:
- `GET /cart`
- `POST /cart/items`
- `PATCH /cart/items/:itemId`
- `DELETE /cart/items/:itemId`
- `DELETE /cart`

Orders:
- `POST /orders`
- `GET /orders/my`
- `GET /orders/:id`
- `PATCH /orders/:id/cancel`
- `PATCH /orders/:id/status` (shop/delivery)

Service Requests:
- `POST /service-requests`
- `GET /service-requests/my`
- `GET /service-requests/incoming`
- `PATCH /service-requests/:id/accept`
- `PATCH /service-requests/:id/reject`
- `PATCH /service-requests/:id/status`

Delivery:
- `PATCH /delivery/me/online`
- `GET /delivery/tasks/available`
- `PATCH /delivery/tasks/:id/accept`
- `PATCH /delivery/tasks/:id/status`
- `POST /delivery/tasks/:id/verify-otp`

Medical:
- `GET /medical/products`
- `POST /medical/prescriptions`
- `GET /medical/prescriptions/my`
- `PATCH /medical/prescriptions/:id/review` (medical role)

Chat:
- `GET /chats/threads`
- `POST /chats/threads`
- `GET /chats/threads/:id/messages`
- `POST /chats/threads/:id/messages`

Reviews:
- `POST /reviews`
- `GET /reviews/:targetType/:targetId`

Notifications:
- `GET /notifications`
- `PATCH /notifications/:id/read`

Uploads:
- `POST /uploads/image`
- `POST /uploads/prescription`

Health:
- `GET /health`

## 4.5 Middleware Design

### `auth.middleware.js`
- Verify JWT access token
- Attach `req.user`
- Reject unauthenticated requests with 401

### `role.middleware.js`
- `allowRoles('shopkeeper', 'admin')`
- Enforce role-based authorization with 403

### `validate.middleware.js`
- Validate body/params/query against schemas
- Return 400 with field errors

### `upload.middleware.js`
- Multer config
- Size/type restrictions

### `rateLimit.middleware.js`
- Protect auth and write-heavy endpoints

### `error.middleware.js`
- Centralized exception handling
- Standard response format

### `notFound.middleware.js`
- 404 handler

### `requestId.middleware.js`
- Add request correlation id for logs/debugging

## 4.6 `app.js` and `server.js` Responsibilities

### `app.js`
Purpose:
- Construct Express app and global middleware stack.

Responsibilities:
1. `express.json()`, `express.urlencoded()`
2. `helmet`, `cors`, compression
3. request-id and logger middleware
4. register `/api` routes
5. register `notFound` and `error` middleware
6. export app for testing and server bootstrap

### `server.js`
Purpose:
- Runtime startup and process lifecycle.

Responsibilities:
1. Load env config
2. Connect database
3. Start HTTP server and optional Socket.IO
4. Graceful shutdown on SIGINT/SIGTERM
5. Handle uncaught errors and promise rejections

## 5. Frontend-to-Backend Mapping (Important)

1. Role navigation in `AppRoutes` requires real role from JWT/user profile endpoint.
2. Grocery pages need products, cart, order APIs replacing static `data.js` and local state.
3. Worker flows need searchable nearby workers and request lifecycle endpoints.
4. Delivery flow needs task queue, status transitions, and OTP verification APIs.
5. Shopkeeper dashboard needs product CRUD + order management + analytics APIs.
6. Medical flow needs product list + prescription upload + chat/pharmacist thread support.
7. Shared notifications and chat can be added in phase 2 if not release critical.

## 6. Known Gaps and Fix Notes Before Backend Wiring

1. `ApiCalls.js` imports React Native storage in web project; replace with web-safe token handling.
2. Authentication context is hardcoded; replace with real login/refresh/verify flow.
3. Multiple simulated modules exist (old and new worker flows). Decide one canonical flow before API wiring.
4. Route naming has typos (`Navigatore`, `Requast`, `Endpiont`) that should be normalized gradually.
5. Some endpoints in code are inconsistent (`/workers/getSuggestion` vs expected `/workers/suggestions`).

## 7. Big Prompt to Generate Complete Backend with AI

Use the exact prompt below with your coding AI:

```text
You are a senior backend engineer. Build a production-ready backend for a multi-role local assistance platform named HelpNearBy.

Business summary:
- Platform connects nearby users with grocery stores, medical stores, local workers, and delivery riders.
- Roles: user, worker, shopkeeper, delivery, medical, admin.
- Frontend is React and currently simulation-heavy. You must provide full real backend APIs.

Technology requirements:
- Node.js + Express
- MongoDB + Mongoose
- JWT auth (access + refresh)
- bcrypt password hashing
- Joi or Zod validation
- Multer-based uploads (image + prescription)
- Socket.IO support for chat and realtime status updates
- Security: helmet, cors, rate limiting, sanitize
- Logging with pino or winston

Deliverables:
1. Full project folder structure with clean separation:
   - src/config, models, controllers, routes, middleware, validators, services, utils
2. Complete `app.js` and `server.js`
3. Complete Mongoose models with indexes and relations:
   - User
   - WorkerProfile
   - Shop
   - Product
   - Cart
   - Order
   - ServiceRequest
   - DeliveryTask
   - ChatThread
   - Message
   - Review
   - Notification
   - Prescription
4. Full controller implementations with error handling and role checks.
5. Full route files and route mounting from `/api`.
6. Middleware implementations:
   - auth
   - role-based authorization
   - validation
   - error handler
   - not found
   - request id
7. Validation schemas for request bodies and params.
8. Standard API response helper (`success`, `message`, `data`, `meta`).
9. Seed script for demo data for all roles.
10. `.env.example` and setup instructions.
11. Postman collection JSON with all endpoints and sample payloads.
12. Unit/integration test skeleton for auth, orders, and service request flow.

Required API endpoints:
Auth:
- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh
- GET /api/auth/verify-token
- POST /api/auth/logout

Users:
- GET /api/users/me
- PATCH /api/users/me
- GET /api/users/nearby-workers

Workers:
- GET /api/workers
- GET /api/workers/suggestions?keyword=
- GET /api/workers/:id
- PATCH /api/workers/me/availability
- GET /api/workers/me/requests

Shops:
- GET /api/shops/nearby
- POST /api/shops
- GET /api/shops/me/dashboard

Products:
- GET /api/products
- GET /api/products/:id
- POST /api/products
- PATCH /api/products/:id
- DELETE /api/products/:id

Cart:
- GET /api/cart
- POST /api/cart/items
- PATCH /api/cart/items/:itemId
- DELETE /api/cart/items/:itemId
- DELETE /api/cart

Orders:
- POST /api/orders
- GET /api/orders/my
- GET /api/orders/:id
- PATCH /api/orders/:id/cancel
- PATCH /api/orders/:id/status

Service requests:
- POST /api/service-requests
- GET /api/service-requests/my
- GET /api/service-requests/incoming
- PATCH /api/service-requests/:id/accept
- PATCH /api/service-requests/:id/reject
- PATCH /api/service-requests/:id/status

Delivery:
- PATCH /api/delivery/me/online
- GET /api/delivery/tasks/available
- PATCH /api/delivery/tasks/:id/accept
- PATCH /api/delivery/tasks/:id/status
- POST /api/delivery/tasks/:id/verify-otp

Medical:
- GET /api/medical/products
- POST /api/medical/prescriptions
- GET /api/medical/prescriptions/my
- PATCH /api/medical/prescriptions/:id/review

Chat:
- GET /api/chats/threads
- POST /api/chats/threads
- GET /api/chats/threads/:id/messages
- POST /api/chats/threads/:id/messages

Reviews:
- POST /api/reviews
- GET /api/reviews/:targetType/:targetId

Notifications:
- GET /api/notifications
- PATCH /api/notifications/:id/read

Uploads:
- POST /api/uploads/image
- POST /api/uploads/prescription

Health:
- GET /api/health

Behavior rules:
- Use role checks for protected endpoints.
- Ensure only owners can modify their own resources.
- Add pagination + sorting for list endpoints.
- Add geospatial queries for nearby workers/shops.
- Implement proper order status transition guards.
- Implement service request lifecycle transition guards.
- Implement delivery OTP verification on completion.
- Use transactions where needed (order placement, assignment).

Coding quality:
- Keep code modular and readable.
- Add clear comments only where logic is non-obvious.
- Return consistent HTTP status codes.
- Include centralized error classes.
- Include a concise README with run, dev, test, seed instructions.

Now generate the complete backend code file-by-file.
For each file:
1) print file path,
2) then full code block,
3) ensure imports resolve correctly.

After code generation, provide:
- setup commands
- migration/seed command
- smoke test checklist with sample curl calls
```

## 8. Suggested Build Order
1. Auth + user profile
2. Shop + product + cart
3. Orders + delivery assignment + OTP
4. Worker request lifecycle
5. Medical prescription flow
6. Chat + notifications
7. Hardening (tests, logs, rate limits, docs)

This sequence helps you replace simulation with real APIs incrementally without breaking the frontend.

## 9. Full Functionality Matrix (Required)

### 9.1 Authentication and Security
- Email/phone login, password reset, refresh token rotation.
- Device/session management with logout from all devices.
- Role and permission matrix (RBAC) with admin override.
- API rate limiting by route type (auth, search, writes).
- Account lockout and suspicious activity alerts.

### 9.2 User and Address Management
- Multiple saved addresses with default address.
- Geo pin + reverse geocoding fallback.
- Address tagging (`home`, `work`, `other`).

### 9.3 Grocery and Medical Commerce
- Shop and product discovery by distance, rating, open-now, stock.
- Cart rules: single-shop or multi-shop strategy (explicitly defined).
- Promo/coupon system with expiry and usage limits.
- Taxes, delivery fee, surge fee, discount computation service.
- Order invoice, downloadable PDF bill.

### 9.4 Worker Service Booking
- Nearby worker search by category + text + radius.
- Request creation with schedule, description, image, location.
- Accept/reject and lifecycle transitions with guard rules.
- Job timeline events (`created`, `accepted`, `arrived`, `started`, `completed`, `cancelled`).
- Final amount capture and proof-of-completion image (optional).

### 9.5 Delivery Operations
- Rider online/offline + heartbeat status.
- Auto/manual assignment policy.
- OTP verification at doorstep.
- Earnings ledger and trip history.
- Reassignment logic when rider fails or times out.

### 9.6 Real-Time Tracking and Events
- Socket.IO channels for:
  - order updates
  - service request updates
  - delivery location streaming
  - chat messages
  - notification pushes
- Geo update endpoint and socket event for rider/worker location every N seconds.
- Store latest location in DB and stream to authorized clients only.
- Event naming convention example:
  - `order.status.updated`
  - `delivery.location.updated`
  - `service.status.updated`
  - `chat.message.new`

### 9.7 Chat and Communication
- Thread-based chat with unread counts and read receipts.
- Message attachments (image/file).
- Basic anti-spam guard and message length checks.
- Optional call request events (no media server in v1).

### 9.8 Admin and Moderation
- Admin APIs for user/shop/worker suspension and verification.
- Content moderation for profile fields and uploaded media metadata.
- Dashboard metrics (orders/day, cancellation rate, avg delivery time).
- Dispute and refund workflow.

### 9.9 Payments and Settlements
- Payment intent tracking and webhook verification (if gateway used).
- COD reconciliation workflow.
- Payout table for worker/shopkeeper/delivery earnings settlement.
- Refund and partial refund records.

### 9.10 Observability and Reliability
- Structured logs with requestId/userId correlation.
- Metrics endpoint and optional OpenTelemetry instrumentation.
- Retry queue for notifications and critical async tasks.
- Cron jobs for stale order cleanup and reminder notifications.
- Backup strategy and index tuning notes.

### 9.11 Testing and Quality Gates
- Unit tests for services and validators.
- Integration tests for auth/order/request lifecycles.
- Contract tests for response schema consistency.
- Seed + fixture scripts for each role and scenario.

## 10. Realtime Tracking Architecture (Reference)

1. Mobile/web client sends periodic GPS (`lat`, `lng`, `accuracy`, `speed`) while active task is running.
2. Backend validates actor-task ownership and writes latest location to `LiveLocation` collection.
3. Backend emits socket event to room scoped by order/request id.
4. Authorized subscribers (user, assigned rider/worker, shop, admin) receive live updates.
5. Last known position is returned from REST for reconnect recovery.
6. If location stream stops for threshold duration, backend marks stale and triggers alert.

Suggested new model:
- `LiveLocation`
  - `actorId`
  - `actorRole`
  - `contextType` (`order|service_request`)
  - `contextId`
  - `location` (Point)
  - `accuracy`
  - `heading`
  - `speed`
  - `capturedAt`

## 11. API Additions for Complete Functionality

Realtime and tracking:
- `POST /api/tracking/location`
- `GET /api/tracking/:contextType/:contextId/latest`
- `GET /api/tracking/:contextType/:contextId/history`

Admin and moderation:
- `GET /api/admin/overview`
- `PATCH /api/admin/users/:id/status`
- `PATCH /api/admin/workers/:id/verify`
- `PATCH /api/admin/shops/:id/verify`
- `GET /api/admin/disputes`
- `PATCH /api/admin/disputes/:id/resolve`

Payments and payouts:
- `POST /api/payments/create-intent`
- `POST /api/payments/webhook`
- `GET /api/payments/my-transactions`
- `GET /api/payouts/me`
- `POST /api/payouts/request`

Reports and analytics:
- `GET /api/analytics/shop`
- `GET /api/analytics/worker`
- `GET /api/analytics/delivery`
- `GET /api/analytics/admin`

## 12. Mega Prompt (All Required Functionality, Including Real-Time Tracking)

Use this prompt when you want AI to build the full backend with all advanced functionality:

```text
You are a principal backend architect and implementation engineer.
Build the full production backend for HelpNearBy with every required feature enabled, including real-time tracking.

Product context:
- Multi-role local assistance marketplace.
- Roles: user, worker, shopkeeper, delivery, medical, admin.
- Domains: grocery commerce, medical orders, local worker service booking, and delivery fulfillment.
- Frontend is React and currently mock-heavy; backend must replace all simulations.

Mandatory tech:
- Node.js, Express, MongoDB, Mongoose
- JWT access/refresh auth
- Socket.IO real-time system
- Multer uploads + cloud storage adapter
- Validation (Joi/Zod), logging, centralized errors
- Security middleware and rate limits
- Jest + supertest tests

Mandatory functional scope:
1) Auth + RBAC + session management
2) User profile + multi-address management
3) Nearby worker/shop discovery via geo queries
4) Product catalog + inventory management
5) Cart + checkout + taxes/fees/discount engine
6) Orders + status lifecycle + invoices
7) Worker request lifecycle + schedule + completion workflow
8) Delivery task assignment + OTP completion + earnings ledger
9) Real-time tracking for rider/worker location with socket rooms
10) Real-time status updates and notifications
11) Chat system with read receipts and attachments
12) Medical prescription upload and review pipeline
13) Ratings/reviews
14) Admin moderation + dispute management
15) Payment intent + webhook + payout records
16) Analytics endpoints per role
17) Audit log + observability + cron jobs

Data models required:
- User, WorkerProfile, Shop, Product, Cart, Order, ServiceRequest, DeliveryTask, ChatThread, Message, Review, Notification, Prescription, LiveLocation, PaymentTransaction, Payout, Dispute, AuditLog.

Routing and controllers:
- Implement all previously defined `/api/...` routes plus tracking/admin/payments/payouts/analytics routes.
- Enforce strict ownership and role checks.
- Add pagination/filter/sort support for list endpoints.

Realtime system requirements:
- Socket auth with JWT.
- Room strategy:
  - `order:{id}`
  - `serviceRequest:{id}`
  - `chat:{threadId}`
  - `user:{id}` (notifications)
- Emit events:
  - `order.status.updated`
  - `delivery.location.updated`
  - `service.status.updated`
  - `chat.message.new`
  - `notification.new`
- Persist latest location and optionally recent history.

State transition guard rules:
- Order: pending -> accepted -> packed -> picked -> out_for_delivery -> delivered
- Service request: pending -> accepted/rejected; accepted -> arrived -> work_started -> completed
- Delivery task: assigned -> accepted -> arrived_shop -> picked -> arrived_customer -> completed
- Disallow invalid transitions and return clear 409 errors.

Reliability requirements:
- Idempotency for critical write endpoints (`create order`, `payment webhook`, `complete delivery`).
- Transaction usage where consistency is required.
- Graceful shutdown and health/readiness endpoints.

Output format rules:
1. Provide file tree first.
2. Then generate each file with full code block and exact path.
3. Ensure imports compile.
4. Add `.env.example`, README, seed script, Postman collection.
5. Provide test commands and smoke test cURL list.

Quality bar:
- Clean architecture, no placeholder TODOs.
- Production-ready error handling and validation.
- Consistent API response envelope.
- Comprehensive inline comments only for non-trivial logic.
```
