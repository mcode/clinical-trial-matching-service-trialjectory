import { CodeMapper, CodeSystemEnum, Quantity, TumorMarker, CancerGeneticVariant, Ratio, BaseFhirResource, CancerRelatedSurgicalProcedure, CancerRelatedRadiationProcedure, PrimaryCancerCondition, mCODEextractor } from 'clinical-trial-matching-service';
import * as fhir from 'fhir/r4';
import profile_system_codes from '../data/profile-system-codes.json';
//import system_metastasis_codes_json from '../data/system-metastasis-codes-json.json';
import primary_cancer_condition_mapping_json from '../data/primary-cancer-condition-type-mapping.json';

//const metastasis_codes = system_metastasis_codes_json as {[key:string]: {[key:string]: string}};
const primary_cancer_condition_mapping = primary_cancer_condition_mapping_json as {[key:string]: string};

/**
 * A class that describes the mapping logic for Trialjectory.
 */
export class TrialjectoryMappingLogic {

  /**
   * The code mapping object that maps profiles to codes.
   */
  static codeMapper = new CodeMapper(profile_system_codes);

  protected extractedMcode: mCODEextractor;

  constructor(patientBundle: fhir.Bundle) {
    this.extractedMcode = new mCODEextractor(patientBundle);
  }

  /**
   * ECOG Score.
   * @returns
   */
  getECOGScore(): number | null {
    const ecog = this.extractedMcode.ecogPerformanceStatus;
    if(ecog == -1) {
      return null;
    }
    return ecog;
  }

  /**
   * Karnofsky Score.
   * @returns
   */
  getKarnofskyScore(): number {
    const karnofsky = this.extractedMcode.karnofskyPerformanceStatus;
    if(karnofsky == -1) {
      return null;
    }
    return karnofsky;
  }

