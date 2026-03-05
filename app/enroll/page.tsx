"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  // Section 1
  consent: string;
  HCN_Number: string;
  hospital_opd_number: string;
  date_of_first_assessment: string;
  // Section 2
  patient_name: string;
  dob: string;
  age: string;
  gender: string;
  marital: string;
  occupation: string;
  education_level: string;
  monthly_income: string;
  family_size: string;
  native_place: string;
  languages_spoken: string;
  likely_caregiver: string;
  address: string;
  phone_number: string;
  alternate_phone_number: string;
  // Section 3
  illness_duration: string;
  severity_before: string;
  daily_function: string;
  work_education: string;
  leisure_limit: string;
  self_confidence: string;
  relationships: string;
  prev_diagnosis: string;
  aborter_info: string;
  aborter_timing: string;
  trigger_info: string;
  lifestyle_info: string;
  // Section 4
  onset_type: string;
  total_duration_illness: string;
  untreated_episode_duration: string;
  treated_episode_duration: string;
  max_episode_duration: string;
  min_episode_duration: string;
  headache_days_per_month: string;
  vas_score: string;
  nrs_category: string;
  // Section 5
  primary_pain_distribution: string;
  sidelocked_headache: string;
  sidelocked_site_specification: string;
  pain_sites: string[];
  pain_site_other_specify: string;
  // Section 6
  pain_character: string[];
  pain_character_other_specify: string;
  // Section 7
  associated_symptoms: string[];
  associated_symptoms_other: string;
  eyelid_edema: string;
  lacrimation: string;
  conjunctival_injection: string;
  nasal_congestion: string;
  rhinorrhea: string;
  facial_sweating: string;
  lid_droop: string;
  aural_fullness: string;
  // Section 8
  aura_present: string;
  aura_type: string[];
  // Section 9
  prodrome_present: string;
  prodrome_symptoms: string[];
  prodrome_other: string;
  // Section 10
  postdrome_symptoms: string[];
  postdrome_other: string;
  // Section 11
  triggers: string[];
  triggers_other: string;
  // Section 12
  past_medical_history: string[];
  past_medical_history_other: string;
  // Section 13
  smoking_status: string;
  smoking_pack_years: string;
  alcohol_intake: string;
  tobacco_use: string;
  substance_use: string;
  family_history_headache: string;
  family_history_relationship: string;
  // Section 14 — Red Flags
  rf_onset_thunderclap: boolean;
  rf_onset_progressive: boolean;
  rf_onset_after_50: boolean;
  rf_onset_pregnancy: boolean;
  rf_worst_headache: boolean;
  rf_freq_increase: boolean;
  rf_severity_increase: boolean;
  rf_exertion_trigger: boolean;
  rf_sexual_activity: boolean;
  rf_fever: boolean;
  rf_seizure: boolean;
  rf_neurological_deficit: boolean;
  rf_neck_stiffness: boolean;
  rf_post_trauma: boolean;
  rf_prior_investigation: boolean;
  rf_systemic_illness: boolean;
  rf_weight_gain: boolean;
  rf_tinnitus_tvo: boolean;
  rf_none: boolean;
  // Section 15
  blood_pressure: string;
  pulse_rate: string;
  ge_pallor: boolean;
  ge_icterus: boolean;
  ge_cyanosis: boolean;
  ge_clubbing: boolean;
  ge_pedal_edema: boolean;
  ge_lymphadenopathy: boolean;
  ge_raised_jvp: boolean;
  ge_skin_markers: boolean;
  ge_none: boolean;
  // Section 16
  cardiovascular_findings: string;
  respiratory_findings: string;
  gastrointestinal_findings: string;
  higher_mental_functions: string;
  cranial_nerve_examination: string;
  motor_system_examination: string;
  sensory_system_examination: string;
  cerebellar_signs: string;
  spine_cranium_examination: string;
  meningeal_signs: string;
  extrapyramidal_signs: string;
  gait_assessment: string;
  // Section 17 — Diagnosis
  diagnosis: string[];
  specify_5: string;
  specify_6: string;
  specify_7: string;
  specify_8: string;
  specify_9: string;
  specify_10: string;
  specify_11: string;
  specify_12: string;
  comments: string;
  appendix_specify: string;
  // Scales
  hit6_score: string;
  midas_score: string;
  phq9_score: string;
  gad7_score: string;
  msqol_score: string;
  // Investigations
  investigations: string[];
  investigations_other: string;
  // Section 21
  provisional_diagnosis: string;
  specific_subtype: string;
  // Section 20 — Medication
  acute_drug_group: string;
  acute_drug_name_route: string;
  acute_time_started: string;
  acute_starting_dose: string;
  acute_final_dose: string;
  acute_adverse_effects: string;
  acute_tolerance: string;
  acute_days_per_month: string;
  acute_effectiveness: string;
  preventive_drug_group: string;
  preventive_drug_name_route: string;
  preventive_time_started: string;
  preventive_starting_dose: string;
  preventive_final_dose: string;
  preventive_adverse_effects: string;
  preventive_tolerance: string;
  preventive_days_per_month: string;
  preventive_effectiveness: string;
  devices_nerve_blocks_botox: string;
  // Section 22
  acute_medicines_prescribed: string;
  preventive_medicines_prescribed: string;
  non_pharmacologic_recommendations: string;
  investigations_recommended: string;
  // Section 23
  patient_instructions: string;
}

// ─── Initial State ─────────────────────────────────────────────────────────────

const initialState: FormData = {
  consent: "", HCN_Number: "", hospital_opd_number: "", date_of_first_assessment: "",
  patient_name: "", dob: "", age: "", gender: "", marital: "", occupation: "",
  education_level: "", monthly_income: "", family_size: "", native_place: "",
  languages_spoken: "", likely_caregiver: "", address: "", phone_number: "",
  alternate_phone_number: "",
  illness_duration: "", severity_before: "", daily_function: "", work_education: "",
  leisure_limit: "", self_confidence: "", relationships: "", prev_diagnosis: "",
  aborter_info: "", aborter_timing: "", trigger_info: "", lifestyle_info: "",
  onset_type: "", total_duration_illness: "", untreated_episode_duration: "",
  treated_episode_duration: "", max_episode_duration: "", min_episode_duration: "",
  headache_days_per_month: "", vas_score: "", nrs_category: "",
  primary_pain_distribution: "", sidelocked_headache: "", sidelocked_site_specification: "",
  pain_sites: [], pain_site_other_specify: "",
  pain_character: [], pain_character_other_specify: "",
  associated_symptoms: [], associated_symptoms_other: "",
  eyelid_edema: "", lacrimation: "", conjunctival_injection: "", nasal_congestion: "",
  rhinorrhea: "", facial_sweating: "", lid_droop: "", aural_fullness: "",
  aura_present: "", aura_type: [],
  prodrome_present: "", prodrome_symptoms: [], prodrome_other: "",
  postdrome_symptoms: [], postdrome_other: "",
  triggers: [], triggers_other: "",
  past_medical_history: [], past_medical_history_other: "",
  smoking_status: "", smoking_pack_years: "", alcohol_intake: "", tobacco_use: "",
  substance_use: "", family_history_headache: "", family_history_relationship: "",
  rf_onset_thunderclap: false, rf_onset_progressive: false, rf_onset_after_50: false,
  rf_onset_pregnancy: false, rf_worst_headache: false, rf_freq_increase: false,
  rf_severity_increase: false, rf_exertion_trigger: false, rf_sexual_activity: false,
  rf_fever: false, rf_seizure: false, rf_neurological_deficit: false,
  rf_neck_stiffness: false, rf_post_trauma: false, rf_prior_investigation: false,
  rf_systemic_illness: false, rf_weight_gain: false, rf_tinnitus_tvo: false, rf_none: false,
  blood_pressure: "", pulse_rate: "",
  ge_pallor: false, ge_icterus: false, ge_cyanosis: false, ge_clubbing: false,
  ge_pedal_edema: false, ge_lymphadenopathy: false, ge_raised_jvp: false,
  ge_skin_markers: false, ge_none: false,
  cardiovascular_findings: "", respiratory_findings: "", gastrointestinal_findings: "",
  higher_mental_functions: "", cranial_nerve_examination: "", motor_system_examination: "",
  sensory_system_examination: "", cerebellar_signs: "", spine_cranium_examination: "",
  meningeal_signs: "", extrapyramidal_signs: "", gait_assessment: "",
  diagnosis: [], specify_5: "", specify_6: "", specify_7: "", specify_8: "",
  specify_9: "", specify_10: "", specify_11: "", specify_12: "", comments: "",
  appendix_specify: "",
  hit6_score: "", midas_score: "", phq9_score: "", gad7_score: "", msqol_score: "",
  investigations: [], investigations_other: "",
  provisional_diagnosis: "", specific_subtype: "",
  acute_drug_group: "", acute_drug_name_route: "", acute_time_started: "",
  acute_starting_dose: "", acute_final_dose: "", acute_adverse_effects: "",
  acute_tolerance: "", acute_days_per_month: "", acute_effectiveness: "",
  preventive_drug_group: "", preventive_drug_name_route: "", preventive_time_started: "",
  preventive_starting_dose: "", preventive_final_dose: "", preventive_adverse_effects: "",
  preventive_tolerance: "", preventive_days_per_month: "", preventive_effectiveness: "",
  devices_nerve_blocks_botox: "",
  acute_medicines_prescribed: "", preventive_medicines_prescribed: "",
  non_pharmacologic_recommendations: "", investigations_recommended: "",
  patient_instructions: "",
};

