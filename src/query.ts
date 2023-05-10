/**
 * Handles conversion of patient bundle data to a proper request for matching service apis.
 * Retrieves api response as promise to be used in conversion to fhir ResearchStudy
 */
import https from "https";
import { IncomingMessage } from "http";
import { Bundle } from 'fhir/r4';
import {
  ClinicalTrialsGovService,
  ServiceConfiguration,
  ResearchStudy,
  SearchSet,
} from "clinical-trial-matching-service";
import convertToResearchStudy from "./researchstudy-mapping";
import * as mcode from './mcode';

export interface QueryConfiguration extends ServiceConfiguration {
  endpoint?: string;
  auth_token?: string;
}

/**
 * Create a new matching function using the given configuration.
 *
 * @param configuration the configuration to use to configure the matcher
 * @param ctgService an optional ClinicalTrialsGovService which can be used to
 *     update the returned trials with additional information pulled from
 *     ClinicalTrials.gov
 */
export function createClinicalTrialLookup(
  configuration: QueryConfiguration,
  ctgService?: ClinicalTrialsGovService
): (patientBundle: Bundle) => Promise<SearchSet> {
  // Raise errors on missing configuration
  if (typeof configuration.endpoint !== "string") {
    throw new Error("Missing endpoint in configuration");
  }
  if (typeof configuration.auth_token !== "string") {
    throw new Error("Missing auth_token in configuration");
  }
  const endpoint = configuration.endpoint;
  const bearerToken = configuration.auth_token;
  return function getMatchingClinicalTrials(
    patientBundle: Bundle
  ): Promise<SearchSet> {
    // Create the query based on the patient bundle:
    const query = new APIQuery(patientBundle);
    // And send the query to the server - For now, the full patient bundle is the query
    return sendQuery(endpoint, query, bearerToken, ctgService);
  };
}

export default createClinicalTrialLookup;

// Generic type for the request data being sent to the server. Fill this out
// with a more complete type.
type QueryRequest = string;

/**
 * Generic type for the trials returned.
 */
export interface QueryTrial extends Record<string, unknown> {
  main_objectives: string[];
  treatment_administration_type: string[];
  nct_number: string;
  title: string;
  first_submitted: string;
  locations?: string;
  url: string;
  phases: string;
  enrollment: number;
  study_type: string;
  control_type: string;
  contact_name?: string;
  conatct_phone?: string;
  contact_email?: string;
  brief_summary: string;
  groups: string[];
  countries: string[];
  states: string[];
  cities: string[];
  closest_facility: TJFacility;
}

export interface TJFacility extends Record<string, string | number> {
  facility_name: string;
  facility_status: string;
  facility_country: string;
  facility_state: string;
  facility_city: string;
  facility_zip: string;
  lat: string;
  lng: string;
  formatted_address: string;
}

/**
 * Type guard to determine if an object is a valid QueryTrial.
 * @param o the object to determine if it is a QueryTrial
 */
export function isQueryTrial(o: unknown): o is QueryTrial {
  if (typeof o !== "object" || o === null) return false;
  const trial = o as QueryTrial;
  return (typeof trial.nct_number === "string" &&
      typeof trial.title === "string" &&
      typeof trial.first_submitted === "string" &&
      (!trial.location || typeof trial.locations === "string") &&
      typeof trial.url === "string" &&
      (typeof trial.phases === "string" || trial.phases === null )&&
      typeof trial.enrollment === "number" &&
      typeof trial.study_type === "string" &&
      (typeof trial.control_type === "string" || trial.control_type === null) &&
      (!trial.contact_name ||  typeof trial.contact_name === "string") &&
      (!trial.conatct_phone || typeof trial.conatct_phone === "string") &&
      (!trial.contact_email || typeof trial.contact_email === "string") &&
      typeof trial.brief_summary === "string" &&
      typeof trial.closest_facility === "object" &&
      Array.isArray(trial.main_objectives) &&
      Array.isArray(trial.treatment_administration_type) &&
      Array.isArray(trial.groups) &&
      Array.isArray(trial.countries) &&
      Array.isArray(trial.states) &&
      Array.isArray(trial.cities)
    );
}