  /**
   * Primary Cancer Mapping.
   * @returns
   */
  getPrimaryCancerValues(): string {
    const extractedPrimaryCancerConditions = this.extractedMcode.primaryCancerConditions;
    const stage:string = this.getStageValues();

    console.log("Extracted", extractedPrimaryCancerConditions);

    // If no primaryCancerCondition -- go ahead and return null
    if (extractedPrimaryCancerConditions.length == 0) {
      return null;
    }

    // Because TrialJectory only supports 1 string as the cancerType, we're going to just go with the first one available
    for (const primaryCancerCondition of extractedPrimaryCancerConditions) {
      // First map the primary cancer condition
      const pccNames = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(primaryCancerCondition.coding);

      console.log("PCC Names", pccNames);
      const cancerCondition = pccNames.find( cancerCondition => cancerCondition in primary_cancer_condition_mapping);
      console.log("CancerCondition", cancerCondition);

      if (cancerCondition === undefined) return null;

      const majorType = primary_cancer_condition_mapping[cancerCondition]

      console.log("majorType", majorType);
      const histologyMorphologies = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(primaryCancerCondition.histologyMorphologyBehavior);
      const statuses:string[] = primaryCancerCondition.clinicalStatus.map(code => code?.display?.toLowerCase());

      // --------------------------------------------------
      // BREAST
      if (majorType == "breast") {
        console.log("BREAST");
        // Not on "Cancer-Breast" sheet and clinical status is current
        if (!pccNames.includes("Cancer-Breast") && statuses.includes("current")) {
          // Stage 1-4 (equivalent to stage not 0)
          if (stage && !['0', '0.1', '0.2'].includes(stage)) {
            return "concomitant_invasive_malignancies";
          }
          // Not "Cancer-Breast" and not "Cancer-skin", but "current"
          if (!pccNames.includes("Cancer-Skin")) {
            return "other_malignancy_except_skin_or_cervical";
          }
        }

        if (pccNames.includes("Cancer-Invasive-Breast") && statuses.includes("recurrent")) {
          return "invasive_breast_cancer_and_recurrent";
        }

        if (pccNames.includes("Cancer-Cervical") && statuses.includes("current") && ['0', '0.1', '0.2'].includes(stage)) {
          return "other_malignancy_except_skin_or_cervical";
        }

        // If PrimaryCancerCode = Cancer-Breast
        if (pccNames.includes("Cancer-Breast")) {
          if (statuses.includes("recurrent")) {
            // Recurrent and histology-morphology is "Morphology-Invasive"
            if (histologyMorphologies.includes("Morphology-Invasive")) {
              return "invasive_breast_cancer_and_recurrent";
            }

            // Recurrent but not Morphology-Invasive
            return "locally_recurrent";
          }

          return "breast_cancer";
        }
      }
      // --------------------------------------------------
      // LUNG
      else if (majorType == "lung") {
        console.log("LUNG");
        // (1) Any in Lung for PrimaryCancer Condition AND...
        const sclc_limited_histo_morph:string[] = [
          "Small cell carcinoma (morphologic abnormality)",
          "Small cell neuroendocrine carcinoma (morphologic abnormality)",
          "Small cell eccrine carcinoma (morphologic abnormality)"
        ];

        const sclc_extensive_histo_morph:string[] = [
          "Small cell carcinoma (morphologic abnormality)",
          "Small cell neuroendocrine carcinoma (morphologic abnormality)",
          "Small cell eccrine carcinoma (morphologic abnormality)"
        ];

        const carcinoid_histo_morph:string[] = [
          "Malignant carcinoid tumor (morphologic abnormality)",
          "Carcinoid bronchial adenoma (morphologic abnormality)",
          "Monodermal teratoma, carcinoid (morphologic abnormality)",
          "Carcinoid tumor - argentaffin (morphologic abnormality)",
          "Carcinoid tumor - morphology (morphologic abnormality)",
          "Tubular carcinoid (morphologic abnormality)",
          "Atypical carcinoid tumor (morphologic abnormality)",
          "Enterochromaffin-like cell carcinoid (morphologic abnormality)",
          "Adenocarcinoid tumor (morphologic abnormality)",
          "Composite carcinoid (morphologic abnormality)",
          "Enterochromaffin cell carcinoid (morphologic abnormality)",
          "Strumal carcinoid (morphologic abnormality)",
          "Goblet cell carcinoid (morphologic abnormality)"
        ];

        // (1) + TNMClinical/PathologicalStageGroup = 1/2/3 and Specific HistoMorph
        if (histologyMorphologies.some(hm => sclc_limited_histo_morph.includes(hm)) && ["1", "2", "3", "3.1", "3.2", "3.2", "3.3", "3.4"].includes(stage)) {
          return "sclc_limited_stage"
        }

        // (1) + TNMClinical/PathologicalStageGroup = 4 and Specific HistoMorph
        if (histologyMorphologies.some(hm => sclc_extensive_histo_morph.includes(hm)) && ["4"].includes(stage)) {
          return "sclc_extensive_stage"
        }

        // (1) + Specific HistoMorph
        if (histologyMorphologies.some(hm => carcinoid_histo_morph.includes(hm))) {
          return "carcinoid"
        }

        // (2) Specific PrimaryCancerConditions AND...
        const sclc_limited_stage:string[] = [
          "Small cell carcinoma of lung (disorder)",
          "Primary small cell carcinoma of left lung (disorder)",
          "Primary small cell carcinoma of right lung (disorder)",
          "Primary small cell carcinoma of upper lobe of left lung (disorder)",
          "Primary small cell carcinoma of lower lobe of left lung (disorder)",
          "Primary small cell carcinoma of lower lobe of right lung (disorder)",
          "Primary small cell carcinoma of upper lobe of right lung (disorder)",
          "Primary small cell carcinoma of middle lobe of right lung (disorder)",
          "Primary small cell malignant neoplasm of lung, TNM stage 3 (disorder)",
          "Primary small cell malignant neoplasm of lung, TNM stage 2 (disorder)",
          "Primary small cell malignant neoplasm of lung, TNM stage 1 (disorder)",
          "Oat cell carcinoma of lung (disorder)",
        ];

        const sclc_extensive_stage_with_stage_group:string[] = [
          "Small cell carcinoma of lung (disorder)",
          "Primary small cell carcinoma of left lung (disorder)",
          "Primary small cell carcinoma of right lung (disorder)",
          "Primary small cell carcinoma of upper lobe of left lung (disorder)",
          "Primary small cell carcinoma of lower lobe of left lung (disorder)",
          "Primary small cell carcinoma of lower lobe of right lung (disorder)",
          "Primary small cell carcinoma of upper lobe of right lung (disorder)",
          "Primary small cell carcinoma of middle lobe of right lung (disorder)",
          "Primary small cell malignant neoplasm of lung, TNM stage 4 (disorder)",
          "Oat cell carcinoma of lung (disorder)",
          "Extensive stage primary small cell carcinoma of lung (disorder)"
        ];

        const sclc_extensive_stage:string[] = [
          "Extensive stage primary small cell carcinoma of lung (disorder)",
          "Primary small cell malignant neoplasm of lung, TNM stage 4 (disorder)"
        ];

        const carcinoid:string[] = ["Carcinoid tumor of lung (disorder)"]

        // (2) + TNMClinical/PathologicalStageGroup = 1/2/3
        if (pccNames.some(pcc => sclc_limited_stage.includes(pcc)) && ["1", "2", "3", "3.1", "3.2", "3.3", "3.4"].includes(stage))  {
          return "sclc_limited_stage";
        }

        // (2) + TNMClinical/PathologicalStageGroup = 4
        if (pccNames.some(pcc => sclc_extensive_stage_with_stage_group.includes(pcc)) && ["4"].includes(stage)) {
          return "sclc_extensive_stage";
        }

        // Just (2)
        if (pccNames.some(pcc => carcinoid.includes(pcc))) return "carcinoid";
        if (pccNames.some(pcc => sclc_extensive_stage.includes(pcc))) return "sclc_extensive_stage";

        // Didn't fulfill any of the other logic but lung -- so return basic mapping
        return "nsclc"
      }
      // --------------------------------------------------
      // COLON
      else if (majorType == "crc") {
        console.log("COLON");
        // Subgroups of colon cancer:
        const colon:string[] = [
          "Malignant neoplasm of colon (disorder)",
          "Malignant tumor of sigmoid colon (disorder)",
          "Malignant tumor of ascending colon (disorder)",
          "Malignant tumor of transverse colon (disorder)",
          "Malignant tumor of descending colon (disorder)",
          "Malignant tumor of rectosigmoid junction (disorder)",
          "Malignant tumor of hepatic flexure (disorder)",
          "Malignant tumor of splenic flexure (disorder)",
          "Hereditary nonpolyposis colon cancer (disorder)",
          "Overlapping malignant neoplasm of colon (disorder)",
          "Primary malignant neoplasm of colon (disorder)",
          "Primary malignant neoplasm of sigmoid colon (disorder)",
          "Primary malignant neoplasm of ascending colon (disorder)",
          "Primary malignant neoplasm of descending colon (disorder)",
          "Primary malignant neoplasm of transverse colon (disorder)",
          "Primary malignant mesenchymal neoplasm of colon (disorder)",
          "Primary malignant neuroendocrine neoplasm of colon (disorder)",
          "Primary malignant neoplasm of hepatic flexure of colon (disorder)",
          "Primary malignant neoplasm of splenic flexure of colon (disorder)",
          "Primary malignant neoplasm of overlapping sites of colon (disorder)",
          "Primary malignant gastrointestinal stromal neoplasm of colon (disorder)",
          "Primary adenocarcinoma of descending colon (disorder)",
          "Primary adenocarcinoma of ascending colon (disorder)",
          "Primary adenocarcinoma of rectosigmoid junction (disorder)",
          "Overlapping malignant neoplasm of colon and rectum (disorder)",
          "Primary adenocarcinoma of colon (disorder)",
          "Familial colorectal cancer type X (disorder)",
          "Kaposi sarcoma of colon (disorder)",
          "Leiomyosarcoma of colon (disorder)",
          "Malignant neoplasm of colon and/or rectum (disorder)",
          "Squamous cell carcinoma of colon (disorder)",
          "Microsatellite instability-high colorectal cancer (disorder)",
          "Malignant carcinoid tumor of colon (disorder)",
          "Primary adenocarcinoma of descending colon and splenic flexure (disorder)",
          "Primary neuroendocrine carcinoma of colon (disorder)",
          "Primary adenocarcinoma of transverse colon (disorder)",
          "Primary adenocarcinoma of ascending colon and right flexure (disorder)",
          "Adenocarcinoma of rectosigmoid junction (disorder)",
          "Local recurrence of malignant tumor of colon (disorder)",
          "Carcinoma of splenic flexure (disorder)",
          "Carcinoma of hepatic flexure (disorder)",
          "Carcinoma of descending colon (disorder)",
          "Carcinoma of transverse colon (disorder)",
          "Carcinoma of ascending colon (disorder)",
          "Adenocarcinoma of sigmoid colon (disorder)",
          "Metastasis to colon of unknown primary (disorder)",
          "Carcinoma of sigmoid colon (disorder)",
          "Carcinoma of the rectosigmoid junction (disorder)",
          "Carcinoma of colon (disorder)"
        ];
        const rectal:string[] = [
          "Malignant neoplasm of colon (disorder)",
          "Malignant tumor of sigmoid colon (disorder)",
          "Malignant tumor of ascending colon (disorder)",
          "Malignant tumor of transverse colon (disorder)",
          "Malignant tumor of descending colon (disorder)",
          "Malignant tumor of rectosigmoid junction (disorder)",
          "Malignant tumor of hepatic flexure (disorder)",
          "Malignant tumor of splenic flexure (disorder)",
          "Hereditary nonpolyposis colon cancer (disorder)",
          "Overlapping malignant neoplasm of colon (disorder)",
          "Primary malignant neoplasm of colon (disorder)",
          "Primary malignant neoplasm of sigmoid colon (disorder)",
          "Primary malignant neoplasm of ascending colon (disorder)",
          "Primary malignant neoplasm of descending colon (disorder)",
          "Primary malignant neoplasm of transverse colon (disorder)",
          "Primary malignant mesenchymal neoplasm of colon (disorder)",
          "Primary malignant neuroendocrine neoplasm of colon (disorder)",
          "Primary malignant neoplasm of hepatic flexure of colon (disorder)",
          "Primary malignant neoplasm of splenic flexure of colon (disorder)",
          "Primary malignant neoplasm of overlapping sites of colon (disorder)",
          "Primary malignant gastrointestinal stromal neoplasm of colon (disorder)",
          "Primary adenocarcinoma of descending colon (disorder)",
          "Primary adenocarcinoma of ascending colon (disorder)",
          "Primary adenocarcinoma of rectosigmoid junction (disorder)",
          "Overlapping malignant neoplasm of colon and rectum (disorder)",
          "Primary adenocarcinoma of colon (disorder)",
          "Familial colorectal cancer type X (disorder)",
          "Kaposi sarcoma of colon (disorder)",
          "Leiomyosarcoma of colon (disorder)",
          "Malignant neoplasm of colon and/or rectum (disorder)",
          "Squamous cell carcinoma of colon (disorder)",
          "Microsatellite instability-high colorectal cancer (disorder)",
          "Malignant carcinoid tumor of colon (disorder)",
          "Primary adenocarcinoma of descending colon and splenic flexure (disorder)",
          "Primary neuroendocrine carcinoma of colon (disorder)",
          "Primary adenocarcinoma of transverse colon (disorder)",
          "Primary adenocarcinoma of ascending colon and right flexure (disorder)",
          "Adenocarcinoma of rectosigmoid junction (disorder)",
          "Local recurrence of malignant tumor of colon (disorder)",
          "Carcinoma of splenic flexure (disorder)",
          "Carcinoma of hepatic flexure (disorder)",
          "Carcinoma of descending colon (disorder)",
          "Carcinoma of transverse colon (disorder)",
          "Carcinoma of ascending colon (disorder)",
          "Adenocarcinoma of sigmoid colon (disorder)",
          "Metastasis to colon of unknown primary (disorder)",
          "Carcinoma of sigmoid colon (disorder)",
          "Carcinoma of the rectosigmoid junction (disorder)",
          "Carcinoma of colon (disorder)"
        ];
        const familial:string[] = [
          "Hereditary nonpolyposis colon cancer (disorder)",
          "Familial colorectal cancer type X (disorder)",
          "Hereditary nonpolyposis colon cancer (disorder)"
        ]

        // Colon is one-to-one mapping so just return what subgroup it is in
        if (pccNames.some(pcc => colon.includes(pcc))) return "colon";
        if (pccNames.some(pcc => rectal.includes(pcc))) return "rectal";
        if (pccNames.some(pcc => familial.includes(pcc))) return "familial";
      }
      // --------------------------------------------------
      // BRAIN
      else if (majorType == "brain") {
        console.log("BRAIN");
        // (1) Any in Brain for PrimaryCancer Condition AND...

        const grade_1_astro_histo_morph:string[] = ["Astrocytoma low grade (morphologic abnormality)"];
        const gbm_histo_morph:string[] = [
          "Glioblastoma (morphologic abnormality)",
          "Giant cell glioblastoma (morphologic abnormality)",
          "Small cell glioblastoma (morphologic abnormality)",
          "Epithelioid glioblastoma (morphologic abnormality)",
          "Gliosarcoma (morphologic abnormality)",
          "Glioblastoma isocitrate dehydrogenase wildtype (morphologic abnormality)",
          "Glioblastoma isocitrate dehydrogenase 1 mutation (morphologic abnormality)",
          "Monstrocellular sarcoma (morphologic abnormality)"
        ];

        // (1) + Specific histomorphs
        if (histologyMorphologies.some(hm => grade_1_astro_histo_morph.includes(hm))) return "grade_1_astro";
        if (histologyMorphologies.some(hm => gbm_histo_morph.includes(hm))) return "gbm"

        // (2) Specific PrimaryCancerConditions...
        const grade_1_astro:string[] = ["Low grade astrocytoma of brain (disorder)"]
        const grade_3_astro:string[] = ["High grade astrocytoma of brain (disorder)"]
        const gbm:string[] = [
          "Glioblastoma multiforme of brain",
          "Giant cell glioblastoma of brain (disorder)",
          "Primary glioblastoma multiforme of cerebrum (disorder)",
          "Primary glioblastoma multiforme of brainstem (disorder)",
          "Primary glioblastoma multiforme of cerebellum (disorder)",
          "Primary glioblastoma multiforme of frontal lobe (disorder)",
          "Primary glioblastoma multiforme of parietal lobe (disorder)",
          "Primary glioblastoma multiforme of temporal lobe (disorder)",
          "Primary glioblastoma multiforme of occipital lobe (disorder)",
          "Glioblastoma multiforme of central nervous system (disorder)",
          "Giant cell glioblastoma of central nervous system (disorder)",
          "Glioblastoma multiforme (disorder)",
          "Glioblastoma multiforme of spinal cord (disorder)",
          "Glioblastoma multiforme of brain (disorder)"
        ]

        if (pccNames.some(pcc => grade_1_astro.includes(pcc))) return "grade_1_astro";
        if (pccNames.some(pcc => grade_3_astro.includes(pcc))) return "grade_3_astro";
        if (pccNames.some(pcc => gbm.includes(pcc))) return "gbm";


        // Didn't fulfill any of the other logic but brain -- so return basic mapping
        // Not actually handled by TJ
        // return "brain"
      }
      // --------------------------------------------------
      // PROSTATE
      else if (majorType == "prostate") {
        console.log("PROSTATE");
        // (1) Any in Prostate for PrimaryCancer Condition AND...

        const adenocarcinoma_histo_morph:string[] = [
          "Adenocarcinoma (morphologic abnormality)",
          "High grade adenocarcinoma (morphologic abnormality)",
          "Low grade adenocarcinoma (morphologic abnormality)",
          "Intermediate grade adenocarcinoma (morphologic abnormality)",
          "Cholangiocarcinoma (morphologic abnormality)",
          "Combined hepatocellular carcinoma and cholangiocarcinoma (morphologic abnormality)"
        ];

        const scc_histo_morph:string[] = [
          "Squamous cell carcinoma (morphologic abnormality)",
          "Malignant keratoacanthoma (morphologic abnormality)",
          "Human papillomavirus negative squamous cell carcinoma (morphologic abnormality)",
          "Human papillomavirus positive squamous cell carcinoma (morphologic abnormality)",
          "Pseudovascular squamous cell carcinoma (morphologic abnormality)",
          "Undifferentiated nonkeratinizing squamous cell carcinoma (morphologic abnormality)",
          "Grade III squamous intraepithelial neoplasia with microinvasive squamous cell carcinoma (morphologic abnormality)",
          "Metaplastic squamous cell carcinoma (morphologic abnormality)",
          "Squamous cell carcinoma, nonkeratinizing, mixed differentiated and undifferentiated (morphologic abnormality)",
          "Squamous cell carcinoma, nonkeratinizing, differentiated (morphologic abnormality)",
          "Squamous cell carcinoma in post-traumatic skin lesion (morphologic abnormality)",
          "Warty (condylomatous) carcinoma (morphologic abnormality)",
          "Squamous cell carcinoma, clear cell type (morphologic abnormality)",
          "Basaloid squamous cell carcinoma (morphologic abnormality)",
          "Squamous cell carcinoma with horn formation (morphologic abnormality)",
          "Verrucous carcinoma (morphologic abnormality)",
          "Adenoid squamous cell carcinoma (morphologic abnormality)",
          "Squamous cell carcinoma, large cell, nonkeratinizing (morphologic abnormality)",
          "Papillary squamous cell carcinoma (morphologic abnormality)",
          "Squamous cell carcinoma, small cell, nonkeratinizing (morphologic abnormality)",
          "Squamous cell carcinoma, keratinizing (morphologic abnormality)",
          "Squamous cell carcinoma, microinvasive (morphologic abnormality)",
          "Squamous cell carcinoma, spindle cell (morphologic abnormality)",
          "Lymphoepithelial carcinoma (morphologic abnormality)"
        ];

        const ductal_carcinoma_histo_morph:string[] = [
          "Infiltrating duct carcinoma (morphologic abnormality)",
          "Salivary duct carcinoma (morphologic abnormality)",
          "Invasive ductal carcinoma with an extensive intraductal component (morphologic abnormality)"
        ];

        const clear_cell_histo_morph:string[] = ["Malignant tumor, clear cell type (morphologic abnormality)"];

        const mucinous_carcinoma_histo_morph:string[] = [
          "Mucinous adenocarcinoma (morphologic abnormality)",
          "Mucinous minimally invasive adenocarcinoma (morphologic abnormality)",
          "Mucinous adenocarcinoma, endocervical, gastric type (morphologic abnormality)",
          "Mucinous eccrine carcinoma (morphologic abnormality)",
          "Mucinous adenocarcinoma, intestinal type (morphologic abnormality)",
          "Mucinous adenocarcinoma, endocervical type (morphologic abnormality)"
        ];

        const sarcomatoid_histo_morph:string[] = ["Pseudosarcomatous carcinoma (morphologic abnormality)"];
        const iac_histo_morph:string[] = ["Atypical medullary carcinoma (morphologic abnormality)"]

        // (1) + Specific histomorphs
        if (histologyMorphologies.some(hm => adenocarcinoma_histo_morph.includes(hm))) return "adenocarcinoma";
        if (histologyMorphologies.some(hm => scc_histo_morph.includes(hm))) return "scc";
        if (histologyMorphologies.some(hm => ductal_carcinoma_histo_morph.includes(hm))) return "ductal_carcinoma";
        if (histologyMorphologies.some(hm => clear_cell_histo_morph.includes(hm))) return "clear_cell";
        if (histologyMorphologies.some(hm => mucinous_carcinoma_histo_morph.includes(hm))) return "mucinous_carcinoma";
        if (histologyMorphologies.some(hm => sarcomatoid_histo_morph.includes(hm))) return "sarcomatoid";
        if (histologyMorphologies.some(hm => iac_histo_morph.includes(hm))) return "iac";


        // (2) Specific PrimaryCancerConditions...
        const adenocarcinoma:string[] = ["Adenocarcinoma of prostate (disorder)"];
        const scc:string[] = ["Squamous cell carcinoma of prostate (disorder)"];
        const intralobular_acinar:string[] = ["Acinar cell cystadenocarcinoma of prostate (disorder)"];
        const ductal_carcinoma:string[] = ["Infiltrating duct carcinoma of prostate (disorder)"];

        if (pccNames.some(pcc => adenocarcinoma.includes(pcc))) return "adenocarcinoma";
        if (pccNames.some(pcc => scc.includes(pcc))) return "scc";
        if (pccNames.some(pcc => intralobular_acinar.includes(pcc))) return "intralobular_acinar";
        if (pccNames.some(pcc => ductal_carcinoma.includes(pcc))) return "ductal_carcinoma";

        // Didn't fulfill any of the other logic but prostate -- so return basic mapping
        // Not actually handled by TJ
        //return "prostate";
      }

      // --------------------------------------------------
      // MULTIPLE MYLELOMA
      else if (majorType == "mm") {
        console.log("MULTIPLE MYELOMA");
        // Subgroups of multiple myeloma cancer:
        const active_mm:string[] = [
          "Indolent multiple myeloma (disorder)",
          "Asymptomatic multiple myeloma (disorder)",
          "Osteosclerotic myeloma (disorder)",
          "Plasma cell myeloma/plasmacytoma (disorder)",
          "Kappa light chain myeloma (disorder)",
          "Smoldering myeloma (disorder)",
          "Lambda light chain myeloma (disorder)",
          "Immunoglobulin D myeloma (disorder)",
          "Immunoglobulin G myeloma (disorder)",
          "Immunoglobulin A myeloma (disorder)",
          "Non-secretory myeloma (disorder)",
          "Light chain myeloma (disorder)",
          "Multiple myeloma (disorder)",
          "Plasma cell leukemia, disease (disorder)"
        ];
        const smoldering_mm = ["Smoldering myeloma (disorder)"];

        if (pccNames.some(pcc => active_mm.includes(pcc))) return "active_mm";
        if (pccNames.some(pcc => smoldering_mm.includes(pcc))) return "smoldering_mm";
      }

      // --------------------------------------------------
      // BLADDER
      else if (majorType == "bladder") {
        console.log("BLADDER");

        const urothelial_carcinoma:string[] = [
          "Micropapillary urothelial carcinoma (disorder)",
          "Transitional cell carcinoma of upper urinary tract (disorder)",
          "Lipid-rich urothelial carcinoma of urinary system (disorder)",
          "Clear cell urothelial carcinoma of urinary system (disorder)",
          "Primary urothelial carcinoma of paraurethral gland (disorder)",
          "Sarcomatoid urothelial carcinoma of urinary bladder (disorder)",
          "Plasmacytoid urothelial carcinoma of urinary bladder (disorder)",
          "Primary urothelial carcinoma of overlapping sites of urinary organs (disorder)"
        ];

        const urothelial_carcinoma_histo_morph:string[] = [
          "Clear cell urothelial carcinoma (morphologic abnormality)",
          "Sarcomatoid urothelial carcinoma (morphologic abnormality)",
          "Transitional cell carcinoma with glandular differentiation (morphologic abnormality)",
          "Transitional cell carcinoma with squamous differentiation (morphologic abnormality)",
          "Transitional cell carcinoma (morphologic abnormality)",
          "Papillary transitional cell carcinoma (morphologic abnormality)",
          "Sarcomatoid urothelial carcinoma (morphologic abnormality)",
          "Micropapillary urothelial carcinoma (morphologic abnormality)",
          "Low-grade non-invasive papillary urothelial carcinoma (morphologic abnormality)",
          "High-grade non-invasive papillary urothelial carcinoma (morphologic abnormality)",
        ];

        const squamous_cell_carcinoma:string[] = [
          "Primary squamous cell carcinoma of ureteral orifice (disorder)",
          "Primary squamous cell carcinoma of posterior wall of urinary bladder (disorder)",
          "Primary squamous cell carcinoma of lateral wall of urinary bladder (disorder)",
          "Primary squamous cell carcinoma of dome of urinary bladder (disorder)",
          "Primary squamous cell carcinoma of neck of urinary bladder (disorder)",
          "Primary squamous cell carcinoma of anterior wall of urinary bladder (disorder)",
          "Squamous cell carcinoma of bladder (disorder)",
        ];

        
        const squamous_cell_carcinoma_histo_morph:string[] = [
          "Malignant keratoacanthoma (morphologic abnormality)",
          "Squamous cell carcinoma (morphologic abnormality)",
          "Human papillomavirus negative squamous cell carcinoma (morphologic abnormality)",
          "Human papillomavirus positive squamous cell carcinoma (morphologic abnormality)",
          "Pseudovascular squamous cell carcinoma (morphologic abnormality)",
          "Undifferentiated nonkeratinizing squamous cell carcinoma (morphologic abnormality)",
          "Grade III squamous intraepithelial neoplasia with microinvasive squamous cell carcinoma (morphologic abnormality)",
          "Metaplastic squamous cell carcinoma (morphologic abnormality)",
          "Squamous cell carcinoma, nonkeratinizing, differentiated (morphologic abnormality)",
          "Squamous cell carcinoma in post-traumatic skin lesion (morphologic abnormality)",
          "Warty (condylomatous) carcinoma (morphologic abnormality)",
          "Squamous cell carcinoma, clear cell type (morphologic abnormality)",
          "Basaloid squamous cell carcinoma (morphologic abnormality)",
          "Squamous cell carcinoma with horn formation (morphologic abnormality)",
          "Verrucous carcinoma (morphologic abnormality)",
          "Adenoid squamous cell carcinoma (morphologic abnormality)",
          "Squamous cell carcinoma, large cell, nonkeratinizing (morphologic abnormality)",
          "Papillary squamous cell carcinoma (morphologic abnormality)",
          "Squamous cell carcinoma, small cell, nonkeratinizing (morphologic abnormality)",
          "Squamous cell carcinoma, keratinizing (morphologic abnormality)",
          "Squamous cell carcinoma, microinvasive (morphologic abnormality)",
          "Squamous cell carcinoma, spindle cell (morphologic abnormality)",
          "Lymphoepithelial carcinoma (morphologic abnormality)",
        ];

        const adenocarcinoma:string[] = [
          "Adenocarcinoma of bladder (disorder)",
          "Primary adenocarcinoma of dome of urinary bladder (disorder)",
          "Primary adenocarcinoma of neck of urinary bladder (disorder)",
          "Primary adenocarcinoma of trigone of urinary bladder (disorder)",
          "Primary adenocarcinoma of anterior wall of urinary bladder (disorder)",
          "Primary adenocarcinoma of posterior wall of urinary bladder (disorder)",
        ];

        const adenocarcinoma_histo_morph:string[] = [
          "Adenocarcinoma (morphologic abnormality)",
          "High grade adenocarcinoma (morphologic abnormality)",
          "Low grade adenocarcinoma (morphologic abnormality)",
          "Intermediate grade adenocarcinoma (morphologic abnormality)",
          "Cholangiocarcinoma (morphologic abnormality)",
          "Combined hepatocellular carcinoma and cholangiocarcinoma (morphologic abnormality)",
        ];

        const small_cell_carcinoma:string[] = [
          "Small cell neuroendocrine carcinoma of bladder (disorder)",
        ];

        const small_cell_carcinoma_histo_morph:string[] = [
          "Malignant keratoacanthoma (morphologic abnormality)",
          "Squamous cell carcinoma (morphologic abnormality)",
          "Human papillomavirus negative squamous cell carcinoma (morphologic abnormality)",
          "Human papillomavirus positive squamous cell carcinoma (morphologic abnormality)",
          "Pseudovascular squamous cell carcinoma (morphologic abnormality)",
          "Undifferentiated nonkeratinizing squamous cell carcinoma (morphologic abnormality)",
          "Grade III squamous intraepithelial neoplasia with microinvasive squamous cell carcinoma (morphologic abnormality)",
          "Metaplastic squamous cell carcinoma (morphologic abnormality)",
          "Squamous cell carcinoma, nonkeratinizing, differentiated (morphologic abnormality)",
          "Squamous cell carcinoma in post-traumatic skin lesion (morphologic abnormality)",
          "Warty (condylomatous) carcinoma (morphologic abnormality)",
          "Squamous cell carcinoma, clear cell type (morphologic abnormality)",
          "Basaloid squamous cell carcinoma (morphologic abnormality)",
          "Squamous cell carcinoma with horn formation (morphologic abnormality)",
          "Verrucous carcinoma (morphologic abnormality)",
          "Adenoid squamous cell carcinoma (morphologic abnormality)",
          "Squamous cell carcinoma, large cell, nonkeratinizing (morphologic abnormality)",
          "Papillary squamous cell carcinoma (morphologic abnormality)",
          "Squamous cell carcinoma, small cell, nonkeratinizing (morphologic abnormality)",
          "Squamous cell carcinoma, keratinizing (morphologic abnormality)",
          "Squamous cell carcinoma, microinvasive (morphologic abnormality)",
          "Squamous cell carcinoma, spindle cell (morphologic abnormality)",
          "Lymphoepithelial carcinoma (morphologic abnormality)",
        ];

        const mixed_histo_morph:string[] = [
          "Squamous cell carcinoma, nonkeratinizing, mixed differentiated and undifferentiated (morphologic abnormality)",
          "Transitional carcinoma with mixed papillary and solid growth pattern (morphologic abnormality)",
          "Squamous cell carcinoma, nonkeratinizing, mixed differentiated and undifferentiated (morphologic abnormality)",
        ];


        const sarcomatoid_carcinoma:string[] = [
          "Sarcomatoid urothelial carcinoma of urinary bladder (disorder)",
        ];

        const sarcomatoid_histo_morph:string[] = [
          "Pseudosarcomatous carcinoma (morphologic abnormality)",
          "Sarcomatoid mesothelioma (morphologic abnormality)",
          "Sarcomatoid urothelial carcinoma (morphologic abnormality)",
          "Granulosa cell tumor, malignant (morphologic abnormality)",
          "Squamous cell carcinoma, spindle cell (morphologic abnormality)",
          "Transitional cell carcinoma, spindle cell (morphologic abnormality)",
          "Basal cell carcinoma with sarcomatoid differentiation (morphologic abnormality)",
          "Carcinoma with pleomorphic, sarcomatoid or sarcomatous elements (morphologic abnormality)",
        ];

        // Specific histomorphs
        if (histologyMorphologies.some(hm => urothelial_carcinoma_histo_morph.includes(hm))) return "urothelial_carcinoma";
        if (histologyMorphologies.some(hm => squamous_cell_carcinoma_histo_morph.includes(hm))) return "squamous_cell_carcinoma";
        if (histologyMorphologies.some(hm => adenocarcinoma_histo_morph.includes(hm))) return "adenocarcinoma";
        if (histologyMorphologies.some(hm => small_cell_carcinoma_histo_morph.includes(hm))) return "small_cell_carcinoma";
        if (histologyMorphologies.some(hm => mixed_histo_morph.includes(hm))) return "mixed";
        if (histologyMorphologies.some(hm => sarcomatoid_histo_morph.includes(hm))) return "sarcomatoid";

        // Specific PrimaryCancerConditions
        if (pccNames.some(pcc => urothelial_carcinoma.includes(pcc))) return "urothelial_carcinoma";
        if (pccNames.some(pcc => squamous_cell_carcinoma.includes(pcc))) return "squamous_cell_carcinoma";
        if (pccNames.some(pcc => adenocarcinoma.includes(pcc))) return "adenocarcinoma";
        if (pccNames.some(pcc => small_cell_carcinoma.includes(pcc))) return "small_cell_carcinoma";
        if (pccNames.some(pcc => sarcomatoid_carcinoma.includes(pcc))) return "sarcomatoid_carcinoma";

      }
    }

    // No proper mapping so return null
    return null;
  }

