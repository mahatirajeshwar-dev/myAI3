import { NextResponse } from 'next/server';
import { issueEmployeeToken } from '@/lib/auth/jwt';

function parseCsvEnv(name: string): string[] {
  return (process.env[name] ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean);
}

export async function POST(req: Request) {
  const body = await req.json() as {
    employeeId?: string;
    employeeName?: string;
  };

  const employeeId = body.employeeId?.trim();

  if (!employeeId) {
    return NextResponse.json({ error: 'employeeId is required' }, { status: 400 });
  }

  const allowList = parseCsvEnv('ALLOWED_EMPLOYEE_IDS');

  if (allowList.length && !allowList.includes(employeeId)) {
    return NextResponse.json({ error: 'Unauthorized employee ID' }, { status: 403 });
  }

  const hrUploaderIds = parseCsvEnv('HR_UPLOADER_IDS');
  const role = hrUploaderIds.includes(employeeId) ? 'hr' : 'employee';

  const token = await issueEmployeeToken({
    employeeId,
    employeeName: body.employeeName,
    role,
  });

  return NextResponse.json({ token, role });
}