// Generic type for the response data being received from the server.
export interface QueryResponse extends Record<string, unknown> {
  trials: QueryTrial[];
}

/**
 * Type guard to determine if an object is a valid QueryResponse.
 * @param o the object to determine if it is a QueryResponse
 */
export function isQueryResponse(o: unknown): o is QueryResponse {
  if (typeof o !== "object" || o === null) return false;

  // Note that the following DOES NOT check the array to make sure every object
  // within it is valid. Currently this is done later in the process. This
  // makes this type guard or the QueryResponse type sort of invalid. However,
  // the assumption is that a single unparsable trial should not cause the
  // entire response to be thrown away.
  return Array.isArray((o as QueryResponse).trials);
}

export interface QueryErrorResponse extends Record<string, unknown> {
  error: string;
}

/**
 * Type guard to determine if an object is a QueryErrorResponse.
 * @param o the object to determine if it is a QueryErrorResponse
 */
export function isQueryErrorResponse(o: unknown): o is QueryErrorResponse {
  if (typeof o !== "object" || o === null) return false;
  return typeof (o as QueryErrorResponse).error === "string";
}

// Generic type that represents a JSON object - that is, an object parsed from
// JSON. Note that the return value from JSON.parse is an any, this does not
// represent that.
type JsonObject = Record<string, unknown>;

// API RESPONSE SECTION
export class APIError extends Error {
  constructor(
    message: string,
    public result: IncomingMessage,
    public body: string
  ) {
    super(message);
  }
}

/**
 * This class represents a query, built based on values from within the patient
 * bundle.
 */
export class APIQuery {
  // The following example fields are defined by default within the matching UI
  /**
   * US zip code
   */
  zipCode: string;
  /**
   * Distance in miles a user has indicated they're willing to travel
   */
  travelRadius: number;
  /**
   * A FHIR ResearchStudy phase
   */
  phase: string;
  /**
   * A FHIR ResearchStudy status
   */
  recruitmentStatus: string;
  // Additional fields which need to be extracted from the bundle to construct query
  biomarkers: string[];
  stage: string;
  cancerType: string;
  cancerSubType: string;
  ecog: number;
  karnofsky: number;
  medications: string[];
  radiationProcedures: string[];
  surgicalProcedures: string[];
  metastasis: string[];
  age: number;
  /**
   * Create a new query object.
   * @param patientBundle the patient bundle to use for field values
   */
  constructor(patientBundle: Bundle) { // this goes through the patient bundle twice - should be revised

    for (const entry of patientBundle.entry) {
      if (!("resource" in entry)) {
        // Skip bad entries
        continue;
      }
      const resource = entry.resource;
      // Pull out search parameters
      if (resource.resourceType === "Parameters") {
        for (const parameter of resource.parameter) {
          if (parameter.name === "zipCode") {
            this.zipCode = parameter.valueString;
          } else if (parameter.name === "travelRadius") {
            this.travelRadius = parseFloat(parameter.valueString);
          } else if (parameter.name === "phase") {
            this.phase = parameter.valueString;
          } else if (parameter.name === "recruitmentStatus") {
            this.recruitmentStatus = parameter.valueString;
          }
        }
      }
    }

    const extractedMCODE = new mcode.ExtractedMCODE(patientBundle);
    console.log(extractedMCODE);
    this.biomarkers = extractedMCODE.getTumorMarkerValue();
    this.stage = extractedMCODE.getStageValues();
    this.cancerType = extractedMCODE.getPrimaryCancerValue();
    this.cancerSubType = extractedMCODE.getHistologyMorphologyValue();
    this.ecog = extractedMCODE.getECOGScore();
    this.karnofsky = extractedMCODE.getKarnofskyScore();
    this.medications = extractedMCODE.getMedicationStatementValues();
    this.radiationProcedures = extractedMCODE.getRadiationProcedureValue();
    this.surgicalProcedures = extractedMCODE.getSurgicalProcedureValue();
    this.metastasis = extractedMCODE.getSecondaryCancerValue();
    this.age = extractedMCODE.getAgeValue();
  }

