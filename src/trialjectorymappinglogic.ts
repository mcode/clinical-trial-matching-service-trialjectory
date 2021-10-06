import { fhir, CodeMapper, CodeSystemEnum, Quantity, TumorMarker, CancerGeneticVariant, Ratio, BaseFhirResource, CancerRelatedSurgicalProcedure, CancerRelatedRadiationProcedure, SecondaryCancerCondition, MappingLogic } from 'clinical-trial-matching-service';
import profile_system_codes from '../data/profile-system-codes.json';
import system_metastasis_codes_json from '../data/system-metastasis-codes-json.json';

const metastasis_codes = system_metastasis_codes_json as {[key:string]: {[key:string]: string}};

/**
 * A class that describes the mapping logic for Trialjectory.
 */
export class TrialjectoryMappingLogic extends MappingLogic {

  /**
   * The code mapping object that maps profiles to codes.
   */
  static codeMapper = new CodeMapper(profile_system_codes)

  /**
   * ECOG Score.
   * @returns 
   */
  getECOGScore(): number {
    const ecog = this.getExtractedEcogPerformaceStatus();
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
    const karnofsky = this.getExtractedKarnofskyPerformanceStatus();
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
    // TODO - Awaiting primary cancer values from Trialjectory.
    return null;
  }

  /**
   * Secondary Cancer Value mapping.
   * @returns
   */
  getSecondaryCancerValues(): string[] {

    const secondaryCancerConditions: SecondaryCancerCondition[] = this.getExtractedSecondaryCancerConditions();

    if (secondaryCancerConditions.length == 0) {
      return null;
    }

    // const secondaryCancerCodings: fhir.Coding[] = this.extractCodings(this.secondaryCancerCondition);
    // Perform the basic mapping.
    // let secondaryCancerMappings: string[] = ExtractedMCODE.codeMapper.extractCodeMappings(secondaryCancerCodings);

    const cancerConditions:string[] = [];
    for (const condition of secondaryCancerConditions) {
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

  /**
   * Returns the histology morphology mappings of this resource.
   * @returns 
   */
  getHistologyMorphologyValue(): string {

    const extractedPrimaryCancerConditions = this.getExtractedPrimaryCancerConditions();

    if (
      extractedPrimaryCancerConditions.length == 0 &&
      this.getExtractedTNMclinicalStageGroup().length == 0 &&
      this.getExtractedTNMpathologicalStageGroup().length == 0
    ) {
      return null;
    }


    // Invasive Ductal Carcinoma
    for (const primaryCancerCondition of extractedPrimaryCancerConditions) {
      const primaryCancerConditions = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(primaryCancerCondition.coding);
      const histologyMorphologies = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(primaryCancerCondition.histologyMorphologyBehavior);
      if (
        (primaryCancerConditions.includes("Cancer-Breast")
        && histologyMorphologies.includes("Morphology-Invas_Duct_Carc"))
        || primaryCancerConditions.includes("Cancer-Invas_Duct_Carc")
      ) {
        // idc (Invasice Ductal Carcinoma)
        return "idc";
      }
    }
    // Invasive Lobular Carcinoma
    for (const primaryCancerCondition of extractedPrimaryCancerConditions) {
      const primaryCancerConditions = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(primaryCancerCondition.coding);
      const histologyMorphologies = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(primaryCancerCondition.histologyMorphologyBehavior);
      if (
        (primaryCancerConditions.includes("Cancer-Breast")
        && histologyMorphologies.includes("Morphology-Invas_Lob_Carc"))
        || primaryCancerConditions.includes("Cancer-Invas_Lob_Carc")
      ) {
        // ilc '(Invasive Lobular Carcinoma)
        return "ilc";
      }
    }
    // Ductual Carcinoma in Situ
    for (const primaryCancerCondition of extractedPrimaryCancerConditions) {
      const primaryCancerConditions = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(primaryCancerCondition.coding);
      const histologyMorphologies = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(primaryCancerCondition.histologyMorphologyBehavior);
      if (
        primaryCancerConditions.includes("Cancer-Breast")
        && histologyMorphologies.includes("Morphology-Duct_Car_In_Situ")
        ) {
        // dcis (Ductal Carcinoma In Situ)
        return "dcis";
      }
    }
    // Invasive Breast Cancer
    for (const primaryCancerCondition of extractedPrimaryCancerConditions) {
      const primaryCancerConditions = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(primaryCancerCondition.coding);
      const histologyMorphologies = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(primaryCancerCondition.histologyMorphologyBehavior);
      if (
        (primaryCancerConditions.includes("Cancer-Breast")
        && histologyMorphologies.includes("Morphology-Invasive"))
        || primaryCancerConditions.includes("Cancer-Invasive-Breast")
      ) {
        // ibc (Invasive Breast Cancer)
        return "ibc";
      }
    }
    // Lobular Carcinoma in Situ (lcis)
    for (const primaryCancerCondition of extractedPrimaryCancerConditions) {
      const primaryCancerConditions = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(primaryCancerCondition.coding);
      const histologyMorphologies = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(primaryCancerCondition.histologyMorphologyBehavior);
      if (
        primaryCancerConditions.includes("lcis-condition")
        || histologyMorphologies.includes("lcis-histology")
        ) {
        // lcis (Lobular Carcinoma In Situ)
        return "lcis";
      }
    }

    // TODO - This logic and mapping does not exist in Trialjectory. It's been added to allow for UTSW record mapping.
    // Invasive Carcinoma
    for (const primaryCancerCondition of extractedPrimaryCancerConditions) {
      const primaryCancerConditions = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(primaryCancerCondition.coding);
      const histologyMorphologies = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(primaryCancerCondition.histologyMorphologyBehavior);
      if (
        (primaryCancerConditions.includes("Cancer-Breast")
        && histologyMorphologies.includes("Morphology-Invasive-Carcinoma"))
        || primaryCancerConditions.includes("Cancer-Invasive-Carcinoma")
      ) {
        return "INVASIVE_CARCINOMA";
      }
    }

    // None of the conditions are satisfied.
    return null;
  }

  /**
   * Returns the radiation procedure mappings for these radiation procedure resources.
   * @returns 
   */
  getRadiationProcedureValues(): string[] {

    const cancerRelatedRadiationProcedures: CancerRelatedRadiationProcedure[] = this.getExtractedCancerRelatedRadiationProcedures();

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
    radiationValues = radiationValues.map(procedure => {
      if(procedureConverter.has(procedure)) {
        return procedureConverter.get(procedure);
      } else {
        return procedure;
      }
    });

    return radiationValues;
  }

  /**
   * Returns the surgical procedure mappings for these surgical procedure resources.
   * @returns 
   */
  getSurgicalProcedureValues(): string[] {

    const cancerRelatedSurgicalProcedures: CancerRelatedSurgicalProcedure[] = this.getExtractedCancerRelatedSurgicalProcedures();

    if(cancerRelatedSurgicalProcedures == null){
      return [];
    }

    const surgical_codes: fhir.Coding[] = this.extractCodings(cancerRelatedSurgicalProcedures);
    // Perform the basic mapping.
    let surgicalProcedureValues: string[] = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(surgical_codes);

    // Convert incorrect profile names to the Trialjectory expected values.
    surgicalProcedureValues = surgicalProcedureValues.map(procedure => {
      if(procedure == "breast-reconstruction") {
        // Although 'reconstruction' is vague, it refers specifically to breast reconstruction.
        return "reconstruction";
      } else if(procedure == "alnd-procedure") {
        // ALND has a second possible logic mapping which will be checked later.
        return "alnd";
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
    if(cancerRelatedSurgicalProcedures.some((surgicalProcedure) => surgicalProcedure.reasonReference != null && surgicalProcedure.reasonReference.meta_profile == 'mcode-secondary-cancer-condition')){
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
    const birthDate = this.getExtractedBirthDate();
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
    let stageValues: string[] = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(this.getExtractedTNMclinicalStageGroup());
    stageValues.push(...TrialjectoryMappingLogic.codeMapper.extractCodeMappings(this.getExtractedTNMpathologicalStageGroup()));

    if(stageValues.length < 1){
      return null;
    }

    // Set the stage conversions.
    const stageConverter = new Map<string, string>()
    stageConverter.set('Stage-4D', '4C');  // 4D is not a stage in Trialjectory, return 4C.
    stageConverter.set('Stage-4C', '4C');
    stageConverter.set('Stage-4B', '4B');
    stageConverter.set('Stage-4A', '4A');
    stageConverter.set('Stage-4', '4');
    stageConverter.set('Stage-3C', '3C');
    stageConverter.set('Stage-3B', '3B');
    stageConverter.set('Stage-3A', '3A');
    stageConverter.set('Stage-3', '3');
    stageConverter.set('Stage-2C', '2C');
    stageConverter.set('Stage-2B', '2B');
    stageConverter.set('Stage-2A', '2A');
    stageConverter.set('Stage-2', '2');
    stageConverter.set('Stage-1C', '1C');
    stageConverter.set('Stage-1B', '1B');
    stageConverter.set('Stage-1A', '1A');
    stageConverter.set('Stage-1', '1');
    stageConverter.set('Stage-0A', '0'); // 0A is not a stage in Trialjectory, return 0.
    stageConverter.set('Stage-0', '0');
    stageConverter.set('Stage-4D', '4C');  // 4D is not a stage in Trialjectory, return 4C.
    stageConverter.set('Stage-0A', '0'); // 0A is not a stage in Trialjectory, return 0.
    stageValues = stageValues.map(stage => {
      if(stageConverter.has(stage)) {
        return stageConverter.get(stage);
      } else {
        throw "Stage does not exist in mapping: " + stage + ".";
      }
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

    const tumorMarker: TumorMarker[] = this.getExtractedTumorMarkers();
    const cancerGeneticVariant: CancerGeneticVariant[] = this.getExtractedCancerGeneticVariants();

    if (tumorMarker.length == 0 && cancerGeneticVariant.length == 0) {
      // Prevents unnecessary checks if the tumor marker values are empty.
      return [];
    }
    const tumorMarkersToCheck = tumorMarker;
    if (tumorMarker.length == 0) {
      // Prevents skipping of cancer genetic variant values.
      tumorMarkersToCheck.push({coding: [] as fhir.Coding[], valueCodeableConcept: [] as fhir.Coding[], valueRatio: [] as Ratio[], valueQuantity: [] as Quantity[], interpretation: [] as fhir.Coding[]} as TumorMarker);
    }

    // Array of Tumor Marker results.
    const tumorMarkerArray: string[] = [];

    // Iterate over each tumor marker seperately.
    for(const currentTumorMarker of tumorMarkersToCheck) {

      // Perform Basic Mapping.
      const basicTumorMapping = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(currentTumorMarker.coding);

      // ER
      if (this.isERPositive(currentTumorMarker, 1, basicTumorMapping)) {
        // NOTE: ER+ check always uses 1 as the metric parameter by default.
        tumorMarkerArray.push('ER+');
      }
      if (this.isERNegative(currentTumorMarker, 1, basicTumorMapping)) {
        // NOTE: ER- check always uses 1 as the metric parameter by default.
        tumorMarkerArray.push('ER-');
      }
  
      // PR
      if (this.isPRPositive(currentTumorMarker, 1, basicTumorMapping)){
        // NOTE: PR+ check always uses 1 as the metric parameter by default.
        tumorMarkerArray.push('PR+');
      }
      if (this.isPRNegative(currentTumorMarker, 1, basicTumorMapping)){
        // NOTE: PR- check always uses 1 as the metric parameter by default.
        tumorMarkerArray.push('PR-');
      }
  
      // RB
      if (this.isRBPositive(currentTumorMarker, 50, basicTumorMapping)) {
        // NOTE: RB+ check always uses 50 as the matric parameter by default.
        tumorMarkerArray.push('RB+');
      }
      if (this.isRBNegative(currentTumorMarker, 50, basicTumorMapping)) {
        // NOTE: RB- check always uses 50 as the matric parameter by default.
        tumorMarkerArray.push('RB-');
      }
  
      // HER
      if (this.isHER2Positive(currentTumorMarker, basicTumorMapping)){
        tumorMarkerArray.push('HER2+')
      }
      if (this.isHER2Negative(currentTumorMarker, ['0', '1', '2', '1+', '2+'], basicTumorMapping)) {
        // NOTE: HER2- check always uses ['0', '1', '2', '1+', '2+'] as the quantities by default.
        tumorMarkerArray.push('HER2-');
      }
  
      // FGFR
      if (this.isFGFRPositive(currentTumorMarker, 1, basicTumorMapping)) {
        tumorMarkerArray.push('FGFR+');
      }
      if (this.isFGFRNegative(currentTumorMarker, 1, basicTumorMapping)) {
        tumorMarkerArray.push('FGFR-');
      }

      // PDL1
      if (this.isPDL1Negative(currentTumorMarker, basicTumorMapping)) {
        tumorMarkerArray.push('PDL1-');
      }
      if (this.isPDL1Positive(currentTumorMarker, basicTumorMapping)) {
        tumorMarkerArray.push('PDL1+');
      }

      // ATM
      if (this.isBioMarkerNegativeCombo2(currentTumorMarker, 'Biomarker-ATM', basicTumorMapping) ||
        cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '795'))) {
        tumorMarkerArray.push('ATM-');
      }
      if (this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-ATM', basicTumorMapping) ||
        cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '795')) ){
        tumorMarkerArray.push('ATM+');
      }

      // CDH1
      if (this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-CDH1', basicTumorMapping) ||
        cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '1748')) ){
        tumorMarkerArray.push('CDH1+');
      }
      if (this.isBioMarkerNegativeCombo2(currentTumorMarker, 'Biomarker-CDH1', basicTumorMapping) ||
        cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '1748')) ){
        tumorMarkerArray.push('CDH1-');
      }

      // CHEK2
      if (this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-CHK2', basicTumorMapping) ||
        cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '16627')) ){
        tumorMarkerArray.push('CHEK2+');
      }  
      if (this.isBioMarkerNegativeCombo2(currentTumorMarker, 'Biomarker-CHK2', basicTumorMapping) ||
        cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '16627')) ){
        tumorMarkerArray.push('CHEK2-');
      }

      // NBN
      if (this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-NBN', basicTumorMapping) ||
        cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '7652')) ){
        tumorMarkerArray.push('NBN+');
      }
      if (this.isBioMarkerNegativeCombo2(currentTumorMarker, 'Biomarker-NBN', basicTumorMapping) ||
        cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '7652')) ){
        tumorMarkerArray.push('NBN-');
      }
  
      // NF1
      if (this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-NF1', basicTumorMapping) ||
        cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '7765')) ){
        tumorMarkerArray.push('NF1+');
      }
      if (this.isBioMarkerNegativeCombo2(currentTumorMarker, 'Biomarker-NF1', basicTumorMapping) ||
        cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '7765')) ){
        tumorMarkerArray.push('NF1-');
      }
  
      // PALB2
      if (this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-PALB2', basicTumorMapping) ||
        cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '26144')) ){
        tumorMarkerArray.push('PALB2+');
      }
      if (this.isBioMarkerNegativeCombo2(currentTumorMarker, 'Biomarker-PALB2', basicTumorMapping) ||
        cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '26144')) ){
        tumorMarkerArray.push('PALB2-');
      }
  
      // PTEN
      if (this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-PTEN', basicTumorMapping) ||
        cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '9588')) ){
        tumorMarkerArray.push('PTEN+');
      }
      if (this.isBioMarkerNegativeCombo2(currentTumorMarker, 'Biomarker-PTEN', basicTumorMapping) ||
        cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '9588')) ){
        tumorMarkerArray.push('PTEN-');
      }
  
      // STK11
      if (this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-STK11', basicTumorMapping) ||
        cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '11389')) ){
        tumorMarkerArray.push('STK11+');
      }
      if (this.isBioMarkerNegativeCombo2(currentTumorMarker, 'Biomarker-STK11', basicTumorMapping) ||
        cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '11389')) ){
        tumorMarkerArray.push('STK11-');
      }
  
      // P53
      if (this.isBioMarkerPositiveCombo2(currentTumorMarker, 'Biomarker-P53', basicTumorMapping) ||
        cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '11998')) ){
        tumorMarkerArray.push('P53+');
      }
      if (this.isBioMarkerNegativeCombo2(currentTumorMarker, 'Biomarker-P53', basicTumorMapping) ||
        cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '11998')) ){
        tumorMarkerArray.push('P53-');
      }

      // PIK3CA
      if (this.isPIK3CANegative(currentTumorMarker) ||
        cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '8975')) ){
        tumorMarkerArray.push('PIK3CA-');
      }
      if (this.isPIK3CAPositive(currentTumorMarker) ||
        cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '8975')) ){
        tumorMarkerArray.push('PIK3CA+');
      }
    }

    // BRCA1
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '1100'))) {
      tumorMarkerArray.push('BRCA1+');
    }
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '1100'))) {
      tumorMarkerArray.push('BRCA1-');
    }

    // BRCA2
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '1101'))) {
      tumorMarkerArray.push('BRCA2+');
    }
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '1101'))) {
      tumorMarkerArray.push('BRCA2-');
    }

    // ESR1
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '3467'))) {
      tumorMarkerArray.push('ESR1+');
    }
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '3467'))) {
      tumorMarkerArray.push('ESR1-');
    }

    // NTRK_FUSION
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '8031')) ||
       cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '8032')) ||
       cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantPositive(cancGenVar, '8033')) ){
      tumorMarkerArray.push('NTRK_FUSION+');
    }
    if (cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '8031')) ||
       cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '8032')) ||
       cancerGeneticVariant.some((cancGenVar) => this.isGeneticVariantNegative(cancGenVar, '8033')) ){
      tumorMarkerArray.push('NTRK_FUSION-');
    }

    // Remove potential duplicates.
    tumorMarkerArray.filter((a, b) => tumorMarkerArray.indexOf(a) === b)

    // Finally, return the fully appended array.
    return tumorMarkerArray;
  }
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
  isERPositive(tumorMarker: TumorMarker, metric: number, basicTumorMapping: string[]): boolean {
    return (
      (this.isValueCodeableConceptPositive(tumorMarker.valueCodeableConcept) ||
        tumorMarker.valueRatio.some((valRat) => this.ratioMatch(valRat.numerator, valRat.denominator, metric, '>=')) ||
        this.isInterpretationPositive(tumorMarker.interpretation) ||
        tumorMarker.valueQuantity.some((valQuant) =>
          this.quantityMatch(valQuant.value, valQuant.code, [metric], '>=', '%')
        )) &&
        basicTumorMapping.includes('Biomarker-ER')
    );
  }
  isERNegative(tumorMarker: TumorMarker, metric: number, basicTumorMapping: string[]): boolean {
    return (
      (this.isValueCodeableConceptNegative(tumorMarker.valueCodeableConcept) ||
        tumorMarker.valueRatio.some((valRat) => this.ratioMatch(valRat.numerator, valRat.denominator, metric, '<')) ||
        this.isInterpretationNegative(tumorMarker.interpretation) ||
        tumorMarker.valueQuantity.some(
          (valQuant) =>
            this.quantityMatch(valQuant.value, valQuant.code, [metric], '<', '%') ||
            this.quantityMatch(valQuant.value, valQuant.code, [0], '=')
        )) &&
        basicTumorMapping.includes('Biomarker-ER')
    );
  }
  isPRPositive(tumorMarker: TumorMarker, metric: number, basicTumorMapping: string[]): boolean {
    return (
      (this.isValueCodeableConceptPositive(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationPositive(tumorMarker.interpretation) ||
        tumorMarker.valueQuantity.some((valQuant) =>
          this.quantityMatch(valQuant.value, valQuant.code, [metric], '>=', '%')
        ) ||
        tumorMarker.valueRatio.some((valRat) => this.ratioMatch(valRat.numerator, valRat.denominator, metric, '>='))) &&
      basicTumorMapping.includes('Biomarker-PR')
    );
  }
  isPRNegative(tumorMarker: TumorMarker, metric: number, basicTumorMapping: string[]): boolean {
    return (
      (this.isValueCodeableConceptNegative(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationNegative(tumorMarker.interpretation) ||
        tumorMarker.valueQuantity.some(
          (valQuant) =>
            this.quantityMatch(valQuant.value, valQuant.code, [metric], '<', '%') ||
            this.quantityMatch(valQuant.value, valQuant.code, [0], '=')
        ) ||
        tumorMarker.valueRatio.some((valRat) => this.ratioMatch(valRat.numerator, valRat.denominator, metric, '<'))) &&
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
      (tumorMarker.valueQuantity.some((valQuant) =>
        this.quantityMatch(valQuant.value, valQuant.code, [metric], '>', '%')
      ) ||
        this.isValueCodeableConceptPositive(tumorMarker.valueCodeableConcept) ||
        tumorMarker.valueRatio.some((valRat) => this.ratioMatch(valRat.numerator, valRat.denominator, metric, '>')) ||
        this.isInterpretationPositive(tumorMarker.interpretation)) &&
        basicTumorMapping.includes('Biomarker-RB')
        );
  }
  isRBNegative(tumorMarker: TumorMarker, metric: number, basicTumorMapping: string[]): boolean {
    return (
      (this.isValueCodeableConceptNegative(tumorMarker.valueCodeableConcept) ||
        tumorMarker.valueRatio.some((valRat) => this.ratioMatch(valRat.numerator, valRat.denominator, metric, '<')) ||
        this.isInterpretationNegativeCombo3(tumorMarker.interpretation) ||
        tumorMarker.valueQuantity.some(
          (valQuant) =>
            this.quantityMatch(valQuant.value, valQuant.code, [metric], '<', '%') ||
            this.quantityMatch(valQuant.value, valQuant.code, [0], '=')
        )) &&
      basicTumorMapping.includes('Biomarker-RB')
    );
  }
  isHER2Positive(tumorMarker: TumorMarker, basicTumorMapping: string[]): boolean {
    return (
      basicTumorMapping.includes('Biomarker-HER2') &&
      (this.isValueCodeableConceptPositive(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationPositive(tumorMarker.interpretation) ||
        tumorMarker.valueQuantity.some((valQuant) =>
          this.quantityMatch(valQuant.value, valQuant.code, ['3', '3+'], '=')
        ))
    );
  }
  isHER2Negative(tumorMarker: TumorMarker, quantities: string[], basicTumorMapping: string[]): boolean {
    return (
      (this.isValueCodeableConceptNegative(tumorMarker.valueCodeableConcept) ||
        this.isInterpretationNegative(tumorMarker.interpretation) || // Information on Interpretation values can be found at: http://hl7.org/fhir/R4/valueset-observation-interpretation.html
        tumorMarker.valueQuantity.some((valQuant) =>
          this.quantityMatch(valQuant.value, valQuant.code, quantities, '=')
        )) &&
        basicTumorMapping.includes('Biomarker-HER2')
    );
  }
  isFGFRPositive(tumorMarker: TumorMarker, metric: number, basicTumorMapping: string[]): boolean {
    return (
      (this.isValueCodeableConceptPositive(tumorMarker.valueCodeableConcept) ||
        tumorMarker.valueRatio.some((valRat) => this.ratioMatch(valRat.numerator, valRat.denominator, metric, '>=')) ||
        this.isInterpretationPositive(tumorMarker.interpretation) ||
        tumorMarker.valueQuantity.some((valQuant) =>
          this.quantityMatch(valQuant.value, valQuant.code, [metric], '>=', '%')
        )) &&
        basicTumorMapping.includes('Biomarker-FGFR')
    );
  }
  isFGFRNegative(tumorMarker: TumorMarker, metric: number, basicTumorMapping: string[]): boolean {
    return (
      (this.isValueCodeableConceptNegative(tumorMarker.valueCodeableConcept) ||
        tumorMarker.valueRatio.some((valRat) => this.ratioMatch(valRat.numerator, valRat.denominator, metric, '<')) ||
        this.isInterpretationNegativeCombo3(tumorMarker.interpretation) ||
        tumorMarker.valueQuantity.some(
          (valQuant) =>
            this.quantityMatch(valQuant.value, valQuant.code, [metric], '<', '%') ||
            this.quantityMatch(valQuant.value, valQuant.code, [0], '=')
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
   * Gets the medication statement value mappnigs from the patient resource.
   * @returns the medications that this resource's codes map to.
   */
  getMedicationStatementValues(): string[] {

    // Medication Notes.
    // eribuline -> eribulin
    // progestin -> progesterone
    // aluronidase -> hyaluronidase (this is missing from TJ doc?)
    // ('goserelin', 'goserelin') // THIS MEDICATION IS NOT CURRENTLY SUPPORTED BY TRIALJECTORY. WE WILL NEED TO DISCUSS THIS WITH THEM.
    // ('leuprolide', 'leuprolide') // THIS MEDICATION IS NOT CURRENTLY SUPPORTED BY TRIALJECTORY. WE WILL NEED TO DISCUSS THIS WITH THEM.
    // WE HAVE SINCE DISCUSSED THESE MEDICATIONS WITH THEM, WAITING FOR THEM TO PROCEED.

    const medicationValues: string[] = TrialjectoryMappingLogic.codeMapper.extractCodeMappings(this.getExtractedCancerRelatedMedicationStatements());

    // Filter any duplicate values.
    medicationValues.filter((a, b) => medicationValues.indexOf(a) === b)

    return medicationValues;
  }

 }