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

}
