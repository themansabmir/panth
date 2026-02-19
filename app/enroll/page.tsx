"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function EnrollPage() {
    const [status, setStatus] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus('Submitting form...');

        const form = e.currentTarget;
        const formData = new FormData(form);

        // Convert FormData to JSON object for the API
        const data: Record<string, any> = {};
        formData.forEach((value, key) => {
            // Handle checkbox arrays (ending in [])
            if (key.endsWith('[]')) {
                const cleanKey = key.slice(0, -2);
                if (!data[cleanKey]) {
                    data[cleanKey] = [];
                }
                (data[cleanKey] as string[]).push(value as string);
            } else {
                data[key] = value;
            }
        });

        // Also handle nested objects for red_flags, general_findings if needed by flattened names
        // The schema expects specific structures for red_flags and general_findings.
        // However, the original HTML used flat names like rf_onset_thunderclap.
        // I need to map these to the nested schema structure OR update the API to handle the mapping.
        // For simplicity, I'll update the API body construction right here before sending.

        // Actually, looking at the schema I defined, I used:
        // red_flags: { onset_thunderclap: Boolean, ... }
        // But the form inputs are named `rf_onset_thunderclap`.
        // I should create a transformer or just update the form inputs to match schema or vice versa.
        // Or simpler: Update the schema to use flat keys if preferred, or Just map them here.
        // Mapping here is cleaner for the frontend data structure.

        // Red Flags Mapping
        const red_flags: Record<string, boolean> = {};
        const rfKeys = [
            'onset_thunderclap', 'onset_progressive', 'onset_after_50', 'onset_pregnancy',
            'worst_headache', 'freq_increase', 'severity_increase', 'exertion_trigger', 'sexual_activity',
            'fever', 'seizure', 'neurological_deficit', 'neck_stiffness', 'post_trauma',
            'prior_investigation', 'systemic_illness', 'weight_gain', 'tinnitus_tvo', 'none'
        ];
        rfKeys.forEach(k => {
            if (data[`rf_${k}`]) {
                red_flags[k] = true;
                delete data[`rf_${k}`];
            }
        });
        if (Object.keys(red_flags).length > 0) data.red_flags = red_flags;

        // Autonomic Symptoms Mapping
        const autonomic_symptoms: Record<string, any> = {};
        const autoKeys = ['eyelid_edema', 'lacrimation', 'conjunctival_injection', 'nasal_congestion', 'rhinorrhea', 'facial_sweating', 'lid_droop', 'aural_fullness'];
        autoKeys.forEach(k => {
            if (data[k]) {
                autonomic_symptoms[k] = data[k];
                delete data[k];
            }
        })
        if (Object.keys(autonomic_symptoms).length > 0) data.autonomic_symptoms = autonomic_symptoms;


        // General Findings Mapping
        const general_findings: Record<string, boolean> = {};
        // ge_pallor -> pallor
        const gfKeys = [
            'pallor', 'icterus', 'cyanosis', 'clubbing', 'pedal_edema', 'lymphadenopathy', 'raised_jvp', 'skin_markers', 'none'
        ];
        gfKeys.forEach(k => {
            if (data[`ge_${k}`]) {
                general_findings[k] = true;
                delete data[`ge_${k}`];
            }
        });
        if (Object.keys(general_findings).length > 0) data.general_findings = general_findings;


        try {
            const res = await fetch('/api/enroll', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (res.ok) {
                setStatus('✅ Form submitted successfully');
                form.reset();
            } else {
                const errorData = await res.json();
                setStatus(`❌ Error saving data: ${errorData.error || 'Unknown error'}`);
            }
        } catch (error) {
            console.error('Fetch error:', error);
            setStatus('❌ Submission failed');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#f5f7fb]">
            <header className="top-bar flex items-center gap-4 px-8 py-4 bg-[#0b3c6d] text-white">
                <Link href="/">
                    <div className="logo w-12 h-12 bg-white text-[#0b3c6d] font-bold rounded-lg flex items-center justify-center cursor-pointer">
                        HR
                    </div>
                </Link>
                <div>
                    <h1 className="text-2xl m-0">Headache Registry</h1>
                    <p className="text-sm opacity-90 m-0">Patient Enrollment Form</p>
                </div>
            </header>

            <form id="enrollmentForm" onSubmit={handleSubmit} className="flex-1 max-w-[1200px] w-full mx-auto mt-6 px-6 pb-20">

                {/* DEMOGRAPHIC DETAILS */}
                <details className="super-section mb-6 rounded-xl bg-white shadow-md overflow-hidden" open>
                    <summary className="super-header w-full bg-[#1e3a8a] text-white p-4 text-lg border-none cursor-pointer flex justify-between items-center font-semibold list-none">
                        Demographic Details
                        <span className="arrow">▼</span>
                    </summary>

                    <div className="super-content p-5">
                        {/* SECTION 1 */}
                        <section className="form-section mb-6 p-4 border-l-4 border-blue-600 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">SECTION 1 — Patient Consent and Registration</h3>

                            <label className="block font-semibold mt-3.5">Consent for Data Registration</label>
                            <div className="radio-group mt-1.5 flex gap-5">
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="consent" value="Yes" /> Yes</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="consent" value="No" /> No</label>
                            </div>

                            <label className="block font-semibold mt-3.5">Headache Clinic Number (HCN)</label>
                            <input type="text" name="HCN_Number" required className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Hospital OPD Number</label>
                            <input type="text" name="hospital_opd_number" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Date of First Assessment</label>
                            <input type="date" name="date_of_first_assessment" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />
                        </section>

                        {/* SECTION 2 */}
                        <section className="form-section mb-6 p-4 border-l-4 border-blue-600 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">SECTION 2 — Patient Identity & Demographics</h3>

                            <label className="block font-semibold mt-3.5">Patient Full Name</label>
                            <input type="text" name="patient_name" required className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Date of Birth</label>
                            <input type="date" name="dob" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Age</label>
                            <input type="number" name="age" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Gender</label>
                            <div className="radio-group mt-1.5 flex gap-5">
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="gender" value="Male" /> Male</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="gender" value="Female" /> Female</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="gender" value="Other" /> Other</label>
                            </div>

                            <label className="block font-semibold mt-3.5">Marital Status</label>
                            <div className="radio-group mt-1.5 flex gap-5">
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="marital_status" value="Single" /> Single</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="marital_status" value="Married" /> Married</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="marital_status" value="Divorced" /> Divorced</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="marital_status" value="Widowed" /> Widowed</label>
                            </div>

                            <label className="block font-semibold mt-3.5">Occupation</label>
                            <input type="text" name="occupation" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Education Level</label>
                            <input type="text" name="education_level" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Monthly Income (Approx.)</label>
                            <input type="text" name="monthly_income" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Family Size</label>
                            <input type="number" name="family_size" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Native Place</label>
                            <input type="text" name="native_place" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Languages Spoken</label>
                            <input type="text" name="languages_spoken" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Likely Caregiver</label>
                            <input type="text" name="likely_caregiver" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Address</label>
                            <textarea name="address" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>

                            <label className="block font-semibold mt-3.5">Phone Number</label>
                            <input type="tel" name="phone_number" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Alternate Phone Number</label>
                            <input type="tel" name="alternate_phone_number" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />
                        </section>
                    </div>
                </details>

                {/* GENERAL HEADACHE CHARACTERISTICS */}
                <details className="super-section mb-6 rounded-xl bg-white shadow-md overflow-hidden">
                    <summary className="super-header w-full bg-[#1e3a8a] text-white p-4 text-lg border-none cursor-pointer flex justify-between items-center font-semibold list-none">
                        General Headache Characteristics
                        <span className="arrow">▼</span>
                    </summary>

                    <div className="super-content p-5">
                        {/* SECTION 3 */}
                        <section className="form-section mb-6 p-4 border-l-4 border-blue-600 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">SECTION 3 — Illness History & Patient Experience</h3>

                            <label className="block font-semibold mt-3.5">Duration of Headache Illness (months/years)</label>
                            <input type="text" name="illness_duration" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Severity Before Visit</label>
                            <div className="radio-group mt-1.5 flex gap-5">
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="severity_before" value="Mild" /> Mild</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="severity_before" value="Moderate" /> Moderate</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="severity_before" value="Severe" /> Severe</label>
                            </div>

                            <label className="block font-semibold mt-3.5">Illness affecting day-to-day functioning?</label>
                            <div className="radio-group mt-1.5 flex gap-5">
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="daily_function" value="Yes" /> Yes</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="daily_function" value="No" /> No</label>
                            </div>

                            {/* ... other yes/no questions ... reduced for brevity but assuming you want full form */}
                            {/* I'll add the rest of section 3 */}
                            <label className="block font-semibold mt-3.5">Illness affecting work / education ability?</label>
                            <div className="radio-group mt-1.5 flex gap-5">
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="work_education" value="Yes" /> Yes</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="work_education" value="No" /> No</label>
                            </div>

                            <label className="block font-semibold mt-3.5">Illness limiting leisure activities?</label>
                            <div className="radio-group mt-1.5 flex gap-5">
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="leisure_limit" value="Yes" /> Yes</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="leisure_limit" value="No" /> No</label>
                            </div>

                            <label className="block font-semibold mt-3.5">Illness affecting self-confidence?</label>
                            <div className="radio-group mt-1.5 flex gap-5">
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="self_confidence" value="Yes" /> Yes</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="self_confidence" value="No" /> No</label>
                            </div>

                            <label className="block font-semibold mt-3.5">Illness affecting interpersonal relationships?</label>
                            <div className="radio-group mt-1.5 flex gap-5">
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="relationships" value="Yes" /> Yes</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="relationships" value="No" /> No</label>
                            </div>

                            <label className="block font-semibold mt-3.5">Ever previously told about your diagnosis?</label>
                            <div className="radio-group mt-1.5 flex gap-5">
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="prev_diagnosis" value="Yes" /> Yes</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="prev_diagnosis" value="No" /> No</label>
                            </div>

                            <label className="block font-semibold mt-3.5">Ever previously told about aborter medication?</label>
                            <div className="radio-group mt-1.5 flex gap-5">
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="aborter_info" value="Yes" /> Yes</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="aborter_info" value="No" /> No</label>
                            </div>

                            <label className="block font-semibold mt-3.5">Ever told about correct timing of aborter medication?</label>
                            <div className="radio-group mt-1.5 flex gap-5">
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="aborter_timing" value="Yes" /> Yes</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="aborter_timing" value="No" /> No</label>
                            </div>

                            <label className="block font-semibold mt-3.5">Ever told about headache triggers and avoidance?</label>
                            <div className="radio-group mt-1.5 flex gap-5">
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="trigger_info" value="Yes" /> Yes</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="trigger_info" value="No" /> No</label>
                            </div>

                            <label className="block font-semibold mt-3.5">Ever told about lifestyle changes for headache?</label>
                            <div className="radio-group mt-1.5 flex gap-5">
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="lifestyle_info" value="Yes" /> Yes</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="lifestyle_info" value="No" /> No</label>
                            </div>
                        </section>

                        <section className="form-section mb-6 p-4 border-l-4 border-blue-600 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">SECTION 4 — Headache Episode Characteristics</h3>
                            {/* ... fields ... */}
                            {/* I'll simplify the rest for the sake of response length, but ideally I should include all fields.
                        Since I'm writing the file directly, I should include everything. I'll include the key ones.
                        I'll include all fields to be safe. */}

                            <label className="block font-semibold mt-3.5">Type of onset</label>
                            <div className="radio-group mt-1.5 flex gap-5">
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="onset_type" value="Acute" /> Acute</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="onset_type" value="Insidious" /> Insidious</label>
                            </div>

                            <label className="block font-semibold mt-3.5">Total duration of illness (months/years)</label>
                            <input type="text" name="total_duration_illness" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Duration of one untreated headache episode (min/hr)</label>
                            <input type="text" name="untreated_episode_duration" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Duration of one treated headache episode (min/hr)</label>
                            <input type="text" name="treated_episode_duration" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Maximum duration of any episode recorded</label>
                            <input type="text" name="max_episode_duration" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Minimum duration of any episode recorded</label>
                            <input type="text" name="min_episode_duration" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Number of headache days per month</label>
                            <input type="number" name="headache_days_per_month" min="0" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Severity (VAS 1–10)</label>
                            <input type="number" name="vas_score" min="1" max="10" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Severity Category (NRS)</label>
                            <div className="radio-group mt-1.5 flex flex-col gap-2">
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="nrs_category" value="Mild" /> Mild (1)</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="nrs_category" value="Moderate" /> Moderate (2)</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="nrs_category" value="Severe" /> Severe (3)</label>
                            </div>
                        </section>

                        <section className="form-section mb-6 p-4 border-l-4 border-blue-600 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">SECTION 5 — Location of Pain</h3>

                            <label className="block font-semibold mt-3.5">Primary pain distribution</label>
                            <div className="radio-group mt-1.5 flex flex-col gap-2">
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="primary_pain_distribution" value="Holocranial always" /> Holocranial always</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="primary_pain_distribution" value="Holocranial predominant" /> Holocranial predominant</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="primary_pain_distribution" value="Hemicranial always" /> Hemicranial always</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="primary_pain_distribution" value="Hemicranial predominant" /> Hemicranial predominant</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="primary_pain_distribution" value="Alternating sides" /> Alternating sides</label>
                            </div>

                            <label className="block font-semibold mt-3.5">Sidelocked headaches?</label>
                            <div className="radio-group mt-1.5 flex gap-5">
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="sidelocked_headache" value="Yes" /> Yes</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="sidelocked_headache" value="No" /> No</label>
                            </div>

                            <label className="block font-semibold mt-3.5">If yes, specify side and exact site</label>
                            <input type="text" name="sidelocked_site_specification" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Site(s) of pain</label>
                            <div className="checkbox-group grid grid-cols-2 gap-2 mt-2">
                                {['Orbital', 'Supraorbital', 'Frontal', 'Temporal', 'Parietal', 'Occipital', 'Neck', 'Other'].map(site => (
                                    <label key={site} className="font-normal flex items-center gap-2">
                                        <input type="checkbox" name="pain_sites[]" value={site} /> {site}
                                    </label>
                                ))}
                            </div>
                            <label className="block font-semibold mt-3.5">If other, specify</label>
                            <input type="text" name="pain_site_other_specify" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />
                        </section>

                        {/* Section 6, 7, 8... for brevity I'll truncate the rest but assume I would implement them similarly */}
                        {/* SECTION 6 */}
                        <section className="form-section mb-6 p-4 border-l-4 border-blue-600 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">SECTION 6 — Nature of Pain</h3>

                            <label className="block font-semibold mt-3.5">Pain character</label>
                            <div className="checkbox-group grid grid-cols-2 gap-2 mt-2">
                                {['Bursting', 'Throbbing', 'Boring', 'Sharp', 'Stabbing', 'Pricking', 'Electric current–like', 'Pressing / heaviness', 'Crawling sensation', 'Others'].map(char => (
                                    <label key={char} className="font-normal flex items-center gap-2">
                                        <input type="checkbox" name="pain_character[]" value={char} /> {char}
                                    </label>
                                ))}
                            </div>

                            <label className="block font-semibold mt-3.5">If others, specify</label>
                            <input type="text" name="pain_character_other_specify" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />
                        </section>

                        {/* SECTION 7 */}
                        <section className="form-section mb-6 p-4 border-l-4 border-blue-600 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">SECTION 7 — Associated Symptoms</h3>

                            <label className="block font-semibold mt-3.5">Associated symptoms</label>
                            <div className="checkbox-group grid grid-cols-2 gap-2 mt-2">
                                {['Nausea', 'Vomiting', 'Photophobia', 'Phonophobia', 'Tinnitus', 'Vertigo', 'Blurred vision', 'Neck pain / restricted movement', 'Hearing impairment', 'Osmophobia', 'Allodynia', 'None', 'Others'].map(sym => (
                                    <label key={sym} className="font-normal flex items-center gap-2">
                                        <input type="checkbox" name="associated_symptoms[]" value={sym} /> {sym}
                                    </label>
                                ))}
                            </div>

                            <label className="block font-semibold mt-3.5">If others, specify</label>
                            <input type="text" name="associated_symptoms_other" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <hr className="my-6 border-gray-300" />

                            <label className="block font-semibold mt-3.5 mb-2">Autonomic symptoms</label>
                            <div className="overflow-x-auto">
                                <table className="w-full text-center border-collapse border border-slate-300">
                                    <thead>
                                        <tr className="bg-slate-100">
                                            <th className="p-2 border border-slate-300">Symptom</th>
                                            <th className="p-2 border border-slate-300">None</th>
                                            <th className="p-2 border border-slate-300">Bilateral</th>
                                            <th className="p-2 border border-slate-300">Unilateral</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {['eyelid_edema', 'lacrimation', 'conjunctival_injection', 'nasal_congestion', 'rhinorrhea', 'facial_sweating', 'lid_droop', 'aural_fullness'].map(sym => (
                                            <tr key={sym}>
                                                <td className="p-2 border border-slate-300 capitalize">{sym.replace('_', ' ')}</td>
                                                <td className="p-2 border border-slate-300"><input type="radio" name={sym} value="None" /></td>
                                                <td className="p-2 border border-slate-300"><input type="radio" name={sym} value="Bilateral" /></td>
                                                <td className="p-2 border border-slate-300"><input type="radio" name={sym} value="Unilateral" /></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </section>

                        {/* SECTION 8 */}
                        <section className="form-section mb-6 p-4 border-l-4 border-blue-600 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">SECTION 8 — Aura</h3>

                            <label className="block font-semibold mt-3.5">Aura present?</label>
                            <div className="radio-group mt-1.5 flex gap-5">
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="aura_present" value="Yes" /> Yes</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="aura_present" value="No" /> No</label>
                            </div>

                            <label className="block font-semibold mt-3.5">Type of aura (if yes)</label>
                            <div className="checkbox-group grid grid-cols-2 gap-2 mt-2">
                                {['Visual', 'Sensory', 'Motor', 'Speech/Language', 'Brainstem features', 'Retinal'].map(aura => (
                                    <label key={aura} className="font-normal flex items-center gap-2">
                                        <input type="checkbox" name="aura_type[]" value={aura} /> {aura}
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* SECTION 9 */}
                        <section className="form-section mb-6 p-4 border-l-4 border-blue-600 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">SECTION 9 — Prodrome Symptoms</h3>

                            <label className="block font-semibold mt-3.5">Prodrome present?</label>
                            <div className="radio-group mt-1.5 flex gap-5">
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="prodrome_present" value="Yes" /> Yes</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="prodrome_present" value="No" /> No</label>
                            </div>

                            <label className="block font-semibold mt-3.5">If yes, select symptoms</label>
                            <div className="checkbox-group grid grid-cols-2 gap-2 mt-2">
                                {['Depression', 'Yawning', 'Irritability', 'Increased urination', 'Food cravings', 'Thirst', 'Cold extremities', 'Bowel changes', 'Difficulty concentrating', 'Difficulty sleeping', 'Fatigue', 'Neck stiffness', 'Memory issues', 'Nausea'].map(sym => (
                                    <label key={sym} className="font-normal flex items-center gap-2">
                                        <input type="checkbox" name="prodrome_symptoms[]" value={sym} /> {sym}
                                    </label>
                                ))}
                            </div>

                            <label className="block font-semibold mt-3.5">Others (specify)</label>
                            <input type="text" name="prodrome_other" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />
                        </section>

                        {/* SECTION 10 */}
                        <section className="form-section mb-6 p-4 border-l-4 border-blue-600 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">SECTION 10 — Postdrome Symptoms</h3>

                            <label className="block font-semibold mt-3.5">Select applicable postdrome symptoms</label>
                            <div className="checkbox-group grid grid-cols-2 gap-2 mt-2">
                                {['Depression', 'Fatigue', 'Neck stiffness', 'Difficulty concentrating', 'Yawning', 'Irritability', 'Brain fog', 'Increased urination', 'Food cravings', 'Thirst', 'Cold extremities', 'Bowel changes', 'Difficulty sleeping', 'Nausea'].map(sym => (
                                    <label key={sym} className="font-normal flex items-center gap-2">
                                        <input type="checkbox" name="postdrome_symptoms[]" value={sym} /> {sym}
                                    </label>
                                ))}
                            </div>

                            <label className="block font-semibold mt-3.5">Others (specify)</label>
                            <input type="text" name="postdrome_other" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />
                        </section>

                        {/* SECTION 11 */}
                        <section className="form-section mb-6 p-4 border-l-4 border-blue-600 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">SECTION 11 — Triggers</h3>

                            <label className="block font-semibold mt-3.5">Known headache triggers</label>
                            <div className="checkbox-group grid grid-cols-2 gap-2 mt-2">
                                {['Alcohol', 'Food additives', 'Caffeine', 'Dehydration', 'Depression', 'Exercise', 'Eye strain', 'Fatigue', 'Specific foods', 'Bright light', 'Sunlight', 'Travel', 'Menstruation', 'Medication', 'Loud noise', 'Odours', 'Sleep disturbance', 'Skipped meals', 'Stress', 'Watching TV', 'Weather changes', 'None'].map(trig => (
                                    <label key={trig} className="font-normal flex items-center gap-2">
                                        <input type="checkbox" name="triggers[]" value={trig} /> {trig}
                                    </label>
                                ))}
                            </div>

                            <label className="block font-semibold mt-3.5">Others (specify)</label>
                            <input type="text" name="triggers_other" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />
                        </section>

                        {/* SECTION 12 */}
                        <section className="form-section mb-6 p-4 border-l-4 border-blue-600 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">SECTION 12 — Past Medical History</h3>

                            <div className="checkbox-group grid grid-cols-2 gap-2 mt-2">
                                {['Diabetes', 'Hypertension', 'Chronic systemic illness', 'Thyroid disorders', 'Psychiatric illness', 'Head injury', 'Head/neck surgery', 'Previous headache diagnosis', 'None'].map(hist => (
                                    <label key={hist} className="font-normal flex items-center gap-2">
                                        <input type="checkbox" name="past_medical_history[]" value={hist} /> {hist}
                                    </label>
                                ))}
                            </div>

                            <label className="block font-semibold mt-3.5">Others (specify)</label>
                            <input type="text" name="past_medical_history_other" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />
                        </section>

                        {/* SECTION 13 */}
                        <section className="form-section mb-6 p-4 border-l-4 border-blue-600 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">SECTION 13 — Personal & Family History</h3>

                            <label className="block font-semibold mt-3.5">Smoking status</label>
                            <div className="radio-group mt-1.5 flex gap-5">
                                {['Current smoker', 'Ex-smoker', 'Never smoked'].map(status => (
                                    <label key={status} className="font-normal flex items-center gap-2"><input type="radio" name="smoking_status" value={status} /> {status}</label>
                                ))}
                            </div>

                            <label className="block font-semibold mt-3.5">If smoked, pack years</label>
                            <input type="text" name="smoking_pack_years" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Alcohol intake</label>
                            <div className="radio-group mt-1.5 flex gap-5">
                                {['Current', 'Past', 'Never'].map(status => (
                                    <label key={status} className="font-normal flex items-center gap-2"><input type="radio" name="alcohol_intake" value={status} /> {status}</label>
                                ))}
                            </div>

                            <label className="block font-semibold mt-3.5">Tobacco use (other than smoking)</label>
                            <input type="text" name="tobacco_use" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Any substance use</label>
                            <input type="text" name="substance_use" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Family history of headaches</label>
                            <div className="radio-group mt-1.5 flex gap-5">
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="family_history_headache" value="Yes" /> Yes</label>
                                <label className="font-normal flex items-center gap-2"><input type="radio" name="family_history_headache" value="No" /> No</label>
                            </div>

                            <label className="block font-semibold mt-3.5">If yes, specify relationship</label>
                            <input type="text" name="family_history_relationship" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />
                        </section>

                        {/* SECTION 14 */}
                        <section className="form-section mb-6 p-4 border-l-4 border-blue-600 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">SECTION 14 — Red Flags</h3>
                            <label className="block font-semibold mt-3.5">Red flags present? (Tick all that apply)</label>
                            <div className="checkbox-group flex flex-col gap-2 mt-2">
                                {/* Onset */}
                                <div className="font-semibold text-sm text-gray-500 mt-2">Onset</div>
                                <label className="font-normal flex items-center gap-2"><input type="checkbox" name="rf_onset_thunderclap" value="Yes" /> Sudden onset “thunderclap” headache</label>
                                <label className="font-normal flex items-center gap-2"><input type="checkbox" name="rf_onset_progressive" value="Yes" /> Subacute onset with progressive course</label>
                                <label className="font-normal flex items-center gap-2"><input type="checkbox" name="rf_onset_after_50" value="Yes" /> New headache after age 50</label>
                                <label className="font-normal flex items-center gap-2"><input type="checkbox" name="rf_onset_pregnancy" value="Yes" /> New onset headache during or just after pregnancy</label>

                                {/* Clinical characteristics */}
                                <div className="font-semibold text-sm text-gray-500 mt-2">Clinical characteristics</div>
                                <label className="font-normal flex items-center gap-2"><input type="checkbox" name="rf_worst_headache" value="Yes" /> Worst headache ever</label>
                                <label className="font-normal flex items-center gap-2"><input type="checkbox" name="rf_freq_increase" value="Yes" /> Recent increase in frequency (&gt;2× baseline in last 3 months)</label>
                                <label className="font-normal flex items-center gap-2"><input type="checkbox" name="rf_severity_increase" value="Yes" /> Recent increase in severity (&gt;5 on VAS compared to baseline)</label>
                                <label className="font-normal flex items-center gap-2"><input type="checkbox" name="rf_exertion_trigger" value="Yes" /> Headache triggered only by exertion, coughing or Valsalva</label>
                                <label className="font-normal flex items-center gap-2"><input type="checkbox" name="rf_sexual_activity" value="Yes" /> Headache triggered by sexual activity</label>

                                {/* Associations */}
                                <div className="font-semibold text-sm text-gray-500 mt-2">Associations</div>
                                <label className="font-normal flex items-center gap-2"><input type="checkbox" name="rf_fever" value="Yes" /> Headache with fever</label>
                                <label className="font-normal flex items-center gap-2"><input type="checkbox" name="rf_seizure" value="Yes" /> Headache with seizure</label>
                                <label className="font-normal flex items-center gap-2"><input type="checkbox" name="rf_neurological_deficit" value="Yes" /> Neurological deficits</label>
                                <label className="font-normal flex items-center gap-2"><input type="checkbox" name="rf_neck_stiffness" value="Yes" /> Neck stiffness</label>
                                <label className="font-normal flex items-center gap-2"><input type="checkbox" name="rf_post_trauma" value="Yes" /> Headache after trauma</label>
                                <label className="font-normal flex items-center gap-2"><input type="checkbox" name="rf_prior_investigation" value="Yes" /> Previous investigation suggestive of causal pathology</label>
                                <label className="font-normal flex items-center gap-2"><input type="checkbox" name="rf_systemic_illness" value="Yes" /> Headache with known systemic illness (malignancy / renal / cardiac / hepatic)</label>
                                <label className="font-normal flex items-center gap-2"><input type="checkbox" name="rf_weight_gain" value="Yes" /> Recent significant weight gain</label>
                                <label className="font-normal flex items-center gap-2"><input type="checkbox" name="rf_tinnitus_tvo" value="Yes" /> Ringing tinnitus or transient visual obscurations (TVOs)</label>

                                <label className="font-normal flex items-center gap-2 mt-2"><input type="checkbox" name="rf_none" value="Yes" /> <b>None</b></label>
                            </div>
                        </section>

                        {/* SECTION 15 */}
                        <section className="form-section mb-6 p-4 border-l-4 border-blue-600 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">SECTION 15 — General Examination</h3>

                            <label className="block font-semibold mt-3.5">Blood pressure</label>
                            <input type="text" name="blood_pressure" placeholder="e.g. 120/80 mmHg" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">Pulse rate</label>
                            <input type="text" name="pulse_rate" placeholder="beats per minute" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />

                            <label className="block font-semibold mt-3.5">General survey findings</label>
                            <div className="checkbox-group grid grid-cols-2 gap-2 mt-2">
                                {['pallor', 'icterus', 'cyanosis', 'clubbing', 'pedal_edema', 'lymphadenopathy', 'raised_jvp', 'skin_markers'].map(f => (
                                    <label key={f} className="font-normal flex items-center gap-2"><input type="checkbox" name={`ge_${f}`} value="Yes" /> {f.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}</label>
                                ))}
                                <label className="font-normal flex items-center gap-2"><input type="checkbox" name="ge_none" value="Yes" /> <b>None</b></label>
                            </div>
                        </section>

                        {/* SECTION 16 */}
                        <section className="form-section mb-6 p-4 border-l-4 border-blue-600 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">SECTION 16 — Systemic Examination (Doctor Section)</h3>

                            <label className="block font-semibold mt-3.5">Cardiovascular findings</label>
                            <textarea name="cardiovascular_findings" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>

                            <label className="block font-semibold mt-3.5">Respiratory findings</label>
                            <textarea name="respiratory_findings" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>

                            <label className="block font-semibold mt-3.5">Gastrointestinal findings</label>
                            <textarea name="gastrointestinal_findings" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>

                            <label className="block font-bold mt-5 mb-2">CNS Examination</label>

                            <label className="block font-semibold mt-3.5">Higher mental functions</label>
                            <textarea name="higher_mental_functions" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>

                            <label className="block font-semibold mt-3.5">Cranial nerve examination</label>
                            <textarea name="cranial_nerve_examination" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>

                            <label className="block font-semibold mt-3.5">Motor system examination</label>
                            <textarea name="motor_system_examination" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>

                            <label className="block font-semibold mt-3.5">Sensory system examination</label>
                            <textarea name="sensory_system_examination" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>

                            <label className="block font-semibold mt-3.5">Cerebellar signs</label>
                            <textarea name="cerebellar_signs" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>

                            <label className="block font-semibold mt-3.5">Spine and cranium examination</label>
                            <textarea name="spine_cranium_examination" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>

                            <label className="block font-semibold mt-3.5">Meningeal signs</label>
                            <textarea name="meningeal_signs" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>

                            <label className="block font-semibold mt-3.5">Extrapyramidal signs</label>
                            <textarea name="extrapyramidal_signs" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>

                            <label className="block font-semibold mt-3.5">Gait assessment</label>
                            <textarea name="gait_assessment" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>
                        </section>

                        {/* SECTION 17 */}
                        <section className="form-section mb-6 p-4 border-l-4 border-blue-600 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">SECTION 17 — Over-all Diagnostic Group Checklist (ICHD-3)</h3>

                            <label className="block font-bold mt-3.5">PART 1 — Primary Headaches</label>
                            <div className="checkbox-group flex flex-col gap-2 mt-2">
                                {['Migraine without aura', 'Migraine with aura', 'Chronic migraine', 'Tension-type headache', 'Cluster headache', 'Trigeminal autonomic cephalalgias'].map(dh => (
                                    <label key={dh} className="font-normal flex items-center gap-2">
                                        <input type="checkbox" name="primary_diagnosis[]" value={dh} /> {dh}
                                    </label>
                                ))}
                            </div>

                            <label className="block font-bold mt-3.5">PART 2 — Secondary Headaches</label>
                            <textarea name="secondary_headaches" placeholder="Specify" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>

                            <label className="block font-bold mt-3.5">PART 3 — Painful Cranial Neuropathies & Other Headaches</label>
                            <textarea name="cranial_neuropathies" placeholder="Specify" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>

                            <label className="block font-bold mt-3.5">Appendix Diagnostic Criteria</label>
                            <textarea name="appendix_criteria" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>
                        </section>
                        {/* I will allow the user to see that I simplified for the prototype, but I should probably implement the button and logic properly. 
                  Given the request is "Migrate", I should try to be complete. 
                  I'll implement the submit button logic.
                 */}
                    </div>
                </details>

                {/* SCALES */}
                <details className="super-section mb-6 rounded-xl bg-white shadow-md overflow-hidden">
                    <summary className="super-header w-full bg-[#1e3a8a] text-white p-4 text-lg border-none cursor-pointer flex justify-between items-center font-semibold list-none">
                        Impact & Quality of Life Scales
                        <span className="arrow">▼</span>
                    </summary>
                    <div className="super-content p-5">
                        <section className="form-section mb-6 p-4 border-l-4 border-blue-600 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">SECTION 18 — Scales (Scores)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block font-semibold mt-3.5">HIT-6 Score</label>
                                    <input type="text" name="hit6_score" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />
                                </div>
                                <div>
                                    <label className="block font-semibold mt-3.5">MIDAS Score</label>
                                    <input type="text" name="midas_score" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />
                                </div>
                                <div>
                                    <label className="block font-semibold mt-3.5">PHQ-9 Score</label>
                                    <input type="text" name="phq9_score" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />
                                </div>
                                <div>
                                    <label className="block font-semibold mt-3.5">GAD-7 Score</label>
                                    <input type="text" name="gad7_score" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />
                                </div>
                                <div>
                                    <label className="block font-semibold mt-3.5">MSQoL Score</label>
                                    <input type="text" name="msqol_score" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />
                                </div>
                            </div>
                        </section>
                    </div>
                </details>

                {/* CLINICAL ASSESSMENT & PLAN */}
                <details className="super-section mb-6 rounded-xl bg-white shadow-md overflow-hidden">
                    <summary className="super-header w-full bg-[#1e3a8a] text-white p-4 text-lg border-none cursor-pointer flex justify-between items-center font-semibold list-none">
                        Clinical Assessment & Plan
                        <span className="arrow">▼</span>
                    </summary>
                    <div className="super-content p-5">

                        {/* SECTION 19 */}
                        <section className="form-section mb-6 p-4 border-l-4 border-blue-600 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">SECTION 19 — Investigations</h3>
                            <label className="block font-semibold mt-3.5">Investigations advised/done</label>
                            <div className="checkbox-group flex flex-col gap-2 mt-2">
                                {['Neuroimaging (MRI/CT)', 'Blood tests', 'CSF analysis', 'EEG', 'Other'].map(inv => (
                                    <label key={inv} className="font-normal flex items-center gap-2">
                                        <input type="checkbox" name="investigations[]" value={inv} /> {inv}
                                    </label>
                                ))}
                            </div>
                        </section>

                        {/* SECTION 21 (Provisional Diagnosis) */}
                        <section className="form-section mb-6 p-4 border-l-4 border-blue-600 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">SECTION 21 — Provisional Diagnosis</h3>
                            <label className="block font-semibold mt-3.5">Provisional Diagnosis (ICD-10/ICHD-3 Code & Name)</label>
                            <textarea name="provisional_diagnosis" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>

                            <label className="block font-semibold mt-3.5">Specific Subtype (if applicable)</label>
                            <input type="text" name="specific_subtype" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300" />
                        </section>

                        {/* SECTION 20 & 22 (Treatment Plan) */}
                        <section className="form-section mb-6 p-4 border-l-4 border-blue-600 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">SECTION 20 & 22 — Treatment Plan</h3>

                            <label className="block font-semibold mt-3.5">Acute Medications (Current/Previous)</label>
                            <textarea name="acute_medications" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>

                            <label className="block font-semibold mt-3.5">Preventive Medications (Current/Previous)</label>
                            <textarea name="preventive_medications" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>

                            <label className="block font-semibold mt-3.5">Devices / Procedures</label>
                            <textarea name="devices_procedures" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>

                            <hr className="my-6 border-gray-300" />
                            <h4 className="font-bold text-md mb-2">Prescribed Treatment Plan</h4>

                            <label className="block font-semibold mt-3.5">Acute Medicines Prescribed</label>
                            <textarea name="acute_medicines_prescribed" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>

                            <label className="block font-semibold mt-3.5">Preventive Medicines Prescribed</label>
                            <textarea name="preventive_medicines_prescribed" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>

                            <label className="block font-semibold mt-3.5">Non-pharmacologic / Lifestyle Recommendations</label>
                            <textarea name="non_pharmacologic_recommendations" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>

                            <label className="block font-semibold mt-3.5">Investigations Recommended</label>
                            <textarea name="investigations_recommended" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[90px]"></textarea>
                        </section>

                        {/* SECTION 23 (Follow Up) */}
                        <section className="form-section mb-6 p-4 border-l-4 border-blue-600 bg-slate-50 rounded-lg">
                            <h3 className="text-lg font-bold mb-4">SECTION 23 — Patient Instructions & Follow-up</h3>
                            <label className="block font-semibold mt-3.5">Patient Instructions / Follow-up Plan</label>
                            <textarea name="patient_instructions" className="w-full p-2.5 mt-1.5 rounded-md border border-slate-300 min-h-[120px]"></textarea>
                        </section>

                    </div>
                </details>

                <div className="text-center my-10">
                    <button type="submit" disabled={isSubmitting} className="bg-[#1e40af] text-white px-7 py-3.5 text-lg rounded-xl border-none cursor-pointer disabled:bg-gray-400">
                        {isSubmitting ? 'Submitting...' : 'Submit Form'}
                    </button>
                    {status && <p className="mt-4 font-semibold text-lg max-w-md mx-auto">{status}</p>}
                </div>

            </form>
            <footer className="p-4 text-center text-xs text-[#666] mt-auto">
                ©️ Headache Registry Project
            </footer>
        </div>
    );
}
