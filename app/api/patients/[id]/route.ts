import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/models/Patient';

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        await dbConnect();

        const { id } = await params;
        const patient = await Patient.findById(id);

        if (!patient) {
            return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: patient });
    } catch (error: any) {
        console.error('Error fetching patient details:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