// ─── Sub-components ────────────────────────────────────────────────────────────

const SectionHeader = ({ title }: { title: string }) => (
  <h3 className="text-base font-semibold text-blue-800 border-b border-blue-200 pb-1 mb-4 mt-2">
    {title}
  </h3>
);

const FieldLabel = ({ children, bold }: { children: React.ReactNode; bold?: boolean }) => (
  <label className={`block text-sm mt-3 mb-1 ${bold ? "font-semibold" : "font-medium"} text-gray-700`}>
    {children}
  </label>
);

const TextInput = ({
  name, value, onChange, placeholder, required, type = "text",
}: {
  name: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; required?: boolean; type?: string;
}) => (
  <input
    type={type} name={name} value={value} onChange={onChange}
    placeholder={placeholder} required={required}
    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
);

const TextArea = ({
  name, value, onChange, rows = 3, placeholder,
}: {
  name: string; value: string; onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number; placeholder?: string;
}) => (
  <textarea
    name={name} value={value} onChange={onChange} rows={rows} placeholder={placeholder}
    className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
  />
);

const RadioGroup = ({
  name, options, value, onChange,
}: {
  name: string; options: { label: string; value: string }[];
  value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1">
    {options.map((o) => (
      <label key={o.value} className="flex items-center gap-1 text-sm cursor-pointer">
        <input type="radio" name={name} value={o.value} checked={value === o.value} onChange={onChange} />
        {o.label}
      </label>
    ))}
  </div>
);

const CheckboxGroup = ({
  name, options, values, onChange,
}: {
  name: string; options: string[]; values: string[];
  onChange: (val: string, checked: boolean) => void;
}) => (
  <div className="flex flex-wrap gap-x-6 gap-y-1 mt-1">
    {options.map((o) => (
      <label key={o} className="flex items-center gap-1 text-sm cursor-pointer">
        <input
          type="checkbox" name={name} value={o}
          checked={values.includes(o)}
          onChange={(e) => onChange(o, e.target.checked)}
        />
        {o}
      </label>
    ))}
  </div>
);

const SingleCheckbox = ({
  name, label, checked, onChange,
}: {
  name: string; label: string; checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) => (
  <label className="flex items-center gap-2 text-sm cursor-pointer mt-1">
    <input type="checkbox" name={name} checked={checked} onChange={onChange} />
    {label}
  </label>
);

interface SuperSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

const SuperSection = ({ title, children, defaultOpen = true }: SuperSectionProps) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-gray-300 rounded-lg mb-4 overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((p) => !p)}
        className="w-full flex justify-between items-center px-5 py-3 bg-blue-700 text-white font-semibold text-left"
      >
        <span>{title}</span>
        <span className="text-lg">{open ? "▲" : "▼"}</span>
      </button>
      {open && <div className="p-5 bg-white space-y-6">{children}</div>}
    </div>
  );
};

const FormSection = ({ children }: { children: React.ReactNode }) => (
  <div className="border border-gray-200 rounded-md p-4 bg-gray-50">{children}</div>
);

// ─── Main Component (inner — uses useSearchParams) ───────────────────────────

