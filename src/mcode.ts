import { fhirclient } from 'fhirclient/lib/types';
import * as fhirpath from 'fhirpath';
import { fhir } from 'clinical-trial-matching-service';
import { CodeMapper, CodeSystemEnum } from './codeMapper';
import profile_system_codes from '../data/profile-system-codes.json';
import system_metastasis_codes_json from '../data/system-metastasis-codes-json.json';

const metastasis_codes = system_metastasis_codes_json as {[key:string]: {[key:string]: string}};

export type FHIRPath = string;

export interface Coding {
  system?: string;
  code?: string;
  display?: string;
}

export interface ReasonReference {
  reference?: string;
  display?: string;
  reference_meta_profile?: string;
}

export interface Quantity {
  value?: number | string;
  comparator?: string;
  unit?: string;
  system?: string;
  code?: string;
}

export interface Ratio {
  numerator?: Quantity;
  denominator?: Quantity;
}

export interface BaseFhirResource {
  coding?: Coding[];
}

export interface CancerConditionParent extends BaseFhirResource {
  clinicalStatus?: Coding[];
  meta_profile?: string;
  full_url?: string;
}

export interface PrimaryCancerCondition extends CancerConditionParent {
  histologyMorphologyBehavior?: Coding[];
}

export interface SecondaryCancerCondition extends CancerConditionParent {
  bodySite?: Coding[];
}

export interface CancerRelatedProcedureParent extends BaseFhirResource {
  bodySite?: Coding[];
}

export interface CancerRelatedRadiationProcedure extends CancerRelatedProcedureParent {
  mcodeTreatmentIntent?: Coding[];
}

export interface CancerRelatedSurgicalProcedure extends CancerRelatedProcedureParent {
  reasonReference?: ReasonReference;
}

export interface TumorMarker extends BaseFhirResource {
  valueQuantity?: Quantity[];
  valueRatio?: Ratio[];
  valueCodeableConcept?: Coding[];
  interpretation?: Coding[];
}

export interface CancerGeneticVariant extends BaseFhirResource {
  component?: CancerGeneticVariantComponent;
  valueCodeableConcept?: Coding[];
  interpretation?: Coding[];
}

export interface CancerGeneticVariantComponent {
  geneStudied?: CancerGeneticVariantComponentType[];
  genomicsSourceClass?: CancerGeneticVariantComponentType[];
}

export interface CancerGeneticVariantComponentType {
  code?: { coding: Coding[] };
  valueCodeableConcept?: { coding: Coding[] };
  interpretation?: { coding: Coding[] };
}

/**
 * Class that describes and maps the extracted mCODE data from a patient record.
 */
export class ExtractedMCODE {
  primaryCancerCondition: PrimaryCancerCondition[];
  TNMClinicalStageGroup: Coding[];
  TNMPathologicalStageGroup: Coding[];
  secondaryCancerCondition: SecondaryCancerCondition[];
  birthDate: string;
  tumorMarker: TumorMarker[];
  cancerGeneticVariant: CancerGeneticVariant[];
  cancerRelatedRadiationProcedure: CancerRelatedRadiationProcedure[];
  cancerRelatedSurgicalProcedure: CancerRelatedSurgicalProcedure[];
  cancerRelatedMedicationStatement: Coding[];
  ecogPerformaceStatus: number;
  karnofskyPerformanceStatus: number;

  /**
   * The code mapping object that maps profiles to codes.
   */
  static code_mapper = new CodeMapper(profile_system_codes)

