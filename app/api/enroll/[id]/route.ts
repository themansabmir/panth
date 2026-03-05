import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/models/Patient';

// In Next.js 15+, params is a Promise and must be awaited
type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, context: RouteContext) {
    try {
        await dbConnect();
        const { id } = await context.params;

        const patient = await Patient.findById(id);

        if (!patient) {
            return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: patient });
    } catch (error: any) {
        console.error('Error fetching patient:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, context: RouteContext) {
    try {
        await dbConnect();
        const { id } = await context.params;
        const body = await req.json();

        const patient = await Patient.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true, runValidators: true }
        );

        if (!patient) {
            return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: patient });
    } catch (error: any) {
        console.error('Error updating patient:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
