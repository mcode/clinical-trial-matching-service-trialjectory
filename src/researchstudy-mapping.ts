/**
 * This module exports a function for mapping a trial in the format returned by
 * the underlying service to the FHIR ResearchStudy type.
 */

import { ResearchStudy } from 'clinical-trial-matching-service';
import * as fhir from 'fhir/r4';
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

function convertArrayToCodeableConcept(trialstringArray: string[]): fhir.CodeableConcept[] {
  const fhirstringArray: fhir.CodeableConcept[] = [];
  for (const trialstring of trialstringArray) {
    fhirstringArray.push({ text: trialstring });
  }
  return fhirstringArray;
}

function convertArrayToObjective(trialstringArray: string[]): fhir.ResearchStudyObjective[] {
  const fhirObjectiveArray: fhir.ResearchStudyObjective[] = [];
  for (const trialstring of trialstringArray) {
    fhirObjectiveArray.push({ name: trialstring });
  }
  return fhirObjectiveArray;
}

export function convertToResearchStudy(trial: QueryTrial, id: number): ResearchStudy {
  //console.log(JSON.stringify(trial));
  const result = new ResearchStudy(id);
  result.status = 'active'; // default

  if (trial.title) {
    result.title = trial.title;
  }

  if(trial.nct_number) {
    result.identifier = [{ use: 'official', system: 'http://clinicaltrials.gov', value: trial.nct_number }];
    result.id = trial.nct_number;
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

  if (trial.contact_name) {
    result.addContact(trial.contact_name, trial.conatct_phone, trial.contact_email);
  }

  if (trial.countries) {
    const countries = convertArrayToCodeableConcept(trial.countries);
    if (countries.length > 0) result.location = countries;
  }

  if (trial.brief_summary) {
    result.description = trial.brief_summary.split("    ").join('\n');
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
    if (site.facility_name) {
      const location = result.addSite(site.facility_name);
      if (site.lat && site.lng) {
        location.position = { latitude: parseFloat(site.lat), longitude: parseFloat(site.lng) };
      }
      if (site.facility_zip) {
        // Populate just enough of the address in the location
        location.address = { use: 'work', postalCode: site.facility_zip };
      }
    }
  }

  return result;
}

export default convertToResearchStudy;
