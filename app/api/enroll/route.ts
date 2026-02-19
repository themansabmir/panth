import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/models/Patient';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const body = await req.json();

        const patient = await Patient.create(body);

        return NextResponse.json({ success: true, data: patient }, { status: 201 });
    } catch (error: any) {
        console.error('Error creating patient:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 400 });
    }
}