  /**
   * Constructor.
   * @param patientBundle The patient bundle to build the mCODE mapping from.
   */
  constructor(patientBundle: fhir.Bundle) {

    if (patientBundle != null) {
      for (const entry of patientBundle.entry) {
        if (!('resource' in entry)) {
          // Skip bad entries
          continue;
        }
        const resource = entry.resource;

        if (
          resource.resourceType === 'Condition' &&
          this.resourceProfile(this.lookup(resource, 'meta.profile'), 'mcode-primary-cancer-condition')
        ) {
          const tempPrimaryCancerCondition: PrimaryCancerCondition = {};
          tempPrimaryCancerCondition.coding = this.lookup(resource, 'code.coding') as Coding[];
          tempPrimaryCancerCondition.clinicalStatus = this.lookup(resource, 'clinicalStatus.coding') as Coding[];
          tempPrimaryCancerCondition.meta_profile = 'mcode-primary-cancer-condition'
          if (this.lookup(resource, 'extension').length !== 0) {
            let count = 0;
            for (const extension of this.lookup(resource, 'extension')) {
              if (
                (this.lookup(resource, `extension[${count}].url`)[0] as string).includes(
                  'mcode-histology-morphology-behavior'
                )
              ) {
                tempPrimaryCancerCondition.histologyMorphologyBehavior = this.lookup(
                  resource,
                  `extension[${count}].valueCodeableConcept.coding`
                ) as Coding[];
              }
              count++;
            }
          }
          if (!tempPrimaryCancerCondition.histologyMorphologyBehavior) {
            tempPrimaryCancerCondition.histologyMorphologyBehavior = [] as Coding[];
          }

          if (this.primaryCancerCondition) {
            this.primaryCancerCondition.push(tempPrimaryCancerCondition);
          } else {
            this.primaryCancerCondition = [tempPrimaryCancerCondition];
          }
        }

        if (
          resource.resourceType === 'Observation' &&
          this.resourceProfile(this.lookup(resource, 'meta.profile'), 'mcode-tnm-clinical-stage-group')
        ) {
          this.TNMClinicalStageGroup = this.addCoding(
            this.TNMClinicalStageGroup,
            this.lookup(resource, 'valueCodeableConcept.coding') as Coding[]
          );
        }

        if (
          resource.resourceType === 'Observation' &&
          this.resourceProfile(this.lookup(resource, 'meta.profile'), 'mcode-tnm-pathological-stage-group')
        ) {
          this.TNMPathologicalStageGroup = this.addCoding(
            this.TNMPathologicalStageGroup,
            this.lookup(resource, 'valueCodeableConcept.coding') as Coding[]
          );
        }

        if (
          resource.resourceType === 'Condition' &&
          this.resourceProfile(this.lookup(resource, 'meta.profile'), 'mcode-secondary-cancer-condition')
        ) {
          const tempSecondaryCancerCondition: SecondaryCancerCondition = {};
          tempSecondaryCancerCondition.coding = this.lookup(resource, 'code.coding') as Coding[];
          tempSecondaryCancerCondition.clinicalStatus = this.lookup(resource, 'clinicalStatus.coding') as Coding[];
          tempSecondaryCancerCondition.bodySite = this.lookup(resource, 'bodySite.coding') as Coding[];
          tempSecondaryCancerCondition.meta_profile = 'mcode-secondary-cancer-condition'
          if (this.secondaryCancerCondition) {
            this.secondaryCancerCondition.push(tempSecondaryCancerCondition); // needs specific de-dup helper function
          } else {
            this.secondaryCancerCondition = [tempSecondaryCancerCondition];
          }
        }

        if (
          resource.resourceType === 'Patient' &&
          this.resourceProfile(this.lookup(resource, 'meta.profile'), 'mcode-cancer-patient')
        ) {
          if (this.lookup(resource, 'birthDate').length !== 0) {
            this.birthDate = this.lookup(resource, 'birthDate')[0] as string;
          } else {
            this.birthDate = 'NA';
          }
        }

        if (
          resource.resourceType === 'Observation' &&
          this.resourceProfile(this.lookup(resource, 'meta.profile'), 'mcode-tumor-marker')
        ) {
          const tempTumorMarker: TumorMarker = {};
          tempTumorMarker.coding = this.lookup(resource, 'code.coding') as Coding[];
          tempTumorMarker.valueQuantity = this.lookup(resource, 'valueQuantity') as Quantity[];
          tempTumorMarker.valueRatio = this.lookup(resource, 'valueRatio') as Ratio[];
          tempTumorMarker.valueCodeableConcept = this.lookup(resource, 'valueCodeableConcept.coding') as Coding[];
          tempTumorMarker.interpretation = this.lookup(resource, 'interpretation.coding') as Coding[];
          if (this.tumorMarker) {
            this.tumorMarker.push(tempTumorMarker);
          } else {
            this.tumorMarker = [tempTumorMarker];
          }
        }
        // Parse and Extract mCODE Cancer Genetic Variant
        if (
          resource.resourceType === 'Observation' &&
          this.resourceProfile(this.lookup(resource, 'meta.profile'), 'mcode-cancer-genetic-variant')
        ) {
          const tempCGV: CancerGeneticVariant = {};
          tempCGV.coding = this.lookup(resource, 'code.coding') as Coding[]; // not used in logic
          tempCGV.component = {
            geneStudied: [] as CancerGeneticVariantComponentType[],
            genomicsSourceClass: [] as CancerGeneticVariantComponentType[]
          };
          for (const currentComponent of this.lookup(resource, 'component') as CancerGeneticVariantComponentType[]) {
            if (currentComponent.code.coding[0].code == '48018-6') {
              // With this code, we've reached a GeneStudied. Populate the GeneStudied attribute.
              tempCGV.component.geneStudied.push(currentComponent);
            }
            if (currentComponent.code.coding[0].code == '48002-0') {
              // With this code, we've reached a GenomicSourceClass. Populate the GenomicSourceClass attribute.
              tempCGV.component.genomicsSourceClass.push(currentComponent);
            }
          }
          tempCGV.valueCodeableConcept = this.lookup(resource, 'valueCodeableConcept.coding') as Coding[];
          tempCGV.interpretation = this.lookup(resource, 'interpretation.coding') as Coding[];
          if (this.cancerGeneticVariant) {
            this.cancerGeneticVariant.push(tempCGV);
          } else {
            this.cancerGeneticVariant = [tempCGV];
          }
        }

        if (
          resource.resourceType === 'Procedure' &&
          this.resourceProfile(this.lookup(resource, 'meta.profile'), 'mcode-cancer-related-radiation-procedure')
        ) {
          const tempCancerRelatedRadiationProcedure: CancerRelatedRadiationProcedure = {};
          tempCancerRelatedRadiationProcedure.coding = this.lookup(resource, 'code.coding') as Coding[];
          tempCancerRelatedRadiationProcedure.bodySite = this.lookup(resource, 'bodySite.coding') as Coding[];
          if (this.cancerRelatedRadiationProcedure) {
            if (
              !this.listContainsRadiationProcedure(
                this.cancerRelatedRadiationProcedure,
                tempCancerRelatedRadiationProcedure
              )
            ) {
              this.cancerRelatedRadiationProcedure.push(tempCancerRelatedRadiationProcedure);
            }
          } else {
            this.cancerRelatedRadiationProcedure = [tempCancerRelatedRadiationProcedure];
          }
        }

        if (
          resource.resourceType === 'Procedure' &&
          this.resourceProfile(this.lookup(resource, 'meta.profile'), 'mcode-cancer-related-surgical-procedure')
        ) {
          const tempCancerRelatedSurgicalProcedure: CancerRelatedSurgicalProcedure = {};
          tempCancerRelatedSurgicalProcedure.coding = this.lookup(resource, 'code.coding') as Coding[];
          tempCancerRelatedSurgicalProcedure.bodySite = this.lookup(resource, 'bodySite.coding') as Coding[];
          const reason_reference = this.lookup(resource, 'reasonReference') as ReasonReference;
          for(const condition of this.primaryCancerCondition){
            if(condition.full_url == reason_reference.reference){
              reason_reference.reference_meta_profile = condition.meta_profile
            }
          }
          if(this.secondaryCancerCondition){
            for(const condition of this.secondaryCancerCondition){
              if(condition.full_url == reason_reference.reference){
                reason_reference.reference_meta_profile = condition.meta_profile
              }
            }
          }
          tempCancerRelatedSurgicalProcedure.reasonReference = reason_reference;
          if (this.cancerRelatedSurgicalProcedure) {
            if (
              !this.listContainsRadiationProcedure(
                this.cancerRelatedSurgicalProcedure,
                tempCancerRelatedSurgicalProcedure
              )
            ) {
              this.cancerRelatedSurgicalProcedure.push(tempCancerRelatedSurgicalProcedure);
            }
          } else {
            this.cancerRelatedSurgicalProcedure = [tempCancerRelatedSurgicalProcedure];
          }
        }

        if (
          resource.resourceType === 'MedicationStatement' &&
          this.resourceProfile(this.lookup(resource, 'meta.profile'), 'mcode-cancer-related-medication-statement')
        ) {
          this.cancerRelatedMedicationStatement = this.addCoding(
            this.cancerRelatedMedicationStatement,
            this.lookup(resource, 'medicationCodeableConcept.coding') as Coding[]
          );
        }

        if (
          resource.resourceType === 'Observation' &&
          this.resourceProfile(this.lookup(resource, 'meta.profile'), 'mcode-ecog-performance-status')
        ) {
          this.ecogPerformaceStatus = this.lookup(resource, 'valueInteger')[0] as number; // this is probably bad type handling
        }

        if (
          resource.resourceType === 'Observation' &&
          this.resourceProfile(this.lookup(resource, 'meta.profile'), 'mcode-karnofsky-performance-status')
        ) {
          this.karnofskyPerformanceStatus = this.lookup(resource, 'valueInteger')[0] as number; // so is this
        }

      }
    }
    // add empty fields if they are not yet undefined
    if (!this.primaryCancerCondition) {
      this.primaryCancerCondition = [] as PrimaryCancerCondition[];
    }
    if (!this.TNMClinicalStageGroup) {
      this.TNMClinicalStageGroup = [] as Coding[];
    }
    if (!this.TNMPathologicalStageGroup) {
      this.TNMPathologicalStageGroup = [] as Coding[];
    }
    if (!this.secondaryCancerCondition) {
      this.secondaryCancerCondition = [] as SecondaryCancerCondition[];
    }
    if (!this.birthDate) {
      this.birthDate = 'NA';
    }
    if (!this.tumorMarker) {
      this.tumorMarker = [] as TumorMarker[];
    }
    if (!this.cancerRelatedRadiationProcedure) {
      this.cancerRelatedRadiationProcedure = [] as CancerRelatedRadiationProcedure[];
    }
    if (!this.cancerRelatedSurgicalProcedure) {
      this.cancerRelatedSurgicalProcedure = [] as CancerRelatedSurgicalProcedure[];
    }
    if (!this.cancerRelatedMedicationStatement) {
      this.cancerRelatedMedicationStatement = [] as Coding[];
    }
    if (!this.cancerGeneticVariant) {
      this.cancerGeneticVariant = [] as CancerGeneticVariant[];
    }
    // Checking if the performanceStatus exists and also making sure it's not 0, as 0 is a valid score
    if (!this.ecogPerformaceStatus && this.ecogPerformaceStatus != 0) {
      this.ecogPerformaceStatus = null;
    }
    if (!this.karnofskyPerformanceStatus && this.karnofskyPerformanceStatus != 0) {
      this.karnofskyPerformanceStatus = null;
    }
  }

