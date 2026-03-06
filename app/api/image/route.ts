import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_URL =`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

// Full schema description for Gemini to extract against
// const FORM_SCHEMA_PROMPT = `
// You are a medical form parser. You will be given an image of a handwritten headache registry patient enrollment form.
// Extract ALL visible filled-in values and return ONLY a valid JSON object (no markdown, no explanation, no code fences).

// The JSON must use EXACTLY these field names and value formats:

// Strings (free text):
//   HCN_Number, hospital_opd_number, date_of_first_assessment (YYYY-MM-DD),
//   patient_name, dob (YYYY-MM-DD), age, occupation, education_level,
//   monthly_income, family_size, native_place, languages_spoken, likely_caregiver,
//   address, phone_number, alternate_phone_number,
//   illness_duration, total_duration_illness, untreated_episode_duration,
//   treated_episode_duration, max_episode_duration, min_episode_duration,
//   headache_days_per_month, vas_score,
//   sidelocked_site_specification, pain_site_other_specify,
//   pain_character_other_specify, associated_symptoms_other,
//   prodrome_other, postdrome_other, triggers_other,
//   past_medical_history_other, smoking_pack_years, tobacco_use,
//   substance_use, family_history_relationship,
//   blood_pressure, pulse_rate,
//   cardiovascular_findings, respiratory_findings, gastrointestinal_findings,
//   higher_mental_functions, cranial_nerve_examination, motor_system_examination,
//   sensory_system_examination, cerebellar_signs, spine_cranium_examination,
//   meningeal_signs, extrapyramidal_signs, gait_assessment,
//   specify_5, specify_6, specify_7, specify_8, specify_9, specify_10,
//   specify_11, specify_12, comments, appendix_specify,
//   hit6_score, midas_score, phq9_score, gad7_score, msqol_score,
//   investigations_other, specific_subtype,
//   acute_drug_group, acute_drug_name_route, acute_time_started,
//   acute_starting_dose, acute_final_dose, acute_adverse_effects,
//   acute_tolerance, acute_days_per_month,
//   preventive_drug_group, preventive_drug_name_route, preventive_time_started,
//   preventive_starting_dose, preventive_final_dose, preventive_adverse_effects,
//   preventive_tolerance, preventive_days_per_month,
//   devices_nerve_blocks_botox, acute_medicines_prescribed,
//   preventive_medicines_prescribed, non_pharmacologic_recommendations,
//   investigations_recommended, patient_instructions

// Single-choice strings (use EXACTLY one of the listed values or "" if blank):
//   consent: "Yes" | "No"
//   gender: "Male" | "Female" | "Other"
//   marital: "Single" | "Married" | "Divorced" | "Widowed"
//   severity_before: "Mild" | "Moderate" | "Severe"
//   daily_function: "Yes" | "No"
//   work_education: "Yes" | "No"
//   leisure_limit: "Yes" | "No"
//   self_confidence: "Yes" | "No"
//   relationships: "Yes" | "No"
//   prev_diagnosis: "Yes" | "No"
//   aborter_info: "Yes" | "No"
//   aborter_timing: "Yes" | "No"
//   trigger_info: "Yes" | "No"
//   lifestyle_info: "Yes" | "No"
//   onset_type: "Acute" | "Insidious"
//   nrs_category: "Mild" | "Moderate" | "Severe"
//   primary_pain_distribution: "Holocranial always" | "Holocranial predominant" | "Hemicranial always" | "Hemicranial predominant" | "Alternating sides"
//   sidelocked_headache: "Yes" | "No"
//   aura_present: "Yes" | "No"
//   prodrome_present: "Yes" | "No"
//   smoking_status: "Current smoker" | "Ex-smoker" | "Never smoked"
//   alcohol_intake: "Current" | "Past" | "Never"
//   family_history_headache: "Yes" | "No"
//   provisional_diagnosis: "Migraine" | "Tension-type headache" | "Cluster / TACs" | "Neuralgia" | "Secondary headache" | "Orofacial pain" | "Uncertain"
//   acute_effectiveness: "Very Effective" | "Moderately Effective" | "Mildly Effective" | "Not Effective"
//   preventive_effectiveness: "Very Effective" | "Moderately Effective" | "Mildly Effective" | "Not Effective"

