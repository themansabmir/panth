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

export async function GET() {
    try {
        await dbConnect();

        // Fetch essential fields for the summary table
        const patients = await Patient.find({})
            .select('HCN_Number patient_name age gender date_of_first_assessment updatedAt')
            .sort({ updatedAt: -1 });

        return NextResponse.json({ success: true, data: patients });
    } catch (error: any) {
        console.error('Error fetching patients:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
