import puppeteer from 'puppeteer';

// Safely stringify an array field
const arr = (v: any): string => Array.isArray(v) ? v.join(', ') : (v ?? '—');
const val = (v: any): string => (v !== undefined && v !== null && v !== '') ? String(v) : '—';
const bool = (v: any): string => v ? '✓' : '';
const fmtDate = (v: any): string => {
    if (!v) return '—';
    try { return new Date(v).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }); }
    catch { return String(v); }
};

function row(label: string, value: string | undefined, cols = 1) {
    return `<tr>
        <td class="label" colspan="${cols === 2 ? 1 : 1}">${label}</td>
        <td class="value" colspan="${cols === 2 ? 3 : 1}">${value ?? '—'}</td>
    </tr>`;
}

function section(title: string, content: string) {
    return `
    <div class="section">
        <div class="section-title">${title}</div>
        <table class="info-table">${content}</table>
    </div>`;
}

function boolRow(label: string, checked: boolean) {
    return `<tr><td class="label">${label}</td><td class="value">${checked ? '✓ Yes' : 'No'}</td></tr>`;
}

export async function generatePatientPdf(p: any): Promise<Buffer> {
    const rf = p.red_flags ?? {};
    const gf = p.general_findings ?? {};
    const as_ = p.autonomic_symptoms ?? {};
    const am = p.acute_meds?.[0] ?? {};
    const pm = p.preventive_meds?.[0] ?? {};

    const autonomicRows = [
        ['Eyelid edema', as_.eyelid_edema],
        ['Lacrimation', as_.lacrimation],
        ['Conjunctival injection', as_.conjunctival_injection],
        ['Nasal congestion', as_.nasal_congestion],
        ['Rhinorrhea', as_.rhinorrhea],
        ['Facial/forehead sweating', as_.facial_sweating],
        ['Lid droop', as_.lid_droop],
        ['Aural fullness', as_.aural_fullness],
    ].map(([label, v]) => `<tr><td class="label">${label}</td><td class="value">${val(v)}</td></tr>`).join('');

    const redFlagRows = [
        ['Thunderclap headache onset', rf.onset_thunderclap],
        ['Subacute progressive onset', rf.onset_progressive],
        ['New headache after age 50', rf.onset_after_50],
        ['New onset in pregnancy', rf.onset_pregnancy],
        ['Worst headache ever', rf.worst_headache],
        ['Recent frequency increase', rf.freq_increase],
        ['Recent severity increase', rf.severity_increase],
        ['Exertion/Valsalva triggered', rf.exertion_trigger],
        ['Sexual activity triggered', rf.sexual_activity],
        ['With fever', rf.fever],
        ['With seizure', rf.seizure],
        ['Neurological deficits', rf.neurological_deficit],
        ['Neck stiffness', rf.neck_stiffness],
        ['Post-trauma', rf.post_trauma],
        ['Prior investigation positive', rf.prior_investigation],
        ['With systemic illness', rf.systemic_illness],
        ['Significant weight gain', rf.weight_gain],
        ['Tinnitus / TVOs', rf.tinnitus_tvo],
        ['None', rf.none],
    ].map(([label, v]) => boolRow(label as string, !!v)).join('');

    const gfRows = [
        ['Pallor', gf.pallor], ['Icterus', gf.icterus], ['Cyanosis', gf.cyanosis],
        ['Clubbing', gf.clubbing], ['Pedal edema', gf.pedal_edema],
        ['Lymphadenopathy', gf.lymphadenopathy], ['Raised JVP', gf.raised_jvp],
        ['Skin / neurocutaneous markers', gf.skin_markers], ['None', gf.none],
    ].map(([label, v]) => boolRow(label as string, !!v)).join('');

    const diagList = Array.isArray(p.diagnosis) && p.diagnosis.length > 0
        ? p.diagnosis.map((d: string) => `<li>${d}</li>`).join('')
        : '<li>—</li>';

    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: 'Segoe UI', Arial, sans-serif; font-size: 11px; color: #1a1a2e; background: #fff; }
  .page-wrap { padding: 20px 24px; }

  /* Header */
  .header { background: #1d4ed8; color: white; padding: 14px 20px; display: flex; align-items: center; gap: 14px; margin-bottom: 18px; border-radius: 6px; }
  .header-logo { width: 44px; height: 44px; border-radius: 50%; background: white; color: #1d4ed8; font-weight: 800; font-size: 15px; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
  .header h1 { font-size: 18px; font-weight: 700; }
  .header p { font-size: 11px; opacity: 0.85; margin-top: 2px; }
  .header-right { margin-left: auto; text-align: right; font-size: 10px; opacity: 0.8; }

  /* Patient banner */
  .patient-banner { background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 6px; padding: 10px 16px; margin-bottom: 16px; display: flex; gap: 24px; flex-wrap: wrap; }
  .patient-banner .field { display: flex; flex-direction: column; }
  .patient-banner .field label { font-size: 9px; text-transform: uppercase; letter-spacing: .5px; color: #6b7280; }
  .patient-banner .field span { font-size: 13px; font-weight: 700; color: #1e3a5f; margin-top: 1px; }

  /* Sections */
  .section { margin-bottom: 14px; page-break-inside: avoid; }
  .section-title { background: #1d4ed8; color: white; padding: 5px 12px; font-size: 10px; font-weight: 700; letter-spacing: .5px; text-transform: uppercase; border-radius: 4px 4px 0 0; }
  .super-section-title { background: #1e3a5f; color: white; padding: 7px 14px; font-size: 11px; font-weight: 700; letter-spacing: .3px; border-radius: 4px 4px 0 0; margin-top: 18px; }
  .info-table { width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-top: none; }
  .info-table td { padding: 5px 10px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
  .info-table tr:last-child td { border-bottom: none; }
  .info-table .label { width: 38%; background: #f8fafc; color: #374151; font-weight: 600; font-size: 10px; }
  .info-table .value { color: #111827; font-size: 10.5px; }
  .info-table tr:hover td { background: #f0f4ff; }

  /* 2-col grid for tables */
  .two-col { display: grid; grid-template-columns: 1fr 1fr; gap: 0 1px; }
  .two-col td.label { width: 55%; }

  /* Diagnosis list */
  .diag-list { padding: 8px 14px; border: 1px solid #e5e7eb; border-top: none; }
  .diag-list li { padding: 2px 0; font-size: 10.5px; color: #111; }

  /* Medication table */
  .med-table { width: 100%; border-collapse: collapse; border: 1px solid #e5e7eb; border-top: none; font-size: 10px; }
  .med-table th { background: #dbeafe; color: #1e40af; padding: 5px 8px; text-align: left; font-weight: 700; border-bottom: 1px solid #bfdbfe; }
  .med-table td { padding: 5px 8px; border-bottom: 1px solid #f3f4f6; vertical-align: top; }
  .med-table tr:last-child td { border-bottom: none; }

  /* Footer */
  .footer { margin-top: 24px; padding-top: 10px; border-top: 1px solid #e5e7eb; text-align: center; font-size: 9px; color: #9ca3af; }

  /* Page break helpers */
  .break-before { page-break-before: always; }
</style>
</head>
<body>
<div class="page-wrap">

  <!-- Header -->
  <div class="header">
    <div class="header-logo">HR</div>
    <div>
      <h1>Headache Registry</h1>
      <p>Patient Clinical Report</p>
    </div>
    <div class="header-right">Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}<br/>CONFIDENTIAL</div>
  </div>

  <!-- Patient Summary Banner -->
  <div class="patient-banner">
    <div class="field"><label>HCN Number</label><span>${val(p.HCN_Number)}</span></div>
    <div class="field"><label>Patient Name</label><span>${val(p.patient_name)}</span></div>
    <div class="field"><label>Age / Gender</label><span>${val(p.age)} / ${val(p.gender)}</span></div>
    <div class="field"><label>Date of Birth</label><span>${fmtDate(p.dob)}</span></div>
    <div class="field"><label>First Assessment</label><span>${fmtDate(p.date_of_first_assessment)}</span></div>
    <div class="field"><label>Provisional Diagnosis</label><span>${val(p.provisional_diagnosis)}</span></div>
  </div>

  <!-- ═══════════════ SECTION 1 & 2 ═══════════════ -->
  ${section('SECTION 1 — Patient Consent & Registration', `
    ${row('Consent for Data Registration', val(p.consent))}
    ${row('HCN Number', val(p.HCN_Number))}
    ${row('Hospital OPD Number', val(p.hospital_opd_number))}
    ${row('Date of First Assessment', fmtDate(p.date_of_first_assessment))}
  `)}

  ${section('SECTION 2 — Patient Identity & Demographics', `
    ${row('Full Name', val(p.patient_name))}
    ${row('Date of Birth', fmtDate(p.dob))}
    ${row('Age', val(p.age))}
    ${row('Gender', val(p.gender))}
    ${row('Marital Status', val(p.marital))}
    ${row('Occupation', val(p.occupation))}
    ${row('Education Level', val(p.education_level))}
    ${row('Monthly Income', val(p.monthly_income))}
    ${row('Family Size', val(p.family_size))}
    ${row('Native Place', val(p.native_place))}
    ${row('Languages Spoken', val(p.languages_spoken))}
    ${row('Likely Caregiver', val(p.likely_caregiver))}
    ${row('Address', val(p.address))}
    ${row('Phone Number', val(p.phone_number))}
    ${row('Alternate Phone', val(p.alternate_phone_number))}
  `)}

  <!-- ═══════════════ SECTION 3 & 4 ═══════════════ -->
  ${section('SECTION 3 — Illness History & Patient Experience', `
    ${row('Duration of Headache Illness', val(p.illness_duration))}
    ${row('Severity Before Visit', val(p.severity_before))}
    ${row('Affecting Daily Function', val(p.daily_function))}
    ${row('Affecting Work / Education', val(p.work_education))}
    ${row('Limiting Leisure Activities', val(p.leisure_limit))}
    ${row('Affecting Self-Confidence', val(p.self_confidence))}
    ${row('Affecting Relationships', val(p.relationships))}
    ${row('Previously Told About Diagnosis', val(p.prev_diagnosis))}
    ${row('Told About Aborter Medication', val(p.aborter_info))}
    ${row('Told About Aborter Timing', val(p.aborter_timing))}
    ${row('Told About Triggers & Avoidance', val(p.trigger_info))}
    ${row('Told About Lifestyle Changes', val(p.lifestyle_info))}
  `)}

  ${section('SECTION 4 — Headache Episode Characteristics', `
    ${row('Type of Onset', val(p.onset_type))}
    ${row('Total Duration of Illness', val(p.total_duration_illness))}
    ${row('Duration — Untreated Episode', val(p.untreated_episode_duration))}
    ${row('Duration — Treated Episode', val(p.treated_episode_duration))}
    ${row('Maximum Episode Duration', val(p.max_episode_duration))}
    ${row('Minimum Episode Duration', val(p.min_episode_duration))}
    ${row('Headache Days per Month', val(p.headache_days_per_month))}
    ${row('VAS Score (1–10)', val(p.vas_score))}
    ${row('NRS Category', val(p.nrs_category))}
  `)}

  <!-- ═══════════════ SECTION 5, 6, 7 ═══════════════ -->
  ${section('SECTION 5 — Location of Pain', `
    ${row('Primary Pain Distribution', val(p.primary_pain_distribution))}
    ${row('Sidelocked Headaches', val(p.sidelocked_headache))}
    ${row('Sidelocked — Side & Site', val(p.sidelocked_site_specification))}
    ${row('Pain Sites', arr(p.pain_sites))}
    ${row('Other Site (specify)', val(p.pain_site_other_specify))}
  `)}

  ${section('SECTION 6 — Nature of Pain', `
    ${row('Pain Character', arr(p.pain_character))}
    ${row('Other Character (specify)', val(p.pain_character_other_specify))}
  `)}

  ${section('SECTION 7 — Associated Symptoms', `
    ${row('Associated Symptoms', arr(p.associated_symptoms))}
    ${row('Other (specify)', val(p.associated_symptoms_other))}
    <tr><td class="label" colspan="2" style="background:#dbeafe;font-weight:700;padding:4px 10px;">Autonomic Symptoms</td></tr>
    ${autonomicRows}
  `)}

  <!-- ═══════════════ SECTION 8–13 ═══════════════ -->
  ${section('SECTION 8 — Aura', `
    ${row('Aura Present', val(p.aura_present))}
    ${row('Type of Aura', arr(p.aura_type))}
  `)}

  ${section('SECTION 9 — Prodrome Symptoms', `
    ${row('Prodrome Present', val(p.prodrome_present))}
    ${row('Prodrome Symptoms', arr(p.prodrome_symptoms))}
    ${row('Other (specify)', val(p.prodrome_other))}
  `)}

  ${section('SECTION 10 — Postdrome Symptoms', `
    ${row('Postdrome Symptoms', arr(p.postdrome_symptoms))}
    ${row('Other (specify)', val(p.postdrome_other))}
  `)}

  ${section('SECTION 11 — Triggers', `
    ${row('Known Triggers', arr(p.triggers))}
    ${row('Other (specify)', val(p.triggers_other))}
  `)}

  ${section('SECTION 12 — Past Medical History', `
    ${row('Past Medical History', arr(p.past_medical_history))}
    ${row('Other (specify)', val(p.past_medical_history_other))}
  `)}

  ${section('SECTION 13 — Personal & Family History', `
    ${row('Smoking Status', val(p.smoking_status))}
    ${row('Pack Years', val(p.smoking_pack_years))}
    ${row('Alcohol Intake', val(p.alcohol_intake))}
    ${row('Tobacco Use', val(p.tobacco_use))}
    ${row('Substance Use', val(p.substance_use))}
    ${row('Family History of Headaches', val(p.family_history_headache))}
    ${row('Relationship', val(p.family_history_relationship))}
  `)}

  <!-- ═══════════════ SECTION 14, 15, 16 ═══════════════ -->
  <div class="section">
    <div class="section-title">SECTION 14 — Red Flags</div>
    <table class="info-table">${redFlagRows}</table>
  </div>

  <div class="section">
    <div class="section-title">SECTION 15 — General Examination</div>
    <table class="info-table">
      ${row('Blood Pressure', val(p.blood_pressure))}
      ${row('Pulse Rate', val(p.pulse_rate))}
      <tr><td class="label" colspan="2" style="background:#dbeafe;font-weight:700;padding:4px 10px;">General Survey Findings</td></tr>
      ${gfRows}
    </table>
  </div>

  ${section('SECTION 16 — Systemic Examination', `
    ${row('Cardiovascular Findings', val(p.cardiovascular_findings))}
    ${row('Respiratory Findings', val(p.respiratory_findings))}
    ${row('Gastrointestinal Findings', val(p.gastrointestinal_findings))}
    ${row('Higher Mental Functions', val(p.higher_mental_functions))}
    ${row('Cranial Nerve Examination', val(p.cranial_nerve_examination))}
    ${row('Motor System Examination', val(p.motor_system_examination))}
    ${row('Sensory System Examination', val(p.sensory_system_examination))}
    ${row('Cerebellar Signs', val(p.cerebellar_signs))}
    ${row('Spine & Cranium Examination', val(p.spine_cranium_examination))}
    ${row('Meningeal Signs', val(p.meningeal_signs))}
    ${row('Extrapyramidal Signs', val(p.extrapyramidal_signs))}
    ${row('Gait Assessment', val(p.gait_assessment))}
  `)}

  <!-- ═══════════════ SECTION 17 — DIAGNOSIS ═══════════════ -->
  <div class="section break-before">
    <div class="section-title">SECTION 17 — ICHD-3 Diagnostic Group Checklist</div>
    <ul class="diag-list">${diagList}</ul>
    <table class="info-table">
      ${row('Specify 5 (Trauma/Head)', val(p.specify_5))}
      ${row('Specify 6 (Vascular)', val(p.specify_6))}
      ${row('Specify 7 (Non-vascular intracranial)', val(p.specify_7))}
      ${row('Specify 8 (Substance)', val(p.specify_8))}
      ${row('Specify 9 (Infection)', val(p.specify_9))}
      ${row('Specify 10 (Homoeostasis)', val(p.specify_10))}
      ${row('Specify 11 (Facial/cervical)', val(p.specify_11))}
      ${row('Specify 12 (Psychiatric)', val(p.specify_12))}
      ${row('Appendix Criteria', val(p.appendix_specify))}
      ${row('Comments', val(p.comments))}
    </table>
  </div>

  <!-- ═══════════════ SCALES ═══════════════ -->
  ${section('Scales', `
    ${row('HIT-6 Score', val(p.hit6_score))}
    ${row('MIDAS Score', val(p.midas_score))}
    ${row('PHQ-9 Score', val(p.phq9_score))}
    ${row('GAD-7 Score', val(p.gad7_score))}
    ${row('MSQOL Score', val(p.msqol_score))}
  `)}

  <!-- ═══════════════ INVESTIGATIONS ═══════════════ -->
  ${section('SECTION 19 — Investigations', `
    ${row('Investigations Ordered', arr(p.investigations))}
    ${row('Other (specify)', val(p.investigations_other))}
  `)}

  <!-- ═══════════════ MEDICATION ═══════════════ -->
  <div class="section">
    <div class="section-title">SECTION 20 — Medication History</div>
    <table class="med-table">
      <thead>
        <tr>
          <th>Field</th>
          <th>Acute Medication</th>
          <th>Preventive Medication</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Drug Group</td><td>${val(am.drug_group)}</td><td>${val(pm.drug_group)}</td></tr>
        <tr><td>Drug Name &amp; Route</td><td>${val(am.drug_name_route)}</td><td>${val(pm.drug_name_route)}</td></tr>
        <tr><td>Time Since Started</td><td>${val(am.time_started)}</td><td>${val(pm.time_started)}</td></tr>
        <tr><td>Starting Dose</td><td>${val(am.starting_dose)}</td><td>${val(pm.starting_dose)}</td></tr>
        <tr><td>Final Dose</td><td>${val(am.final_dose)}</td><td>${val(pm.final_dose)}</td></tr>
        <tr><td>Adverse Effects</td><td>${val(am.adverse_effects)}</td><td>${val(pm.adverse_effects)}</td></tr>
        <tr><td>Tolerance Issues</td><td>${val(am.tolerance)}</td><td>${val(pm.tolerance)}</td></tr>
        <tr><td>Days / Month</td><td>${val(am.days_per_month)}</td><td>${val(pm.days_per_month)}</td></tr>
        <tr><td>Effectiveness</td><td>${val(am.effectiveness)}</td><td>${val(pm.effectiveness)}</td></tr>
      </tbody>
    </table>
    <table class="info-table" style="border-top: 1px solid #e5e7eb; margin-top: 6px;">
      ${row('Devices / Nerve Blocks / Botox', val(p.devices_nerve_blocks_botox))}
    </table>
  </div>

  <!-- ═══════════════ PROVISIONAL DIAGNOSIS & TREATMENT ═══════════════ -->
  ${section('SECTION 21 — Provisional Diagnosis', `
    ${row('Provisional Diagnosis', val(p.provisional_diagnosis))}
    ${row('Specific Subtype', val(p.specific_subtype))}
  `)}

  ${section('SECTION 22 — Treatment Plan', `
    ${row('Acute Medicines Prescribed', val(p.acute_medicines_prescribed))}
    ${row('Preventive Medicines Prescribed', val(p.preventive_medicines_prescribed))}
    ${row('Non-Pharmacologic Recommendations', val(p.non_pharmacologic_recommendations))}
    ${row('Investigations Recommended', val(p.investigations_recommended))}
  `)}

  ${section('SECTION 23 — Patient Instructions', `
    ${row('Patient Instructions', val(p.patient_instructions))}
  `)}

  <div class="footer">
    Headache Registry — Confidential Patient Record &nbsp;|&nbsp; Generated ${new Date().toISOString()}
  </div>

</div>
</body>
</html>`;

    const browser = await puppeteer.launch({
        headless: true,
        args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
        ],
    });

    try {
        const page = await browser.newPage();
        await page.setContent(html, { waitUntil: 'networkidle0' });
        const pdf = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: { top: '12mm', bottom: '12mm', left: '10mm', right: '10mm' },
        });
        return Buffer.from(pdf);
    } finally {
        await browser.close();
    }
}
