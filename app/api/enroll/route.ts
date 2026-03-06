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

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const { searchParams } = new URL(req.url);
        const page = Math.max(1, parseInt(searchParams.get('page') ?? '1', 10));
        const limit = Math.min(500, Math.max(1, parseInt(searchParams.get('limit') ?? '10', 10)));
        const skip = (page - 1) * limit;

        const [patients, total] = await Promise.all([
            Patient.find({})
                .select('HCN_Number patient_name age gender provisional_diagnosis date_of_first_assessment phone_number')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            Patient.countDocuments(),
        ]);

        return NextResponse.json({
            success: true,
            data: patients,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error: any) {
        console.error('Error fetching patients:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
