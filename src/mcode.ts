import { fhirclient } from 'fhirclient/lib/types';
import * as fhirpath from 'fhirpath';

import profile_system_codes_json from '../data/profile-system-codes-json.json';
import { fhir } from 'clinical-trial-matching-service';
import { CodeProfile, ProfileSystemCodes } from './profileSystemLogic';

const profile_system_codes = profile_system_codes_json as ProfileSystemCodes;

export type FHIRPath = string;

export interface Coding {
  system?: string;
  code?: string;
  display?: string;
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

export interface PrimaryCancerCondition {
  clinicalStatus?: Coding[];
  coding?: Coding[];
  histologyMorphologyBehavior?: Coding[];
}

export interface SecondaryCancerCondition {
  clinicalStatus?: Coding[];
  coding?: Coding[];
  bodySite?: Coding[];
}

export interface CancerRelatedRadiationProcedure {
  coding?: Coding[];
  bodySite?: Coding[];
}

export interface TumorMarker {
  code?: Coding[];
  valueQuantity?: Quantity[];
  valueRatio?: Ratio[];
  valueCodeableConcept?: Coding[];
  interpretation?: Coding[];
}

export interface CancerGeneticVariant {
  code?: Coding[];
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

// extracted MCODE info
export class ExtractedMCODE {
  primaryCancerCondition: PrimaryCancerCondition[];
  TNMClinicalStageGroup: Coding[];
  TNMPathologicalStageGroup: Coding[];
  secondaryCancerCondition: SecondaryCancerCondition[];
  birthDate: string;
  tumorMarker: TumorMarker[];
  cancerGeneticVariant: CancerGeneticVariant[];
  cancerRelatedRadiationProcedure: CancerRelatedRadiationProcedure[];
  cancerRelatedSurgicalProcedure: Coding[];
  cancerRelatedMedicationStatement: Coding[];
  ecogPerformaceStatus: number;
  karnofskyPerformanceStatus: number;

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
          tempTumorMarker.code = this.lookup(resource, 'code.coding') as Coding[];
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
          tempCGV.code = this.lookup(resource, 'code.coding') as Coding[]; // not used in logic
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
          this.cancerRelatedSurgicalProcedure = this.addCoding(
            this.cancerRelatedSurgicalProcedure,
            this.lookup(resource, 'code.coding') as Coding[]
          );
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
      this.cancerRelatedSurgicalProcedure = [] as Coding[];
    }
    if (!this.cancerRelatedMedicationStatement) {
      this.cancerRelatedMedicationStatement = [] as Coding[];
    }
    if (!this.cancerGeneticVariant) {
      this.cancerGeneticVariant = [] as CancerGeneticVariant[];
    }
    // Checking if the performanceStatus exists and also making sure it's not 0, as 0 is a valid score
    if (!this.ecogPerformaceStatus && this.ecogPerformaceStatus != 0) {
      this.ecogPerformaceStatus = -1;
    }
    if (!this.karnofskyPerformanceStatus && this.karnofskyPerformanceStatus != 0) {
      this.karnofskyPerformanceStatus = -1;
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

  // Age
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
    return Math.round(millisecondsAge / milliseconds1Years);
  }