// Autonomic symptoms — each: "None" | "Bilateral" | "Unilateral" | "":
//   eyelid_edema, lacrimation, conjunctival_injection, nasal_congestion,
//   rhinorrhea, facial_sweating, lid_droop, aural_fullness

// Boolean fields (true/false):
//   rf_onset_thunderclap, rf_onset_progressive, rf_onset_after_50, rf_onset_pregnancy,
//   rf_worst_headache, rf_freq_increase, rf_severity_increase, rf_exertion_trigger,
//   rf_sexual_activity, rf_fever, rf_seizure, rf_neurological_deficit, rf_neck_stiffness,
//   rf_post_trauma, rf_prior_investigation, rf_systemic_illness, rf_weight_gain,
//   rf_tinnitus_tvo, rf_none,
//   ge_pallor, ge_icterus, ge_cyanosis, ge_clubbing, ge_pedal_edema,
//   ge_lymphadenopathy, ge_raised_jvp, ge_skin_markers, ge_none

// Array fields (list only values that are checked/ticked, empty array [] if none):
//   pain_sites: ["Orbital","Supraorbital","Frontal","Temporal","Parietal","Occipital","Neck","Other"]
//   pain_character: ["Bursting","Throbbing","Boring","Sharp","Stabbing","Pricking","Electric current–like","Pressing / heaviness","Crawling sensation","Others"]
//   associated_symptoms: ["Nausea","Vomiting","Photophobia","Phonophobia","Tinnitus","Vertigo","Blurred vision","Neck pain / restricted movement","Hearing impairment","Osmophobia","Allodynia","None","Others"]
//   aura_type: ["Visual","Sensory","Motor","Speech/Language","Brainstem features","Retinal"]
//   prodrome_symptoms: ["Depression","Yawning","Irritability","Increased urination","Food cravings","Thirst","Cold extremities","Bowel changes","Difficulty concentrating","Difficulty sleeping","Fatigue","Neck stiffness","Memory issues","Nausea"]
//   postdrome_symptoms: ["Depression","Fatigue","Neck stiffness","Difficulty concentrating","Yawning","Irritability","Brain fog","Increased urination","Food cravings","Thirst","Cold extremities","Bowel changes","Difficulty sleeping","Nausea"]
//   triggers: ["Alcohol","Food additives","Caffeine","Dehydration","Depression","Exercise","Eye strain","Fatigue","Specific foods","Bright light","Sunlight","Travel","Menstruation","Medication","Loud noise","Odours","Sleep disturbance","Skipped meals","Stress","Watching TV","Weather changes","None"]
//   past_medical_history: ["Diabetes","Hypertension","Chronic systemic illness","Thyroid disorders","Psychiatric illness","Head injury","Head/neck surgery","Previous headache diagnosis","None"]
//   diagnosis: [use exact ICHD-3 labels visible in the form]
//   investigations: ["CBC","ESR","LFT","RFT","ANA","Electrolytes","Vasculitis Profile","Vitamin B12","Folate","HbA1c","ENA","HIV","HBsAg","HCV","FBS","PPBS","ECG","CT Brain","CT Angiogram Head & Neck","MR Brain","MR Angiogram","CRP","CSF opening pressure","CSF Cells","CSF Sugar","CSF Protein","CSF other tests","X-ray Cervical spine","Thyroid Panel (TSH/FT3/FT4)","Eye Evaluation (VA/VF/IOP/OCT/RNFL/GCIPL)","Lipid Profile (TC/HDL/LDL/VLDL/TG)","Other"]

// Return ONLY the JSON object. If a field is not visible or not filled in the image, omit it from the JSON entirely.
// `;

