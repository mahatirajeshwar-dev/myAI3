module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[project]/lib/auth/jwt.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "issueEmployeeToken",
    ()=>issueEmployeeToken,
    "verifyEmployeeToken",
    ()=>verifyEmployeeToken
]);
const encoder = new TextEncoder();
function base64UrlEncode(value) {
    return Buffer.from(value).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}
function base64UrlDecode(value) {
    const padded = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=');
    return Buffer.from(padded, 'base64').toString('utf-8');
}
async function sign(content, secret) {
    const key = await crypto.subtle.importKey('raw', encoder.encode(secret), {
        name: 'HMAC',
        hash: 'SHA-256'
    }, false, [
        'sign'
    ]);
    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(content));
    return Buffer.from(signature).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
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
"[project]/app/api/auth/token/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/auth/jwt.ts [app-route] (ecmascript)");
;
;
async function POST(req) {
    const body = await req.json();
    const employeeId = body.employeeId?.trim();
    if (!employeeId) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'employeeId is required'
        }, {
            status: 400
        });
    }
    const allowList = process.env.ALLOWED_EMPLOYEE_IDS?.split(',').map((id)=>id.trim()).filter(Boolean);
    if (allowList?.length && !allowList.includes(employeeId)) {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: 'Unauthorized employee ID'
        }, {
            status: 403
        });
    }
    try {
        const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$auth$2f$jwt$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["issueEmployeeToken"])({
            employeeId,
            employeeName: body.employeeName,
            role: body.role ?? 'employee'
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            token
        });
    } catch (error) {
        console.error('Token issuance failed:', error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: error instanceof Error ? error.message : 'Failed to issue token'
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__82bf3d54._.js.map