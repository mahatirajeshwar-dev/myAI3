const encoder = new TextEncoder();

type JwtPayload = {
  sub: string;
  role: string;
  name?: string;
  iat: number;
  exp: number;
};

function base64UrlEncode(value: string): string {
  return Buffer.from(value)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

function base64UrlDecode(value: string): string {
  const padded = value
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(Math.ceil(value.length / 4) * 4, '=');
  return Buffer.from(padded, 'base64').toString('utf-8');
}

async function sign(content: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(content));

  return Buffer.from(signature)
    .toString('base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_');
}

export async function issueEmployeeToken(input: {
  employeeId: string;
  role: string;
  employeeName?: string;
  expiresInHours?: number;
}): Promise<string> {
  const secret = process.env.JWT_SECRET || process.env.JWT_SECRET_KEY;

  if (!secret) {
    throw new Error('Neither JWT_SECRET nor JWT_SECRET_KEY is configured in your environment variables.');

  }

  const now = Math.floor(Date.now() / 1000);
  const payload: JwtPayload = {
    sub: input.employeeId,
    role: input.role,
    name: input.employeeName,
    iat: now,
    exp: now + (input.expiresInHours ?? 8) * 60 * 60,
  };

  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(payload));
  const body = `${encodedHeader}.${encodedPayload}`;
  const signature = await sign(body, secret);

  return `${body}.${signature}`;
}

export async function verifyEmployeeToken(token: string): Promise<JwtPayload | null> {
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

  const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JwtPayload;
  const now = Math.floor(Date.now() / 1000);

  if (payload.exp < now) {
    return null;
  }

  return payload;
}