  /**
   * Secondary Cancer Value mapping.
   * @returns METASTATIC,LEPTOMENINGEAL_METASTATIC_DISEASE,BRAIN_METASTASIS,INVASIVE_BREAST_CANCER_AND_METASTATIC
   */
  getSecondaryCancerValues(): string {
    const extractedPrimaryCancerConditions = this.extractedMcode.primaryCancerConditions;
    const extractedSecondaryCancerConditions = this.extractedMcode.secondaryCancerConditions;
    const stage:string = this.getStageValues();

    // Just combine all of the primary conditions
    const pccNames:string[] = extractedPrimaryCancerConditions.reduce((acc:string[], cur:PrimaryCancerCondition) => acc.concat(TrialjectoryMappingLogic.codeMapper.extractCodeMappings(cur.coding)),[]);
    const histologyMorphologies:string[] = extractedPrimaryCancerConditions.reduce((acc:string[], cur:PrimaryCancerCondition) => acc.concat(TrialjectoryMappingLogic.codeMapper.extractCodeMappings(cur.histologyMorphologyBehavior)), []);

    for (const secondaryCancerCondition of extractedSecondaryCancerConditions) {
      // First map the secondary cancer condition
      const sccNames:string[] = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(secondaryCancerCondition.coding);

      const statuses:string[] = secondaryCancerCondition.clinicalStatus.map(code => code?.display?.toLowerCase());

      console.log("Secondary Cancer Conditions", sccNames);
      //SecondaryCancerCondition code = any code on sheet "Metastasis-Brain" and clinicalStatus = "active"
      if (sccNames.some(scc => scc == "Metastasis-Brain") && statuses.includes("active")) {
        return "brain_metastasis";
      }

            //SecondaryCancerCondition code = any code on sheet "Metastasis-Brain" and clinicalStatus = "active"
      if (sccNames.includes("Metastasis-Brain")) {
        return "brain_metastasis";
      }

      // SecondaryCancerCondition bodySite = SNOMED#8935007
      if (secondaryCancerCondition.bodySite.some(bs => bs.code == "8935007" && bs.system == "SNOMED")) {
        return "leptomeningeal_metastatic_disease";
      }

      const morphologyInvasive:string[] = [
        "Intraductal papillary neoplasm with invasive carcinoma (morphologic abnormality)",
        "Mucinous cystic neoplasm with invasive carcinoma (morphologic abnormality)",
        "Non-mucinous minimally invasive adenocarcinoma (morphologic abnormality)",
        "Mucinous minimally invasive adenocarcinoma (morphologic abnormality)",
        "Solid papillary carcinoma with invasion (morphologic abnormality)",
        "Invasive micropapillary carcinoma of breast (morphologic abnormality)",
        "Encapsulated papillary carcinoma with invasion (morphologic abnormality)",
        "Grade III squamous intraepithelial neoplasia with microinvasive squamous cell carcinoma (morphologic abnormality)",
        "Ductal carcinoma in situ with microinvasion and involving nipple skin (morphologic abnormality)",
        "Lobular carcinoma in situ with microinvasion (morphologic abnormality)",
        "Follicular carcinoma, grossly encapsulated with angioinvasion (morphologic abnormality)",
        "Follicular carcinoma, widely invasive (morphologic abnormality)",
        "Invasive ductal carcinoma with an extensive intraductal component (morphologic abnormality)",
        "Intraductal papillary-mucinous carcinoma, invasive (morphologic abnormality)",
        "Follicular carcinoma, minimally invasive (morphologic abnormality)",
        "Intraductal papillary adenocarcinoma with invasion (morphologic abnormality)",
        "Squamous cell carcinoma, microinvasive (morphologic abnormality)",
        "Grade III squamous intraepithelial neoplasia with microinvasive squamous cell carcinoma (morphologic abnormality)",
        "Squamous cell carcinoma in situ with questionable stromal invasion (morphologic abnormality)",
        "Leukemic infiltration (morphologic abnormality)",
        "Lymphomatous infiltration (morphologic abnormality)",
        "Infiltrating carcinoma with ductal and lobular features (morphologic abnormality)",
        "Infiltrating lobular mixed with other types of carcinoma (morphologic abnormality)",
        "Infiltrating duct mixed with other types of carcinoma (morphologic abnormality)",
        "Infiltrating duct carcinoma (morphologic abnormality)",
        "Paget's disease and infiltrating duct carcinoma of breast (morphologic abnormality)",
        "Infiltrating ductular carcinoma (morphologic abnormality)",
        "Infiltrating basal cell carcinoma (morphologic abnormality)",
        "Infiltrating duct and lobular carcinoma (morphologic abnormality)",
      ];

      if (stage == "4" && (pccNames.some(pcc => pcc == "Cancer-Breast") && histologyMorphologies.some(hm => morphologyInvasive.includes(hm) || "Morphology-Invasive") || pccNames.some(pcc => pcc == "Cancer-Invasive-Breast"))) {
        return "invasive_breast_cancer_and_metastatic";
      }

     }

    if (extractedSecondaryCancerConditions.length > 0 || stage == "4") {
      return "metastatic";
    }

    return null;
  }

