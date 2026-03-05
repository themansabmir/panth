import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Patient from '@/models/Patient';
import { generatePatientPdf } from '../../../../../lib/pdfGenerator';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, context: RouteContext) {
    try {
        await dbConnect();
        const { id } = await context.params;

        const patient = await Patient.findById(id).lean();

        if (!patient) {
            return NextResponse.json({ success: false, error: 'Patient not found' }, { status: 404 });
        }

        const pdfBuffer = await generatePatientPdf(patient as any);

        const name = (patient as any).patient_name?.replace(/\s+/g, '_') ?? id;

        return new NextResponse(pdfBuffer as any, {
            status: 200,
            headers: {
                'Content-Type': 'application/pdf',
                'Content-Disposition': `attachment; filename="${name}_report.pdf"`,
                'Content-Length': pdfBuffer.byteLength.toString(),
            },
        });
    } catch (error: any) {
        console.error('PDF generation error:', error);
        return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }
}