  // Get Tumor Marker Values.
  getTumorMarkerValue(): string[] {

    // TODO: Trialjectory Biomarkers not used: [atm, cdh1, chek2, nbn, nf1, palb2, pten, stk11, p53, esr1, pik3ca, pdl1, ntrk_fusion]
    // Tialjectory Biomarkers used: [her2 (+ and -), pr (+ and -), er (+ and -), rb (+ only, should there be a -?), fgfr, brca1, brca2]

    if (this.tumorMarker.length == 0 && this.cancerGeneticVariant.length == 0) {
      // Should return an empty array as opposed to 'NOT_SURE'? Or this is maybe not even necessary since it would just return an empty array at the end of the function anyway.
      return [];
    }

    // Array that Tumor Marker values will be added to as they apply.
    let tumorMarkerArray: string[];

    if (this.tumorMarker.some((tm) => this.isHER2Negative(tm, ['0', '1', '2', '1+', '2+']))) {
      // NOTE: HER2- check always uses ['0', '1', '2', '1+', '2+'] as the quanitites by default.
      tumorMarkerArray.push('her2-');
    }

    if ( this.tumorMarker.some((tm) => this.tumorMarker.some((tm) => this.isHER2Positive(tm)))){
      tumorMarkerArray.push('her2+');
    }

    if (this.tumorMarker.some((tm) => this.isPRNegative(tm, 1))){
      // NOTE: PR- check always uses 1 as the matric parameter by default.
      tumorMarkerArray.push('pr-');
    }

    if (this.tumorMarker.some((tm) => this.isPRPositive(tm, 1))){
      // NOTE: PR+ check always uses 1 as the matric parameter by default.
      tumorMarkerArray.push('pr+');
    }

    if (this.tumorMarker.some((tm) => this.isERNegative(tm, 1))) {
      // NOTE: ER- check always uses 1 as the matric parameter by default.
      tumorMarkerArray.push('er-');
    }

    if (this.tumorMarker.some((tm) => this.isERPositive(tm, 1))) {
      // NOTE: ER+ check always uses 1 as the matric parameter by default.
      tumorMarkerArray.push('er+');
    }

    if (this.tumorMarker.some((tm) => this.isRBPositive(tm, 50))) {
      // NOTE: RB+ check always uses 50 as the matric parameter by default.
      tumorMarkerArray.push('rb+');
    }

    if (this.tumorMarker.some((tm) => this.isFGFRAmplification(tm, 1))) {
      // NOTE: FGFR check always uses 1 as the matric parameter by default.
      tumorMarkerArray.push('fgfr');
    }

    // TODO: Not sure how to treat the distinction between BRCA#, BRCA#-SOMATIC, BRCA#-GERMLINE. Assuming it should just do the BRCA# check, but I'm leaving the germline and somatic variations for now just in case.

    // BRCA1-Germline (IS THIS NECESSARY?)
    if (
      this.cancerGeneticVariant.some(
        (cancGenVar) =>
          this.isBRCA(cancGenVar, '1100') &&
          cancGenVar.component.genomicsSourceClass.some((genSourceClass) =>
            genSourceClass.valueCodeableConcept.coding.some(
              (valCodeCon) => this.normalizeCodeSystem(valCodeCon.system) == 'LOINC' && valCodeCon.code == 'LA6683-2'
            )
          )
      )
    ) {
      tumorMarkerArray.push('brca1');
    }
    // BRCA2-Germline (IS THIS NECESSARY?)
    if (
      this.cancerGeneticVariant.some(
        (cancGenVar) =>
          this.isBRCA(cancGenVar, '1101') &&
          cancGenVar.component.genomicsSourceClass.some((genSourceClass) =>
            genSourceClass.valueCodeableConcept.coding.some(
              (valCodeCon) => this.normalizeCodeSystem(valCodeCon.system) == 'LOINC' && valCodeCon.code == 'LA6683-2'
            )
          )
      )
    ) {
      tumorMarkerArray.push('brca2');
    }
    // BRCA1-somatic (IS THIS NECESSARY?)
    if (
      this.cancerGeneticVariant.some(
        (cancGenVar) =>
          this.isBRCA(cancGenVar, '1100') &&
          cancGenVar.component.genomicsSourceClass.some((genSourceClass) =>
            genSourceClass.valueCodeableConcept.coding.some(
              (valCodeCon) => this.normalizeCodeSystem(valCodeCon.system) == 'LOINC' && valCodeCon.code == 'LA6684-0'
            )
          )
      )
    ) {
      tumorMarkerArray.push('brca1');
    }
    // BRCA2-somatic (IS THIS NECESSARY?)
    if (
      this.cancerGeneticVariant.some(
        (cancGenVar) =>
          this.isBRCA(cancGenVar, '1101') &&
          cancGenVar.component.genomicsSourceClass.some((genSourceClass) =>
            genSourceClass.valueCodeableConcept.coding.some(
              (valCodeCon) => this.normalizeCodeSystem(valCodeCon.system) == 'LOINC' && valCodeCon.code == 'LA6684-0'
            )
          )
      )
    ) {
      tumorMarkerArray.push('brca2');
    }
    // BRCA1
    if (this.cancerGeneticVariant.some((cancGenVar) => this.isBRCA(cancGenVar, '1100'))) {
      tumorMarkerArray.push('brca1');
    }
    // BRCA2
    if (this.cancerGeneticVariant.some((cancGenVar) => this.isBRCA(cancGenVar, '1101'))) {
      tumorMarkerArray.push('brca2');
    }

    // Finally, return the fully appended array.
    return tumorMarkerArray;
  }
  isBRCA(cancGenVar: CancerGeneticVariant, brcaCode: string): boolean {
    return (
      cancGenVar.component.geneStudied.some((geneStudied) =>
        geneStudied.valueCodeableConcept.coding.some(
          (valCodeCon) => this.normalizeCodeSystem(valCodeCon.system) == 'HGNC' && valCodeCon.code == brcaCode
        )
      ) &&
      (cancGenVar.valueCodeableConcept.some(
        (valCodeCon) =>
          (this.normalizeCodeSystem(valCodeCon.system) == 'SNOMED' && valCodeCon.code == '10828004') ||
          (this.normalizeCodeSystem(valCodeCon.system) == 'LOINC' && valCodeCon.code == 'LA9633-4') ||
          (this.normalizeCodeSystem(valCodeCon.system) == 'HL7' && valCodeCon.code == 'POS')
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
  isHER2Positive(tumorMarker: TumorMarker): boolean {
    return (
      tumorMarker.code.some((code) => this.codeIsInSheet(code, 'Biomarker-HER2')) &&
      (tumorMarker.valueCodeableConcept.some(
        (valCodeCon) =>
          (this.normalizeCodeSystem(valCodeCon.system) == 'SNOMED' && valCodeCon.code == '10828004') ||
          (this.normalizeCodeSystem(valCodeCon.system) == 'HL7' && valCodeCon.code == 'POS')
      ) ||
        tumorMarker.interpretation.some(
          (interp) =>
            (interp.code == 'POS' || interp.code == 'DET' || interp.code == 'H') &&
            interp.system == 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html'
        ) ||
        tumorMarker.valueQuantity.some((valQuant) =>
          this.quantityMatch(valQuant.value, valQuant.code, ['3', '3+'], '=')
        ))
    );
  }
  isHER2Negative(tumorMarker: TumorMarker, quantities: string[]): boolean {
    return (
      (tumorMarker.valueCodeableConcept.some(
        (valCodeCon) =>
          (this.normalizeCodeSystem(valCodeCon.system) == 'SNOMED' && valCodeCon.code == '260385009') ||
          (this.normalizeCodeSystem(valCodeCon.system) == 'HL7' && valCodeCon.code == 'NEG')
      ) ||
        tumorMarker.interpretation.some(
          (interp) =>
            (interp.code == 'L' || interp.code == 'N' || interp.code == 'NEG' || interp.code == 'ND') &&
            interp.system == 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html'
        ) || // Information on Interpretation values can be found at: http://hl7.org/fhir/R4/valueset-observation-interpretation.html
        tumorMarker.valueQuantity.some((valQuant) =>
          this.quantityMatch(valQuant.value, valQuant.code, quantities, '=')
        )) &&
      tumorMarker.code.some((code) => this.codeIsInSheet(code, 'Biomarker-HER2'))
    );
  }
  isPRPositive(tumorMarker: TumorMarker, metric: number): boolean {
    return (
      (tumorMarker.valueCodeableConcept.some(
        (valCodeCon) =>
          (this.normalizeCodeSystem(valCodeCon.system) == 'SNOMED' && valCodeCon.code == '10828004') ||
          (this.normalizeCodeSystem(valCodeCon.system) == 'HL7' && valCodeCon.code == 'POS')
      ) ||
        tumorMarker.interpretation.some(
          (interp) =>
            (interp.code == 'POS' || interp.code == 'DET' || interp.code == 'H') &&
            interp.system == 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html'
        ) ||
        tumorMarker.valueQuantity.some((valQuant) =>
          this.quantityMatch(valQuant.value, valQuant.code, [metric], '>=', '%')
        ) ||
        tumorMarker.valueRatio.some((valRat) => this.ratioMatch(valRat.numerator, valRat.denominator, metric, '>='))) &&
      tumorMarker.code.some((code) => this.codeIsInSheet(code, 'Biomarker-PR'))
    );
  }
  isPRNegative(tumorMarker: TumorMarker, metric: number): boolean {
    return (
      (tumorMarker.valueCodeableConcept.some(
        (valCodeCon) =>
          (this.normalizeCodeSystem(valCodeCon.system) == 'SNOMED' && valCodeCon.code == '260385009') ||
          (this.normalizeCodeSystem(valCodeCon.system) == 'HL7' && valCodeCon.code == 'NEG')
      ) ||
        tumorMarker.interpretation.some(
          (interp) =>
            (interp.code == 'L' || interp.code == 'N' || interp.code == 'NEG' || interp.code == 'ND') &&
            interp.system == 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html'
        ) ||
        tumorMarker.valueQuantity.some(
          (valQuant) =>
            this.quantityMatch(valQuant.value, valQuant.code, [metric], '<', '%') ||
            this.quantityMatch(valQuant.value, valQuant.code, [0], '=')
        ) ||
        tumorMarker.valueRatio.some((valRat) => this.ratioMatch(valRat.numerator, valRat.denominator, metric, '<'))) &&
      tumorMarker.code.some((code) => this.codeIsInSheet(code, 'Biomarker-PR'))
    );
  }
  isERPositive(tumorMarker: TumorMarker, metric: number): boolean {
    return (
      (tumorMarker.valueCodeableConcept.some(
        (valCodeCon) =>
          (this.normalizeCodeSystem(valCodeCon.system) == 'SNOMED' && valCodeCon.code == '10828004') ||
          (this.normalizeCodeSystem(valCodeCon.system) == 'HL7' && valCodeCon.code == 'POS')
      ) ||
        tumorMarker.valueRatio.some((valRat) => this.ratioMatch(valRat.numerator, valRat.denominator, metric, '>=')) ||
        tumorMarker.interpretation.some(
          (interp) =>
            (interp.code == 'POS' || interp.code == 'DET' || interp.code == 'H') &&
            interp.system == 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html'
        ) ||
        tumorMarker.valueQuantity.some((valQuant) =>
          this.quantityMatch(valQuant.value, valQuant.code, [metric], '>=', '%')
        )) &&
      tumorMarker.code.some((code) => this.codeIsInSheet(code, 'Biomarker-ER'))
    );
  }
  isERNegative(tumorMarker: TumorMarker, metric: number): boolean {
    return (
      (tumorMarker.valueCodeableConcept.some(
        (valCodeCon) =>
          (this.normalizeCodeSystem(valCodeCon.system) == 'SNOMED' && valCodeCon.code == '260385009') ||
          (this.normalizeCodeSystem(valCodeCon.system) == 'HL7' && valCodeCon.code == 'NEG')
      ) ||
        tumorMarker.valueRatio.some((valRat) => this.ratioMatch(valRat.numerator, valRat.denominator, metric, '<')) ||
        tumorMarker.interpretation.some(
          (interp) =>
            (interp.code == 'L' || interp.code == 'N' || interp.code == 'NEG' || interp.code == 'ND') &&
            interp.system == 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html'
        ) ||
        tumorMarker.valueQuantity.some(
          (valQuant) =>
            this.quantityMatch(valQuant.value, valQuant.code, [metric], '<', '%') ||
            this.quantityMatch(valQuant.value, valQuant.code, [0], '=')
        )) &&
      tumorMarker.code.some((code) => this.codeIsInSheet(code, 'Biomarker-ER'))
    );
  }
  isFGFRAmplification(tumorMarker: TumorMarker, metric: number): boolean {
    return (
      (tumorMarker.valueCodeableConcept.some(
        (valCodeCon) => this.normalizeCodeSystem(valCodeCon.system) == 'SNOMED' && valCodeCon.code == '10828004'
      ) ||
        tumorMarker.valueRatio.some((valRat) => this.ratioMatch(valRat.numerator, valRat.denominator, metric, '>=')) ||
        tumorMarker.interpretation.some(
          (interp) =>
            (interp.code == 'POS' || interp.code == 'DET' || interp.code == 'H') &&
            interp.system == 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html'
        ) ||
        tumorMarker.valueQuantity.some((valQuant) =>
          this.quantityMatch(valQuant.value, valQuant.code, [metric], '>=', '%')
        )) &&
      tumorMarker.code.some((code) => this.codeIsInSheet(code, 'Biomarker-FGFR'))
    );
  }
  isRBPositive(tumorMarker: TumorMarker, metric: number): boolean {
    return (
      (tumorMarker.valueQuantity.some((valQuant) =>
        this.quantityMatch(valQuant.value, valQuant.code, [metric], '>', '%')
      ) ||
        tumorMarker.valueCodeableConcept.some(
          (valCodeCon) =>
            (this.normalizeCodeSystem(valCodeCon.system) == 'SNOMED' && valCodeCon.code == '10828004') ||
            (this.normalizeCodeSystem(valCodeCon.system) == 'HL7' && valCodeCon.code == 'POS')
        ) ||
        tumorMarker.valueRatio.some((valRat) => this.ratioMatch(valRat.numerator, valRat.denominator, metric, '>')) ||
        tumorMarker.interpretation.some(
          (interp) =>
            (interp.code == 'POS' || interp.code == 'DET' || interp.code == 'H') &&
            interp.system == 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html'
        )) &&
      tumorMarker.code.some((code) => this.codeIsInSheet(code, 'Biomarker-RB'))
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

  // Return whether any of the codes in a given coding exist in the given profiles (sheets).
  codeIsInSheet(coding: Coding, ...sheetNames: string[]): boolean {
    const system = this.normalizeCodeSystem(coding.system);
    for (const sheetName of sheetNames) {
      const codeProfile: CodeProfile = profile_system_codes[sheetName] as CodeProfile; // Pull the codes for the profile
      if (codeProfile == undefined) {
        console.error('Code Profile ' + sheetName + ' is undefined.');
      }
      let codeSet: { code: string }[] = codeProfile[system] as { code: string }[]; // Pull the system codes from the codes
      if (!codeSet) {
        codeSet = [];
      }
      // Check that the current code matches the given code.
      for (const currentCode of codeSet) {
        if (coding.code == currentCode.code || coding.display == currentCode.code) {
          return true;
        }
      }
    }
    return false;
  }

  // Normalize the code system.
  normalizeCodeSystem(codeSystem: string): string {
    const lowerCaseCodeSystem: string = codeSystem.toLowerCase();
    if (lowerCaseCodeSystem.includes('snomed')) {
      return 'SNOMED';
    } else if (lowerCaseCodeSystem.includes('rxnorm')) {
      return 'RxNorm';
    } else if (lowerCaseCodeSystem.includes('icd-10')) {
      return 'ICD-10';
    } else if (lowerCaseCodeSystem.includes('ajcc') || lowerCaseCodeSystem.includes('cancerstaging.org')) {
      return 'AJCC';
    } else if (lowerCaseCodeSystem.includes('loinc')) {
      return 'LOINC';
    } else if (lowerCaseCodeSystem.includes('nih')) {
      return 'NIH';
    } else if (lowerCaseCodeSystem.includes('hgnc') || lowerCaseCodeSystem.includes('genenames.org')) {
      return 'HGNC';
    } else if (lowerCaseCodeSystem.includes('hl7')) {
      return 'HL7';
    } else {
      return '';
    }
  }

 }