  /**
   * Returns the histology morphology mappings of this resource.
   * @returns
   */
  getHistologyMorphologyValue(): string {
    const extractedPrimaryCancerConditions = this.extractedMcode.primaryCancerConditions;
    const stage:string = this.getStageValues();

    // If no primaryCancerCondition -- go ahead and return null
    if (extractedPrimaryCancerConditions.length == 0) {
      return null;
    }

    // Because TrialJectory only supports 1 string as the cancerSubType, we're going to just go with the first one available
    for (const primaryCancerCondition of extractedPrimaryCancerConditions) {
      // First map the primary cancer condition
      const pccNames = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(primaryCancerCondition.coding);
      const cancerCondition = pccNames.find( cancerCondition => cancerCondition in primary_cancer_condition_mapping)

      if (cancerCondition === undefined) return null;

      const majorType = primary_cancer_condition_mapping[cancerCondition]
      const histologyMorphologies = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(primaryCancerCondition.histologyMorphologyBehavior);

      if (majorType == "breast") {
        const morphologyInvasiveCarcinoma:string[] = [
          "Intraductal papillary neoplasm with invasive carcinoma (morphologic abnormality)",
          "Mucinous cystic neoplasm with invasive carcinoma (morphologic abnormality)",
          "Non-mucinous minimally invasive adenocarcinoma (morphologic abnormality)",
          "Mucinous minimally invasive adenocarcinoma (morphologic abnormality)",
          "Solid papillary carcinoma with invasion (morphologic abnormality)",
          "Invasive micropapillary carcinoma of breast (morphologic abnormality)",
          "Encapsulated papillary carcinoma with invasion (morphologic abnormality)",
          "Grade III squamous intraepithelial neoplasia with microinvasive squamous cell carcinoma (morphologic abnormality)",
          "Ductal carcinoma in situ with microinvasion and involving nipple skin (morphologic abnormality)",
          "Lobular carcinoma in situ with microinvasion (morphologic abnormality)",
          "Follicular carcinoma, grossly encapsulated with angioinvasion (morphologic abnormality)",
          "Follicular carcinoma, widely invasive (morphologic abnormality)",
          "Invasive ductal carcinoma with an extensive intraductal component (morphologic abnormality)",
          "Intraductal papillary-mucinous carcinoma, invasive (morphologic abnormality)",
          "Follicular carcinoma, minimally invasive (morphologic abnormality)",
          "Intraductal papillary adenocarcinoma with invasion (morphologic abnormality)",
          "Squamous cell carcinoma, microinvasive (morphologic abnormality)",
          "Grade III squamous intraepithelial neoplasia with microinvasive squamous cell carcinoma (morphologic abnormality)",
          "Squamous cell carcinoma in situ with questionable stromal invasion (morphologic abnormality)",
          "Infiltrating carcinoma with ductal and lobular features (morphologic abnormality)",
          "Infiltrating lobular mixed with other types of carcinoma (morphologic abnormality)",
          "Infiltrating duct mixed with other types of carcinoma (morphologic abnormality)",
          "Infiltrating duct carcinoma (morphologic abnormality)",
          "Paget's disease and infiltrating duct carcinoma of breast (morphologic abnormality)",
          "Infiltrating ductular carcinoma (morphologic abnormality)",
          "Infiltrating basal cell carcinoma (morphologic abnormality)",
          "Infiltrating duct and lobular carcinoma (morphologic abnormality)"
        ];

        const morphologyInvasive:string[] = [
        "Intraductal papillary neoplasm with invasive carcinoma (morphologic abnormality)",
        "Mucinous cystic neoplasm with invasive carcinoma (morphologic abnormality)",
        "Non-mucinous minimally invasive adenocarcinoma (morphologic abnormality)",
        "Mucinous minimally invasive adenocarcinoma (morphologic abnormality)",
        "Solid papillary carcinoma with invasion (morphologic abnormality)",
        "Invasive micropapillary carcinoma of breast (morphologic abnormality)",
        "Encapsulated papillary carcinoma with invasion (morphologic abnormality)",
        "Grade III squamous intraepithelial neoplasia with microinvasive squamous cell carcinoma (morphologic abnormality)",
        "Ductal carcinoma in situ with microinvasion and involving nipple skin (morphologic abnormality)",
        "Lobular carcinoma in situ with microinvasion (morphologic abnormality)",
        "Follicular carcinoma, grossly encapsulated with angioinvasion (morphologic abnormality)",
        "Follicular carcinoma, widely invasive (morphologic abnormality)",
        "Invasive ductal carcinoma with an extensive intraductal component (morphologic abnormality)",
        "Intraductal papillary-mucinous carcinoma, invasive (morphologic abnormality)",
        "Follicular carcinoma, minimally invasive (morphologic abnormality)",
        "Intraductal papillary adenocarcinoma with invasion (morphologic abnormality)",
        "Squamous cell carcinoma, microinvasive (morphologic abnormality)",
        "Grade III squamous intraepithelial neoplasia with microinvasive squamous cell carcinoma (morphologic abnormality)",
        "Squamous cell carcinoma in situ with questionable stromal invasion (morphologic abnormality)",
        "Leukemic infiltration (morphologic abnormality)",
        "Lymphomatous infiltration (morphologic abnormality)",
        "Infiltrating carcinoma with ductal and lobular features (morphologic abnormality)",
        "Infiltrating lobular mixed with other types of carcinoma (morphologic abnormality)",
        "Infiltrating duct mixed with other types of carcinoma (morphologic abnormality)",
        "Infiltrating duct carcinoma (morphologic abnormality)",
        "Paget's disease and infiltrating duct carcinoma of breast (morphologic abnormality)",
        "Infiltrating ductular carcinoma (morphologic abnormality)",
        "Infiltrating basal cell carcinoma (morphologic abnormality)",
        "Infiltrating duct and lobular carcinoma (morphologic abnormality)",
        ];

        const morphologyInvasiveCarcinomaMix:string[] = [
          "Infiltrating lobular mixed with other types of carcinoma (morphologic abnormality)",
          "Infiltrating duct mixed with other types of carcinoma (morphologic abnormality)",
          "Infiltrating carcinoma with ductal and lobular features (morphologic abnormality)",
          "Infiltrating duct and lobular carcinoma (morphologic abnormality)"
        ];

        const morphologyInvasiveDuctalCarcinoma:string [] = [
          "Ductal carcinoma in situ with microinvasion and involving nipple skin (morphologic abnormality)",
          "Invasive ductal carcinoma with an extensive intraductal component (morphologic abnormality)",
          "Intraductal papillary-mucinous carcinoma, invasive (morphologic abnormality)",
          "Intraductal papillary adenocarcinoma with invasion (morphologic abnormality)",
          "Infiltrating carcinoma with ductal and lobular features (morphologic abnormality)",
          "Infiltrating duct mixed with other types of carcinoma (morphologic abnormality)",
          "Infiltrating duct carcinoma (morphologic abnormality)",
          "Paget's disease and infiltrating duct carcinoma of breast (morphologic abnormality)",
          "Infiltrating ductular carcinoma (morphologic abnormality)",
          "Infiltrating duct and lobular carcinoma (morphologic abnormality)"
        ];

        const morphologyDuctalCarcinomaInSitu:string[] = [
          "Intraductal papillary neoplasm with high grade intraepithelial neoplasia",
          "Intraductal papilloma with ductal carcinoma in situ",
          "Cystic hypersecretory carcinoma, intraductal",
          "Clinging intraductal carcinoma",
          "Apocrine intraductal carcinoma",
          "Ductal carcinoma in situ - category",
          "Ductal carcinoma in situ, solid type",
          "Intraductal micropapillary carcinoma",
          "Intraductal papillary-mucinous carcinoma, non-invasive",
          "Intraductal carcinoma, noninfiltrating",
          "Noninfiltrating intraductal papillary adenocarcinoma",
          "Intraductal carcinoma and lobular carcinoma in situ"
        ];

        if (pccNames.includes("Cancer-Breast")) {
          if (histologyMorphologies.some(hm => morphologyInvasiveCarcinoma.includes(hm))) {
            return "invasive_carcinoma";
          }

          if (histologyMorphologies.some(hm => morphologyInvasive.includes(hm))) {
            return "invasive_breast_cancer";
          }

          if (histologyMorphologies.some(hm => morphologyInvasiveCarcinomaMix.includes(hm))) {
            return "invasive_mammory_carcinoma";
          }

          if (histologyMorphologies.some(hm => morphologyInvasiveDuctalCarcinoma.includes(hm))) {
            return "invasive_ductal_carcinoma";
          }

          if (histologyMorphologies.some(hm => hm == "Lobular carcinoma in situ with microinvasion (morphologic abnormality)")) {
            return "invasive_lobular_carcinoma";
          }

          if (histologyMorphologies.some(hm => morphologyDuctalCarcinomaInSitu.includes(hm))) {
            return "ductal_carcinoma_in_situ";
          }


          if (histologyMorphologies.some(hm => hm == "Inflammatory carcinoma")) {
            return "inflammatory";
          }
        }

        if (pccNames.includes("Cancer-Invasive-Carcinoma")) {
          return "invasive_carcinoma"
        }

        if (pccNames.includes("Cancer-Invasive-Breast")) {
          return "invasive_breast_cancer";
        }

        if (pccNames.includes("Carcinoma of breast with ductal and lobular features (disorder)") && !["0", "0.1", "0.2"].includes(stage)) {
          return "invasive_mammory_carcinoma";
        }

        if (pccNames.includes("Cancer-Invas_Duct_Carc")) {
          return "invasive_ductal_carcinoma";
        }

        if (pccNames.includes("Cancer-Invas_Lob_Carc")) {
          return "invasive_lobular_carcinoma";
        }

        if (pccNames.includes("Cancer-Inflammatory")) {
          return "inflammatory";
        }
      }

      if (majorType == "lung") {

        const adenocarcinoma:string[] = [
          "Adenocarcinoma of lung (disorder)",
          "Adenocarcinoma of left lung (disorder)",
          "Adenocarcinoma of right lung (disorder)",
          "Primary adenocarcinoma of lung (disorder)",
          "Primary mucinous adenocarcinoma of lung (disorder)",
          "Primary papillary adenocarcinoma of lung (disorder)",
          "Primary clear cell adenocarcinoma of lung (disorder)",
          "Non-mucinous adenocarcinoma in situ of lung (disorder)",
          "Primary adenocarcinoma of lower lobe of left lung (disorder)",
          "Primary adenocarcinoma of upper lobe of left lung (disorder)",
          "Primary adenocarcinoma of lower lobe of right lung (disorder)",
          "Primary adenocarcinoma of upper lobe of right lung (disorder)",
          "Primary adenocarcinoma of middle lobe of right lung (disorder)",
          "Primary mucinous cystadenocarcinoma of lung (disorder)",
          "Primary mucinous bronchiolo-alveolar carcinoma of lung (disorder)",
          "Primary non-mucinous bronchiolo-alveolar carcinoma of lung (disorder)",
          "Primary mixed mucinous and non-mucinous bronchiolo-alveolar carcinoma of lung (disorder)",
          "Primary salivary gland type carcinoma of lung (disorder)",
          "Primary adenoid cystic carcinoma of lung (disorder)",
          "Primary mucoepidermoid carcinoma of lung (disorder)",
          "Primary myoepithelial carcinoma of lung (disorder)",
          "Primary solid carcinoma of lung (disorder)",
          "Primary adenosquamous carcinoma of lung (disorder)",
          "Primary mixed subtype adenocarcinoma of lung (disorder)",
          "Primary fetal adenocarcinoma of lung (disorder)"
        ];

        const adenocarcinoma_histo_morph:string[] = [
          "Adenocarcinoma (morphologic abnormality)",
          "High grade adenocarcinoma (morphologic abnormality)",
          "Low grade adenocarcinoma (morphologic abnormality)",
          "Intermediate grade adenocarcinoma (morphologic abnormality)",
          "Cholangiocarcinoma (morphologic abnormality)",
          "Combined hepatocellular carcinoma and cholangiocarcinoma (morphologic abnormality)"
        ];

        const scc:string[] = [
          "Squamous cell carcinoma of lung (disorder)",
          "Squamous cell carcinoma of left lung (disorder)",
          "Squamous cell carcinoma of right lung (disorder)",
          "Primary basaloid squamous cell carcinoma of lung (disorder)",
          "Primary papillary squamous cell carcinoma of lung (disorder)",
          "Primary clear cell squamous cell carcinoma of lung (disorder)",
          "Squamous cell carcinoma of lung, TNM stage 4 (disorder)",
          "Squamous cell carcinoma of lung, TNM stage 3 (disorder)",
          "Squamous cell carcinoma of lung, TNM stage 1 (disorder)",
          "Squamous cell carcinoma of lung, TNM stage 2 (disorder)",
          "Primary squamous cell carcinoma of upper lobe of left lung (disorder)",
          "Primary squamous cell carcinoma of lower lobe of left lung (disorder)",
          "Primary squamous cell carcinoma of lower lobe of right lung (disorder)",
          "Primary squamous cell carcinoma of upper lobe of right lung (disorder)",
          "Primary squamous cell carcinoma of middle lobe of right lung (disorder)",
          "Primary small cell non-keratinizing squamous cell carcinoma of lung (disorder)",
          "Squamous cell carcinoma of bronchus in right upper lobe (disorder)",
          "Squamous cell carcinoma of bronchus in right middle lobe (disorder)",
          "Squamous cell carcinoma of bronchus in right lower lobe (disorder)",
          "Squamous cell carcinoma of bronchus in left upper lobe (disorder)",
          "Squamous cell carcinoma of bronchus in left lower lobe (disorder)"
        ];

        const scc_histo_morph:string[] = [
          "Malignant keratoacanthoma (morphologic abnormality)",
          "Squamous cell carcinoma (morphologic abnormality)",
          "Human papillomavirus negative squamous cell carcinoma (morphologic abnormality)",
          "Human papillomavirus positive squamous cell carcinoma (morphologic abnormality)",
          "Pseudovascular squamous cell carcinoma (morphologic abnormality)",
          "Undifferentiated nonkeratinizing squamous cell carcinoma (morphologic abnormality)",
          "Grade III squamous intraepithelial neoplasia with microinvasive squamous cell carcinoma (morphologic abnormality)",
          "Metaplastic squamous cell carcinoma (morphologic abnormality)",
          "Squamous cell carcinoma, nonkeratinizing, mixed differentiated and undifferentiated (morphologic abnormality)",
          "Squamous cell carcinoma, nonkeratinizing, differentiated (morphologic abnormality)",
          "Squamous cell carcinoma in post-traumatic skin lesion (morphologic abnormality)",
          "Warty (condylomatous) carcinoma (morphologic abnormality)",
          "Squamous cell carcinoma, clear cell type (morphologic abnormality)",
          "Basaloid squamous cell carcinoma (morphologic abnormality)",
          "Squamous cell carcinoma with horn formation (morphologic abnormality)",
          "Verrucous carcinoma (morphologic abnormality)",
          "Adenoid squamous cell carcinoma (morphologic abnormality)",
          "Squamous cell carcinoma, large cell, nonkeratinizing (morphologic abnormality)",
          "Papillary squamous cell carcinoma (morphologic abnormality)",
          "Squamous cell carcinoma, small cell, nonkeratinizing (morphologic abnormality)",
          "Squamous cell carcinoma, keratinizing (morphologic abnormality)",
          "Squamous cell carcinoma, microinvasive (morphologic abnormality)",
          "Squamous cell carcinoma, spindle cell (morphologic abnormality)",
          "Lymphoepithelial carcinoma (morphologic abnormality)"
        ]

        const large_cell:string[] = [
          "Large cell carcinoma of lung (disorder)",
          "Large cell carcinoma of lung, TNM stage 1 (disorder)",
          "Large cell carcinoma of lung, TNM stage 2 (disorder)",
          "Large cell carcinoma of lung, TNM stage 3 (disorder)",
          "Large cell carcinoma of lung, TNM stage 4 (disorder)",
          "Primary large cell carcinoma of upper lobe of left lung (disorder)",
          "Primary large cell carcinoma of lower lobe of left lung (disorder)",
          "Primary large cell carcinoma of upper lobe of right lung (disorder)",
          "Primary large cell carcinoma of lower lobe of right lung (disorder)",
          "Giant cell carcinoma of lung (disorder)"
        ];

        const large_cell_histo_morph:string[] = [
          "Large cell carcinoma (morphologic abnormality)",
          "Giant cell carcinoma (morphologic abnormality)"
        ];

        const large_cell_neuroendocrine:string[] = ["Primary malignant neuroendocrine neoplasm of lung (disorder)"];

        const large_cell_neuroendocrine_histo_morph:string[] = [
          "Large cell neuroendocrine carcinoma (morphologic abnormality)",
          "Combined large cell neuroendocrine carcinoma (morphologic abnormality)"
        ];

        const adenosquamous:string[] = ["Primary adenosquamous carcinoma of lung (disorder)"];

        const adenosquamous_histo_morph:string[] = ["Adenosquamous carcinoma (morphologic abnormality)"];

        const sarcomatoid:string[] = ["Primary pseudosarcomatous carcinoma of lung (disorder)"];

        const sarcomatoid_histo_morph:string[] = ["Pseudosarcomatous carcinoma (morphologic abnormality)"]

        // ANY in Lung and Specific HistoMorphs
        if (histologyMorphologies.some(hm => adenocarcinoma_histo_morph.includes(hm))) return "adenocarcinoma";
        if (histologyMorphologies.some(hm => scc_histo_morph.includes(hm))) return "scc";
        if (histologyMorphologies.some(hm => large_cell_histo_morph.includes(hm))) return "large_cell";
        if (histologyMorphologies.some(hm => large_cell_neuroendocrine_histo_morph.includes(hm))) return "large_cell_neuroendocrine";
        if (histologyMorphologies.some(hm => adenosquamous_histo_morph.includes(hm))) return "adenosquamous";
        if (histologyMorphologies.some(hm => sarcomatoid_histo_morph.includes(hm))) return "sarcomatoid";

        // Specific PrimaryCancerConditions
        if (pccNames.some( pcc => adenocarcinoma.includes(pcc))) return "adenocarcinoma";
        if (pccNames.some( pcc => scc.includes(pcc))) return "scc";
        if (pccNames.some( pcc => large_cell.includes(pcc))) return "large_cell";
        if (pccNames.some( pcc => large_cell_neuroendocrine.includes(pcc))) return "large_cell_neuroendocrine";
        if (pccNames.some( pcc => adenosquamous.includes(pcc))) return "adenosquamous";
        if (pccNames.some( pcc => sarcomatoid.includes(pcc))) return "sarcomatoid";

      }
      if (majorType == "colon") {
        const afap:string[] = ["Attenuated familial adenomatous polyposis (disorder)"];
        const lynch_syndrome:string[] = ["Lynch syndrome (disorder)"];
        const hnpcc:string[] = ["Hereditary nonpolyposis colon cancer (disorder)"];

        if (pccNames.some( pcc => afap.includes(pcc))) return "afap";
        if (pccNames.some( pcc => lynch_syndrome.includes(pcc))) return "lynch_syndrome";
        if (pccNames.some( pcc => hnpcc.includes(pcc))) return "hnpcc";
      }
    }

    return null;
  }