  lookup(
    resource: fhirclient.FHIR.Resource,
    path: FHIRPath,
    environment?: { [key: string]: string }
  ): fhirpath.PathLookupResult[] {
    return fhirpath.evaluate(resource, path, environment);
  }
  resourceProfile(profiles: fhirpath.PathLookupResult[], key: string): boolean {
    for (const profile of profiles) {
      if ((profile as string).includes(key)) {
        return true;
      }
    }
    return false;
  }
  contains(coding_list: Coding[], coding: Coding): boolean {
    return coding_list.some((list_coding) => list_coding.system === coding.system && list_coding.code === coding.code);
  }
  addCoding(code_list: Coding[], codes: Coding[]): Coding[] {
    if (code_list) {
      for (const code of codes) {
        if (!this.contains(code_list, code)) {
          code_list.push(code);
        }
      }
      return code_list;
    } else {
      return codes;
    }
  }
  listContainsRadiationProcedure(
    procedure_list: CancerRelatedRadiationProcedure[],
    procedure: CancerRelatedRadiationProcedure
  ): boolean {
    for (const stored_procedure of procedure_list) {
      if (
        procedure.coding.every((coding1) =>
          stored_procedure.coding.some((coding2) => coding1.system == coding2.system && coding1.code == coding2.code)
        ) &&
        (!procedure.bodySite ||
          !stored_procedure.bodySite ||
          procedure.bodySite.every((coding1) =>
            stored_procedure.coding.some((coding2) => coding1.system == coding2.system && coding1.code == coding2.code)
          ))
      ) {
        return true;
      }
    }
    return false;
  }

    // Get ECOG Score
    getECOGScore(): number {
      if(this.ecogPerformaceStatus == -1) {
        return null;
      }
      return this.ecogPerformaceStatus;
    }
  
    // Get Karnofsky Score
    getKarnofskyScore(): number {
      if(this.karnofskyPerformanceStatus == -1) {
        return null;
      }
      return this.karnofskyPerformanceStatus;
    }

  // TODO - This will almost certainly be changed after more details from Trialjectory.
  // Primary Cancer Value
  getPrimaryCancerValue(): string {
    if (this.primaryCancerCondition.length == 0) {
      return null;
    }
    // Cycle through each of the primary cancer objects and check that they satisfy this priority requirement.
    for (const primaryCancerCondition of this.primaryCancerCondition) {
      // Cycle through each of the primary Cancer condition's codes independently due to code-dependent conditions
      for (const currentCoding of primaryCancerCondition.coding) {
        // 3. Invasive Breast Cancer and Recurrent
        if (
            ExtractedMCODE.code_mapper.aCodeIsInMapping(primaryCancerCondition.histologyMorphologyBehavior, 'Morphology-Invasive')
           ||
            ExtractedMCODE.code_mapper.codeIsInMapping(currentCoding, 'Cancer-Invasive-Breast') &&
          ExtractedMCODE.code_mapper.codeIsInMapping(currentCoding, 'Cancer-Breast') &&
          primaryCancerCondition.clinicalStatus.some((clinStat) => clinStat.code == 'recurrence')
        ) {
          return 'INVASIVE_BREAST_CANCER_AND_RECURRENT';
        }
      }
    }
    // Cycle through each of the primary cancer objects and check that they satisfy this priority requirement.
    for (const primaryCancerCondition of this.primaryCancerCondition) {
      // 4. Locally Recurrent
      if (
        ExtractedMCODE.code_mapper.aCodeIsInMapping(primaryCancerCondition.coding, 'Cancer-Breast') &&
        primaryCancerCondition.clinicalStatus.some((clinStat) => clinStat.code == 'recurrence')
      ) {
        return 'LOCALLY_RECURRENT';
      }
    }
    // Cycle through each of the primary cancer objects and check that they satisfy this priority requirement.
    for (const primaryCancerCondition of this.primaryCancerCondition) {
      // 1. Breast Cancer
      if (ExtractedMCODE.code_mapper.aCodeIsInMapping(primaryCancerCondition.coding, 'Cancer-Breast')) {
        return 'BREAST_CANCER';
      }
    }
    // Cycle through each of the primary cancer objects and check that they satisfy this priority requirement.
    for (const primaryCancerCondition of this.primaryCancerCondition) {
      // 2. Concomitant invasive malignancies
      if (
        primaryCancerCondition.coding.some((code) => ExtractedMCODE.code_mapper.codeIsNotInMapping(code, 'Cancer-Breast')) &&
        primaryCancerCondition.clinicalStatus.some((clinStat) => clinStat.code == 'active') &&
        (
          ExtractedMCODE.code_mapper.aCodeIsInMapping(this.TNMClinicalStageGroup, 'Stage-1', 'Stage-2', 'Stage-3', 'Stage-4')
         ||
            ExtractedMCODE.code_mapper.aCodeIsInMapping(this.TNMPathologicalStageGroup, 'Stage-1', 'Stage-2', 'Stage-3', 'Stage-4')
          )
      ) {
        return 'CONCOMITANT_INVASIVE_MALIGNANCIES';
      }
    }
    // Cycle through each of the primary cancer objects and check that they satisfy this priority requirement.
    for (const primaryCancerCondition of this.primaryCancerCondition) {
      // 5. Other malignancy - except skin or cervical
      if (
        (primaryCancerCondition.coding.some((code) => ExtractedMCODE.code_mapper.codeIsNotInMapping(code, 'Cancer-Breast')) &&
          primaryCancerCondition.clinicalStatus.some((clinStat) => clinStat.code == 'active')) ||
        (primaryCancerCondition.coding.some((code) => ExtractedMCODE.code_mapper.codeIsNotInMapping(code, 'Cancer-Cervical')) &&
          primaryCancerCondition.clinicalStatus.some((clinStat) => clinStat.code == 'active') &&
          (this.TNMClinicalStageGroup.some((code) => ExtractedMCODE.code_mapper.codeIsInMapping(code, 'Stage-0')) ||
            this.TNMPathologicalStageGroup.some((coding) => ExtractedMCODE.code_mapper.codeIsInMapping(coding, 'Stage-0'))))
      ) {
        return 'OTHER_MALIGNANCY_EXCEPT_SKIN_OR_CERVICAL';
      }
    }
    // None of the conditions are satisfied.
    return null;
  }

  /**
   * Secondary Cancer Value mapping.
   * @returns
   */
  getSecondaryCancerValue(): string[] {
    if (this.secondaryCancerCondition.length == 0) {
      return null;
    }

    const cancerConditions:string[] = [];
    for (const condition of this.secondaryCancerCondition) {
      if (condition.coding) {
        for (const code of condition.coding) {
          if (code.system && code.code && code.system.includes("snomed")) {
            // Look to see if the code is in the mapping
            const organ = metastasis_codes.SNOMED[code.code];
            
            if (organ) {
              cancerConditions.push(organ);
              // If we were successful, let's move on to the next one
              continue;
            }

          }

          // If we weren't able to apply a mapping, let's see if we can get it from the display string
          if (code.display) {
            const re = new RegExp(/secondary malignant neoplasm of (?<organ>[a-zA-Z ]+) \(disorder\)/, 'i');
            const matches = re.exec(code.display.toLowerCase());
            const groups = matches == null ? null : matches.groups;
            if (groups && groups.organ) cancerConditions.push(groups.organ);
          }

        }
      }
    }

    return cancerConditions.length == 0 ? null : cancerConditions;
  }