const FORM_SCHEMA_PROMPT = `
You are a medical data extraction expert. Extract ALL visible data from the handwritten form and return ONLY a valid JSON object. 
If a field is blank, omit it. If a checkbox is ticked or (+), mark as true.

The JSON structure MUST match this exact nested schema:

{
  "HCN_Number": "string",
  "hospital_opd_number": "string",
  "date_of_first_assessment": "YYYY-MM-DD",
  "patient_name": "string",
  "dob": "YYYY-MM-DD",
  "age": number,
  "gender": "Male" | "Female" | "Other",
  "marital_status": "Single" | "Married" | "Divorced" | "Widowed",
  "occupation": "string",
  "education_level": "string",
  "monthly_income": "string",
  "family_size": number,
  "native_place": "string",
  "languages_spoken": "string",
  "likely_caregiver": "string",
  "address": "string",
  "phone_number": "string",
  "alternate_phone_number": "string",

  "illness_duration": "string",
  "severity_before": "Mild" | "Moderate" | "Severe",
  "daily_function": "Yes" | "No",
  "work_education": "Yes" | "No",
  "leisure_limit": "Yes" | "No",
  "self_confidence": "Yes" | "No",
  "relationships": "Yes" | "No",
  "prev_diagnosis": "Yes" | "No",
  "aborter_info": "Yes" | "No",
  "aborter_timing": "Yes" | "No",
  "trigger_info": "Yes" | "No",
  "lifestyle_info": "Yes" | "No",

  "onset_type": "Acute" | "Insidious",
  "total_duration_illness": "string",
  "untreated_episode_duration": "string",
  "treated_episode_duration": "string",
  "max_episode_duration": "string",
  "min_episode_duration": "string",
  "headache_days_per_month": number,
  "vas_score": number,
  "nrs_category": "Mild" | "Moderate" | "Severe",

  "primary_pain_distribution": "Holocranial always" | "Holocranial predominant" | "Hemicranial always" | "Hemicranial predominant" | "Alternating sides",
  "sidelocked_headache": "Yes" | "No",
  "sidelocked_site_specification": "string",
  "pain_sites": ["Orbital","Supraorbital","Frontal","Temporal","Parietal","Occipital","Neck","Other"],
  "pain_site_other_specify": "string",

  "pain_character": ["Bursting","Throbbing","Boring","Sharp","Stabbing","Pricking","Electric current–like","Pressing / heaviness","Crawling sensation","Others"],
  "pain_character_other_specify": "string",

  "associated_symptoms": ["Nausea","Vomiting","Photophobia","Phonophobia","Tinnitus","Vertigo","Blurred vision","Neck pain / restricted movement","Hearing impairment","Osmophobia","Allodynia","None","Others"],
  "associated_symptoms_other": "string",

  "autonomic_symptoms": {
    "eyelid_edema": "None" | "Bilateral" | "Unilateral",
    "lacrimation": "None" | "Bilateral" | "Unilateral",
    "conjunctival_injection": "None" | "Bilateral" | "Unilateral",
    "nasal_congestion": "None" | "Bilateral" | "Unilateral",
    "rhinorrhea": "None" | "Bilateral" | "Unilateral",
    "facial_sweating": "None" | "Bilateral" | "Unilateral",
    "lid_droop": "None" | "Bilateral" | "Unilateral",
    "aural_fullness": "None" | "Bilateral" | "Unilateral"
  },

  "aura_present": "Yes" | "No",
  "aura_type": ["Visual","Sensory","Motor","Speech/Language","Brainstem features","Retinal"],
  "prodrome_present": "Yes" | "No",
  "prodrome_symptoms": ["Depression","Yawning","Irritability","Increased urination","Food cravings","Thirst","Cold extremities","Bowel changes","Difficulty concentrating","Difficulty sleeping","Fatigue","Neck stiffness","Memory issues","Nausea"],
  "prodrome_other": "string",
  "postdrome_symptoms": ["Depression","Fatigue","Neck stiffness","Difficulty concentrating","Yawning","Irritability","Brain fog","Increased urination","Food cravings","Thirst","Cold extremities","Bowel changes","Difficulty sleeping","Nausea"],
  "postdrome_other": "string",

  "triggers": ["Alcohol","Food additives","Caffeine","Dehydration","Depression","Exercise","Eye strain","Fatigue","Specific foods","Bright light","Sunlight","Travel","Menstruation","Medication","Loud noise","Odours","Sleep disturbance","Skipped meals","Stress","Watching TV","Weather changes","None"],
  "triggers_other": "string",

  "past_medical_history": ["Diabetes","Hypertension","Chronic systemic illness","Thyroid disorders","Psychiatric illness","Head injury","Head/neck surgery","Previous headache diagnosis","None"],
  "past_medical_history_other": "string",

  "smoking_status": "Current smoker" | "Ex-smoker" | "Never smoked",
  "smoking_pack_years": "string",
  "alcohol_intake": "Current" | "Past" | "Never",
  "tobacco_use": "string",
  "substance_use": "string",
  "family_history_headache": "Yes" | "No",
  "family_history_relationship": "string",

  "red_flags": {
    "onset_thunderclap": boolean, "onset_progressive": boolean, "onset_after_50": boolean, "onset_pregnancy": boolean,
    "worst_headache": boolean, "freq_increase": boolean, "severity_increase": boolean, "exertion_trigger": boolean,
    "sexual_activity": boolean, "fever": boolean, "seizure": boolean, "neurological_deficit": boolean,
    "neck_stiffness": boolean, "post_trauma": boolean, "prior_investigation": boolean, "systemic_illness": boolean,
    "weight_gain": boolean, "tinnitus_tvo": boolean, "none": boolean
  },

  "blood_pressure": "string",
  "pulse_rate": "string",
  "general_findings": {
    "pallor": boolean, "icterus": boolean, "cyanosis": boolean, "clubbing": boolean,
    "pedal_edema": boolean, "lymphadenopathy": boolean, "raised_jvp": boolean, "skin_markers": boolean, "none": boolean
  },

  "cardiovascular_findings": "string",
  "respiratory_findings": "string",
  "gastrointestinal_findings": "string",
  "higher_mental_functions": "string",
  "cranial_nerve_examination": "string",
  "motor_system_examination": "string",
  "sensory_system_examination": "string",
  "cerebellar_signs": "string",
  "spine_cranium_examination": "string",
  "meningeal_signs": "string",
  "extrapyramidal_signs": "string",
  "gait_assessment": "string",

  "diagnosis": ["string"],
  "secondary_headaches": "string",
  "cranial_neuropathies": "string",
  "appendix_criteria": "string",

  "hit6_score": "string",
  "midas_score": "string",
  "phq9_score": "string",
  "gad7_score": "string",
  "msqol_score": "string",

  "investigations": ["string"],
  "investigations_other": "string",

  "acute_meds": [{
    "drug_group": "string",
    "drug_name_route": "string",
    "time_started": "string",
    "starting_dose": "string",
    "final_dose": "string",
    "adverse_effects": "string",
    "tolerance": "string",
    "days_per_month": number,
    "effectiveness": "string"
  }],

  "preventive_meds": [{
    "drug_group": "string",
    "drug_name_route": "string",
    "time_started": "string",
    "starting_dose": "string",
    "final_dose": "string",
    "adverse_effects": "string",
    "tolerance": "string",
    "days_per_month": number,
    "effectiveness": "string"
  }],

  "devices_nerve_blocks_botox": "string",
  "provisional_diagnosis": "string",
  "specific_subtype": "string",
  "acute_medicines_prescribed": "string",
  "preventive_medicines_prescribed": "string",
  "non_pharmacologic_recommendations": "string",
  "investigations_recommended": "string",
  "patient_instructions": "string"
}

Return ONLY the JSON object.
`;
export async function POST(req: NextRequest) {
  try {
    const { imageBase64, mimeType } = await req.json();

    if (!imageBase64 || !mimeType) {
      return NextResponse.json({ error: "Missing imageBase64 or mimeType" }, { status: 400 });
    }

    const geminiPayload = {
      contents: [
        {
          parts: [
            { text: FORM_SCHEMA_PROMPT },
            {
              inline_data: {
                mime_type: mimeType,
                data: imageBase64,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,       // low temp = more deterministic extraction
        maxOutputTokens: 8192,
      },
    };

    const geminiRes = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiPayload),
    });

    if (!geminiRes.ok) {
      const errText = await geminiRes.text();
      return NextResponse.json({ error: `Gemini API error: ${errText}` }, { status: 502 });
    }

    const geminiData = await geminiRes.json();
    const rawText: string = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // Strip any accidental markdown fences Gemini may still add
    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Gemini returned non-JSON output", raw: cleaned },
        { status: 422 }
      );
    }

    return NextResponse.json({ data: parsed });
  } catch (err) {
    console.error("parse-form-image error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}