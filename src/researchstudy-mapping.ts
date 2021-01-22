/**
 * This module exports a function for mapping a trial in the format returned by
 * the underlying service to the FHIR ResearchStudy type.
 */

import { fhir, ResearchStudy } from 'clinical-trial-matching-service';
import { QueryTrial, TJFacility } from './query';

export const phaseCodeMap = new Map<string, string>([
  // this mapping needs to be verified
  ["N/A", "n-a"],
  ["Early Phase 1", "early-phase-1"],
  ["Phase 1", "phase-1"],
  ["Phase 1/Phase 2", "phase-1-phase-2"],
  ["Phase 2", "phase-2"],
  ["Phase 2/Phase 3", "phase-2-phase-3"],
  ["Phase 3", "phase-3"],
  ["Phase 4", "phase-4"],
]);

function convertArrayToCodeableConcept(trialStringArray: string[]): fhir.CodeableConcept[] {
  const fhirStringArray: fhir.CodeableConcept[] = [];
  for (const trialString of trialStringArray) {
    fhirStringArray.push({ text: trialString });
  }
  return fhirStringArray;
}

function convertArrayToObjective(trialStringArray: string[]): fhir.Objective[] {
  const fhirObjectiveArray: fhir.Objective[] = [];
  for (const trialString of trialStringArray) {
    fhirObjectiveArray.push({ name: trialString });
  }
  return fhirObjectiveArray;
}

export function convertToResearchStudy(trial: QueryTrial, id: number): ResearchStudy {
  const result = new ResearchStudy(id);
  result.status = 'active'; // default

  if (trial.title) {
    result.title = trial.title;
  }

  if(trial.nct_number) {
    result.identifier = [{ use: 'official', system: 'http://clinicaltrials.gov', value: trial.nct_number }];
  }

  if (trial.phases) { // Needs mapping verified
    result.phase = {
      coding: [
        {
          system: 'http://terminology.hl7.org/CodeSystem/research-study-phase',
          code: phaseCodeMap.get(trial.phases),
          display: trial.phases
        }
      ],
      text: trial.phases
    };
  }

  if (trial.contactName) {
    result.addContact(trial.contact_name, trial.contact_phone, trial.contact_email);
  }

  if (trial.countries) {
    const countries = convertArrayToCodeableConcept(trial.countries);
    if (countries.length > 0) result.location = countries;
  }

  if (trial.brief_summary) {
    result.description = trial.brief_summary;
  }

  if (trial.main_objectives) {
    const objectives = convertArrayToObjective(trial.main_objectives);
    if (objectives.length > 0) result.objective = objectives;
  }

  if (trial.groups) {
    const keywords = convertArrayToCodeableConcept(trial.groups);
    if (keywords.length > 0) result.keyword = keywords;
  }

  if (trial.study_type) {
    result.category = [{ text: trial.study_type }];
  }

  if (trial.closest_facility) {
    const site : TJFacility = trial.closest_facility;
    const location = result.addSite(site.facility_name);
    if (site.lat && site.lng) {
      location.position = { latitude: parseFloat(site.lat), longitude: parseFloat(site.lng) };
    }
    if (site.facility_zip) {
      // Populate just enough of the address in the location
      location.address = { use: 'work', postalCode: site.facility_zip };
    }
  }

  return result;
}

export default convertToResearchStudy;
