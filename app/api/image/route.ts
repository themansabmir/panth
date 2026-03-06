import { NextRequest, NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_URL =`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const STRING_FIELDS = new Set([
  "HCN_Number", "hospital_opd_number", "date_of_first_assessment",
  "patient_name", "dob", "occupation", "education_level", "monthly_income",
  "native_place", "languages_spoken", "likely_caregiver", "address",
  "phone_number", "alternate_phone_number", "illness_duration",
  "total_duration_illness", "untreated_episode_duration", "treated_episode_duration",
  "max_episode_duration", "min_episode_duration", "sidelocked_site_specification",
  "pain_site_other_specify", "pain_character_other_specify", "associated_symptoms_other",
  "prodrome_other", "postdrome_other", "triggers_other", "past_medical_history_other",
  "smoking_pack_years", "tobacco_use", "substance_use", "family_history_relationship",
  "blood_pressure", "pulse_rate", "cardiovascular_findings", "respiratory_findings",
  "gastrointestinal_findings", "higher_mental_functions", "cranial_nerve_examination",
  "motor_system_examination", "sensory_system_examination", "cerebellar_signs",
  "spine_cranium_examination", "meningeal_signs", "extrapyramidal_signs",
  "gait_assessment", "specify_5", "specify_6", "specify_7", "specify_8",
  "specify_9", "specify_10", "specify_11", "specify_12", "comments",
  "appendix_specify", "investigations_other", "specific_subtype",
  "acute_drug_group", "acute_drug_name_route", "acute_time_started",
  "acute_starting_dose", "acute_final_dose", "acute_adverse_effects",
  "acute_tolerance", "preventive_drug_group", "preventive_drug_name_route",
  "preventive_time_started", "preventive_starting_dose", "preventive_final_dose",
  "preventive_adverse_effects", "preventive_tolerance", "devices_nerve_blocks_botox",
  "acute_medicines_prescribed", "preventive_medicines_prescribed",
  "non_pharmacologic_recommendations", "investigations_recommended", "patient_instructions",
]);

const NUMBER_FIELDS = new Set([
  "age", "family_size", "headache_days_per_month", "vas_score",
  "hit6_score", "midas_score", "phq9_score", "gad7_score", "msqol_score",
  "acute_days_per_month", "preventive_days_per_month",
]);

const NUMBER_FIELD_RANGES: Record<string, { min: number; max: number }> = {
  age: { min: 0, max: 120 },
  family_size: { min: 1, max: 50 },
  headache_days_per_month: { min: 0, max: 31 },
  vas_score: { min: 1, max: 10 },
  hit6_score: { min: 6, max: 78 },
  midas_score: { min: 0, max: 270 },
  phq9_score: { min: 0, max: 27 },
  gad7_score: { min: 0, max: 21 },
  msqol_score: { min: 0, max: 100 },
  acute_days_per_month: { min: 0, max: 31 },
  preventive_days_per_month: { min: 0, max: 31 },
};

const ENUM_FIELDS: Record<string, string[]> = {
  consent: ["Yes", "No"],
  gender: ["Male", "Female", "Other"],
  marital: ["Single", "Married", "Divorced", "Widowed"],
  severity_before: ["Mild", "Moderate", "Severe"],
  daily_function: ["Yes", "No"],
  work_education: ["Yes", "No"],
  leisure_limit: ["Yes", "No"],
  self_confidence: ["Yes", "No"],
  relationships: ["Yes", "No"],
  prev_diagnosis: ["Yes", "No"],
  aborter_info: ["Yes", "No"],
  aborter_timing: ["Yes", "No"],
  trigger_info: ["Yes", "No"],
  lifestyle_info: ["Yes", "No"],
  onset_type: ["Acute", "Insidious"],
  nrs_category: ["Mild", "Moderate", "Severe"],
  primary_pain_distribution: [
    "Holocranial always", "Holocranial predominant",
    "Hemicranial always", "Hemicranial predominant", "Alternating sides",
  ],
  sidelocked_headache: ["Yes", "No"],
  aura_present: ["Yes", "No"],
  prodrome_present: ["Yes", "No"],
  smoking_status: ["Current smoker", "Ex-smoker", "Never smoked"],
  alcohol_intake: ["Current", "Past", "Never"],
  family_history_headache: ["Yes", "No"],
  provisional_diagnosis: [
    "Migraine", "Tension-type headache", "Cluster / TACs",
    "Neuralgia", "Secondary headache", "Orofacial pain", "Uncertain",
  ],
  acute_effectiveness: ["Very Effective", "Moderately Effective", "Mildly Effective", "Not Effective"],
  preventive_effectiveness: ["Very Effective", "Moderately Effective", "Mildly Effective", "Not Effective"],
  eyelid_edema: ["None", "Bilateral", "Unilateral"],
  lacrimation: ["None", "Bilateral", "Unilateral"],
  conjunctival_injection: ["None", "Bilateral", "Unilateral"],
  nasal_congestion: ["None", "Bilateral", "Unilateral"],
  rhinorrhea: ["None", "Bilateral", "Unilateral"],
  facial_sweating: ["None", "Bilateral", "Unilateral"],
  lid_droop: ["None", "Bilateral", "Unilateral"],
  aural_fullness: ["None", "Bilateral", "Unilateral"],
};

const BOOLEAN_FIELDS = new Set([
  "rf_onset_thunderclap", "rf_onset_progressive", "rf_onset_after_50", "rf_onset_pregnancy",
  "rf_worst_headache", "rf_freq_increase", "rf_severity_increase", "rf_exertion_trigger",
  "rf_sexual_activity", "rf_fever", "rf_seizure", "rf_neurological_deficit", "rf_neck_stiffness",
  "rf_post_trauma", "rf_prior_investigation", "rf_systemic_illness", "rf_weight_gain",
  "rf_tinnitus_tvo", "rf_none",
  "ge_pallor", "ge_icterus", "ge_cyanosis", "ge_clubbing", "ge_pedal_edema",
  "ge_lymphadenopathy", "ge_raised_jvp", "ge_skin_markers", "ge_none",
]);

const ARRAY_FIELD_ALLOWED_VALUES: Record<string, string[]> = {
  pain_sites: ["Orbital", "Supraorbital", "Frontal", "Temporal", "Parietal", "Occipital", "Neck", "Other"],
  pain_character: ["Bursting", "Throbbing", "Boring", "Sharp", "Stabbing", "Pricking", "Electric current–like", "Pressing / heaviness", "Crawling sensation", "Others"],
  associated_symptoms: ["Nausea", "Vomiting", "Photophobia", "Phonophobia", "Tinnitus", "Vertigo", "Blurred vision", "Neck pain / restricted movement", "Hearing impairment", "Osmophobia", "Allodynia", "None", "Others"],
  aura_type: ["Visual", "Sensory", "Motor", "Speech/Language", "Brainstem features", "Retinal"],
  prodrome_symptoms: ["Depression", "Yawning", "Irritability", "Increased urination", "Food cravings", "Thirst", "Cold extremities", "Bowel changes", "Difficulty concentrating", "Difficulty sleeping", "Fatigue", "Neck stiffness", "Memory issues", "Nausea"],
  postdrome_symptoms: ["Depression", "Fatigue", "Neck stiffness", "Difficulty concentrating", "Yawning", "Irritability", "Brain fog", "Increased urination", "Food cravings", "Thirst", "Cold extremities", "Bowel changes", "Difficulty sleeping", "Nausea"],
  triggers: ["Alcohol", "Food additives", "Caffeine", "Dehydration", "Depression", "Exercise", "Eye strain", "Fatigue", "Specific foods", "Bright light", "Sunlight", "Travel", "Menstruation", "Medication", "Loud noise", "Odours", "Sleep disturbance", "Skipped meals", "Stress", "Watching TV", "Weather changes", "None"],
  past_medical_history: ["Diabetes", "Hypertension", "Chronic systemic illness", "Thyroid disorders", "Psychiatric illness", "Head injury", "Head/neck surgery", "Previous headache diagnosis", "None"],
  investigations: ["CBC", "ESR", "LFT", "RFT", "ANA", "Electrolytes", "Vasculitis Profile", "Vitamin B12", "Folate", "HbA1c", "ENA", "HIV", "HBsAg", "HCV", "FBS", "PPBS", "ECG", "CT Brain", "CT Angiogram Head & Neck", "MR Brain", "MR Angiogram", "CRP", "CSF opening pressure", "CSF Cells", "CSF Sugar", "CSF Protein", "CSF other tests", "X-ray Cervical spine", "Thyroid Panel (TSH/FT3/FT4)", "Eye Evaluation (VA/VF/IOP/OCT/RNFL/GCIPL)", "Lipid Profile (TC/HDL/LDL/VLDL/TG)", "Other"],
  diagnosis: [
    "1.1 Migraine without aura", "1.2 Migraine with aura", "1.2.1 Migraine with typical aura",
    "1.2.2 Migraine with brainstem aura", "1.2.3 Hemiplegic migraine", "1.2.4 Retinal migraine",
    "1.3 Chronic Migraine", "1.4 Complications of Migraine", "1.4.1 Status Migrainosus",
    "1.4.2 Persistent aura without infarction", "1.4.3 Migrainous Infarction",
    "1.4.4 Migraine aura-triggered seizure", "1.5 Probable Migraine",
    "1.5.1 Probable Migraine without aura", "1.5.2 Probable Migraine with aura",
    "1.6 Episodic Syndromes associated with migraine", "1.6.1 Recurrent gastrointestinal disturbance",
    "1.6.2 Benign paroxysmal vertigo", "1.6.3 Benign paroxysmal torticollis",
    "2.1 Infrequent episodic tension-type headache", "2.2 Frequent episodic tension-type headache",
    "2.3 Chronic tension-type headache", "2.4 Probable tension-type headache",
    "3.1 Cluster Headache", "3.1.1 Episodic Cluster Headache", "3.1.2 Chronic Cluster Headache",
    "3.2 Paroxysmal Hemicrania", "3.2.1 Episodic Paroxysmal Hemicrania",
    "3.2.2 Chronic Paroxysmal Hemicrania",
    "3.3 Short-lasting unilateral neuralgiform headache attacks",
    "3.3.1 SUNCT", "3.3.1.1 Episodic SUNCT", "3.3.1.2 Chronic SUNCT",
    "3.3.2 SUNA", "3.3.2.1 Episodic SUNA", "3.3.2.2 Chronic SUNA",
    "3.4 Hemicrania continua", "3.4.1 Hemicrania continua, remitting subtype",
    "3.4.2 Hemicrania continua, unremitting subtype",
    "3.5 Probable trigeminal autonomic cephalalgia", "3.5.1 Probable cluster headache",
    "3.5.2 Probable paroxysmal hemicrania",
    "3.5.3 Probable short-lasting unilateral neuralgiform headache attacks",
    "3.5.4 Probable hemicrania continua",
    "4.1 Primary cough headache", "4.2 Primary exercise headache",
    "4.3 Primary headache associated with sexual activity", "4.4 Primary thunderclap headache",
    "4.5 Cold-stimulus headache", "4.6 External-pressure headache",
    "4.7 Primary stabbing headache", "4.8 Nummular headache",
    "4.9 Hypnic headache", "4.10 New daily persistent headache (NDPH)",
    "5 Headache attributed to trauma or injury to the head and/or neck",
    "6 Headache attributed to cranial and/or cervical vascular disorder",
    "7 Headache attributed to non-vascular intracranial disorder",
    "8 Headache attributed to a substance or its withdrawal",
    "9 Headache attributed to infection",
    "10 Headache attributed to disorder of homoeostasis",
    "11 Headache or facial pain attributed to disorder of facial or cervical structure",
    "12 Headache attributed to psychiatric disorder",
    "13.1 Pain attributed to lesion of trigeminal nerve", "13.1.1 Trigeminal neuralgia",
    "13.1.1.1 Classical trigeminal neuralgia", "13.1.1.2 Secondary trigeminal neuralgia",
    "13.1.1.3 Idiopathic trigeminal neuralgia", "13.1.2 Painful trigeminal neuropathy",
    "13.2 Glossopharyngeal nerve pain", "13.3 Nervus intermedius pain",
    "13.4 Occipital neuralgia", "13.5 Neck-tongue syndrome", "13.6 Painful optic neuritis",
    "13.7 Ischaemic ocular motor nerve palsy", "13.8 Tolosa-Hunt syndrome",
    "13.9 Raeder syndrome", "13.10 Recurrent painful ophthalmoplegic neuropathy",
    "13.11 Burning mouth syndrome", "13.12 Persistent idiopathic facial pain",
    "13.13 Central neuropathic pain", "14 Other headache disorders",
    "14.1 Headache not elsewhere classified", "14.2 Headache unspecified",
  ],
};

// Date format: YYYY-MM-DD
const DATE_FIELDS = new Set(["date_of_first_assessment", "dob"]);
const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;

// ─── Prompt ───────────────────────────────────────────────────────────────────

const FORM_SCHEMA_PROMPT = `
You are a strict medical form data extractor. You will receive an image of a handwritten headache registry patient enrollment form.

## YOUR ONLY JOB
Extract ONLY what is clearly, visibly, and unambiguously written in the image.
Return a single valid JSON object. Nothing else — no markdown, no explanation, no code fences, no comments.

## CRITICAL RULES — READ CAREFULLY

### RULE 1 — NO HALLUCINATION (most important)
- If a field is blank, crossed out, illegible, or you are even slightly uncertain → DO NOT include it in the output.
- NEVER guess, infer, assume, or fill in values that are not explicitly written.
- When in doubt, OMIT. An omitted field is always safer than a wrong value.

### RULE 2 — STRICT TYPE ENFORCEMENT
Each field has an exact type. Return that exact type — no exceptions:

**NUMBER fields** → return a JSON number (no quotes, no units, no text).
  Allowed fields and their valid ranges:
  - age: integer, 0–120
  - family_size: integer, 1–50
  - headache_days_per_month: integer, 0–31
  - vas_score: integer, 1–10
  - hit6_score: integer, 6–78
  - midas_score: integer, 0–270
  - phq9_score: integer, 0–27
  - gad7_score: integer, 0–21
  - msqol_score: integer, 0–100
  - acute_days_per_month: integer, 0–31
  - preventive_days_per_month: integer, 0–31
  If the written number is outside the valid range → OMIT the field.
  WRONG: "age": "35" or "age": "35 years"  →  CORRECT: "age": 35

**BOOLEAN fields** → return JSON true or false only.
  Mark true ONLY if a checkbox is clearly ticked/checked/crossed.
  Mark false ONLY if it is clearly unchecked. If unclear → OMIT.
  Applies to: rf_onset_thunderclap, rf_onset_progressive, rf_onset_after_50, rf_onset_pregnancy,
  rf_worst_headache, rf_freq_increase, rf_severity_increase, rf_exertion_trigger, rf_sexual_activity,
  rf_fever, rf_seizure, rf_neurological_deficit, rf_neck_stiffness, rf_post_trauma,
  rf_prior_investigation, rf_systemic_illness, rf_weight_gain, rf_tinnitus_tvo, rf_none,
  ge_pallor, ge_icterus, ge_cyanosis, ge_clubbing, ge_pedal_edema,
  ge_lymphadenopathy, ge_raised_jvp, ge_skin_markers, ge_none

**ENUM fields** → return ONLY one of the allowed string values listed below. 
  If the written value does not exactly match one of the allowed values → OMIT.
  consent: "Yes" | "No"
  gender: "Male" | "Female" | "Other"
  marital: "Single" | "Married" | "Divorced" | "Widowed"
  severity_before: "Mild" | "Moderate" | "Severe"
  daily_function: "Yes" | "No"
  work_education: "Yes" | "No"
  leisure_limit: "Yes" | "No"
  self_confidence: "Yes" | "No"
  relationships: "Yes" | "No"
  prev_diagnosis: "Yes" | "No"
  aborter_info: "Yes" | "No"
  aborter_timing: "Yes" | "No"
  trigger_info: "Yes" | "No"
  lifestyle_info: "Yes" | "No"
  onset_type: "Acute" | "Insidious"
  nrs_category: "Mild" | "Moderate" | "Severe"
  primary_pain_distribution: "Holocranial always" | "Holocranial predominant" | "Hemicranial always" | "Hemicranial predominant" | "Alternating sides"
  sidelocked_headache: "Yes" | "No"
  aura_present: "Yes" | "No"
  prodrome_present: "Yes" | "No"
  smoking_status: "Current smoker" | "Ex-smoker" | "Never smoked"
  alcohol_intake: "Current" | "Past" | "Never"
  family_history_headache: "Yes" | "No"
  provisional_diagnosis: "Migraine" | "Tension-type headache" | "Cluster / TACs" | "Neuralgia" | "Secondary headache" | "Orofacial pain" | "Uncertain"
  acute_effectiveness: "Very Effective" | "Moderately Effective" | "Mildly Effective" | "Not Effective"
  preventive_effectiveness: "Very Effective" | "Moderately Effective" | "Mildly Effective" | "Not Effective"
  eyelid_edema: "None" | "Bilateral" | "Unilateral"
  lacrimation: "None" | "Bilateral" | "Unilateral"
  conjunctival_injection: "None" | "Bilateral" | "Unilateral"
  nasal_congestion: "None" | "Bilateral" | "Unilateral"
  rhinorrhea: "None" | "Bilateral" | "Unilateral"
  facial_sweating: "None" | "Bilateral" | "Unilateral"
  lid_droop: "None" | "Bilateral" | "Unilateral"
  aural_fullness: "None" | "Bilateral" | "Unilateral"

**ARRAY fields** → return a JSON array containing ONLY values from the allowed list below.
  Include a value ONLY if its checkbox is clearly ticked. Empty array [] if nothing is ticked.
  NEVER invent values not in the allowed list.
  pain_sites allowed: ["Orbital","Supraorbital","Frontal","Temporal","Parietal","Occipital","Neck","Other"]
  pain_character allowed: ["Bursting","Throbbing","Boring","Sharp","Stabbing","Pricking","Electric current–like","Pressing / heaviness","Crawling sensation","Others"]
  associated_symptoms allowed: ["Nausea","Vomiting","Photophobia","Phonophobia","Tinnitus","Vertigo","Blurred vision","Neck pain / restricted movement","Hearing impairment","Osmophobia","Allodynia","None","Others"]
  aura_type allowed: ["Visual","Sensory","Motor","Speech/Language","Brainstem features","Retinal"]
  prodrome_symptoms allowed: ["Depression","Yawning","Irritability","Increased urination","Food cravings","Thirst","Cold extremities","Bowel changes","Difficulty concentrating","Difficulty sleeping","Fatigue","Neck stiffness","Memory issues","Nausea"]
  postdrome_symptoms allowed: ["Depression","Fatigue","Neck stiffness","Difficulty concentrating","Yawning","Irritability","Brain fog","Increased urination","Food cravings","Thirst","Cold extremities","Bowel changes","Difficulty sleeping","Nausea"]
  triggers allowed: ["Alcohol","Food additives","Caffeine","Dehydration","Depression","Exercise","Eye strain","Fatigue","Specific foods","Bright light","Sunlight","Travel","Menstruation","Medication","Loud noise","Odours","Sleep disturbance","Skipped meals","Stress","Watching TV","Weather changes","None"]
  past_medical_history allowed: ["Diabetes","Hypertension","Chronic systemic illness","Thyroid disorders","Psychiatric illness","Head injury","Head/neck surgery","Previous headache diagnosis","None"]
  investigations allowed: ["CBC","ESR","LFT","RFT","ANA","Electrolytes","Vasculitis Profile","Vitamin B12","Folate","HbA1c","ENA","HIV","HBsAg","HCV","FBS","PPBS","ECG","CT Brain","CT Angiogram Head & Neck","MR Brain","MR Angiogram","CRP","CSF opening pressure","CSF Cells","CSF Sugar","CSF Protein","CSF other tests","X-ray Cervical spine","Thyroid Panel (TSH/FT3/FT4)","Eye Evaluation (VA/VF/IOP/OCT/RNFL/GCIPL)","Lipid Profile (TC/HDL/LDL/VLDL/TG)","Other"]
  diagnosis allowed: ["1.1 Migraine without aura","1.2 Migraine with aura","1.2.1 Migraine with typical aura","1.2.2 Migraine with brainstem aura","1.2.3 Hemiplegic migraine","1.2.4 Retinal migraine","1.3 Chronic Migraine","1.4 Complications of Migraine","1.4.1 Status Migrainosus","1.4.2 Persistent aura without infarction","1.4.3 Migrainous Infarction","1.4.4 Migraine aura-triggered seizure","1.5 Probable Migraine","1.5.1 Probable Migraine without aura","1.5.2 Probable Migraine with aura","1.6 Episodic Syndromes associated with migraine","1.6.1 Recurrent gastrointestinal disturbance","1.6.2 Benign paroxysmal vertigo","1.6.3 Benign paroxysmal torticollis","2.1 Infrequent episodic tension-type headache","2.2 Frequent episodic tension-type headache","2.3 Chronic tension-type headache","2.4 Probable tension-type headache","3.1 Cluster Headache","3.1.1 Episodic Cluster Headache","3.1.2 Chronic Cluster Headache","3.2 Paroxysmal Hemicrania","3.2.1 Episodic Paroxysmal Hemicrania","3.2.2 Chronic Paroxysmal Hemicrania","3.3 Short-lasting unilateral neuralgiform headache attacks","3.3.1 SUNCT","3.3.1.1 Episodic SUNCT","3.3.1.2 Chronic SUNCT","3.3.2 SUNA","3.3.2.1 Episodic SUNA","3.3.2.2 Chronic SUNA","3.4 Hemicrania continua","3.4.1 Hemicrania continua, remitting subtype","3.4.2 Hemicrania continua, unremitting subtype","3.5 Probable trigeminal autonomic cephalalgia","3.5.1 Probable cluster headache","3.5.2 Probable paroxysmal hemicrania","3.5.3 Probable short-lasting unilateral neuralgiform headache attacks","3.5.4 Probable hemicrania continua","4.1 Primary cough headache","4.2 Primary exercise headache","4.3 Primary headache associated with sexual activity","4.4 Primary thunderclap headache","4.5 Cold-stimulus headache","4.6 External-pressure headache","4.7 Primary stabbing headache","4.8 Nummular headache","4.9 Hypnic headache","4.10 New daily persistent headache (NDPH)","5 Headache attributed to trauma or injury to the head and/or neck","6 Headache attributed to cranial and/or cervical vascular disorder","7 Headache attributed to non-vascular intracranial disorder","8 Headache attributed to a substance or its withdrawal","9 Headache attributed to infection","10 Headache attributed to disorder of homoeostasis","11 Headache or facial pain attributed to disorder of facial or cervical structure","12 Headache attributed to psychiatric disorder","13.1 Pain attributed to lesion of trigeminal nerve","13.1.1 Trigeminal neuralgia","13.1.1.1 Classical trigeminal neuralgia","13.1.1.2 Secondary trigeminal neuralgia","13.1.1.3 Idiopathic trigeminal neuralgia","13.1.2 Painful trigeminal neuropathy","13.2 Glossopharyngeal nerve pain","13.3 Nervus intermedius pain","13.4 Occipital neuralgia","13.5 Neck-tongue syndrome","13.6 Painful optic neuritis","13.7 Ischaemic ocular motor nerve palsy","13.8 Tolosa-Hunt syndrome","13.9 Raeder syndrome","13.10 Recurrent painful ophthalmoplegic neuropathy","13.11 Burning mouth syndrome","13.12 Persistent idiopathic facial pain","13.13 Central neuropathic pain","14 Other headache disorders","14.1 Headache not elsewhere classified","14.2 Headache unspecified"]

**DATE fields** → return as string in YYYY-MM-DD format only.
  date_of_first_assessment, dob
  If the date is partially legible or format is ambiguous → OMIT.

**STRING fields** → return a JSON string. Transcribe exactly what is written.
  Do NOT clean up, rephrase, or interpret. If illegible → OMIT.

### RULE 3 — NO EXTRA KEYS
Only output field names that appear in this prompt. Never invent new field names.

### RULE 4 — OMIT, NEVER NULL
Never return null, undefined, "N/A", "unknown", "", or 0 as a placeholder.
If you cannot confidently read a field → simply omit it from the JSON.

Return ONLY the JSON object. No other text.
`;

// ─── Server-side Validation ───────────────────────────────────────────────────

interface ValidationResult {
  cleaned: Record<string, unknown>;
  dropped: { field: string; reason: string; originalValue: unknown }[];
}

function validateAndSanitize(raw: Record<string, unknown>): ValidationResult {
  const cleaned: Record<string, unknown> = {};
  const dropped: ValidationResult["dropped"] = [];

  const allKnownFields = new Set([
    ...STRING_FIELDS,
    ...NUMBER_FIELDS,
    ...Object.keys(ENUM_FIELDS),
    ...BOOLEAN_FIELDS,
    ...Object.keys(ARRAY_FIELD_ALLOWED_VALUES),
  ]);

  for (const [key, value] of Object.entries(raw)) {
    // Drop unknown keys
    if (!allKnownFields.has(key)) {
      dropped.push({ field: key, reason: "Unknown field — not in schema", originalValue: value });
      continue;
    }

    // Skip null / undefined
    if (value === null || value === undefined) {
      dropped.push({ field: key, reason: "Null or undefined value", originalValue: value });
      continue;
    }

    // ── Number fields
    if (NUMBER_FIELDS.has(key)) {
      const num = typeof value === "number" ? value : Number(value);
      if (isNaN(num) || !isFinite(num)) {
        dropped.push({ field: key, reason: "Not a valid number", originalValue: value });
        continue;
      }
      if (!Number.isInteger(num)) {
        dropped.push({ field: key, reason: "Must be an integer", originalValue: value });
        continue;
      }
      const range = NUMBER_FIELD_RANGES[key];
      if (range && (num < range.min || num > range.max)) {
        dropped.push({ field: key, reason: `Out of range [${range.min}–${range.max}]`, originalValue: value });
        continue;
      }
      cleaned[key] = num;
      continue;
    }

    // ── Boolean fields
    if (BOOLEAN_FIELDS.has(key)) {
      if (typeof value !== "boolean") {
        dropped.push({ field: key, reason: "Must be boolean true/false", originalValue: value });
        continue;
      }
      cleaned[key] = value;
      continue;
    }

    // ── Enum fields
    if (ENUM_FIELDS[key]) {
      if (typeof value !== "string" || !ENUM_FIELDS[key].includes(value)) {
        dropped.push({ field: key, reason: `Value not in allowed enum: [${ENUM_FIELDS[key].join(", ")}]`, originalValue: value });
        continue;
      }
      cleaned[key] = value;
      continue;
    }

    // ── Array fields
    if (ARRAY_FIELD_ALLOWED_VALUES[key]) {
      if (!Array.isArray(value)) {
        dropped.push({ field: key, reason: "Must be an array", originalValue: value });
        continue;
      }
      const allowed = ARRAY_FIELD_ALLOWED_VALUES[key];
      const validItems = (value as unknown[]).filter((item) => {
        if (typeof item !== "string") return false;
        return allowed.includes(item);
      });
      const invalidItems = (value as unknown[]).filter((item) => !validItems.includes(item));
      if (invalidItems.length > 0) {
        dropped.push({ field: key, reason: `Array had invalid items removed: ${JSON.stringify(invalidItems)}`, originalValue: value });
      }
      // Only include if there are valid items remaining
      if (validItems.length > 0) {
        cleaned[key] = validItems;
      }
      continue;
    }

    // ── Date fields
    if (DATE_FIELDS.has(key)) {
      if (typeof value !== "string" || !DATE_REGEX.test(value)) {
        dropped.push({ field: key, reason: "Must be a string in YYYY-MM-DD format", originalValue: value });
        continue;
      }
      // Check it's a real calendar date
      const d = new Date(value);
      if (isNaN(d.getTime())) {
        dropped.push({ field: key, reason: "Invalid calendar date", originalValue: value });
        continue;
      }
      cleaned[key] = value;
      continue;
    }

    // ── String fields
    if (STRING_FIELDS.has(key)) {
      if (typeof value !== "string") {
        dropped.push({ field: key, reason: "Must be a string", originalValue: value });
        continue;
      }
      const trimmed = value.trim();
      if (trimmed === "" || trimmed.toLowerCase() === "n/a" || trimmed.toLowerCase() === "unknown") {
        dropped.push({ field: key, reason: "Empty / placeholder string", originalValue: value });
        continue;
      }
      cleaned[key] = trimmed;
      continue;
    }
  }

  return { cleaned, dropped };
}

// ─── Route Handler ────────────────────────────────────────────────────────────

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
            { inline_data: { mime_type: mimeType, data: imageBase64 } },
          ],
        },
      ],
      generationConfig: {
        temperature: 0,        // zero temperature = maximally deterministic
        maxOutputTokens: 8192,
        responseMimeType: "application/json", // tell Gemini to return JSON directly
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

    // Belt-and-suspenders: strip markdown fences even though we requested JSON mime
    const cleaned = rawText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    let rawParsed: Record<string, unknown>;
    try {
      rawParsed = JSON.parse(cleaned);
    } catch {
      return NextResponse.json(
        { error: "Gemini returned non-JSON output", raw: cleaned },
        { status: 422 }
      );
    }

    // Run server-side validation & sanitisation
    const { cleaned: data, dropped } = validateAndSanitize(rawParsed);

    // Log dropped fields for monitoring (never sent to client in prod)
    if (dropped.length > 0) {
      console.warn(`[parse-form-image] Dropped ${dropped.length} fields after validation:`, dropped);
    }

    return NextResponse.json({
      data,
      meta: {
        fieldsExtracted: Object.keys(data).length,
        fieldsDropped: dropped.length,
        // In development, expose what was dropped so you can debug
        ...(process.env.NODE_ENV === "development" && { dropped }),
      },
    });
  } catch (err) {
    console.error("parse-form-image error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
