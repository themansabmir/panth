import { Schema, model, models } from 'mongoose';

const PatientSchema = new Schema({
    // Section 1: Consent & Registration
    consent: String,
    HCN_Number: { type: String, required: true },
    hospital_opd_number: String,
    date_of_first_assessment: Date,

    // Section 2: Identity & Demographics
    patient_name: { type: String, required: true },
    dob: Date,
    age: Number,
    gender: String,
    marital_status: String,
    occupation: String,
    education_level: String,
    monthly_income: String,
    family_size: Number,
    native_place: String,
    languages_spoken: String,
    likely_caregiver: String,
    address: String,
    phone_number: String,
    alternate_phone_number: String,

    // Section 3: Illness History
    illness_duration: String,
    severity_before: String,
    daily_function: String,
    work_education: String,
    leisure_limit: String,
    self_confidence: String,
    relationships: String,
    prev_diagnosis: String,
    aborter_info: String,
    aborter_timing: String,
    trigger_info: String,
    lifestyle_info: String,

    // Section 4: Headache Episode Characteristics
    onset_type: String,
    total_duration_illness: String,
    untreated_episode_duration: String,
    treated_episode_duration: String,
    max_episode_duration: String,
    min_episode_duration: String,
    headache_days_per_month: Number,
    vas_score: Number,
    nrs_category: String,

    // Section 5: Location of Pain
    primary_pain_distribution: String,
    sidelocked_headache: String,
    sidelocked_site_specification: String,
    pain_sites: [String],
    pain_site_other_specify: String,

    // Section 6: Nature of Pain
    pain_character: [String],
    pain_character_other_specify: String,

    // Section 7: Associated Symptoms
    associated_symptoms: [String],
    associated_symptoms_other: String,
    // Autonomic symptoms
    autonomic_symptoms: {
        eyelid_edema: String,
        lacrimation: String,
        conjunctival_injection: String,
        nasal_congestion: String,
        rhinorrhea: String,
        facial_sweating: String,
        lid_droop: String,
        aural_fullness: String,
    },

    // Section 8: Aura
    aura_present: String,
    aura_type: [String],

    // Section 9: Prodrome
    prodrome_present: String,
    prodrome_symptoms: [String],
    prodrome_other: String,

    // Section 10: Postdrome
    postdrome_symptoms: [String],
    postdrome_other: String,

    // Section 11: Triggers
    triggers: [String],
    triggers_other: String,

    // Section 12: Past Medical History
    past_medical_history: [String],
    past_medical_history_other: String,

    // Section 13: Personal & Family History
    smoking_status: String,
    smoking_pack_years: String,
    alcohol_intake: String,
    tobacco_use: String,
    substance_use: String,
    family_history_headache: String,
    family_history_relationship: String,

    // Section 14: Red Flags
    red_flags: {
        onset_thunderclap: Boolean,
        onset_progressive: Boolean,
        onset_after_50: Boolean,
        onset_pregnancy: Boolean,
        worst_headache: Boolean,
        freq_increase: Boolean,
        severity_increase: Boolean,
        exertion_trigger: Boolean,
        sexual_activity: Boolean,
        fever: Boolean,
        seizure: Boolean,
        neurological_deficit: Boolean,
        neck_stiffness: Boolean,
        post_trauma: Boolean,
        prior_investigation: Boolean,
        systemic_illness: Boolean,
        weight_gain: Boolean,
        tinnitus_tvo: Boolean,
        none: Boolean,
    },

    // Section 15: General Examination
    blood_pressure: String,
    pulse_rate: String,
    general_findings: {
        pallor: Boolean,
        icterus: Boolean,
        cyanosis: Boolean,
        clubbing: Boolean,
        pedal_edema: Boolean,
        lymphadenopathy: Boolean,
        raised_jvp: Boolean,
        skin_markers: Boolean,
        none: Boolean,
    },

    // Section 16: Systemic Examination
    cardiovascular_findings: String,
    respiratory_findings: String,
    gastrointestinal_findings: String,
    // CNS Examination
    higher_mental_functions: String,
    cranial_nerve_examination: String,
    motor_system_examination: String,
    sensory_system_examination: String,
    cerebellar_signs: String,
    spine_cranium_examination: String,
    meningeal_signs: String,
    extrapyramidal_signs: String,
    gait_assessment: String,

    // Section 17: Diagnosis
    diagnosis: [String], // ICHD-3 Checklist
    secondary_headaches: String,
    cranial_neuropathies: String,
    appendix_criteria: String,
    // Secondary Headache Specifications
    specify_5: String,
    specify_6: String,
    specify_7: String,
    specify_8: String,
    specify_9: String,
    specify_10: String,
    specify_11: String,
    specify_12: String,
    appendix_specify: String,

    // Section 18 / Scales (from super-section "Scales")
    hit6_score: String,
    midas_score: String,
    phq9_score: String,
    gad7_score: String,
    msqol_score: String,

    // Section 19: Investigations
    investigations: [String], // Checkboxes
    investigations_other: String,

    // Section 20: Medication (Structured)
    acute_meds: [{
        drug_group: String,
        drug_name_route: String,
        time_started: String,
        starting_dose: String,
        final_dose: String,
        adverse_effects: String,
        tolerance: String,
        days_per_month: Number,
        effectiveness: String,
    }],
    preventive_meds: [{
        drug_group: String,
        drug_name_route: String,
        time_started: String,
        starting_dose: String,
        final_dose: String,
        adverse_effects: String,
        tolerance: String,
        days_per_month: Number,
        effectiveness: String,
    }],
    devices_nerve_blocks_botox: String,

    // Section 21: Provisional Diagnosis
    provisional_diagnosis: String,
    specific_subtype: String,

    // Section 22: Treatment Plan (Continued)
    acute_medicines_prescribed: String,
    preventive_medicines_prescribed: String,
    non_pharmacologic_recommendations: String,
    investigations_recommended: String,

    // Section 23: Patient Instructions
    patient_instructions: String,

}, { timestamps: true });

const Patient = models.Patient || model('Patient', PatientSchema);

export default Patient;