function HeadacheRegistryFormContent() {
  const [formData, setFormData] = useState<FormData>(initialState);
  const [submitted, setSubmitted] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  // When non-null, we're editing an existing patient (holds their Mongo _id)
  const [editingId, setEditingId] = useState<string | null>(null);
  // Controlled input for the "Load Patient" search bar
  const [lookupId, setLookupId] = useState("");

  // Read ?id= from URL and auto-load on mount
  const searchParams = useSearchParams();
  const urlPatientId = searchParams.get("id");

  const fetchPatient = useCallback(async (id: string) => {
    if (!id.trim()) return;
    setIsLoading(true);
    setStatusMsg("");
    try {
      const res = await fetch(`/api/enroll/${id.trim()}`);
      const result = await res.json();
      if (result.success) {
        const p = result.data;
        setFormData({
          ...initialState,
          ...Object.fromEntries(
            Object.keys(initialState)
              .filter((k) => k in p && typeof p[k] !== 'object')
              .map((k) => [k, p[k] ?? initialState[k as keyof FormData]])
          ),
          pain_sites: p.pain_sites ?? [],
          pain_character: p.pain_character ?? [],
          associated_symptoms: p.associated_symptoms ?? [],
          aura_type: p.aura_type ?? [],
          prodrome_symptoms: p.prodrome_symptoms ?? [],
          postdrome_symptoms: p.postdrome_symptoms ?? [],
          triggers: p.triggers ?? [],
          past_medical_history: p.past_medical_history ?? [],
          investigations: p.investigations ?? [],
          diagnosis: p.diagnosis ?? [],
          eyelid_edema: p.autonomic_symptoms?.eyelid_edema ?? "",
          lacrimation: p.autonomic_symptoms?.lacrimation ?? "",
          conjunctival_injection: p.autonomic_symptoms?.conjunctival_injection ?? "",
          nasal_congestion: p.autonomic_symptoms?.nasal_congestion ?? "",
          rhinorrhea: p.autonomic_symptoms?.rhinorrhea ?? "",
          facial_sweating: p.autonomic_symptoms?.facial_sweating ?? "",
          lid_droop: p.autonomic_symptoms?.lid_droop ?? "",
          aural_fullness: p.autonomic_symptoms?.aural_fullness ?? "",
          rf_onset_thunderclap: p.red_flags?.onset_thunderclap ?? false,
          rf_onset_progressive: p.red_flags?.onset_progressive ?? false,
          rf_onset_after_50: p.red_flags?.onset_after_50 ?? false,
          rf_onset_pregnancy: p.red_flags?.onset_pregnancy ?? false,
          rf_worst_headache: p.red_flags?.worst_headache ?? false,
          rf_freq_increase: p.red_flags?.freq_increase ?? false,
          rf_severity_increase: p.red_flags?.severity_increase ?? false,
          rf_exertion_trigger: p.red_flags?.exertion_trigger ?? false,
          rf_sexual_activity: p.red_flags?.sexual_activity ?? false,
          rf_fever: p.red_flags?.fever ?? false,
          rf_seizure: p.red_flags?.seizure ?? false,
          rf_neurological_deficit: p.red_flags?.neurological_deficit ?? false,
          rf_neck_stiffness: p.red_flags?.neck_stiffness ?? false,
          rf_post_trauma: p.red_flags?.post_trauma ?? false,
          rf_prior_investigation: p.red_flags?.prior_investigation ?? false,
          rf_systemic_illness: p.red_flags?.systemic_illness ?? false,
          rf_weight_gain: p.red_flags?.weight_gain ?? false,
          rf_tinnitus_tvo: p.red_flags?.tinnitus_tvo ?? false,
          rf_none: p.red_flags?.none ?? false,
          ge_pallor: p.general_findings?.pallor ?? false,
          ge_icterus: p.general_findings?.icterus ?? false,
          ge_cyanosis: p.general_findings?.cyanosis ?? false,
          ge_clubbing: p.general_findings?.clubbing ?? false,
          ge_pedal_edema: p.general_findings?.pedal_edema ?? false,
          ge_lymphadenopathy: p.general_findings?.lymphadenopathy ?? false,
          ge_raised_jvp: p.general_findings?.raised_jvp ?? false,
          ge_skin_markers: p.general_findings?.skin_markers ?? false,
          ge_none: p.general_findings?.none ?? false,
          acute_drug_group: p.acute_meds?.[0]?.drug_group ?? "",
          acute_drug_name_route: p.acute_meds?.[0]?.drug_name_route ?? "",
          acute_time_started: p.acute_meds?.[0]?.time_started ?? "",
          acute_starting_dose: p.acute_meds?.[0]?.starting_dose ?? "",
          acute_final_dose: p.acute_meds?.[0]?.final_dose ?? "",
          acute_adverse_effects: p.acute_meds?.[0]?.adverse_effects ?? "",
          acute_tolerance: p.acute_meds?.[0]?.tolerance ?? "",
          acute_days_per_month: p.acute_meds?.[0]?.days_per_month?.toString() ?? "",
          acute_effectiveness: p.acute_meds?.[0]?.effectiveness ?? "",
          preventive_drug_group: p.preventive_meds?.[0]?.drug_group ?? "",
          preventive_drug_name_route: p.preventive_meds?.[0]?.drug_name_route ?? "",
          preventive_time_started: p.preventive_meds?.[0]?.time_started ?? "",
          preventive_starting_dose: p.preventive_meds?.[0]?.starting_dose ?? "",
          preventive_final_dose: p.preventive_meds?.[0]?.final_dose ?? "",
          preventive_adverse_effects: p.preventive_meds?.[0]?.adverse_effects ?? "",
          preventive_tolerance: p.preventive_meds?.[0]?.tolerance ?? "",
          preventive_days_per_month: p.preventive_meds?.[0]?.days_per_month?.toString() ?? "",
          preventive_effectiveness: p.preventive_meds?.[0]?.effectiveness ?? "",
          date_of_first_assessment: p.date_of_first_assessment
            ? new Date(p.date_of_first_assessment).toISOString().split('T')[0]
            : "",
          dob: p.dob ? new Date(p.dob).toISOString().split('T')[0] : "",
        });
        setEditingId(id.trim());
        setLookupId(id.trim());
        setSubmitted(false);
        setStatusMsg(`Loaded patient: ${p.patient_name || id.trim()}`);
      } else {
        setStatusMsg(`Patient not found: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("Error loading patient. Check the ID and try again.");
    } finally {
      setIsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auto-load when navigated here with ?id=
  useEffect(() => {
    if (urlPatientId) {
      fetchPatient(urlPatientId);
    }
  }, [urlPatientId, fetchPatient]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleCheckboxBool = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((p) => ({ ...p, [name]: checked }));
  };

  const handleCheckboxArray = (field: keyof FormData, val: string, checked: boolean) => {
    setFormData((p) => {
      const arr = (p[field] as string[]) ?? [];
      return {
        ...p,
        [field]: checked ? [...arr, val] : arr.filter((v) => v !== val),
      };
    });
  };

  // ── Fetch a patient by ID and pre-fill the form (manual load bar) ──────────
  const fetchPatientManual = (id: string) => fetchPatient(id);

  // Generic field handlers
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMsg("");

    // Build the nested payload expected by the DB schema
    const payload = {
      ...formData,
      autonomic_symptoms: {
        eyelid_edema: formData.eyelid_edema,
        lacrimation: formData.lacrimation,
        conjunctival_injection: formData.conjunctival_injection,
        nasal_congestion: formData.nasal_congestion,
        rhinorrhea: formData.rhinorrhea,
        facial_sweating: formData.facial_sweating,
        lid_droop: formData.lid_droop,
        aural_fullness: formData.aural_fullness,
      },
      red_flags: {
        onset_thunderclap: formData.rf_onset_thunderclap,
        onset_progressive: formData.rf_onset_progressive,
        onset_after_50: formData.rf_onset_after_50,
        onset_pregnancy: formData.rf_onset_pregnancy,
        worst_headache: formData.rf_worst_headache,
        freq_increase: formData.rf_freq_increase,
        severity_increase: formData.rf_severity_increase,
        exertion_trigger: formData.rf_exertion_trigger,
        sexual_activity: formData.rf_sexual_activity,
        fever: formData.rf_fever,
        seizure: formData.rf_seizure,
        neurological_deficit: formData.rf_neurological_deficit,
        neck_stiffness: formData.rf_neck_stiffness,
        post_trauma: formData.rf_post_trauma,
        prior_investigation: formData.rf_prior_investigation,
        systemic_illness: formData.rf_systemic_illness,
        weight_gain: formData.rf_weight_gain,
        tinnitus_tvo: formData.rf_tinnitus_tvo,
        none: formData.rf_none,
      },
      general_findings: {
        pallor: formData.ge_pallor,
        icterus: formData.ge_icterus,
        cyanosis: formData.ge_cyanosis,
        clubbing: formData.ge_clubbing,
        pedal_edema: formData.ge_pedal_edema,
        lymphadenopathy: formData.ge_lymphadenopathy,
        raised_jvp: formData.ge_raised_jvp,
        skin_markers: formData.ge_skin_markers,
        none: formData.ge_none,
      },
      acute_meds: [{
        drug_group: formData.acute_drug_group,
        drug_name_route: formData.acute_drug_name_route,
        time_started: formData.acute_time_started,
        starting_dose: formData.acute_starting_dose,
        final_dose: formData.acute_final_dose,
        adverse_effects: formData.acute_adverse_effects,
        tolerance: formData.acute_tolerance,
        days_per_month: Number(formData.acute_days_per_month) || 0,
        effectiveness: formData.acute_effectiveness,
      }],
      preventive_meds: [{
        drug_group: formData.preventive_drug_group,
        drug_name_route: formData.preventive_drug_name_route,
        time_started: formData.preventive_time_started,
        starting_dose: formData.preventive_starting_dose,
        final_dose: formData.preventive_final_dose,
        adverse_effects: formData.preventive_adverse_effects,
        tolerance: formData.preventive_tolerance,
        days_per_month: Number(formData.preventive_days_per_month) || 0,
        effectiveness: formData.preventive_effectiveness,
      }],
    };

    try {
      const url = editingId ? `/api/enroll/${editingId}` : "/api/enroll";
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await res.json();
      if (result.success) {
        setSubmitted(true);
        setStatusMsg(editingId ? "Patient updated successfully!" : "Form submitted successfully!");
      } else {
        setStatusMsg(`Error: ${result.error}`);
      }
    } catch (err) {
      console.error(err);
      setStatusMsg("A network error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewForm = () => {
    setFormData(initialState);
    setSubmitted(false);
    setStatusMsg("");
    setEditingId(null);
    setLookupId("");
  };

  // ── Autonomic symptom rows
  const autonomicRows: { label: string; field: keyof FormData }[] = [
    { label: "Eyelid edema", field: "eyelid_edema" },
    { label: "Lacrimation", field: "lacrimation" },
    { label: "Conjunctival injection", field: "conjunctival_injection" },
    { label: "Nasal congestion", field: "nasal_congestion" },
    { label: "Rhinorrhea", field: "rhinorrhea" },
    { label: "Facial/forehead sweating", field: "facial_sweating" },
    { label: "Lid droop", field: "lid_droop" },
    { label: "Aural fullness", field: "aural_fullness" },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-blue-800 text-white px-6 py-4 flex items-center gap-4 shadow">
        <div className="w-12 h-12 rounded-full bg-white text-blue-800 font-bold text-xl flex items-center justify-center">
          HR
        </div>
        <div>
          <h1 className="text-2xl font-bold">Headache Registry</h1>
          <p className="text-sm text-blue-200">Patient Enrollment Form</p>
        </div>
      </header>

      {/* ── Back link + Load patient bar ── */}
      <div className="max-w-5xl mx-auto px-4 pt-5">
        <Link href="/patients" className="inline-flex items-center gap-1 text-sm text-blue-700 hover:underline mb-3">
          ← Patient List
        </Link>
        <div className="flex gap-2 items-center bg-white border border-blue-200 rounded-lg px-4 py-3 shadow-sm">
          <span className="text-sm font-medium text-gray-600 whitespace-nowrap">Load patient by ID:</span>
          <input
            type="text"
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && fetchPatientManual(lookupId)}
            placeholder="Paste MongoDB _id here…"
            className="flex-1 border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            type="button"
            onClick={() => fetchPatientManual(lookupId)}
            disabled={isLoading || !lookupId.trim()}
            className="bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white text-sm font-semibold px-4 py-1.5 rounded transition"
          >
            {isLoading ? "Loading…" : "Load"}
          </button>
        </div>

        {/* Editing banner */}
        {editingId && (
          <div className="mt-2 flex items-center gap-2 bg-amber-50 border border-amber-300 text-amber-800 text-sm rounded-lg px-4 py-2">
            <span className="font-semibold">✏️ Editing patient</span>
            <code className="font-mono text-xs bg-amber-100 px-2 py-0.5 rounded">{editingId}</code>
            <span className="ml-auto text-xs text-amber-600">Submit will update this record.</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="max-w-5xl mx-auto px-4 py-4 space-y-4">

        {/* ═══════════════════════════════════════════════════════
            SUPER SECTION — Demographic Details
        ════════════════════════════════════════════════════════ */}
        <SuperSection title="Demographic Details" defaultOpen>

          {/* Section 1 */}
          <FormSection>
            <SectionHeader title="SECTION 1 — Patient Consent and Registration" />

            <FieldLabel>Consent for Data Registration</FieldLabel>
            <RadioGroup name="consent" value={formData.consent} onChange={handleChange}
              options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]} />

            <FieldLabel>Headache Clinic Number (HCN)</FieldLabel>
            <TextInput name="HCN_Number" value={formData.HCN_Number} onChange={handleChange} required />

            <FieldLabel>Hospital OPD Number</FieldLabel>
            <TextInput name="hospital_opd_number" value={formData.hospital_opd_number} onChange={handleChange} />

            <FieldLabel>Date of First Assessment</FieldLabel>
            <TextInput type="date" name="date_of_first_assessment" value={formData.date_of_first_assessment} onChange={handleChange} />
          </FormSection>

          {/* Section 2 */}
          <FormSection>
            <SectionHeader title="SECTION 2 — Patient Identity & Demographics" />

            <FieldLabel>Patient Full Name</FieldLabel>
            <TextInput name="patient_name" value={formData.patient_name} onChange={handleChange} required />

            <FieldLabel>Date of Birth</FieldLabel>
            <TextInput type="date" name="dob" value={formData.dob} onChange={handleChange} />

            <FieldLabel>Age</FieldLabel>
            <TextInput type="number" name="age" value={formData.age} onChange={handleChange} />

            <FieldLabel>Gender</FieldLabel>
            <RadioGroup name="gender" value={formData.gender} onChange={handleChange}
              options={["Male", "Female", "Other"].map((v) => ({ label: v, value: v }))} />

            <FieldLabel>Marital Status</FieldLabel>
            <RadioGroup name="marital" value={formData.marital} onChange={handleChange}
              options={["Single", "Married", "Divorced", "Widowed"].map((v) => ({ label: v, value: v }))} />

            <FieldLabel>Occupation</FieldLabel>
            <TextInput name="occupation" value={formData.occupation} onChange={handleChange} />

            <FieldLabel>Education Level</FieldLabel>
            <TextInput name="education_level" value={formData.education_level} onChange={handleChange} />

            <FieldLabel>Monthly Income (Approx.)</FieldLabel>
            <TextInput name="monthly_income" value={formData.monthly_income} onChange={handleChange} />

            <FieldLabel>Family Size</FieldLabel>
            <TextInput type="number" name="family_size" value={formData.family_size} onChange={handleChange} />

            <FieldLabel>Native Place</FieldLabel>
            <TextInput name="native_place" value={formData.native_place} onChange={handleChange} />

            <FieldLabel>Languages Spoken</FieldLabel>
            <TextInput name="languages_spoken" value={formData.languages_spoken} onChange={handleChange} />

            <FieldLabel>Likely Caregiver</FieldLabel>
            <TextInput name="likely_caregiver" value={formData.likely_caregiver} onChange={handleChange} />

            <FieldLabel>Address</FieldLabel>
            <TextArea name="address" value={formData.address} onChange={handleChange} />

            <FieldLabel>Phone Number</FieldLabel>
            <TextInput type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} />

            <FieldLabel>Alternate Phone Number</FieldLabel>
            <TextInput type="tel" name="alternate_phone_number" value={formData.alternate_phone_number} onChange={handleChange} />
          </FormSection>
        </SuperSection>

        {/* ═══════════════════════════════════════════════════════
            SUPER SECTION — General Headache Characteristics
        ════════════════════════════════════════════════════════ */}
        <SuperSection title="General Headache Characteristics">

          {/* Section 3 */}
          <FormSection>
            <SectionHeader title="SECTION 3 — Illness History & Patient Experience" />

            <FieldLabel bold>Duration of Headache Illness (months/years)</FieldLabel>
            <TextInput name="illness_duration" value={formData.illness_duration} onChange={handleChange} />

            <FieldLabel bold>Severity Before Visit</FieldLabel>
            <RadioGroup name="severity_before" value={formData.severity_before} onChange={handleChange}
              options={["Mild", "Moderate", "Severe"].map((v) => ({ label: v, value: v }))} />

            {(
              [
                ["daily_function", "Illness affecting day-to-day functioning?"],
                ["work_education", "Illness affecting work / education ability?"],
                ["leisure_limit", "Illness limiting leisure activities?"],
                ["self_confidence", "Illness affecting self-confidence?"],
                ["relationships", "Illness affecting interpersonal relationships?"],
                ["prev_diagnosis", "Ever previously told about your diagnosis?"],
                ["aborter_info", "Ever previously told about aborter medication?"],
                ["aborter_timing", "Ever told about correct timing of aborter medication?"],
                ["trigger_info", "Ever told about headache triggers and avoidance?"],
                ["lifestyle_info", "Ever told about lifestyle changes for headache?"],
              ] as [keyof FormData, string][]
            ).map(([field, label]) => (
              <div key={field}>
                <FieldLabel bold>{label}</FieldLabel>
                <RadioGroup name={field} value={formData[field] as string} onChange={handleChange}
                  options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]} />
              </div>
            ))}
          </FormSection>

          {/* Section 4 */}
          <FormSection>
            <SectionHeader title="SECTION 4 — Headache Episode Characteristics" />

            <FieldLabel bold>Type of onset</FieldLabel>
            <RadioGroup name="onset_type" value={formData.onset_type} onChange={handleChange}
              options={[{ label: "Acute", value: "Acute" }, { label: "Insidious", value: "Insidious" }]} />

            <FieldLabel bold>Total duration of illness (months/years)</FieldLabel>
            <TextInput name="total_duration_illness" value={formData.total_duration_illness} onChange={handleChange} />

            <FieldLabel bold>Duration of one untreated headache episode (min/hr)</FieldLabel>
            <TextInput name="untreated_episode_duration" value={formData.untreated_episode_duration} onChange={handleChange} />

            <FieldLabel bold>Duration of one treated headache episode (min/hr)</FieldLabel>
            <TextInput name="treated_episode_duration" value={formData.treated_episode_duration} onChange={handleChange} />

            <FieldLabel bold>Maximum duration of any episode recorded</FieldLabel>
            <TextInput name="max_episode_duration" value={formData.max_episode_duration} onChange={handleChange} />

            <FieldLabel bold>Minimum duration of any episode recorded</FieldLabel>
            <TextInput name="min_episode_duration" value={formData.min_episode_duration} onChange={handleChange} />

            <FieldLabel bold>Number of headache days per month</FieldLabel>
            <TextInput type="number" name="headache_days_per_month" value={formData.headache_days_per_month} onChange={handleChange} />

            <FieldLabel bold>Severity (VAS 1–10)</FieldLabel>
            <TextInput type="number" name="vas_score" value={formData.vas_score} onChange={handleChange} />

            <FieldLabel bold>Severity Category (NRS)</FieldLabel>
            <RadioGroup name="nrs_category" value={formData.nrs_category} onChange={handleChange}
              options={[
                { label: "Mild (1)", value: "Mild" },
                { label: "Moderate (2)", value: "Moderate" },
                { label: "Severe (3)", value: "Severe" },
              ]} />
          </FormSection>

          {/* Section 5 */}
          <FormSection>
            <SectionHeader title="SECTION 5 — Location of Pain" />

            <FieldLabel bold>Primary pain distribution</FieldLabel>
            <RadioGroup name="primary_pain_distribution" value={formData.primary_pain_distribution} onChange={handleChange}
              options={[
                "Holocranial always", "Holocranial predominant",
                "Hemicranial always", "Hemicranial predominant", "Alternating sides",
              ].map((v) => ({ label: v, value: v }))} />

            <FieldLabel bold>Sidelocked headaches?</FieldLabel>
            <RadioGroup name="sidelocked_headache" value={formData.sidelocked_headache} onChange={handleChange}
              options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]} />

            <FieldLabel bold>If yes, specify side and exact site</FieldLabel>
            <TextInput name="sidelocked_site_specification" value={formData.sidelocked_site_specification} onChange={handleChange} />

            <FieldLabel bold>Site(s) of pain</FieldLabel>
            <CheckboxGroup name="pain_sites[]" options={["Orbital", "Supraorbital", "Frontal", "Temporal", "Parietal", "Occipital", "Neck", "Other"]}
              values={formData.pain_sites} onChange={(v, c) => handleCheckboxArray("pain_sites", v, c)} />

            <FieldLabel bold>If other, specify</FieldLabel>
            <TextInput name="pain_site_other_specify" value={formData.pain_site_other_specify} onChange={handleChange} />
          </FormSection>

          {/* Section 6 */}
          <FormSection>
            <SectionHeader title="SECTION 6 — Nature of Pain" />
            <FieldLabel bold>Pain character</FieldLabel>
            <CheckboxGroup
              name="pain_character[]"
              options={["Bursting", "Throbbing", "Boring", "Sharp", "Stabbing", "Pricking", "Electric current–like", "Pressing / heaviness", "Crawling sensation", "Others"]}
              values={formData.pain_character}
              onChange={(v, c) => handleCheckboxArray("pain_character", v, c)}
            />
            <FieldLabel bold>If others, specify</FieldLabel>
            <TextInput name="pain_character_other_specify" value={formData.pain_character_other_specify} onChange={handleChange} />
          </FormSection>

          {/* Section 7 */}
          <FormSection>
            <SectionHeader title="SECTION 7 — Associated Symptoms" />

            <FieldLabel bold>Associated symptoms</FieldLabel>
            <CheckboxGroup
              name="associated_symptoms[]"
              options={["Nausea", "Vomiting", "Photophobia", "Phonophobia", "Tinnitus", "Vertigo", "Blurred vision", "Neck pain / restricted movement", "Hearing impairment", "Osmophobia", "Allodynia", "None", "Others"]}
              values={formData.associated_symptoms}
              onChange={(v, c) => handleCheckboxArray("associated_symptoms", v, c)}
            />
            <FieldLabel bold>If others, specify</FieldLabel>
            <TextInput name="associated_symptoms_other" value={formData.associated_symptoms_other} onChange={handleChange} />

            <hr className="my-4" />

            <FieldLabel bold>Autonomic symptoms</FieldLabel>
            <div className="overflow-x-auto mt-2">
              <table className="w-full text-sm border border-gray-300 text-center">
                <thead className="bg-blue-100">
                  <tr>
                    <th className="border border-gray-300 p-2 text-left">Symptom</th>
                    <th className="border border-gray-300 p-2">None</th>
                    <th className="border border-gray-300 p-2">Bilateral</th>
                    <th className="border border-gray-300 p-2">Unilateral</th>
                  </tr>
                </thead>
                <tbody>
                  {autonomicRows.map(({ label, field }) => (
                    <tr key={field} className="even:bg-gray-50">
                      <td className="border border-gray-300 p-2 text-left">{label}</td>
                      {["None", "Bilateral", "Unilateral"].map((opt) => (
                        <td key={opt} className="border border-gray-300 p-2">
                          <input type="radio" name={field} value={opt}
                            checked={formData[field] === opt}
                            onChange={handleChange} />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FormSection>

          {/* Section 8 */}
          <FormSection>
            <SectionHeader title="SECTION 8 — Aura" />
            <FieldLabel bold>Aura present?</FieldLabel>
            <RadioGroup name="aura_present" value={formData.aura_present} onChange={handleChange}
              options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]} />
            <FieldLabel bold>Type of aura (if yes)</FieldLabel>
            <CheckboxGroup
              name="aura_type[]"
              options={["Visual", "Sensory", "Motor", "Speech/Language", "Brainstem features", "Retinal"]}
              values={formData.aura_type}
              onChange={(v, c) => handleCheckboxArray("aura_type", v, c)}
            />
          </FormSection>

          {/* Section 9 */}
          <FormSection>
            <SectionHeader title="SECTION 9 — Prodrome Symptoms" />
            <FieldLabel bold>Prodrome present?</FieldLabel>
            <RadioGroup name="prodrome_present" value={formData.prodrome_present} onChange={handleChange}
              options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]} />
            <FieldLabel bold>If yes, select symptoms</FieldLabel>
            <CheckboxGroup
              name="prodrome_symptoms[]"
              options={["Depression", "Yawning", "Irritability", "Increased urination", "Food cravings", "Thirst", "Cold extremities", "Bowel changes", "Difficulty concentrating", "Difficulty sleeping", "Fatigue", "Neck stiffness", "Memory issues", "Nausea"]}
              values={formData.prodrome_symptoms}
              onChange={(v, c) => handleCheckboxArray("prodrome_symptoms", v, c)}
            />
            <FieldLabel bold>Others (specify)</FieldLabel>
            <TextInput name="prodrome_other" value={formData.prodrome_other} onChange={handleChange} />
          </FormSection>

          {/* Section 10 */}
          <FormSection>
            <SectionHeader title="SECTION 10 — Postdrome Symptoms" />
            <FieldLabel bold>Select applicable postdrome symptoms</FieldLabel>
            <CheckboxGroup
              name="postdrome_symptoms[]"
              options={["Depression", "Fatigue", "Neck stiffness", "Difficulty concentrating", "Yawning", "Irritability", "Brain fog", "Increased urination", "Food cravings", "Thirst", "Cold extremities", "Bowel changes", "Difficulty sleeping", "Nausea"]}
              values={formData.postdrome_symptoms}
              onChange={(v, c) => handleCheckboxArray("postdrome_symptoms", v, c)}
            />
            <FieldLabel bold>Others (specify)</FieldLabel>
            <TextInput name="postdrome_other" value={formData.postdrome_other} onChange={handleChange} />
          </FormSection>

          {/* Section 11 */}
          <FormSection>
            <SectionHeader title="SECTION 11 — Triggers" />
            <FieldLabel bold>Known headache triggers</FieldLabel>
            <CheckboxGroup
              name="triggers[]"
              options={["Alcohol", "Food additives", "Caffeine", "Dehydration", "Depression", "Exercise", "Eye strain", "Fatigue", "Specific foods", "Bright light", "Sunlight", "Travel", "Menstruation", "Medication", "Loud noise", "Odours", "Sleep disturbance", "Skipped meals", "Stress", "Watching TV", "Weather changes", "None"]}
              values={formData.triggers}
              onChange={(v, c) => handleCheckboxArray("triggers", v, c)}
            />
            <FieldLabel bold>Others (specify)</FieldLabel>
            <TextInput name="triggers_other" value={formData.triggers_other} onChange={handleChange} />
          </FormSection>

          {/* Section 12 */}
          <FormSection>
            <SectionHeader title="SECTION 12 — Past Medical History" />
            <FieldLabel bold>Past medical history (tick all that apply)</FieldLabel>
            <CheckboxGroup
              name="past_medical_history[]"
              options={["Diabetes", "Hypertension", "Chronic systemic illness", "Thyroid disorders", "Psychiatric illness", "Head injury", "Head/neck surgery", "Previous headache diagnosis", "None"]}
              values={formData.past_medical_history}
              onChange={(v, c) => handleCheckboxArray("past_medical_history", v, c)}
            />
            <FieldLabel bold>Others (specify)</FieldLabel>
            <TextInput name="past_medical_history_other" value={formData.past_medical_history_other} onChange={handleChange} />
          </FormSection>

          {/* Section 13 */}
          <FormSection>
            <SectionHeader title="SECTION 13 — Personal & Family History" />

            <FieldLabel bold>Smoking status</FieldLabel>
            <RadioGroup name="smoking_status" value={formData.smoking_status} onChange={handleChange}
              options={["Current smoker", "Ex-smoker", "Never smoked"].map((v) => ({ label: v, value: v }))} />

            <FieldLabel bold>If smoked, pack years</FieldLabel>
            <TextInput name="smoking_pack_years" value={formData.smoking_pack_years} onChange={handleChange} />

            <FieldLabel bold>Alcohol intake</FieldLabel>
            <RadioGroup name="alcohol_intake" value={formData.alcohol_intake} onChange={handleChange}
              options={["Current", "Past", "Never"].map((v) => ({ label: v, value: v }))} />

            <FieldLabel bold>Tobacco use (other than smoking)</FieldLabel>
            <TextInput name="tobacco_use" value={formData.tobacco_use} onChange={handleChange} />

            <FieldLabel bold>Any substance use</FieldLabel>
            <TextInput name="substance_use" value={formData.substance_use} onChange={handleChange} />

            <FieldLabel bold>Family history of headaches</FieldLabel>
            <RadioGroup name="family_history_headache" value={formData.family_history_headache} onChange={handleChange}
              options={[{ label: "Yes", value: "Yes" }, { label: "No", value: "No" }]} />

            <FieldLabel bold>If yes, specify relationship</FieldLabel>
            <TextInput name="family_history_relationship" value={formData.family_history_relationship} onChange={handleChange} />
          </FormSection>

          {/* Section 14 */}
          <FormSection>
            <SectionHeader title="SECTION 14 — Red Flags" />
            <FieldLabel bold>Red flags present? (Tick all that apply)</FieldLabel>

            <p className="text-xs font-semibold text-gray-500 mt-3 mb-1 uppercase">Onset</p>
            <SingleCheckbox name="rf_onset_thunderclap" checked={formData.rf_onset_thunderclap} onChange={handleCheckboxBool} label='Sudden onset "thunderclap" headache' />
            <SingleCheckbox name="rf_onset_progressive" checked={formData.rf_onset_progressive} onChange={handleCheckboxBool} label="Subacute onset with progressive course" />
            <SingleCheckbox name="rf_onset_after_50" checked={formData.rf_onset_after_50} onChange={handleCheckboxBool} label="New headache after age 50" />
            <SingleCheckbox name="rf_onset_pregnancy" checked={formData.rf_onset_pregnancy} onChange={handleCheckboxBool} label="New onset headache during or just after pregnancy" />

            <p className="text-xs font-semibold text-gray-500 mt-3 mb-1 uppercase">Clinical characteristics</p>
            <SingleCheckbox name="rf_worst_headache" checked={formData.rf_worst_headache} onChange={handleCheckboxBool} label="Worst headache ever" />
            <SingleCheckbox name="rf_freq_increase" checked={formData.rf_freq_increase} onChange={handleCheckboxBool} label="Recent increase in frequency (>2× baseline in last 3 months)" />
            <SingleCheckbox name="rf_severity_increase" checked={formData.rf_severity_increase} onChange={handleCheckboxBool} label="Recent increase in severity (>5 on VAS compared to baseline)" />
            <SingleCheckbox name="rf_exertion_trigger" checked={formData.rf_exertion_trigger} onChange={handleCheckboxBool} label="Headache triggered only by exertion, coughing or Valsalva" />
            <SingleCheckbox name="rf_sexual_activity" checked={formData.rf_sexual_activity} onChange={handleCheckboxBool} label="Headache triggered by sexual activity" />

            <p className="text-xs font-semibold text-gray-500 mt-3 mb-1 uppercase">Associations</p>
            <SingleCheckbox name="rf_fever" checked={formData.rf_fever} onChange={handleCheckboxBool} label="Headache with fever" />
            <SingleCheckbox name="rf_seizure" checked={formData.rf_seizure} onChange={handleCheckboxBool} label="Headache with seizure" />
            <SingleCheckbox name="rf_neurological_deficit" checked={formData.rf_neurological_deficit} onChange={handleCheckboxBool} label="Neurological deficits" />
            <SingleCheckbox name="rf_neck_stiffness" checked={formData.rf_neck_stiffness} onChange={handleCheckboxBool} label="Neck stiffness" />
            <SingleCheckbox name="rf_post_trauma" checked={formData.rf_post_trauma} onChange={handleCheckboxBool} label="Headache after trauma" />
            <SingleCheckbox name="rf_prior_investigation" checked={formData.rf_prior_investigation} onChange={handleCheckboxBool} label="Previous investigation suggestive of causal pathology" />
            <SingleCheckbox name="rf_systemic_illness" checked={formData.rf_systemic_illness} onChange={handleCheckboxBool} label="Headache with known systemic illness (malignancy / renal / cardiac / hepatic)" />
            <SingleCheckbox name="rf_weight_gain" checked={formData.rf_weight_gain} onChange={handleCheckboxBool} label="Recent significant weight gain" />
            <SingleCheckbox name="rf_tinnitus_tvo" checked={formData.rf_tinnitus_tvo} onChange={handleCheckboxBool} label="Ringing tinnitus or transient visual obscurations (TVOs)" />
            <SingleCheckbox name="rf_none" checked={formData.rf_none} onChange={handleCheckboxBool} label="None" />
          </FormSection>

          {/* Section 15 */}
          <FormSection>
            <SectionHeader title="SECTION 15 — General Examination" />

            <FieldLabel bold>Blood pressure</FieldLabel>
            <TextInput name="blood_pressure" value={formData.blood_pressure} onChange={handleChange} placeholder="e.g. 120/80 mmHg" />

            <FieldLabel bold>Pulse rate</FieldLabel>
            <TextInput name="pulse_rate" value={formData.pulse_rate} onChange={handleChange} placeholder="beats per minute" />

            <FieldLabel bold>General survey findings</FieldLabel>
            <SingleCheckbox name="ge_pallor" checked={formData.ge_pallor} onChange={handleCheckboxBool} label="Pallor" />
            <SingleCheckbox name="ge_icterus" checked={formData.ge_icterus} onChange={handleCheckboxBool} label="Icterus" />
            <SingleCheckbox name="ge_cyanosis" checked={formData.ge_cyanosis} onChange={handleCheckboxBool} label="Cyanosis" />
            <SingleCheckbox name="ge_clubbing" checked={formData.ge_clubbing} onChange={handleCheckboxBool} label="Clubbing" />
            <SingleCheckbox name="ge_pedal_edema" checked={formData.ge_pedal_edema} onChange={handleCheckboxBool} label="Pedal edema" />
            <SingleCheckbox name="ge_lymphadenopathy" checked={formData.ge_lymphadenopathy} onChange={handleCheckboxBool} label="Lymph node enlargement" />
            <SingleCheckbox name="ge_raised_jvp" checked={formData.ge_raised_jvp} onChange={handleCheckboxBool} label="Raised JVP" />
            <SingleCheckbox name="ge_skin_markers" checked={formData.ge_skin_markers} onChange={handleCheckboxBool} label="Skin / neurocutaneous markers" />
            <SingleCheckbox name="ge_none" checked={formData.ge_none} onChange={handleCheckboxBool} label="None" />
          </FormSection>

          {/* Section 16 */}
          <FormSection>
            <SectionHeader title="SECTION 16 — Systemic Examination (Doctor Section)" />
            {(
              [
                ["cardiovascular_findings", "Cardiovascular findings"],
                ["respiratory_findings", "Respiratory findings"],
                ["gastrointestinal_findings", "Gastrointestinal findings"],
              ] as [keyof FormData, string][]
            ).map(([f, l]) => (
              <div key={f}>
                <FieldLabel>{l}</FieldLabel>
                <TextArea name={f} value={formData[f] as string} onChange={handleChange} />
              </div>
            ))}
            <p className="font-semibold text-sm mt-4 mb-1 text-gray-700">CNS Examination</p>
            {(
              [
                ["higher_mental_functions", "Higher mental functions"],
                ["cranial_nerve_examination", "Cranial nerve examination"],
                ["motor_system_examination", "Motor system examination"],
                ["sensory_system_examination", "Sensory system examination"],
                ["cerebellar_signs", "Cerebellar signs"],
                ["spine_cranium_examination", "Spine and cranium examination"],
                ["meningeal_signs", "Meningeal signs"],
                ["extrapyramidal_signs", "Extrapyramidal signs"],
                ["gait_assessment", "Gait assessment"],
              ] as [keyof FormData, string][]
            ).map(([f, l]) => (
              <div key={f}>
                <FieldLabel>{l}</FieldLabel>
                <TextArea name={f} value={formData[f] as string} onChange={handleChange} />
              </div>
            ))}
          </FormSection>

          {/* Section 17 — ICHD-3 Diagnosis */}
          <FormSection>
            <SectionHeader title="SECTION 17 — Overall Diagnostic Group Checklist (ICHD-3)" />

            {/* Part 1 — Primary */}
            <h4 className="font-bold text-sm text-gray-800 mt-3 mb-2">PART 1 — Primary Headaches</h4>

            <p className="text-xs font-semibold text-blue-700 mb-1">1. Migraine</p>
            {[
              "1.1 Migraine without aura",
              "1.2 Migraine with aura",
              "1.2.1 Migraine with typical aura",
              "1.2.2 Migraine with brainstem aura",
              "1.2.3 Hemiplegic migraine",
              "1.2.4 Retinal migraine",
              "1.3 Chronic Migraine",
              "1.4 Complications of Migraine",
              "1.4.1 Status Migrainosus",
              "1.4.2 Persistent aura without infarction",
              "1.4.3 Migrainous Infarction",
              "1.4.4 Migraine aura-triggered seizure",
              "1.5 Probable Migraine",
              "1.5.1 Probable Migraine without aura",
              "1.5.2 Probable Migraine with aura",
              "1.6 Episodic Syndromes associated with migraine",
              "1.6.1 Recurrent gastrointestinal disturbance",
              "1.6.2 Benign paroxysmal vertigo",
              "1.6.3 Benign paroxysmal torticollis",
            ].map((d) => (
              <label key={d} className="flex items-center gap-2 text-sm mt-1 cursor-pointer">
                <input type="checkbox" name="diagnosis[]" value={d}
                  checked={formData.diagnosis.includes(d)}
                  onChange={(e) => handleCheckboxArray("diagnosis", d, e.target.checked)} />
                {d}
              </label>
            ))}

            <p className="text-xs font-semibold text-blue-700 mt-3 mb-1">2. Tension-Type Headache</p>
            {[
              "2.1 Infrequent episodic tension-type headache",
              "2.2 Frequent episodic tension-type headache",
              "2.3 Chronic tension-type headache",
              "2.4 Probable tension-type headache",
            ].map((d) => (
              <label key={d} className="flex items-center gap-2 text-sm mt-1 cursor-pointer">
                <input type="checkbox" name="diagnosis[]" value={d}
                  checked={formData.diagnosis.includes(d)}
                  onChange={(e) => handleCheckboxArray("diagnosis", d, e.target.checked)} />
                {d}
              </label>
            ))}

            <p className="text-xs font-semibold text-blue-700 mt-3 mb-1">3. Trigeminal Autonomic Cephalalgias (TACs)</p>
            {[
              "3.1 Cluster Headache",
              "3.1.1 Episodic Cluster Headache",
              "3.1.2 Chronic Cluster Headache",
              "3.2 Paroxysmal Hemicrania",
              "3.2.1 Episodic Paroxysmal Hemicrania",
              "3.2.2 Chronic Paroxysmal Hemicrania",
              "3.3 Short-lasting unilateral neuralgiform headache attacks",
              "3.3.1 SUNCT",
              "3.3.1.1 Episodic SUNCT",
              "3.3.1.2 Chronic SUNCT",
              "3.3.2 SUNA",
              "3.3.2.1 Episodic SUNA",
              "3.3.2.2 Chronic SUNA",
              "3.4 Hemicrania continua",
              "3.4.1 Hemicrania continua, remitting subtype",
              "3.4.2 Hemicrania continua, unremitting subtype",
              "3.5 Probable trigeminal autonomic cephalalgia",
              "3.5.1 Probable cluster headache",
              "3.5.2 Probable paroxysmal hemicrania",
              "3.5.3 Probable short-lasting unilateral neuralgiform headache attacks",
              "3.5.4 Probable hemicrania continua",
            ].map((d) => (
              <label key={d} className="flex items-center gap-2 text-sm mt-1 cursor-pointer">
                <input type="checkbox" name="diagnosis[]" value={d}
                  checked={formData.diagnosis.includes(d)}
                  onChange={(e) => handleCheckboxArray("diagnosis", d, e.target.checked)} />
                {d}
              </label>
            ))}

            <p className="text-xs font-semibold text-blue-700 mt-3 mb-1">4. Other Primary Headache Disorders</p>
            {[
              "4.1 Primary cough headache",
              "4.2 Primary exercise headache",
              "4.3 Primary headache associated with sexual activity",
              "4.4 Primary thunderclap headache",
              "4.5 Cold-stimulus headache",
              "4.6 External-pressure headache",
              "4.7 Primary stabbing headache",
              "4.8 Nummular headache",
              "4.9 Hypnic headache",
              "4.10 New daily persistent headache (NDPH)",
            ].map((d) => (
              <label key={d} className="flex items-center gap-2 text-sm mt-1 cursor-pointer">
                <input type="checkbox" name="diagnosis[]" value={d}
                  checked={formData.diagnosis.includes(d)}
                  onChange={(e) => handleCheckboxArray("diagnosis", d, e.target.checked)} />
                {d}
              </label>
            ))}

            {/* Part 2 — Secondary */}
            <h4 className="font-bold text-sm text-gray-800 mt-5 mb-2">PART 2: Secondary Headaches</h4>
            {(
              [
                ["5 Headache attributed to trauma or injury to the head and/or neck", "specify_5"],
                ["6 Headache attributed to cranial and/or cervical vascular disorder", "specify_6"],
                ["7 Headache attributed to non-vascular intracranial disorder", "specify_7"],
                ["8 Headache attributed to a substance or its withdrawal", "specify_8"],
                ["9 Headache attributed to infection", "specify_9"],
                ["10 Headache attributed to disorder of homoeostasis", "specify_10"],
                ["11 Headache or facial pain attributed to disorder of facial or cervical structure", "specify_11"],
                ["12 Headache attributed to psychiatric disorder", "specify_12"],
              ] as [string, keyof FormData][]
            ).map(([d, specField]) => (
              <div key={d} className="mt-2">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" name="diagnosis[]" value={d}
                    checked={formData.diagnosis.includes(d)}
                    onChange={(e) => handleCheckboxArray("diagnosis", d, e.target.checked)} />
                  {d}
                </label>
                <TextInput name={specField} value={formData[specField] as string} onChange={handleChange} placeholder="Specify" />
              </div>
            ))}

            <FieldLabel>Comments:</FieldLabel>
            <TextArea name="comments" value={formData.comments} onChange={handleChange} rows={3} />

            {/* Part 3 */}
            <h4 className="font-bold text-sm text-gray-800 mt-5 mb-2">PART 3: Painful Cranial Neuropathies, Other Facial Pain and Other Headaches</h4>
            {[
              "13.1 Pain attributed to lesion of trigeminal nerve",
              "13.1.1 Trigeminal neuralgia",
              "13.1.1.1 Classical trigeminal neuralgia",
              "13.1.1.2 Secondary trigeminal neuralgia",
              "13.1.1.3 Idiopathic trigeminal neuralgia",
              "13.1.2 Painful trigeminal neuropathy",
              "13.2 Glossopharyngeal nerve pain",
              "13.3 Nervus intermedius pain",
              "13.4 Occipital neuralgia",
              "13.5 Neck-tongue syndrome",
              "13.6 Painful optic neuritis",
              "13.7 Ischaemic ocular motor nerve palsy",
              "13.8 Tolosa-Hunt syndrome",
              "13.9 Raeder syndrome",
              "13.10 Recurrent painful ophthalmoplegic neuropathy",
              "13.11 Burning mouth syndrome",
              "13.12 Persistent idiopathic facial pain",
              "13.13 Central neuropathic pain",
              "14 Other headache disorders",
              "14.1 Headache not elsewhere classified",
              "14.2 Headache unspecified",
            ].map((d) => (
              <label key={d} className="flex items-center gap-2 text-sm mt-1 cursor-pointer">
                <input type="checkbox" name="diagnosis[]" value={d}
                  checked={formData.diagnosis.includes(d)}
                  onChange={(e) => handleCheckboxArray("diagnosis", d, e.target.checked)} />
                {d}
              </label>
            ))}

            <FieldLabel>Appendix Diagnostic Criteria - Specify:</FieldLabel>
            <TextArea name="appendix_specify" value={formData.appendix_specify} onChange={handleChange} rows={3} />
          </FormSection>
        </SuperSection>

        {/* ═══════════════════════════════════════════════════════
            SUPER SECTION — Scales
        ════════════════════════════════════════════════════════ */}
        <SuperSection title="Scales">
          {(
            [
              ["hit6_score", "HIT-6 (Headache Impact Test)"],
              ["midas_score", "MIDAS (Migraine Disability Assessment)"],
              ["phq9_score", "PHQ-9 (Depression Scale)"],
              ["gad7_score", "GAD-7 (Anxiety Scale)"],
              ["msqol_score", "MSQOL (Migraine Specific Quality of Life)"],
            ] as [keyof FormData, string][]
          ).map(([field, title]) => (
            <FormSection key={field}>
              <SectionHeader title={title} />
              <TextInput name={field} value={formData[field] as string} onChange={handleChange} placeholder="Score" />
            </FormSection>
          ))}
        </SuperSection>

        {/* ═══════════════════════════════════════════════════════
            SUPER SECTION — Investigations
        ════════════════════════════════════════════════════════ */}
        <SuperSection title="Investigations">
          <FormSection>
            <SectionHeader title="SECTION 19 — Investigations" />
            <CheckboxGroup
              name="investigations[]"
              options={[
                "CBC", "ESR", "LFT", "RFT", "ANA", "Electrolytes", "Vasculitis Profile",
                "Vitamin B12", "Folate", "HbA1c", "ENA", "HIV", "HBsAg", "HCV", "FBS", "PPBS",
                "ECG", "CT Brain", "CT Angiogram Head & Neck", "MR Brain", "MR Angiogram", "CRP",
                "CSF opening pressure", "CSF Cells", "CSF Sugar", "CSF Protein", "CSF other tests",
                "X-ray Cervical spine", "Thyroid Panel (TSH/FT3/FT4)",
                "Eye Evaluation (VA/VF/IOP/OCT/RNFL/GCIPL)",
                "Lipid Profile (TC/HDL/LDL/VLDL/TG)", "Other",
              ]}
              values={formData.investigations}
              onChange={(v, c) => handleCheckboxArray("investigations", v, c)}
            />
            <FieldLabel>If Other, specify</FieldLabel>
            <TextInput name="investigations_other" value={formData.investigations_other} onChange={handleChange} placeholder="Specify" />
          </FormSection>
        </SuperSection>

        {/* ═══════════════════════════════════════════════════════
            SUPER SECTION — Provisional Diagnosis
        ════════════════════════════════════════════════════════ */}
        <SuperSection title="Provisional Diagnosis">
          <FormSection>
            <SectionHeader title="SECTION 21 — Provisional Diagnosis" />
            <RadioGroup
              name="provisional_diagnosis"
              value={formData.provisional_diagnosis}
              onChange={handleChange}
              options={[
                "Migraine", "Tension-type headache", "Cluster / TACs",
                "Neuralgia", "Secondary headache", "Orofacial pain", "Uncertain",
              ].map((v) => ({ label: v, value: v }))}
            />
            <FieldLabel>Specific subtype</FieldLabel>
            <TextInput name="specific_subtype" value={formData.specific_subtype} onChange={handleChange} />
          </FormSection>
        </SuperSection>

        {/* ═══════════════════════════════════════════════════════
            SUPER SECTION — Treatment Plan
        ════════════════════════════════════════════════════════ */}
        <SuperSection title="Treatment Plan">
          <FormSection>
            <SectionHeader title="SECTION 20 — Medication" />

            {/* Acute */}
            <h3 className="font-bold text-sm text-gray-800 mt-2 mb-2">Acute Medications</h3>
            <FieldLabel>Drug Group</FieldLabel>
            <TextInput name="acute_drug_group" value={formData.acute_drug_group} onChange={handleChange} />
            <FieldLabel>Drug Name + Route</FieldLabel>
            <TextInput name="acute_drug_name_route" value={formData.acute_drug_name_route} onChange={handleChange} />
            <FieldLabel>Time Since Started</FieldLabel>
            <TextInput name="acute_time_started" value={formData.acute_time_started} onChange={handleChange} />
            <FieldLabel>Starting Dose</FieldLabel>
            <TextInput name="acute_starting_dose" value={formData.acute_starting_dose} onChange={handleChange} />
            <FieldLabel>Final Dose</FieldLabel>
            <TextInput name="acute_final_dose" value={formData.acute_final_dose} onChange={handleChange} />
            <FieldLabel>Adverse Effects</FieldLabel>
            <TextArea name="acute_adverse_effects" value={formData.acute_adverse_effects} onChange={handleChange} rows={2} />
            <FieldLabel>Tolerance Issues</FieldLabel>
            <TextArea name="acute_tolerance" value={formData.acute_tolerance} onChange={handleChange} rows={2} />
            <FieldLabel>Number of Days Used per Month</FieldLabel>
            <TextInput type="number" name="acute_days_per_month" value={formData.acute_days_per_month} onChange={handleChange} />
            <FieldLabel>Effectiveness</FieldLabel>
            <select name="acute_effectiveness" value={formData.acute_effectiveness} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">Select</option>
              {["Very Effective", "Moderately Effective", "Mildly Effective", "Not Effective"].map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>

            <hr className="my-4" />

            {/* Preventive */}
            <h3 className="font-bold text-sm text-gray-800 mt-2 mb-2">Preventive Medications</h3>
            <FieldLabel>Drug Group</FieldLabel>
            <TextInput name="preventive_drug_group" value={formData.preventive_drug_group} onChange={handleChange} />
            <FieldLabel>Drug Name + Route</FieldLabel>
            <TextInput name="preventive_drug_name_route" value={formData.preventive_drug_name_route} onChange={handleChange} />
            <FieldLabel>Time Since Started</FieldLabel>
            <TextInput name="preventive_time_started" value={formData.preventive_time_started} onChange={handleChange} />
            <FieldLabel>Starting Dose</FieldLabel>
            <TextInput name="preventive_starting_dose" value={formData.preventive_starting_dose} onChange={handleChange} />
            <FieldLabel>Final Dose</FieldLabel>
            <TextInput name="preventive_final_dose" value={formData.preventive_final_dose} onChange={handleChange} />
            <FieldLabel>Adverse Effects</FieldLabel>
            <TextArea name="preventive_adverse_effects" value={formData.preventive_adverse_effects} onChange={handleChange} rows={2} />
            <FieldLabel>Tolerance Issues</FieldLabel>
            <TextArea name="preventive_tolerance" value={formData.preventive_tolerance} onChange={handleChange} rows={2} />
            <FieldLabel>Number of Days Used per Month</FieldLabel>
            <TextInput type="number" name="preventive_days_per_month" value={formData.preventive_days_per_month} onChange={handleChange} />
            <FieldLabel>Effectiveness</FieldLabel>
            <select name="preventive_effectiveness" value={formData.preventive_effectiveness} onChange={handleChange}
              className="w-full border border-gray-300 rounded px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400">
              <option value="">Select</option>
              {["Very Effective", "Moderately Effective", "Mildly Effective", "Not Effective"].map((o) => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>

            <hr className="my-4" />

            <h3 className="font-bold text-sm text-gray-800 mt-2 mb-2">Devices / Nerve Blocks / Botox</h3>
            <TextArea name="devices_nerve_blocks_botox" value={formData.devices_nerve_blocks_botox} onChange={handleChange}
              rows={4} placeholder="Describe device therapy, nerve blocks, Botox details..." />
          </FormSection>

          <FormSection>
            <SectionHeader title="SECTION 22 — Treatment Plan" />
            <FieldLabel>Acute medicines prescribed</FieldLabel>
            <TextArea name="acute_medicines_prescribed" value={formData.acute_medicines_prescribed} onChange={handleChange} rows={3} />
            <FieldLabel>Preventive medicines prescribed</FieldLabel>
            <TextArea name="preventive_medicines_prescribed" value={formData.preventive_medicines_prescribed} onChange={handleChange} rows={3} />
            <FieldLabel>Non-pharmacologic recommendations</FieldLabel>
            <TextArea name="non_pharmacologic_recommendations" value={formData.non_pharmacologic_recommendations} onChange={handleChange} rows={3} />
            <FieldLabel>Investigations recommended</FieldLabel>
            <TextArea name="investigations_recommended" value={formData.investigations_recommended} onChange={handleChange} rows={3} />
          </FormSection>
        </SuperSection>

        {/* ═══════════════════════════════════════════════════════
            SUPER SECTION — Follow-up & Patient Instructions
        ════════════════════════════════════════════════════════ */}
        <SuperSection title="Follow-up & Patient Instructions">
          <FormSection>
            <SectionHeader title="SECTION 23 — Patient Instructions" />
            <TextArea name="patient_instructions" value={formData.patient_instructions} onChange={handleChange} rows={4} />
          </FormSection>
        </SuperSection>

        {/* Submit */}
        <div className="text-center mt-8 mb-12 space-y-3">
          <div className="flex justify-center gap-3">
            {!submitted ? (
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-700 hover:bg-blue-800 disabled:opacity-50 text-white font-semibold px-10 py-3 rounded-lg shadow transition"
              >
                {isLoading ? "Saving…" : editingId ? "Update Patient" : "Submit Form"}
              </button>
            ) : (
              <button type="button" onClick={handleNewForm}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-10 py-3 rounded-lg shadow transition">
                New Form
              </button>
            )}
            {/* Always show a "New Form" escape hatch while editing, even before submit */}
            {editingId && !submitted && (
              <button type="button" onClick={handleNewForm}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg shadow transition">
                Cancel
              </button>
            )}
          </div>
          {statusMsg && (
            <p className={`font-medium text-sm ${statusMsg.startsWith("Error") || statusMsg.startsWith("Patient not found") || statusMsg.startsWith("A network") ? "text-red-600" : "text-green-700"}`}>
              {statusMsg}
            </p>
          )}
        </div>

      </form>
    </div>
  );
}

// ─── Default export with Suspense (required for useSearchParams) ──────────────

export default function HeadacheRegistryForm() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
        Loading form…
      </div>
    }>
      <HeadacheRegistryFormContent />
    </Suspense>
  );
}