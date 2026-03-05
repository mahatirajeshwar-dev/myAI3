import { NextResponse } from 'next/server';
import { issueEmployeeToken } from '@/lib/auth/jwt';

export async function POST(req: Request) {
  const body = await req.json() as {
    employeeId?: string;
    employeeName?: string;
    role?: string;
  };

  const employeeId = body.employeeId?.trim();

  if (!employeeId) {
    return NextResponse.json({ error: 'employeeId is required' }, { status: 400 });
  }

  const allowList = process.env.ALLOWED_EMPLOYEE_IDS
    ?.split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  if (allowList?.length && !allowList.includes(employeeId)) {
    return NextResponse.json({ error: 'Unauthorized employee ID' }, { status: 403 });
  }

<<<<<<< HEAD
  try {
    const token = await issueEmployeeToken({
      employeeId,
      employeeName: body.employeeName,
      role: body.role ?? 'employee',
    });

    return NextResponse.json({ token });
  } catch (error) {
    console.error('Token issuance failed:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to issue token'
    }, { status: 500 });
  }
=======
  const token = await issueEmployeeToken({
    employeeId,
    employeeName: body.employeeName,
    role: body.role ?? 'employee',
  });

  return NextResponse.json({ token });
>>>>>>> 2c0dfac5910032c84c5db1021f994e51ff0dadfd
}
