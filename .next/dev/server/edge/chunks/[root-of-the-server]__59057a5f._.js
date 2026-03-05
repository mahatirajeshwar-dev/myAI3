(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/[root-of-the-server]__59057a5f._.js",
"[externals]/node:buffer [external] (node:buffer, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}),
"[project]/lib/auth/jwt.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "issueEmployeeToken",
    ()=>issueEmployeeToken,
    "verifyEmployeeToken",
    ()=>verifyEmployeeToken
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__ = /*#__PURE__*/ __turbopack_context__.i("[externals]/node:buffer [external] (node:buffer, cjs)");
const encoder = new TextEncoder();
function base64UrlEncode(value) {
    return __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].from(value).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function base64UrlDecode(value) {
    const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
    return __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].from(padded, 'base64').toString('utf-8');
}
async function sign(content, secret) {
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), {
        name: 'HMAC',
        hash: 'SHA-256'
    }, false, [
        'sign'
    ]);
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(content));
    return __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].from(signature).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
async function issueEmployeeToken(input) {
    const secret = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;
    if (!secret) {
        throw new Error('Neither JWT_SECRET nor JWT_SECRET_KEY is configured in your environment variables.');
    }
    const now = Math.floor(Date.now() / 1000);
    const payload = {
        sub: input.employeeId,
        role: input.role,
        name: input.employeeName,
        iat: now,
        exp: now + (input.expiresInHours ?? 8) * 60 * 60
    };
    const header = {
        alg: 'HS256',
        typ: 'JWT'
    };
    const encodedHeader = base64UrlEncode(JSON.stringify(header));
    const encodedPayload = base64UrlEncode(JSON.stringify(payload));
    const body = `${encodedHeader}.${encodedPayload}`;
    const signature = await sign(body, secret);
    return `${body}.${signature}`;
}
async function verifyEmployeeToken(token) {
    const secret = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;
    if (!secret) {
        throw new Error('Neither JWT_SECRET nor JWT_SECRET_KEY is configured in your environment variables.');
    }
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
    if (!encodedHeader || !encodedPayload || !encodedSignature) {
        return null;
    }
    const body = `${encodedHeader}.${encodedPayload}`;
    const expectedSignature = await sign(body, secret);
    if (expectedSignature !== encodedSignature) {
        return null;
    }
    const payload = JSON.parse(base64UrlDecode(encodedPayload));
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
        return null;
    }
    return payload;
}
}),
"[project]/middleware.ts [middleware-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "config",
    ()=>config,
    "middleware",
    ()=>middleware
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/exports/index.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$jwt$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/jwt.ts [middleware-edge] (ecmascript)");
;
;
async function middleware(request) {
    const isProtectedPath = request.nextUrl.pathname.startsWith('/api/chat') || request.nextUrl.pathname.startsWith('/api/ingestion');
    if (!isProtectedPath) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    // Bypass prefetch requests to avoid build/render loops
    if (request.headers.get('x-middleware-prefetch')) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
    }
    const authHeader = request.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Missing bearer token'
        }, {
            status: 401
        });
    }
    const token = authHeader.replace('Bearer ', '');
    const payload = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$jwt$2e$ts__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["verifyEmployeeToken"])(token);
    if (!payload) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Invalid or expired token'
        }, {
            status: 401
        });
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$exports$2f$index$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        '/api/chat/:path*',
        '/api/ingestion/:path*'
    ]
};
}),
]);

//# sourceMappingURL=%5Broot-of-the-server%5D__59057a5f._.js.map