  /**
   * Create the information sent to the server.
   * @return {string} the api query
   */
  toQuery(): QueryRequest {
    return JSON.stringify({
      zip: this.zipCode,
      distance: this.travelRadius,
      phase: this.phase,
      status: this.recruitmentStatus,
      biomarkers: this.biomarkers,
      stage: this.stage,
      cancerType: this.cancerType,
      cancerSubType: this.cancerSubType,
      ecog: this.ecog,
      karnofsky: this.karnofsky,
      medications: this.medications,
      procedures: this.radiationProcedures.concat(this.surgicalProcedures),
      metastasis: this.metastasis,
      age: this.age
    });
  }

  tostring(): string {
    console.log(this.toQuery());
    // Note that if toQuery is no longer a string, this will no longer work
    return this.toQuery();
  }
}

/**
 * Convert a query response into a search set.
 *
 * @param response the response object
 * @param ctgService an optional ClinicalTrialsGovService which can be used to
 *     update the returned trials with additional information pulled from
 *     ClinicalTrials.gov
 */
export function convertResponseToSearchSet(
  response: QueryResponse,
  ctgService?: ClinicalTrialsGovService
): Promise<SearchSet> {
  // Our final response
  const studies: ResearchStudy[] = [];
  // For generating IDs
  let id = 0;
  for (const trial of response.trials) {
    if (isQueryTrial(trial)) {
      studies.push(convertToResearchStudy(trial, id++));
    } else {
      // This trial could not be understood. It can be ignored if that should
      // happen or raised/logged as an error.
      console.error("Unable to parse trial from server: %o", trial);
    }
  }
  if (ctgService) {
    // If given a backup service, use it
    return ctgService.updateResearchStudies(studies).then(() => {
      const ss = new SearchSet();
      for (const study of studies) {
        // If returned from TrialJectory, then the study has a match likelihood of 1
        ss.addEntry(study, 1);
      }
      return ss;
    });
  } else {
    // Otherwise, resolve immediately
    const ss = new SearchSet();
    for (const study of studies) {
      // If returned from TrialJectory, then the study has a match likelihood of 1
      ss.addEntry(study, 1);
    }
    return Promise.resolve(ss);
  }
}

/**
 * Helper function to handle actually sending the query.
 *
 * @param endpoint the URL of the end point to send the query to
 * @param query the query to send
 * @param bearerToken the bearer token to send along with the query to
 *     authenticate with the service
 * @param ctgService an optional ClinicalTrialsGovService which can be used to
 *     update the returned trials with additional information pulled from
 *     ClinicalTrials.gov
 */
function sendQuery(
  endpoint: string,
  query: APIQuery,
  bearerToken: string,
  ctgService?: ClinicalTrialsGovService
): Promise<SearchSet> {
  return new Promise((resolve, reject) => {
    const body = Buffer.from(query.toQuery(), "utf8"); //query.toQuery()
    console.log("QUERY");
    console.log(query.toQuery());

    const request = https.request(
      endpoint,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Content-Length": body.byteLength.toString(),
          "User-Agent": "Clinical-Trial-Matching-Wrapper",
        },
      },
      (result) => {
        let responseBody = "";
        result.on("data", (chunk) => {
          responseBody += chunk;
        });
        result.on("end", () => {
          console.log("Complete");
          if (result.statusCode === 200) {
            let json: unknown;
            try {
              json = JSON.parse(responseBody) as unknown;
            } catch (ex) {
              reject(
                new APIError(
                  "Unable to parse response as JSON",
                  result,
                  responseBody
                )
              );
            }
            if (isQueryResponse(json)) {
              resolve(convertResponseToSearchSet(json, ctgService));
            } else if (isQueryErrorResponse(json)) {
              reject(
                new APIError(
                  `Error from service: ${json.error}`,
                  result,
                  responseBody
                )
              );
            } else {
              reject(new Error("Unable to parse response from server"));
            }
          } else {
            reject(
              new APIError(
                `Server returned ${result.statusCode} ${result.statusMessage}`,
                result,
                responseBody
              )
            );
          }
        });
      }
    );

    request.on("error", (error) => reject(error));

    request.write(body);
    request.end();
  });
}