  // Histology Morphology Value (cancerSubType)
  getHistologyMorphologyValue(): string {
    if (
      this.primaryCancerCondition.length == 0 &&
      this.TNMClinicalStageGroup.length == 0 &&
      this.TNMPathologicalStageGroup.length == 0
    ) {
      return null;
    }
    // Invasive Ductal Carcinoma
    for (const primaryCancerCondition of this.primaryCancerCondition) {
      if (
        (ExtractedMCODE.code_mapper.aCodeIsInMapping(
          primaryCancerCondition.coding,
          "Cancer-Breast"
        ) &&
          ExtractedMCODE.code_mapper.aCodeIsInMapping(
            primaryCancerCondition.histologyMorphologyBehavior,
            "Morphology-Invas_Duct_Carc"
          )) ||
        ExtractedMCODE.code_mapper.aCodeIsInMapping(
          primaryCancerCondition.coding,
          "Cancer-Invas_Duct_Carc"
        )
      ) {
        // idc (Invasice Ductal Carcinoma)
        return "idc";
      }
    }
    // Invasive Lobular Carcinoma
    for (const primaryCancerCondition of this.primaryCancerCondition) {
      if (
        (ExtractedMCODE.code_mapper.aCodeIsInMapping(
          primaryCancerCondition.coding,
          "Cancer-Breast"
        ) &&
          ExtractedMCODE.code_mapper.aCodeIsInMapping(
            primaryCancerCondition.histologyMorphologyBehavior,
            "Morphology-Invas_Lob_Carc"
          )) ||
        ExtractedMCODE.code_mapper.aCodeIsInMapping(
          primaryCancerCondition.coding,
          "Cancer-Invas_Lob_Carc"
        )
      ) {
        // ilc '(Invasive Lobular Carcinoma)
        return "ilc";
      }
    }
    // Ductual Carcinoma in Situ
    for (const primaryCancerCondition of this.primaryCancerCondition) {
      if (
        ExtractedMCODE.code_mapper.aCodeIsInMapping(
          primaryCancerCondition.coding,
          "Cancer-Breast"
        ) &&
        ExtractedMCODE.code_mapper.aCodeIsInMapping(
          primaryCancerCondition.histologyMorphologyBehavior,
          "Morphology-Duct_Car_In_Situ"
        )
      ) {
        // dcis (Ductal Carcinoma In Situ)
        return "dcis";
      }
    }
    // Invasive Breast Cancer
    for (const primaryCancerCondition of this.primaryCancerCondition) {
      if (
        (ExtractedMCODE.code_mapper.aCodeIsInMapping(
          primaryCancerCondition.coding,
          "Cancer-Breast"
        ) &&
          ExtractedMCODE.code_mapper.aCodeIsInMapping(
            primaryCancerCondition.histologyMorphologyBehavior,
            "Morphology-Invasive"
          )) ||
        ExtractedMCODE.code_mapper.aCodeIsInMapping(
          primaryCancerCondition.coding,
          "Cancer-Invasive-Breast"
        )
      ) {
        // ibc (Invasive Breast Cancer)
        return "ibc";
      }
    }

    // Lobular Carcinoma in Situ (lcis)
    for (const primaryCancerCondition of this.primaryCancerCondition) {
      if (
        primaryCancerCondition.histologyMorphologyBehavior.some(
          (histMorphBehav) =>
            ExtractedMCODE.code_mapper.codeIsInMapping(
              histMorphBehav,
              "lcis-histology"
            )
        ) ||
        primaryCancerCondition.coding.some((code) =>
          ExtractedMCODE.code_mapper.codeIsInMapping(code, "lcis-condition")
        )
      ) {
        return "lcis";
      }
    }

    // TODO - This logic and mapping does not exist in Trialjectory. It's been added to allow for UTSW record mapping.
    // Invasive Carcinoma
    for (const primaryCancerCondition of this.primaryCancerCondition) {
      if (
        (primaryCancerCondition.coding.some((code) =>
          ExtractedMCODE.code_mapper.codeIsInMapping(code, "Cancer-Breast")
        ) &&
          primaryCancerCondition.histologyMorphologyBehavior.some(
            (histMorphBehav) =>
              ExtractedMCODE.code_mapper.codeIsInMapping(
                histMorphBehav,
                "Morphology-Invasive-Carcinoma"
              )
          )) ||
        primaryCancerCondition.coding.some((code) =>
          ExtractedMCODE.code_mapper.codeIsInMapping(
            code,
            "Cancer-Invasive-Carcinoma"
          )
        )
      ) {
        return "INVASIVE_CARCINOMA";
      }
    }

    // None of the conditions are satisfied.
    return null;
  }

  // Radiation Procedures
  getRadiationProcedureValue(): string[] {

    let radiationValues:string[] = [];

    const procedure_codes_map = new Map<string, string>()
    procedure_codes_map.set('ablation-procedure', 'ablation');
    procedure_codes_map.set('rfa-procedure', 'rfa');
    procedure_codes_map.set('ebrt-procedure', 'ebrt');
    // Perform the basic mappings of the radiation procedures.
    radiationValues = radiationValues.concat(this.performBasicMappings(procedure_codes_map, this.cancerRelatedRadiationProcedure));

    // WBRT Logic.
    for (const cancerRelatedRadiationProcedure of this.cancerRelatedRadiationProcedure) {
      if (
        cancerRelatedRadiationProcedure.coding &&
        cancerRelatedRadiationProcedure.bodySite &&
        cancerRelatedRadiationProcedure.coding.some(
          (coding) => (CodeMapper.codesEqual(coding, CodeSystemEnum.SNOMED, '108290001'))
        ) &&
        cancerRelatedRadiationProcedure.bodySite.some(
          (coding) => (CodeMapper.codesEqual(coding, CodeSystemEnum.SNOMED, '119235005')) || (CodeMapper.codesEqual(coding, CodeSystemEnum.SNOMED, '12738006'))
        )
      ) {
        radiationValues.push('wbrt');
      }
    }

    // Radiation Logic.
    if (this.cancerRelatedRadiationProcedure.length > 0) {
      // If there is any code in the cancerRelatedRadiationProcedure, it counts as radiation.
      radiationValues.push('radiation');
    }

    return radiationValues;
  }

  // Surgical Procedures
  getSurgicalProcedureValue(): string[] {

    if(this.cancerRelatedSurgicalProcedure == null){
      return [];
    }

    let surgicalValues:string[] = [];
    
    // Set the Mapping Name -> Trialjectory Result.
    const procedure_codes_map = new Map<string, string>()
    procedure_codes_map.set('mastectomy', 'mastectomy');
    procedure_codes_map.set('lumpectomy', 'lumpectomy');
    procedure_codes_map.set('alnd-procedure', 'alnd');  // ALND also has a second possible mapping which will be checked later.
    procedure_codes_map.set('breast-reconstruction', 'reconstruction');  // Although 'reconstruction' is vague, it refers specifically to breast reconstruction.
    // Perform the basic mappings of the surgical procedures.
    surgicalValues = surgicalValues.concat(this.performBasicMappings(procedure_codes_map, this.cancerRelatedSurgicalProcedure));

    // Additional ALND mapping check (if alnd has not already been added).
    if(!surgicalValues.includes('alnd')){
      if(this.cancerRelatedSurgicalProcedure.some((surgicalProcedure) => surgicalProcedure.coding != null && surgicalProcedure.coding.some((code) => code.code == '122459003') 
          && ExtractedMCODE.code_mapper.aCodeIsInMapping(surgicalProcedure.bodySite, 'alnd-bodysite'))) {
            surgicalValues.push('alnd');
      }
    }

    // Metastasis Resection check.
    if(this.cancerRelatedSurgicalProcedure.some((surgicalProcedure) => surgicalProcedure.reasonReference != null && surgicalProcedure.reasonReference.reference_meta_profile == 'mcode-secondary-cancer-condition')){
      surgicalValues.push('metastasis_resection');
    }

    return surgicalValues;
  }

  /**
   * Returns the basic code mappings described by the given map of procedure code mappings on the given Fhir Resource.
   * @param code_mapping The map tha describes the mapping of each code to a value.
   * @param fhir_resource The resource to perform the mapping on.
   * @returns The string array of mapped result values.
   */
  performBasicMappings(code_mapping: Map<string, string>, fhir_resource: BaseFhirResource[]): string[] {
    const mapped_values:string[] = [];

    // Iterate through the mappings and append when a code is satisfied.
    for (const procedure_name of code_mapping.keys()) {
      if (fhir_resource.some((fhir_resource) => fhir_resource.coding != null && ExtractedMCODE.code_mapper.aCodeIsInMapping(fhir_resource.coding, procedure_name))) {
        mapped_values.push(code_mapping.get(procedure_name));
      }
    }
    return mapped_values;
  }