  /**
   * Returns the radiation procedure mappings for these radiation procedure resources.
   * @returns
   */
  getRadiationProcedureValues(): string[] {

    const cancerRelatedRadiationProcedures: CancerRelatedRadiationProcedure[] = this.extractedMcode.cancerRelatedRadiationProcedures;

    const radiation_codes: fhir.Coding[] = this.extractCodings(cancerRelatedRadiationProcedures);
    // Perform the basic mapping.
    let radiationValues: string[] = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(radiation_codes);

    // WBRT Logic.
    for (const cancerRelatedRadiationProcedure of cancerRelatedRadiationProcedures) {
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

    // Simple radiation logic.
    if (cancerRelatedRadiationProcedures.length > 0) {
      // If there is any code in the cancerRelatedRadiationProcedure, it counts as radiation.
      radiationValues.push('radiation');
    }

    // Convert values to expected Trialjectory values.
    const procedureConverter = new Map<string, string>()
    procedureConverter.set('ablation-procedure', 'ablation');
    procedureConverter.set('rfa-procedure', 'rfa');
    procedureConverter.set('ebrt-procedure', 'ebrt');
    procedureConverter.set('radiation', 'radiation_other');
    procedureConverter.set('brachytherapy-radiation', "brachytherapy");
    radiationValues = radiationValues.map(procedure => {
      return procedureConverter.get(procedure.toLowerCase()) || procedure.toLowerCase();
    });

    return radiationValues;
  }

  /**
   * Returns the surgical procedure mappings for these surgical procedure resources.
   * @returns
   */
  getSurgicalProcedureValues(): string[] {

    const cancerRelatedSurgicalProcedures = this.extractedMcode.cancerRelatedSurgicalProcedures;

    if(cancerRelatedSurgicalProcedures == null){
      return [];
    }

    const surgical_codes: fhir.Coding[] = this.extractCodings(cancerRelatedSurgicalProcedures);
    // Perform the basic mapping.
    let surgicalProcedureValues: string[] = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(surgical_codes);

    // Convert incorrect profile names to the Trialjectory expected values.
    surgicalProcedureValues = surgicalProcedureValues.map(procedure => {
      procedure = procedure.toLowerCase();
      if(procedure == "breast-reconstruction") {
        // Although 'reconstruction' is vague, it refers specifically to breast reconstruction.
        return "reconstruction";
      } else if(procedure == "alnd-procedure") {
        // ALND has a second possible logic mapping which will be checked later.
        return "alnd";
      }
      else if(procedure.endsWith("-surgery")) {
        // Remove "-surgery"
        return procedure.slice(0, -8);
      }
      else {
        return procedure;
      }
    });

    // Additional ALND complex logic (if alnd has not already been added).
    if(!surgicalProcedureValues.includes('alnd')){
      const bodySiteCodingExtracor = (procedure: CancerRelatedSurgicalProcedure[]) => {
        const codingList: fhir.Coding[] = []
        for(const resource of procedure){
          if(resource.bodySite != null) {
            codingList.push(...resource.bodySite);
          }
        }
        return codingList;
      }
      const surgicalBodysite = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(bodySiteCodingExtracor(cancerRelatedSurgicalProcedures));
      if(surgical_codes.some(coding => CodeMapper.codesEqual(coding, CodeSystemEnum.SNOMED, '122459003')
          && surgicalBodysite.includes('alnd-bodysite'))) {
            surgicalProcedureValues.push('alnd');
      }
    }

    // Metastasis Resection complex logic.
    if(cancerRelatedSurgicalProcedures.some((surgicalProcedure) => surgicalProcedure.reasonReference != null && surgicalProcedure.reasonReference.some(rr => rr.meta_profile == 'mcode-secondary-cancer-condition'))){
      surgicalProcedureValues.push('metastasis_resection');
    }

    // Filter any duplicate values.
    surgicalProcedureValues.filter((a, b) => surgicalProcedureValues.indexOf(a) === b)

    return surgicalProcedureValues;
  }

  /**
   * Reeturns the list of coding's associated with the given base fhir resource.
   * @param resources The fhir resources to pull coding's from.
   * @returns
   */
  extractCodings(resources: BaseFhirResource[]): fhir.Coding[] {
    const codingList: fhir.Coding[] = []
    for(const resource of resources){
      if(resource.coding != null){
        codingList.push(...resource.coding);
      }
    }
    return codingList;
  }

  /**
   * Gets the Age value of the patient resource.
   * @returns Returns the age of the patient in this resource.
   */
  getAgeValue(): number {
    const birthDate = this.extractedMcode.birthDate;
    if (birthDate == 'NA' || birthDate == null || birthDate == undefined) {
      return null;
    }
    // Birthdate is in format: '1966-08-03'
    const today: Date = new Date();
    const checkDate: Date = new Date(birthDate);
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

    // Perform the basic extraction mappings.
    let stageValues: string[] = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(this.extractedMcode.TNMClinicalStageGroups);
    stageValues.push(...TrialjectoryMappingLogic.codeMapper.extractCodeMappings(this.extractedMcode.TNMPathologicalStageGroups));

    console.log("Stages", JSON.stringify(stageValues));
    if(stageValues.length < 1){
      return null;
    }

    // Set the stage conversions.
    // TrialJectory uses decimal stages
    // Supports: 0.1,0.2,1,2,3,3.1,3.2,4,0,2.1,2.2,3.3,3.4
    const stageConverter = new Map<string, string>([
      ['Stage-0', '0'],
      ['Stage-0A', '0.1'],
      ['Stage-0B', '0.2'],
      ['0A', '0.1'],
      ['0B', '0.2'],

      ['Stage-1', '1'],
      ['Stage-1A', '1'],
      ['Stage-1B', '1'],
      ['Stage-1C', '1'],
      ['1A', '1'],
      ['1B', '1'],
      ['1C', '1'],

      ['Stage-2', '2'],
      ['Stage-2A', '2.1'],
      ['Stage-2B', '2.2'],
      ['Stage-2C', '2'],
      ['2A', '2.1'],
      ['2B', '2.2'],
      ['2C', '2'],

      ['Stage-3', '3'],
      ['Stage-3A', '3.1'],
      ['Stage-3B', '3.2'],
      ['Stage-3C', '3.3'],
      ['Stage-3D', '3.4'],
      ['3A', '3.1'],
      ['3B', '3.2'],
      ['3C', '3.3'],
      ['3D', '3.4'],

      ['Stage-4', '4'],
      ['Stage-4A', '4.1'],
      ['Stage-4B', '4.2'],
      ['Stage-4C', '4.3'],
      ['Stage-4D', '4.4'],
      ['4A', '4.1'],
      ['4B', '4.2'],
      ['4C', '4.3'],
      ['4D', '4.4'],
    ]);

    stageValues = stageValues.map(stage => {
      return stageConverter.get(stage) || stage;
    });

    // Pull the highest stage value.
    // This may be an issue with 2 vs. 2C etc.
    return stageValues.sort().reverse()[0]
  }

  /**
   *
   * @returns Gets the tumor marker mappings from the codes in this resource.
   */
  getTumorMarkerValues(): string[] {

    const tumorMarker = this.extractedMcode.tumorMarkers;
    const cancerGeneticVariant = this.extractedMcode.cancerGeneticVariants;

    console.log("Tumor Markers!", JSON.stringify(tumorMarker));

    if (tumorMarker.length == 0 && cancerGeneticVariant.length == 0) {
      // Prevents unnecessary checks if there are no tumor marker values.
      return [];
    }
    const tumorMarkersToCheck = tumorMarker;
    if (tumorMarker.length == 0) {
      // Prevents skipping of cancer genetic variant values.
      tumorMarkersToCheck.push({coding: [] as fhir.Coding[], valueCodeableConcept: [] as fhir.Coding[], valueRatio: [] as Ratio[], valueQuantity: [] as Quantity[], interpretation: [] as fhir.Coding[]} as TumorMarker);
    }

    // Array of Tumor Marker results.
    const tumorMarkerArray: string[] = [];
    console.log("Tumor Markers to Check", JSON.stringify(tumorMarkersToCheck));

    // Iterate over each tumor marker seperately.
    for(const currentTumorMarker of tumorMarkersToCheck) {

      // Perform Basic Mapping.
      const basicTumorMapping = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(currentTumorMarker.coding);

      // ER
      if (this.isERPositive(currentTumorMarker, 1, basicTumorMapping)) {
        // NOTE: ER+ check always uses 1 as the metric parameter by default.
        tumorMarkerArray.push('ER+');
      }

      // PR
      if (this.isPRPositive(currentTumorMarker, 1, basicTumorMapping)){
        // NOTE: PR+ check always uses 1 as the metric parameter by default.
        tumorMarkerArray.push('PR+');
      }

      // HER
      if (this.isHER2Positive(currentTumorMarker, basicTumorMapping)){
        tumorMarkerArray.push('HER2+')
      }

      // RB
      if (this.isRBPositive(currentTumorMarker, 50, basicTumorMapping)) {
        // NOTE: RB+ check always uses 50 as the matric parameter by default.
        tumorMarkerArray.push('RB+');
      }

      // PIK3CA
      if (basicTumorMapping.includes('Biomarker-PIK3CA')){
        tumorMarkerArray.push('PIK3CA');
      }

      // PDL1
      /** TJ no longer supports PDL1- or +; just pdl1 */
      if (basicTumorMapping.includes('Biomarker-PDL1')) { tumorMarkerArray.push('PDL1'); }

      //kras
      if(this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-kras', basicTumorMapping)) {
        tumorMarkerArray.push('kras');
      }

      //nras
      if(this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-nras', basicTumorMapping)) {
        tumorMarkerArray.push('nras');
      }

      //braf
      if(this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-braf', basicTumorMapping)) {
        tumorMarkerArray.push('braf');
      }

      //pik3
      if(this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-pik3', basicTumorMapping)) {
        tumorMarkerArray.push('pik3');
      }

      //egfr
      if(this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-egfr', basicTumorMapping)) {
        tumorMarkerArray.push('egfr');
      }

      // erbb2_her2
      if(this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-erbb2_her2', basicTumorMapping)) {
        tumorMarkerArray.push('erbb2_her2');
      }

      // her3
      if(this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-her3', basicTumorMapping)) {
        tumorMarkerArray.push('her3');
      }

      // msi
      if(this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-msi', basicTumorMapping)) {
        tumorMarkerArray.push('msi');
      }

      // ret
      if(this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-ret', basicTumorMapping)) {
        tumorMarkerArray.push('ret');
      }

      // fgfr1
      if(this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-fgfr1', basicTumorMapping)) {
        tumorMarkerArray.push('fgfr1');
      }

      // fgfr2
      if(this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-fgfr2', basicTumorMapping)) {
        tumorMarkerArray.push('fgfr2');
      }

      // fgfr3
      if(this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-fgfr3', basicTumorMapping)) {
        tumorMarkerArray.push('fgfr3');
      }

      // idh1
      if(this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-idh1', basicTumorMapping)) {
        tumorMarkerArray.push('idh1');
      }

      // atrx
      if(this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-atrx', basicTumorMapping)) {
        tumorMarkerArray.push('atrx');
      }

      // tert
      if(this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-tert', basicTumorMapping)) {
        tumorMarkerArray.push('tert');
      }

      // P53
      if (this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-P53', basicTumorMapping) ||
        cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '11998')) ){
        tumorMarkerArray.push('p53_tp53_mutation');
      }

      if (this.isBioMarkerNegativeCombo2(currentTumorMarker, 'Biomarker-P53', basicTumorMapping) ||
        cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '11998')) ){
        tumorMarkerArray.push('p53_tp53_deletion');
      }
    }

    // BRCA1
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '1100') ||
        this.isGeneticVariantNegative(cancGenVar, '1100'))) {
      tumorMarkerArray.push('BRCA1');
    }

    // BRCA2
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '1101') ||
        this.isGeneticVariantNegative(cancGenVar, '1101'))) {
      tumorMarkerArray.push('BRCA2');
    }

    // CHEK2
    /** TJ No longer supports CHEK2- or +; just chek2 */
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '16627')) ||
      cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '16627'))){
      tumorMarkerArray.push('CHEK2');
    }

    // NBN
    /** TJ No longer supports NBN- or +; just nbn */
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '7652')) ||
      cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '7652'))){
      tumorMarkerArray.push('NBN');
    }

    // NF1
    /** TJ No longer supports NF1- or +; just nf1 */
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '7765')) ||
      cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '7765'))){
      tumorMarkerArray.push('NF1');
    }

    // PALB2
    /** TJ No longer supports PALB2- or +; just palb2 */
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '26144')) ||
      cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '26144'))){
      tumorMarkerArray.push('PALB2');
    }

    // STK11
    /** TJ No longer supports STK11- or +; just stk11 */
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '11389')) ||
      cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '11389'))){
      tumorMarkerArray.push('STK11');
    }

    // ESR1
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '3467')) ||
        cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '3467'))) {
      tumorMarkerArray.push('ESR1');
    }

    // PIK3CA
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '8975')) ||
       cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '8975')) ){
      tumorMarkerArray.push('PIK3CA');
    }

    // NTRK_FUSION
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '8031')) ||
       cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '8032')) ||
       cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '8033')) ||
       cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '8031')) ||
       cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '8032')) ||
       cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '8033')) ){
      tumorMarkerArray.push('NTRK_FUSION');
    }

    // kras
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '6407'))) {
      tumorMarkerArray.push('kras');
    }

    // nras
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '7989'))) {
      tumorMarkerArray.push('nras');
    }

    // braf
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '1097'))) {
      tumorMarkerArray.push('braf');
    }

    // pik3
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '8975'))) {
      tumorMarkerArray.push('pik3');
    }

    // pik3r1
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '8979'))) {
      tumorMarkerArray.push('pik3r1');
    }

    // wnt
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '12774'))) {
      tumorMarkerArray.push('wnt');
    }

    // egfr
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '3236'))) {
      tumorMarkerArray.push('egfr');
    }

    // erbb2_her2
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '3430'))) {
      tumorMarkerArray.push('erbb2_her2');
    }

    // her3
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '3431'))) {
      tumorMarkerArray.push('her3');
    }

    // ret
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '9967'))) {
      tumorMarkerArray.push('ret');
    }

    // fgfr1
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '3688'))) {
      tumorMarkerArray.push('fgfr1');
    }

    // fgfr2
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '3689'))) {
      tumorMarkerArray.push('fgfr2');
    }

    // fgfr3
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '3690'))) {
      tumorMarkerArray.push('fgfr3');
    }

    // nrg1
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '7997'))) {
      tumorMarkerArray.push('nrg1');
    }

    // idh1
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '5382'))) {
      tumorMarkerArray.push('idh1');
    }

    //atrx
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '886'))) {
      tumorMarkerArray.push('atrx');
    }

    //tert
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '11730'))) {
      tumorMarkerArray.push('tert');
    }

    // h3f3a
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '4764'))) {
      tumorMarkerArray.push('h3f3a');
    }

    // rela
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '9955'))) {
      tumorMarkerArray.push('rela');
    }

    // pdgfra
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '8803'))) {
      tumorMarkerArray.push('pdgfra');
    }

    // c_met
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '7029'))) {
      tumorMarkerArray.push('c_met');
    }



    /** Valid one-to-one cancer genetic variant mappings */
    const geneStudiedCodings: fhir.Coding[] = cancerGeneticVariant.flatMap(cgv => cgv.component.geneStudied.flatMap(gs => gs.valueCodeableConcept.coding));
    const fullCancerGeneticVariantGeneStudied = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(geneStudiedCodings);
    if(fullCancerGeneticVariantGeneStudied.length > 0) {
      // Colorectal Values.
      const validGeneticVariantValues = ["APC gene", "MLH1", "MSH2", "MSH6", "PMS2", "EPCAM", "STK11", "MUTYH"];
      // Lung Values.
      validGeneticVariantValues.push(...["EGFR","RB1","TP53","KRAS","ALK","ROS1","RET","BRAF","MET"]);
      // Melanoma Values.
      validGeneticVariantValues.push(...["BRAF","NRAS","CDKN2A","NF1","KIT","CDK4"]);
      // Multiple Myeloma Values.
      validGeneticVariantValues.push(...["MYC","TP53"]);
      // Non-Hodgkin Lymphoma Values.
      validGeneticVariantValues.push(...["BCL2"]);
      // Brain Values.
      validGeneticVariantValues.push(...["NF1","NF2","TSC1","TSC2","MLH1","PMS2"]);
      // Uterine Values.
      validGeneticVariantValues.push(...["RB1"]);
      // Prostate Values.
      validGeneticVariantValues.push(...["BRCA1","BRCA2","CHEK2","ATM","PALB2","RAD51D","MSH2","MSH6","MLH1","PMS2","RNASEL","HOXB13"]);
      const oneToOneGeneticVariantMappings = fullCancerGeneticVariantGeneStudied.filter(mapping => validGeneticVariantValues.includes(mapping));
      if(oneToOneGeneticVariantMappings.length > 0){
        tumorMarkerArray.push(...oneToOneGeneticVariantMappings);
      }
    }

    // Set to lowercase values, as expected by trialjectory.
    const lowerTumorMarkerArray = tumorMarkerArray.map(tumorMarker => tumorMarker.toLowerCase());

    // Remove potential duplicates.
    lowerTumorMarkerArray.filter((a, b) => lowerTumorMarkerArray.indexOf(a) === b)

    // Finally, return the fully appended array.
    return lowerTumorMarkerArray;
  }

  /** -------------- HELPER FUNCTIONS: Determine POS/NEG on Tumor Marker for Biomarkers -------------- **/
  isValueCodeableConceptPositive(valueCodeableConcept: fhir.Coding[]): boolean {
    return valueCodeableConcept.some(
                   (coding) =>
                    (CodeMapper.codesEqual(coding, CodeSystemEnum.SNOMED, '10828004')) ||
                    (CodeMapper.codesEqual(coding, CodeSystemEnum.HL7, 'POS'))
                 );
  }

  isValueCodeableConceptNegative(valueCodeableConcept: fhir.Coding[]): boolean {
    return valueCodeableConcept.some(
                   (coding) =>
                    (CodeMapper.codesEqual(coding, CodeSystemEnum.SNOMED, '260385009')) ||
                    (CodeMapper.codesEqual(coding, CodeSystemEnum.HL7, 'NEG'))
                 );
  }

  isInterpretationPositive(interpretation: fhir.Coding[]): boolean {
    return interpretation.some(
                     (interp) =>
                       (interp.code == 'POS' || interp.code == 'DET' || interp.code == 'H') &&
                       interp.system == 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html'
                   );
  }
  isInterpretationNegative(interpretation: fhir.Coding[]): boolean {
    return interpretation.some(
                     (interp) =>
                       (interp.code == 'L' || interp.code == 'N' || interp.code == 'NEG' || interp.code == 'ND') &&
                       interp.system == 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html'
                   );
  }

  isInterpretationPositiveCombo2(interpretation: fhir.Coding[]): boolean {
    return interpretation.some(
                     (interp) =>
                       (interp.code == 'POS' || interp.code == 'ND' || interp.code == 'L') &&
                       interp.system == 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html'
                   );
  }

  isInterpretationNegativeCombo2(interpretation: fhir.Coding[]): boolean {
    return interpretation.some(
                     (interp) =>
                       (interp.code == 'NEG' || interp.code == 'DET' || interp.code == 'H') &&
                       interp.system == 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html'
                   );
  }

  isInterpretationNegativeCombo3(interpretation: fhir.Coding[]): boolean {
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
          geneStud.interpretation.some(interpretation => interpretation.coding.some(
            (interp) => interp.code == 'CAR' || interp.code == 'A' || interp.code == 'POS'
          ))
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
          geneStud.interpretation.some(interpretation => interpretation.coding.some(
            (interp) => interp.code == 'N' || interp.code == 'NEG'
          ))
        ))
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

  /** -------------- HELPER FUNCTIONS: Determine POS/NEG on Tumor Marker -------------- **/

  isERPositive(tumorMarker: TumorMarker, metric: number, basicTumorMapping: string[]): boolean {
    return (
      (this.isValueCodeableConceptPositive(tumorMarker.valueCodeableConcept) ||
        (tumorMarker.valueRatio && this.ratioMatch(tumorMarker.valueRatio.numerator, tumorMarker.valueRatio.denominator, metric, '>=')) ||
        this.isInterpretationPositive(tumorMarker.interpretation) ||
        (tumorMarker.valueQuantity &&
          this.quantityMatch(tumorMarker.valueQuantity.value, tumorMarker.valueQuantity.code, [metric], '>=', '%')
        )) &&
        basicTumorMapping.includes('Biomarker-ER')
    );
  }
  isERNegative(tumorMarker: TumorMarker, metric: number, basicTumorMapping: string[]): boolean {
    return (
      (this.isValueCodeableConceptNegative(tumorMarker.valueCodeableConcept) ||
        (tumorMarker.valueRatio && this.ratioMatch(tumorMarker.valueRatio.numerator, tumorMarker.valueRatio.denominator, metric, '<'))) ||
        this.isInterpretationNegative(tumorMarker.interpretation) ||
        (tumorMarker.valueQuantity && (
            this.quantityMatch(tumorMarker.valueQuantity.value, tumorMarker.valueQuantity.code, [metric], '<', '%') ||
            this.quantityMatch(tumorMarker.valueQuantity.value, tumorMarker.valueQuantity.code, [0], '=')
        )) &&
        basicTumorMapping.includes('Biomarker-ER')
    );
  }
  isPRPositive(tumorMarker: TumorMarker, metric: number, basicTumorMapping: string[]): boolean {
    return (
      (this.isValueCodeableConceptPositive(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationPositive(tumorMarker.interpretation) ||
        (tumorMarker.valueQuantity &&
          this.quantityMatch(tumorMarker.valueQuantity.value, tumorMarker.valueQuantity.code, [metric], '>=', '%')
        ) ||
        (tumorMarker.valueRatio && this.ratioMatch(tumorMarker.valueRatio.numerator, tumorMarker.valueRatio.denominator, metric, '>='))) &&
      basicTumorMapping.includes('Biomarker-PR')
    );
  }
  isPRNegative(tumorMarker: TumorMarker, metric: number, basicTumorMapping: string[]): boolean {
    return (
      (this.isValueCodeableConceptNegative(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationNegative(tumorMarker.interpretation) ||
        (tumorMarker.valueQuantity &&
            this.quantityMatch(tumorMarker.valueQuantity.value, tumorMarker.valueQuantity.code, [metric], '<', '%') ||
            this.quantityMatch(tumorMarker.valueQuantity.value, tumorMarker.valueQuantity.code, [0], '=')
        ) ||
        (tumorMarker.valueRatio && this.ratioMatch(tumorMarker.valueRatio.numerator, tumorMarker.valueRatio.denominator, metric, '<'))) &&
      basicTumorMapping.includes('Biomarker-PR')
    );
  }
  isBioMarkerPositiveCombo2(tumorMarker: TumorMarker, profileName: string, basicTumorMapping: string[]): boolean {
    return (
      (this.isValueCodeableConceptPositive(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationPositiveCombo2(tumorMarker.interpretation))
      && basicTumorMapping.includes(profileName)
    );
  }
  isBioMarkerNegativeCombo2(tumorMarker: TumorMarker, profileName: string, basicTumorMapping: string[]): boolean {
    return (
      (this.isValueCodeableConceptNegative(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationNegativeCombo2(tumorMarker.interpretation))
        && basicTumorMapping.includes(profileName)
      );
  }
  isRBPositive(tumorMarker: TumorMarker, metric: number, basicTumorMapping: string[]): boolean {
    return (
      ((tumorMarker.valueQuantity &&
        this.quantityMatch(tumorMarker.valueQuantity.value, tumorMarker.valueQuantity.code, [metric], '>', '%')
      ) ||
        this.isValueCodeableConceptPositive(tumorMarker.valueCodeableConcept) ||
        (tumorMarker.valueRatio && this.ratioMatch(tumorMarker.valueRatio.numerator, tumorMarker.valueRatio.denominator, metric, '>')) ||
        this.isInterpretationPositive(tumorMarker.interpretation)) &&
        basicTumorMapping.includes('Biomarker-RB')
    );
  }
  isRBNegative(tumorMarker: TumorMarker, metric: number, basicTumorMapping: string[]): boolean {
    return (
      (this.isValueCodeableConceptNegative(tumorMarker.valueCodeableConcept) ||
        (tumorMarker.valueRatio && this.ratioMatch(tumorMarker.valueRatio.numerator, tumorMarker.valueRatio.denominator, metric, '<')) ||
        this.isInterpretationNegativeCombo3(tumorMarker.interpretation) ||
        (tumorMarker.valueQuantity && (
            this.quantityMatch(tumorMarker.valueQuantity.value, tumorMarker.valueQuantity.code, [metric], '<', '%') ||
            this.quantityMatch(tumorMarker.valueQuantity.value, tumorMarker.valueQuantity.code, [0], '=')
        ))) &&
      basicTumorMapping.includes('Biomarker-RB')
    );
  }
  isHER2Positive(tumorMarker: TumorMarker, basicTumorMapping: string[]): boolean {
    return (
      basicTumorMapping.includes('Biomarker-HER2') &&
      (this.isValueCodeableConceptPositive(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationPositive(tumorMarker.interpretation) ||
        (tumorMarker.valueQuantity &&
          this.quantityMatch(tumorMarker.valueQuantity.value, tumorMarker.valueQuantity.code, ['3', '3+'], '=')
        ))
    );
  }
  isHER2Negative(tumorMarker: TumorMarker, quantities: string[], basicTumorMapping: string[]): boolean {
    return (
      (this.isValueCodeableConceptNegative(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationNegative(tumorMarker.interpretation) || // Information on Interpretation values can be found at: http://hl7.org/fhir/R4/valueset-observation-interpretation.html
        (tumorMarker.valueQuantity &&
          this.quantityMatch(tumorMarker.valueQuantity.value, tumorMarker.valueQuantity.code, quantities, '=')
        )) &&
        basicTumorMapping.includes('Biomarker-HER2')
    );
  }
  isFGFRPositive(tumorMarker: TumorMarker, metric: number, basicTumorMapping: string[]): boolean {
    return (
      (this.isValueCodeableConceptPositive(tumorMarker.valueCodeableConcept) ||
        (tumorMarker.valueRatio && this.ratioMatch(tumorMarker.valueRatio.numerator, tumorMarker.valueRatio.denominator, metric, '>=')) ||
        this.isInterpretationPositive(tumorMarker.interpretation) ||
        (tumorMarker.valueQuantity &&
          this.quantityMatch(tumorMarker.valueQuantity.value, tumorMarker.valueQuantity.code, [metric], '>=', '%')
        )) &&
        basicTumorMapping.includes('Biomarker-FGFR')
    );
  }
  isFGFRNegative(tumorMarker: TumorMarker, metric: number, basicTumorMapping: string[]): boolean {
    return (
      (this.isValueCodeableConceptNegative(tumorMarker.valueCodeableConcept) ||
        (tumorMarker.valueRatio && this.ratioMatch(tumorMarker.valueRatio.numerator, tumorMarker.valueRatio.denominator, metric, '<')) ||
        this.isInterpretationNegativeCombo3(tumorMarker.interpretation) ||
        (tumorMarker.valueQuantity &&
            (this.quantityMatch(tumorMarker.valueQuantity.value, tumorMarker.valueQuantity.code, [metric], '<', '%') ||
            this.quantityMatch(tumorMarker.valueQuantity.value, tumorMarker.valueQuantity.code, [0], '='))
        )) &&
        basicTumorMapping.includes('Biomarker-FGFR')
    );
  }
  isPIK3CAPositive(tumorMarker: TumorMarker): boolean {
    const basicTumorMapping = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(tumorMarker.coding);
    return (
      (this.isValueCodeableConceptPositive(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationPositive(tumorMarker.interpretation))
      && basicTumorMapping.includes('Biomarker-PIK3CA')
    );
  }
  isPIK3CANegative(tumorMarker: TumorMarker): boolean {
    const basicTumorMapping = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(tumorMarker.coding);
    return (
      (this.isValueCodeableConceptNegative(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationNegative(tumorMarker.interpretation))
      && basicTumorMapping.includes('Biomarker-PIK3CA')
    );
  }
  isPDL1Positive(tumorMarker: TumorMarker, basicTumorMapping: string[]): boolean {
    return (
      (this.isValueCodeableConceptPositive(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationPositive(tumorMarker.interpretation))
        && basicTumorMapping.includes('Biomarker-PDL1')
        );
  }
  isPDL1Negative(tumorMarker: TumorMarker, basicTumorMapping: string[]): boolean {
    return (
      (this.isValueCodeableConceptNegative(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationNegative(tumorMarker.interpretation))
      && basicTumorMapping.includes('Biomarker-PDL1')
    );
  }

  /**
   * Gets the medication statement value mappings from the patient resource.
   * @returns the medications that this resource's codes map to.
   */
  getMedicationStatementValues(): string[] {

    // Medication Notes.
    // eribuline -> eribulin
    // progestin -> progesterone
    // aluronidase -> hyaluronidase (this is missing from TJ doc?)
    // If primary cancer type is colon, then irinotecan -> camptosar and bevacizumab -> avastin
    // ('goserelin', 'goserelin') // THIS MEDICATION IS NOT CURRENTLY SUPPORTED BY TRIALJECTORY. WE WILL NEED TO DISCUSS THIS WITH THEM.
    // ('leuprolide', 'leuprolide') // THIS MEDICATION IS NOT CURRENTLY SUPPORTED BY TRIALJECTORY. WE WILL NEED TO DISCUSS THIS WITH THEM.
    // WE HAVE SINCE DISCUSSED THESE MEDICATIONS WITH THEM, WAITING FOR THEM TO PROCEED.

    const medicationValues: string[] = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(this.extractedMcode.cancerRelatedMedicationStatements);
    // Filter any duplicate values.
    medicationValues.filter((a, b) => medicationValues.indexOf(a) === b)
    return medicationValues;
  }

  /**
   * Gets the main bio  primary Cancer Type (Cancer "Name")
   * @returns The main cancer group type
   *  */
  getCancerName(): string {
    const extractedPrimaryCancerConditions = this.extractedMcode.primaryCancerConditions;

    // If no primaryCancerCondition -- go ahead and return null
    if (extractedPrimaryCancerConditions.length == 0) {
      return null;
    }

    // Because TrialJectory only supports 1 string as the cancerType, we're going to just go with the first one available
    for (const primaryCancerCondition of extractedPrimaryCancerConditions) {
      // First map the primary cancer condition
      const pccNames = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(primaryCancerCondition.coding);
      const cancerCondition = pccNames.find( cancerCondition => cancerCondition in primary_cancer_condition_mapping);

      if (cancerCondition === undefined) return null;

      const majorType = primary_cancer_condition_mapping[cancerCondition]

      if (majorType) return majorType;
    }
    return null;
  }
}
