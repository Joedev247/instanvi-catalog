# Instanvi Catalogue - Frontend Integration Guide

This document outlines the API endpoints, authentication flows, and data structures required for integrating the Instanvi Catalogue frontend with the backend.

---

## 🏗️ Architecture & Business Flows

The platform supports two primary user roles with distinct workflows:

### 1. Provider (Organization) Flow

_The "Source of Truth" for products and collections._

1.  **Onboarding/Auth**: Admin logs in via OTP.
2.  **Inventory Management**: Admin creates **Products** (Master items with base details and images).
3.  **Collection Planning**: Admin creates a **Catalogue** (e.g., "Summer 2024").
4.  **Publishing**: Admin adds selected Products to the Catalogue and sets the official prices.
5.  **Visibility**: The catalogue can be **Public** (viewable by all) or **Private** (requires access code).

### 2. Reseller (Member/Customer) Flow

_Individuals who want to sell the Provider's products under their own brand._

1.  **Discovery**: Reseller views a Provider's catalogue.
2.  **Acquisition**: Reseller clicks **"Clone"** to copy the catalogue structure to their own account.
3.  **Branding**: Reseller updates the cloned catalogue's name, description, and logo.
4.  **Pricing Control**: Reseller modifies product prices in their cloned catalogue (usually adding a margin).
5.  **Distribution**: Reseller shares their unique **Cloned Catalogue Link** with _their_ final customers.

---

## Base URL

- **Development**: `http://localhost:3001` (Check your `.env`)
- **API Prefix**: `/api` (if applicable, based on NestJS config)

---

## 🔑 Authentication

### OTP Flow (All Users)

Uses **OTP-based login**.

**1. Request OTP**
`POST /auth/request-otp`

- **Payload**:

```json
{
  "identifier": "user@example.com"
}
```

**2. Login/Verify OTP**
`POST /auth/login`

- **Payload**:

```json
{
  "identifier": "user@example.com",
  "code": "123456"
}
```

- **Response**: `{ "access_token": "...", "user": { ... } }`

---

## 2. Organization Management

_Requires Admin JWT Token_

- **Create Organization**: `POST /organizations`
  - Body: `{ "name": "...", "slug": "...", "logoUrl": "..." }`
- **List All**: `GET /organizations`
- **Get by Slug**: `GET /organizations/:slug` (Publicly accessible usually)
- **Update**: `PATCH /organizations/:id`
- **Delete**: `DELETE /organizations/:id`

---

## 📦 Product Management (Provider)

_Requires Admin JWT Token_

**Create Product**
`POST /products`

- **Type**: `multipart/form-data`
- **Payload (Form Data)**:
  - `name`: "Premium Coffee Beans"
  - `sku`: "COF-001"
  - `description`: "Grown in the mountains of Ethiopia."
  - `organizationId`: "uuid-here"
  - `files`: (Binary Image Files)
- **List Products**: `GET /products?organizationId=:orgId`
- **Get Detail**: `GET /products/:id`
- **Update**: `PATCH /products/:id`
  - Supports `multipart/form-data` for new images.
- **Delete**: `DELETE /products/:id`

---

## 📚 Catalogue Management (Provider)

_Requires Admin JWT Token_

**1. Create Master Catalogue**
`POST /catalogues`

- **Payload**:

```json
{
  "name": "Summer Collection",
  "description": "Premium summer items",
  "type": "public",
  "allowCloning": true
}
```

- **List Office Catalogues**: `GET /catalogues`
- **Get by ID**: `GET /catalogues/:id`
- **Public View**: `GET /catalogues/view/:slug` (No Auth)
  **2. Add Product to Catalogue**
  `POST /catalogues/:id/products`
- **Payload**:

```json
{
  "productId": "uuid-of-product",
  "price": 1500,
  "compareAtPrice": 2000,
  "displayOrder": 1,
  "customNote": "Limited edition"
}
```

**3. Bulk Add Products**
`POST /catalogues/:id/products/bulk`

- **Payload**:

```json
{
  "products": [
    { "productId": "uuid-1", "price": 1000 },
    { "productId": "uuid-2", "price": 2500 }
  ]
}
```

- **Remove Product**: `DELETE /catalogues/:id/products/:productId`

---

## 🔃 Cloning & Reselling (Member Flow)

_Requires Customer Auth Token_

**1. Clone a Catalogue**
`POST /catalogues/:id/clone`

- **Payload**:

```json
{
  "customName": "Jane's Coffee Shop",
  "description": "Quality beans for home brewing",
  "logoUrl": "https://example.com/logo.png"
}
```

- **My Cloned Catalogues**: `GET /cloned-catalogues/my`
  **2. Update Product Price (Reseller Margin)**
  `PATCH /cloned-catalogues/:id/prices`
- **Query Params**: `?catalogueProductId=uuid&price=1800`
- _Note: `catalogueProductId` is the ID of the link between the product and the original catalogue._

**3. Bulk Update Prices**
`PATCH /cloned-catalogues/:id/prices/bulk`

- **Payload**:

```json
{
  "prices": [
    { "catalogueProductId": "uuid-1", "customPrice": 5500 },
    { "catalogueProductId": "uuid-2", "customPrice": 4200 }
  ]
}
```

- **View Cloned Catalogue (Public)**: `GET /cloned-catalogues/view/:slug`

---

## 🔒 Private Catalogue Access

_Used by anyone trying to view a 'private' type catalogue_

1.  **Request Access**: `POST /catalogues/:id/request-access`
    - **Payload**:
    ```json
    {
      "name": "John Doe",
      "email": "john@example.com"
    }
    ```
2.  **Verify Access**: `POST /catalogues/:id/verify-access`
    - **Payload**:
    ```json
    {
      "code": "123456"
    }
    ```

---

## 6. Customer Management

_Requires Admin JWT Token (except for profile endpoints)_

- **Get Own Profile**: `GET /customers/profile` (Customer Auth)
- **Update Own Profile**: `PATCH /customers/profile` (Customer Auth)
- **Admin List Customers**: `GET /customers`
- **Admin Add Customer**: `POST /customers`
  - Body: `{ "firstName": "...", "lastName": "...", "email": "...", "phone": "..." }`
- **Admin Delete**: `DELETE /customers/:id`

---

## 🛠️ Global Implementation Notes

### Image Uploads

For products, use `multipart/form-data`. The backend handles file processing and returns the stored paths.

### Authorization

Include `Authorization: Bearer <token>` for all requests.

| Context      | Guard               | Header Key      |
| :----------- | :------------------ | :-------------- |
| **Admin**    | `JwtAuthGuard`      | `Authorization` |
| **Reseller** | `CustomerAuthGuard` | `Authorization` |

### Organization Context

- In many endpoints, the `organizationId` is automatically extracted from the JWT token.
- For public views, you may need to pass the `organizationId` or use the `slug` in the URL.