  /**
   * Gets the Age value of the patient resource.
   * @returns Returns the age of the patient in this resource.
   */
  getAgeValue(): number {
    if (this.birthDate == 'NA' || this.birthDate == null || this.birthDate == undefined) {
      return null;
    }
    // Birthdate is in format: '1966-08-03'
    const today: Date = new Date();
    const checkDate: Date = new Date(this.birthDate);
    // Time Difference (Milliseconds)
    const millisecondsAge = today.getTime() - checkDate.getTime();
    const milliseconds1Years = 1000 * 60 * 60 * 24 * 365;
    return Math.floor(millisecondsAge / milliseconds1Years);
  }

  /**
   * Gets the most advanced staging that this person's resource codes map to.
   * @returns The most advanced staging that this person's resource codes map to.
   */
  getStageValues(): string {
    // Set the sheet name -> Trialjectory result mapping.
    const stage_value_map = new Map<string, string>()
    stage_value_map.set('Stage-4D', '4C');  // 4D is not a stage in Trialjectory, return 4C.
    stage_value_map.set('Stage-4C', '4C');
    stage_value_map.set('Stage-4B', '4B');
    stage_value_map.set('Stage-4A', '4A');
    stage_value_map.set('Stage-4', '4');
    stage_value_map.set('Stage-3C', '3C');
    stage_value_map.set('Stage-3B', '3B');
    stage_value_map.set('Stage-3A', '3A');
    stage_value_map.set('Stage-3', '3');
    stage_value_map.set('Stage-2C', '2C');
    stage_value_map.set('Stage-2B', '2B');
    stage_value_map.set('Stage-2A', '2A');
    stage_value_map.set('Stage-2', '2');
    stage_value_map.set('Stage-1C', '1C');
    stage_value_map.set('Stage-1B', '1B');
    stage_value_map.set('Stage-1A', '1A');
    stage_value_map.set('Stage-1', '1');
    stage_value_map.set('Stage-0A', '0'); // 0A is not a stage in Trialjectory, return 0.
    stage_value_map.set('Stage-0', '0');

    // Iterate through the mappings and return when a code is satisfied.
    for(const stage_name of stage_value_map.keys()){
      if (ExtractedMCODE.code_mapper.aCodeIsInMapping(this.TNMClinicalStageGroup, stage_name) ||
      ExtractedMCODE.code_mapper.aCodeIsInMapping(this.TNMPathologicalStageGroup, stage_name)) {
        return stage_value_map.get(stage_name);
      }
    }

    return null;
  }

  /**
   * 
   * @returns Gets the tumor marker mappings from the codes in this resource.
   */
  getTumorMarkerValue(): string[] {

    if (this.tumorMarker.length == 0 && this.cancerGeneticVariant.length == 0) {
      // Prevents unnecessary checks if the tumor marker values are empty.
      return [];
    }

    // Array that Tumor Marker values will be added to as they apply.
    const tumorMarkerArray: string[] = [];

    if (this.tumorMarker.some((tm) => this.isERPositive(tm, 1))) {
      // NOTE: ER+ check always uses 1 as the metric parameter by default.
      tumorMarkerArray.push('ER+');
    }

    if (this.tumorMarker.some((tm) => this.isERNegative(tm, 1))) {
      // NOTE: ER- check always uses 1 as the metric parameter by default.
      tumorMarkerArray.push('ER-');
    }

    if (this.tumorMarker.some((tm) => this.isPRPositive(tm, 1))){
      // NOTE: PR+ check always uses 1 as the metric parameter by default.
      tumorMarkerArray.push('PR+');
    }

    if (this.tumorMarker.some((tm) => this.isPRNegative(tm, 1))){
      // NOTE: PR- check always uses 1 as the metric parameter by default.
      tumorMarkerArray.push('PR-');
    }

    // BRCA1
    if (this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '1100'))) {
      tumorMarkerArray.push('BRCA1+');
    }

    if (this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '1100'))) {
      tumorMarkerArray.push('BRCA1-');
    }
    // BRCA2
    if (this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '1101'))) {
      tumorMarkerArray.push('BRCA2+');
    }

    if (this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '1101'))) {
      tumorMarkerArray.push('BRCA2-');
    }

    if (this.tumorMarker.some((tm) => this.isBioMarkerPositiveCombo2(tm, 'Biomarker-ATM')) ||
      this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '795')) ){
      tumorMarkerArray.push('ATM+');
    }

    if (this.tumorMarker.some((tm) => this.isBioMarkerNegativeCombo2(tm, 'Biomarker-ATM')) ||
      this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '795')) ){
      tumorMarkerArray.push('ATM-');
    }

    if (this.tumorMarker.some((tm) => this.isBioMarkerPositiveCombo2(tm, 'Biomarker-CDH1')) ||
      this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '1748')) ){
      tumorMarkerArray.push('CDH1+');
    }

    if (this.tumorMarker.some((tm) => this.isBioMarkerNegativeCombo2(tm, 'Biomarker-CDH1')) ||
      this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '1748')) ){
      tumorMarkerArray.push('CDH1-');
    }

    if (this.tumorMarker.some((tm) => this.isBioMarkerPositiveCombo2(tm, 'Biomarker-CHK2')) ||
      this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '16627')) ){
      tumorMarkerArray.push('CHEK2+');
    }

    if (this.tumorMarker.some((tm) => this.isBioMarkerNegativeCombo2(tm, 'Biomarker-CHK2')) ||
      this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '16627')) ){
      tumorMarkerArray.push('CHEK2-');
    }

    if (this.tumorMarker.some((tm) => this.isBioMarkerPositiveCombo2(tm, 'Biomarker-NBN')) ||
      this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '7652')) ){
      tumorMarkerArray.push('NBN+');
    }

    if (this.tumorMarker.some((tm) => this.isBioMarkerNegativeCombo2(tm, 'Biomarker-NBN')) ||
      this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '7652')) ){
      tumorMarkerArray.push('NBN-');
    }

    if (this.tumorMarker.some((tm) => this.isBioMarkerPositiveCombo2(tm, 'Biomarker-NF1')) ||
      this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '7765')) ){
      tumorMarkerArray.push('NF1+');
    }

    if (this.tumorMarker.some((tm) => this.isBioMarkerNegativeCombo2(tm, 'Biomarker-NF1')) ||
      this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '7765')) ){
      tumorMarkerArray.push('NF1-');
    }

    if (this.tumorMarker.some((tm) => this.isBioMarkerPositiveCombo2(tm, 'Biomarker-PALB2')) ||
      this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '26144')) ){
      tumorMarkerArray.push('PALB2+');
    }

    if (this.tumorMarker.some((tm) => this.isBioMarkerNegativeCombo2(tm, 'Biomarker-PALB2')) ||
      this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '26144')) ){
      tumorMarkerArray.push('PALB2-');
    }

    if (this.tumorMarker.some((tm) => this.isBioMarkerPositiveCombo2(tm, 'Biomarker-PTEN')) ||
      this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '9588')) ){
      tumorMarkerArray.push('PTEN+');
    }

    if (this.tumorMarker.some((tm) => this.isBioMarkerNegativeCombo2(tm, 'Biomarker-PTEN')) ||
      this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '9588')) ){
      tumorMarkerArray.push('PTEN-');
    }

    if (this.tumorMarker.some((tm) => this.isBioMarkerPositiveCombo2(tm, 'Biomarker-STK11')) ||
      this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '11389')) ){
      tumorMarkerArray.push('STK11+');
    }

    if (this.tumorMarker.some((tm) => this.isBioMarkerNegativeCombo2(tm, 'Biomarker-STK11')) ||
      this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '11389')) ){
      tumorMarkerArray.push('STK11-');
    }

    if (this.tumorMarker.some((tm) => this.isBioMarkerPositiveCombo2(tm, 'Biomarker-P53')) ||
      this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '11998')) ){
      tumorMarkerArray.push('P53+');
    }

    if (this.tumorMarker.some((tm) => this.isBioMarkerNegativeCombo2(tm, 'Biomarker-P53')) ||
      this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '11998')) ){
      tumorMarkerArray.push('P53-');
    }

    if (this.tumorMarker.some((tm) => this.isRBPositive(tm, 50))) {
      // NOTE: RB+ check always uses 50 as the matric parameter by default.
      tumorMarkerArray.push('RB+');
    }

    if (this.tumorMarker.some((tm) => this.isRBNegative(tm, 50))) {
      // NOTE: RB- check always uses 50 as the matric parameter by default.
      tumorMarkerArray.push('RB-');
    }

    if (this.tumorMarker.some((tm) => this.tumorMarker.some((tm) => this.isHER2Positive(tm)))){
           tumorMarkerArray.push('HER2+');
         }

    if (this.tumorMarker.some((tm) => this.isHER2Negative(tm, ['0', '1', '2', '1+', '2+']))) {
      // NOTE: HER2- check always uses ['0', '1', '2', '1+', '2+'] as the quantities by default.
      tumorMarkerArray.push('HER2-');
    }

    if (this.tumorMarker.some((tm) => this.isFGFRPositive(tm, 1))) {
      tumorMarkerArray.push('FGFR+');
    }

    if (this.tumorMarker.some((tm) => this.isFGFRNegative(tm, 1))) {
      tumorMarkerArray.push('FGFR-');
    }

    if (this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '3467'))) {
      tumorMarkerArray.push('ESR1+');
    }

    if (this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '3467'))) {
      tumorMarkerArray.push('ESR1-');
    }

    if (this.tumorMarker.some((tm) => this.isPIK3CAPositive(tm)) ||
      this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '8975')) ){
      tumorMarkerArray.push('PIK3CA+');
    }

    if (this.tumorMarker.some((tm) => this.isPIK3CANegative(tm)) ||
      this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '8975')) ){
      tumorMarkerArray.push('PIK3CA-');
    }

    if (this.tumorMarker.some((tm) => this.isPDL1Positive(tm))) {
      tumorMarkerArray.push('PDL1+');
    }

    if (this.tumorMarker.some((tm) => this.isPDL1Negative(tm))) {
      tumorMarkerArray.push('PDL1-');
    }

    if (this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '8031')) ||
       this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '8032')) ||
       this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '8033')) ){
      tumorMarkerArray.push('NTRK_FUSION+');
    }

    if (this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '8031')) ||
       this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '8032')) ||
       this.cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '8033')) ){
      tumorMarkerArray.push('NTRK_FUSION-');
    }

    // Finally, return the fully appended array.
    return tumorMarkerArray;
  }
  isValueCodeableConceptPositive(valueCodeableConcept: Coding[]): boolean {
    return valueCodeableConcept.some(
                   (coding) =>
                    (CodeMapper.codesEqual(coding, CodeSystemEnum.SNOMED, '10828004')) ||
                    (CodeMapper.codesEqual(coding, CodeSystemEnum.HL7, 'POS'))
                 );
  }
  isValueCodeableConceptNegative(valueCodeableConcept: Coding[]): boolean {
    return valueCodeableConcept.some(
                   (coding) =>
                    (CodeMapper.codesEqual(coding, CodeSystemEnum.SNOMED, '260385009')) ||
                    (CodeMapper.codesEqual(coding, CodeSystemEnum.HL7, 'NEG'))
                 );
  }
  isInterpretationPositive(interpretation: Coding[]): boolean {
    return interpretation.some(
                     (interp) =>
                       (interp.code == 'POS' || interp.code == 'DET' || interp.code == 'H') &&
                       interp.system == 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html'
                   );
  }
  isInterpretationNegative(interpretation: Coding[]): boolean {
    return interpretation.some(
                     (interp) =>
                       (interp.code == 'L' || interp.code == 'N' || interp.code == 'NEG' || interp.code == 'ND') &&
                       interp.system == 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html'
                   );
  }
  isInterpretationPositiveCombo2(interpretation: Coding[]): boolean {
    return interpretation.some(
                     (interp) =>
                       (interp.code == 'POS' || interp.code == 'ND' || interp.code == 'L') &&
                       interp.system == 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html'
                   );
  }
  isInterpretationNegativeCombo2(interpretation: Coding[]): boolean {
    return interpretation.some(
                     (interp) =>
                       (interp.code == 'NEG' || interp.code == 'DET' || interp.code == 'H') &&
                       interp.system == 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html'
                   );
  }
  isInterpretationNegativeCombo3(interpretation: Coding[]): boolean {
    return interpretation.some(
                     (interp) =>
                       (interp.code == 'L' || interp.code == 'NEG' || interp.code == 'ND') &&
                       interp.system == 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html'
                   );
  }
  isGeneticVariantPositive(cancGenVar: CancerGeneticVariant, genVarCode: string): boolean {
    return (
      cancGenVar.component.geneStudied.some((geneStudied) =>
        geneStudied.valueCodeableConcept.coding.some(
          (coding) => (CodeMapper.codesEqual(coding, CodeSystemEnum.HGNC, genVarCode))
        )
      ) &&
      (cancGenVar.valueCodeableConcept.some(
        (coding) =>
          (CodeMapper.codesEqual(coding, CodeSystemEnum.SNOMED, '10828004')) ||
          (CodeMapper.codesEqual(coding, CodeSystemEnum.LOINC, 'LA9633-4')) ||
          (CodeMapper.codesEqual(coding, CodeSystemEnum.HL7, 'POS'))
      ) ||
        cancGenVar.interpretation.some(
          (interp) => interp.code == 'CAR' || interp.code == 'A' || interp.code == 'POS'
        ) ||
        cancGenVar.component.geneStudied.some((geneStud) =>
          geneStud.interpretation.coding.some(
            (interp) => interp.code == 'CAR' || interp.code == 'A' || interp.code == 'POS'
          )
        ))
    );
  }
  isGeneticVariantNegative(cancGenVar: CancerGeneticVariant, genVarCode: string): boolean {
    return (
      cancGenVar.component.geneStudied.some((geneStudied) =>
        geneStudied.valueCodeableConcept.coding.some(
          (coding) => (CodeMapper.codesEqual(coding, CodeSystemEnum.HGNC, genVarCode))
        )
      ) &&
      (cancGenVar.valueCodeableConcept.some(
        (coding) =>
          (CodeMapper.codesEqual(coding, CodeSystemEnum.SNOMED, '260385009')) ||
          (CodeMapper.codesEqual(coding, CodeSystemEnum.LOINC, 'LA9634-2')) ||
          (CodeMapper.codesEqual(coding, CodeSystemEnum.HL7, 'NEG'))
      ) ||
        cancGenVar.interpretation.some(
          (interp) => interp.code == 'N' || interp.code == 'NEG'
        ) ||
        cancGenVar.component.geneStudied.some((geneStud) =>
          geneStud.interpretation.coding.some(
            (interp) => interp.code == 'N' || interp.code == 'NEG'
          )
        ))
    );
  }
  isERPositive(tumorMarker: TumorMarker, metric: number): boolean {
    return (
      (this.isValueCodeableConceptPositive(tumorMarker.valueCodeableConcept) ||
        tumorMarker.valueRatio.some((valRat) => this.ratioMatch(valRat.numerator, valRat.denominator, metric, '>=')) ||
        this.isInterpretationPositive(tumorMarker.interpretation) ||
        tumorMarker.valueQuantity.some((valQuant) =>
          this.quantityMatch(valQuant.value, valQuant.code, [metric], '>=', '%')
        )) &&
      tumorMarker.coding.some((code) => ExtractedMCODE.code_mapper.codeIsInMapping(code, 'Biomarker-ER'))
    );
  }
  isERNegative(tumorMarker: TumorMarker, metric: number): boolean {
    return (
      (this.isValueCodeableConceptNegative(tumorMarker.valueCodeableConcept) ||
        tumorMarker.valueRatio.some((valRat) => this.ratioMatch(valRat.numerator, valRat.denominator, metric, '<')) ||
        this.isInterpretationNegative(tumorMarker.interpretation) ||
        tumorMarker.valueQuantity.some(
          (valQuant) =>
            this.quantityMatch(valQuant.value, valQuant.code, [metric], '<', '%') ||
            this.quantityMatch(valQuant.value, valQuant.code, [0], '=')
        )) &&
      tumorMarker.coding.some((code) => ExtractedMCODE.code_mapper.codeIsInMapping(code, 'Biomarker-ER'))
    );
  }
  isPRPositive(tumorMarker: TumorMarker, metric: number): boolean {
    return (
      (this.isValueCodeableConceptPositive(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationPositive(tumorMarker.interpretation) ||
        tumorMarker.valueQuantity.some((valQuant) =>
          this.quantityMatch(valQuant.value, valQuant.code, [metric], '>=', '%')
        ) ||
        tumorMarker.valueRatio.some((valRat) => this.ratioMatch(valRat.numerator, valRat.denominator, metric, '>='))) &&
      tumorMarker.coding.some((code) => ExtractedMCODE.code_mapper.codeIsInMapping(code, 'Biomarker-PR'))
    );
  }
  isPRNegative(tumorMarker: TumorMarker, metric: number): boolean {
    return (
      (this.isValueCodeableConceptNegative(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationNegative(tumorMarker.interpretation) ||
        tumorMarker.valueQuantity.some(
          (valQuant) =>
            this.quantityMatch(valQuant.value, valQuant.code, [metric], '<', '%') ||
            this.quantityMatch(valQuant.value, valQuant.code, [0], '=')
        ) ||
        tumorMarker.valueRatio.some((valRat) => this.ratioMatch(valRat.numerator, valRat.denominator, metric, '<'))) &&
      tumorMarker.coding.some((code) => ExtractedMCODE.code_mapper.codeIsInMapping(code, 'Biomarker-PR'))
    );
  }
  isBioMarkerPositiveCombo2(tumorMarker: TumorMarker, sheetName: string): boolean {
    return (
      (this.isValueCodeableConceptPositive(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationPositiveCombo2(tumorMarker.interpretation))
      && tumorMarker.coding.some((code) => ExtractedMCODE.code_mapper.codeIsInMapping(code, sheetName))
    );
  }
  isBioMarkerNegativeCombo2(tumorMarker: TumorMarker, sheetName: string): boolean {
    return (
      (this.isValueCodeableConceptNegative(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationNegativeCombo2(tumorMarker.interpretation))
      && tumorMarker.coding.some((code) => ExtractedMCODE.code_mapper.codeIsInMapping(code, sheetName))
    );
  }
  isRBPositive(tumorMarker: TumorMarker, metric: number): boolean {
    return (
      (tumorMarker.valueQuantity.some((valQuant) =>
        this.quantityMatch(valQuant.value, valQuant.code, [metric], '>', '%')
      ) ||
        this.isValueCodeableConceptPositive(tumorMarker.valueCodeableConcept) ||
        tumorMarker.valueRatio.some((valRat) => this.ratioMatch(valRat.numerator, valRat.denominator, metric, '>')) ||
        this.isInterpretationPositive(tumorMarker.interpretation)) &&
      tumorMarker.coding.some((code) => ExtractedMCODE.code_mapper.codeIsInMapping(code, 'Biomarker-RB'))
    );
  }
  isRBNegative(tumorMarker: TumorMarker, metric: number): boolean {
    return (
      (this.isValueCodeableConceptNegative(tumorMarker.valueCodeableConcept) ||
        tumorMarker.valueRatio.some((valRat) => this.ratioMatch(valRat.numerator, valRat.denominator, metric, '<')) ||
        this.isInterpretationNegativeCombo3(tumorMarker.interpretation) ||
        tumorMarker.valueQuantity.some(
          (valQuant) =>
            this.quantityMatch(valQuant.value, valQuant.code, [metric], '<', '%') ||
            this.quantityMatch(valQuant.value, valQuant.code, [0], '=')
        )) &&
      tumorMarker.coding.some((code) => ExtractedMCODE.code_mapper.codeIsInMapping(code, 'Biomarker-RB'))
    );
  }
  isHER2Positive(tumorMarker: TumorMarker): boolean {
    return (
      tumorMarker.coding.some((code) => ExtractedMCODE.code_mapper.codeIsInMapping(code, 'Biomarker-HER2')) &&
      (this.isValueCodeableConceptPositive(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationPositive(tumorMarker.interpretation) ||
        tumorMarker.valueQuantity.some((valQuant) =>
          this.quantityMatch(valQuant.value, valQuant.code, ['3', '3+'], '=')
        ))
    );
  }
  isHER2Negative(tumorMarker: TumorMarker, quantities: string[]): boolean {
    return (
      (this.isValueCodeableConceptNegative(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationNegative(tumorMarker.interpretation) || // Information on Interpretation values can be found at: http://hl7.org/fhir/R4/valueset-observation-interpretation.html
        tumorMarker.valueQuantity.some((valQuant) =>
          this.quantityMatch(valQuant.value, valQuant.code, quantities, '=')
        )) &&
      tumorMarker.coding.some((code) => ExtractedMCODE.code_mapper.codeIsInMapping(code, 'Biomarker-HER2'))
    );
  }
  isFGFRPositive(tumorMarker: TumorMarker, metric: number): boolean {
    return (
      (this.isValueCodeableConceptPositive(tumorMarker.valueCodeableConcept) ||
        tumorMarker.valueRatio.some((valRat) => this.ratioMatch(valRat.numerator, valRat.denominator, metric, '>=')) ||
        this.isInterpretationPositive(tumorMarker.interpretation) ||
        tumorMarker.valueQuantity.some((valQuant) =>
          this.quantityMatch(valQuant.value, valQuant.code, [metric], '>=', '%')
        )) &&
      tumorMarker.coding.some((code) => ExtractedMCODE.code_mapper.codeIsInMapping(code, 'Biomarker-FGFR'))
    );
  }
  isFGFRNegative(tumorMarker: TumorMarker, metric: number): boolean {
    return (
      (this.isValueCodeableConceptNegative(tumorMarker.valueCodeableConcept) ||
        tumorMarker.valueRatio.some((valRat) => this.ratioMatch(valRat.numerator, valRat.denominator, metric, '<')) ||
        this.isInterpretationNegativeCombo3(tumorMarker.interpretation) ||
        tumorMarker.valueQuantity.some(
          (valQuant) =>
            this.quantityMatch(valQuant.value, valQuant.code, [metric], '<', '%') ||
            this.quantityMatch(valQuant.value, valQuant.code, [0], '=')
        )) &&
      tumorMarker.coding.some((code) => ExtractedMCODE.code_mapper.codeIsInMapping(code, 'Biomarker-FGFR'))
    );
  }
  isPIK3CAPositive(tumorMarker: TumorMarker): boolean {
    return (
      (this.isValueCodeableConceptPositive(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationPositive(tumorMarker.interpretation))
      && tumorMarker.coding.some((code) => ExtractedMCODE.code_mapper.codeIsInMapping(code, 'Biomarker-PIK3CA'))
    );
  }
  isPIK3CANegative(tumorMarker: TumorMarker): boolean {
    return (
      (this.isValueCodeableConceptNegative(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationNegative(tumorMarker.interpretation))
      && tumorMarker.coding.some((code) => ExtractedMCODE.code_mapper.codeIsInMapping(code, 'Biomarker-PIK3CA'))
    );
  }
  isPDL1Positive(tumorMarker: TumorMarker): boolean {
    return (
      (this.isValueCodeableConceptPositive(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationPositive(tumorMarker.interpretation))
      && tumorMarker.coding.some((code) => ExtractedMCODE.code_mapper.codeIsInMapping(code, 'Biomarker-PDL1'))
    );
  }
  isPDL1Negative(tumorMarker: TumorMarker): boolean {
    return (
      (this.isValueCodeableConceptNegative(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationNegative(tumorMarker.interpretation))
      && tumorMarker.coding.some((code) => ExtractedMCODE.code_mapper.codeIsInMapping(code, 'Biomarker-PDL1'))
    );
  }
quantityMatch(
    quantValue: string | number,
    quantUnit: string,
    metricValues: string[] | number[],
    metricComparator: string,
    metricUnit?: string
  ): boolean {
    if ((!quantUnit && metricUnit) || (quantUnit && !metricUnit) || quantUnit != metricUnit) {
      //console.log('incompatible units');
      return false;
    }

    if (metricComparator == '=') {
      quantValue = typeof quantValue == 'string' ? quantValue : quantValue.toString(); // we're doing string comparisons for these
      return metricValues.some((value: string | number) => quantValue == value);
    } else if (metricComparator == '>=') {
      return quantValue >= metricValues[0];
    } else if (metricComparator == '<') {
      return quantValue < metricValues[0];
    } else if (metricComparator == '>') {
      return quantValue > metricValues[0];
    } else {
      console.log('err unknown operator');
      return false;
    }
  }
  ratioMatch(numerator: Quantity, denominator: Quantity, metricValue: number, metricComparator: string): boolean {
    if (!numerator || !denominator || !numerator.value || !denominator.value) {
      //console.log('missing info for ratio comparison');
      return false;
    }
    const num: number = typeof numerator.value == 'number' ? numerator.value : Number(numerator.value);
    const den: number = typeof denominator.value == 'number' ? denominator.value : Number(denominator.value);
    const percentage = (num / den) * 100;
    if (metricComparator == '>=') {
      return percentage >= metricValue;
    } else if (metricComparator == '<') {
      return percentage < metricValue;
    } else if (metricComparator == '>') {
      return percentage > metricValue;
    } else {
      console.log('err unknown operator');
      return false;
    }
  }

  /**
   * 
   * @returns the medications that this resource's codes map to.
   */
  getMedicationStatementValues(): string[] {

    // Set the madication code mappings -> Trialjectory result mapping.
    const medication_mappings = new Map<string, string>()
    medication_mappings.set('anastrozole', 'anastrozole');
    medication_mappings.set('exemestane', 'exemestane');
    medication_mappings.set('letrozole', 'letrozole');
    medication_mappings.set('tamoxifen', 'tamoxifen');
    medication_mappings.set('toremifene', 'toremifene');
    medication_mappings.set('fulvestrant', 'fulvestrant');
    medication_mappings.set('raloxifene_hcl', 'raloxifene_hcl');
    medication_mappings.set('trastuzumab', 'trastuzumab');  // There are 2 mappings for trastuzumab because both are applicable.
    medication_mappings.set('trastuzumab_hyaluronidase_conjugate', 'trastuzumab_hyaluronidase_conjugate');
    medication_mappings.set('trastuzumab_deruxtecan_conjugate', 'trastuzumab_deruxtecan_conjugate');
    medication_mappings.set('pertuzumab', 'pertuzumab');
    medication_mappings.set('lapatinib', 'lapatinib');
    medication_mappings.set('pamidronate', 'pamidronate');
    medication_mappings.set('paclitaxel', 'paclitaxel');
    medication_mappings.set('hyaluronidase', 'hyaluronidase');  // Originally spelled aluronidase, updated to hyaluronidase.
    medication_mappings.set('tucatinib', 'tucatinib');
    medication_mappings.set('paclitaxel', 'paclitaxel');
    medication_mappings.set('ixabepilone', 'ixabepilone');
    medication_mappings.set('neratinib', 'neratinib');
    medication_mappings.set('tdm1', 'tdm1');
    medication_mappings.set('doxorubicin', 'doxorubicin');
    medication_mappings.set('epirubicin', 'epirubicin');
    medication_mappings.set('cyclophosphamide', 'cyclophosphamide');
    medication_mappings.set('docetaxel', 'docetaxel');
    medication_mappings.set('cisplatin', 'cisplatin');
    medication_mappings.set('carboplatin', 'carboplatin');
    medication_mappings.set('gemcitabine', 'gemcitabine');
    medication_mappings.set('capecitabine', 'capecitabine');
    medication_mappings.set('vinblastine_sulfate', 'vinblastine_sulfate');
    medication_mappings.set('sacituzumab_govitecan_hziy', 'sacituzumab_govitecan_hziy');
    medication_mappings.set('methotrexate', 'methotrexate');
    medication_mappings.set('fluorouracil', 'fluorouracil');
    medication_mappings.set('vinorelbine', 'vinorelbine');
    medication_mappings.set('eribulin', 'eribulin');  // Originally spelled  eribuline, updated to eribulin.
    medication_mappings.set('etoposide', 'etoposide');
    medication_mappings.set('pemetrexed', 'pemetrexed');
    medication_mappings.set('irinotecan', 'irinotecan');
    medication_mappings.set('topotecan', 'topotecan');
    medication_mappings.set('ifosfamide', 'ifosfamide');
    medication_mappings.set('nivolumab', 'nivolumab');
    medication_mappings.set('avelumab', 'avelumab');
    medication_mappings.set('thiotepa', 'thiotepa');
    medication_mappings.set('olaparib', 'olaparib');
    medication_mappings.set('talazoparib', 'talazoparib');
    medication_mappings.set('atezolizumab', 'atezolizumab');
    medication_mappings.set('pembrolizumab', 'pembrolizumab');
    medication_mappings.set('zoledronic_acid', 'zoledronic_acid');
    medication_mappings.set('denosumab', 'denosumab');
    medication_mappings.set('bevacizumab', 'bevacizumab');
    medication_mappings.set('everolimus', 'everolimus');
    medication_mappings.set('progesterone', 'progesterone'); // Originally spelled progestin, updated to progesterone.
    medication_mappings.set('fluoxymesterone', 'fluoxymesterone');
    medication_mappings.set('estrogen', 'high_dose_estrogen');  // Standard estrogen is the medication used for high_dose_estrogen, but Trialjectory expects high_dose_estrogen.
    medication_mappings.set('palbociclib', 'palbociclib');
    medication_mappings.set('abemaciclib', 'abemaciclib');
    medication_mappings.set('alpelisib', 'alpelisib');
    medication_mappings.set('ribociclib', 'ribociclib');
    medication_mappings.set('pertuzumab_trastuzumab_hyaluronidase', 'pertuzumab_trastuzumab_hyaluronidase');
    medication_mappings.set('goserelin', 'goserelin'); // THIS MEDICATION IS NOT CURRENTLY SUPPORTED BY TRIALJECTORY. WE WILL NEED TO DISCUSS THIS WITH THEM.
    medication_mappings.set('leuprolide', 'leuprolide'); // THIS MEDICATION IS NOT CURRENTLY SUPPORTED BY TRIALJECTORY. WE WILL NEED TO DISCUSS THIS WITH THEM.
    // WE HAVE SINCE DISCUSSED THESE MEDICATIONS WITH THEM, WAITING FOR THEM TO PROCEED.

    const medication_values: string[] = [];

    // Iterate through the mappings and append when a code is satisfied.
    for (const medication_name of medication_mappings.keys()) {
      if (this.cancerRelatedMedicationStatement.some((code) => ExtractedMCODE.code_mapper.codeIsInMapping(code, medication_name))) {
        medication_values.push(medication_mappings.get(medication_name));
      }
    }

    // Filter any duplicate values.
    medication_values.filter((a, b) => medication_values.indexOf(a) === b)

    return medication_values;
  }
 }