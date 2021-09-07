import * as mcode from "../src/mcode";
import { fhir } from 'clinical-trial-matching-service';
import fs from 'fs';
import path from 'path';
import { Coding, PrimaryCancerCondition } from "../src/mcode";
import { CodeMapper, CodeSystemEnum } from "../src/codeMapper";


function createEmptyTumorMarker(): mcode.TumorMarker {
  const tm: mcode.TumorMarker = {};
  tm.coding = [] as Coding[];
  tm.interpretation = [] as Coding[];
  tm.valueCodeableConcept = [] as Coding[];
  tm.valueQuantity = [] as mcode.Quantity[];
  tm.valueRatio = [] as mcode.Ratio[];
  return tm;
}

function createEmptyCancerGeneticVariant(): mcode.CancerGeneticVariant {
  return {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  } as mcode.CancerGeneticVariant;
}

function createEmptyCancerGeneticVariantComponent(): mcode.CancerGeneticVariantComponent {
  return {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  } as mcode.CancerGeneticVariantComponent;
}

function createEmptyCancerGeneticVariantGeneStudied(): mcode.CancerGeneticVariantComponentType {
  return {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  } as mcode.CancerGeneticVariantComponentType;
}

function createEmptyCancerGeneticVariantGenomicsSource(): mcode.CancerGeneticVariantComponentType {
  return {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  } as mcode.CancerGeneticVariantComponentType;
}


describe('ExtractedMCODE Import', () => {
  let sampleData: fhir.Bundle;
  beforeAll(() => {
    return new Promise((resolve, reject) => {
      const patientDataPath = path.join(__dirname, '../../spec/data/patient_data.json');
      fs.readFile(patientDataPath, { encoding: 'utf8' }, (error, data) => {
        if (error) {
          console.error('Could not read spec file');
          reject(error);
          return;
        }
        try {
          sampleData = JSON.parse(data) as fhir.Bundle;
          // The object we resolve to doesn't really matter
          resolve(sampleData);
        } catch (ex) {
          reject(error);
        }
      });
    });
  });

  it('checksCountOfExtractedProfiles', function () {
    const extractedData = new mcode.ExtractedMCODE(sampleData);
    expect(extractedData.primaryCancerCondition.length).toBe(1);
    expect(extractedData.TNMClinicalStageGroup.length).toBe(2);
    expect(extractedData.TNMPathologicalStageGroup.length).toBe(2);
    expect(extractedData.secondaryCancerCondition.length).toBe(2);
    expect(extractedData.birthDate).toBe('1966-08-03');
    expect(extractedData.tumorMarker.length).toBe(3);
    expect(extractedData.cancerRelatedRadiationProcedure.length).toBe(2);
    expect(extractedData.cancerRelatedSurgicalProcedure.length).toBe(3);
    expect(extractedData.cancerRelatedMedicationStatement.length).toBe(1);
    expect(extractedData.cancerGeneticVariant.length).toBe(2);
    expect(extractedData.ecogPerformaceStatus).toBe(3);
    expect(extractedData.karnofskyPerformanceStatus).toBe(90);
  });

  it('checkExtractedPrimaryCancerCondition', function () {
    const extractedData = new mcode.ExtractedMCODE(sampleData);
    expect(extractedData.primaryCancerCondition[0].clinicalStatus[0].code).toBe('active');
    expect(extractedData.primaryCancerCondition[0].coding[0].code).toBe('254837009');
    expect(extractedData.primaryCancerCondition[0].histologyMorphologyBehavior[0].code).toBe('367651003');
    expect(extractedData.primaryCancerCondition[0].meta_profile).toBe('mcode-primary-cancer-condition');
  });

  it('checkExtractedTNMClinicalStageGroup', function () {
    const extractedData = new mcode.ExtractedMCODE(sampleData);
    expect(extractedData.TNMClinicalStageGroup[0].code).toBe('261638004');
    expect(extractedData.TNMClinicalStageGroup[1].code).toBe('c3A');
  });

  it('checkExtractedTNMPathologicalStageGroup', function () {
    const extractedData = new mcode.ExtractedMCODE(sampleData);
    expect(extractedData.TNMPathologicalStageGroup[0].code).toBe('261638004');
    expect(extractedData.TNMPathologicalStageGroup[1].code).toBe('c3A');
  });

  it('checkExtractedSecondaryCancerCondition', function () {
    const extractedData = new mcode.ExtractedMCODE(sampleData);
    expect(extractedData.secondaryCancerCondition[0].clinicalStatus[0].code).toBe('active');
    expect(extractedData.secondaryCancerCondition[0].coding[0].code).toBe('128462008');
    expect(extractedData.secondaryCancerCondition[0].bodySite[0].code).toBe('8935007');
    expect(extractedData.secondaryCancerCondition[0].meta_profile).toBe('mcode-secondary-cancer-condition');
  });

  it('checkExtractedTumorMarker', function () {
    const extractedData = new mcode.ExtractedMCODE(sampleData);
    expect(
      extractedData.tumorMarker.some(
        (marker) =>
          marker.valueCodeableConcept[0].code == '10828004' &&
          marker.valueQuantity[0].value == 3 &&
          marker.valueRatio.length == 0 &&
          marker.coding[0].code == '48676-1' &&
          marker.coding[1].code == '85319-2' &&
          marker.interpretation[0].code == 'POS'
      )
    ).toBeTrue();
    expect(
      extractedData.tumorMarker.some(
        (marker) =>
          marker.valueCodeableConcept[0].code == '10828004' &&
          marker.valueQuantity.length == 0 &&
          marker.valueRatio[0].numerator.value == 1 &&
          marker.valueRatio[0].numerator.comparator == '>=' &&
          marker.valueRatio[0].denominator.value == 100 &&
          marker.coding[0].code == '48676-1' &&
          marker.coding[1].code == '85318-4' &&
          marker.interpretation.length == 0
      )
    ).toBeTrue();
    expect(
      extractedData.tumorMarker.some(
        (marker) =>
          marker.valueCodeableConcept[0].code == '10828004' &&
          marker.valueQuantity.length > 0 &&
          marker.valueQuantity[0].value == 10 &&
          marker.valueQuantity[0].comparator == '>=' &&
          marker.valueQuantity[0].unit == '%' &&
          marker.valueRatio.length == 0 &&
          marker.coding[0].code == '16112-5' &&
          marker.coding[1].code == '85337-4' &&
          marker.interpretation.length == 0
      )
    ).toBeTrue();
  });

  it('checkExtractedCancerRelatedRadiationProcedure', function () {
    const extractedData = new mcode.ExtractedMCODE(sampleData);
    expect(
      extractedData.cancerRelatedRadiationProcedure.some(
        (procedure) => procedure.coding[0].code == '448385000' && procedure.bodySite.length == 0
      )
    ).toBeTrue();
    expect(
      extractedData.cancerRelatedRadiationProcedure.some(
        (procedure) =>
          procedure.coding[0].code == '448385000' &&
          procedure.bodySite.length != 0 &&
          procedure.bodySite[0].code == '12738006'
      )
    ).toBeTrue();
  });

  it('checkExtractedCancerRelatedSurgicalProcedure', function () {
    const extractedData = new mcode.ExtractedMCODE(sampleData);
    expect(extractedData.cancerRelatedSurgicalProcedure.some((procedure) => procedure.coding[0].code == '396487001')).toBeTrue();
    expect(extractedData.cancerRelatedSurgicalProcedure.some((procedure) => procedure.coding[0].code == '443497002')).toBeTrue();
    expect(extractedData.cancerRelatedSurgicalProcedure.some((procedure) => procedure.reasonReference.meta_profile == 'mcode-primary-cancer-condition')).toBeTrue();
    expect(extractedData.cancerRelatedSurgicalProcedure.some((procedure) => procedure.reasonReference.meta_profile == 'mcode-secondary-cancer-condition')).toBeTrue();
  });

  it('checkExtractedCancerGeneticVariant', function () {
    const extractedData = new mcode.ExtractedMCODE(sampleData);
    expect(extractedData.cancerGeneticVariant[0].coding[0].system).toBe('http://loinc.org');
    expect(extractedData.cancerGeneticVariant[0].coding[0].code).toBe('69548-6');
    expect(extractedData.cancerGeneticVariant[0].valueCodeableConcept[0].system).toBe('http://loinc.org');
    expect(extractedData.cancerGeneticVariant[0].valueCodeableConcept[0].code).toBe('LA9633-4');
    expect(extractedData.cancerGeneticVariant[0].interpretation[0].system).toBe(
      'http://hl7.org/fhir/ValueSet/observation-interpretation'
    );
    expect(extractedData.cancerGeneticVariant[0].interpretation[0].code).toBe('POS');
    expect(extractedData.cancerGeneticVariant[0].component.geneStudied[0].code.coding[0].system).toBe(
      'http://loinc.org'
    );
    expect(extractedData.cancerGeneticVariant[0].component.geneStudied[0].code.coding[0].code).toBe('48018-6');
    expect(
      CodeMapper.normalizeCodeSystem(
        extractedData.cancerGeneticVariant[0].component.geneStudied[0].valueCodeableConcept.coding[0].system
      )
    ).toBe(CodeSystemEnum.HGNC);
    expect(extractedData.cancerGeneticVariant[0].component.geneStudied[0].valueCodeableConcept.coding[0].code).toBe(
      'HGNC:11389'
    );
    expect(extractedData.cancerGeneticVariant[0].component.geneStudied[0].interpretation.coding[0].system).toBe(
      'http://hl7.org/fhir/ValueSet/observation-interpretation'
    );
    expect(extractedData.cancerGeneticVariant[0].component.geneStudied[0].interpretation.coding[0].code).toBe('CAR');
    expect(extractedData.cancerGeneticVariant[0].component.genomicsSourceClass[0].code.coding[0].system).toBe(
      'http://loinc.org'
    );
    expect(extractedData.cancerGeneticVariant[0].component.genomicsSourceClass[0].code.coding[0].code).toBe('48002-0');
    expect(
      extractedData.cancerGeneticVariant[0].component.genomicsSourceClass[0].valueCodeableConcept.coding[0].system
    ).toBe('http://loinc.org');
    expect(
      extractedData.cancerGeneticVariant[0].component.genomicsSourceClass[0].valueCodeableConcept.coding[0].code
    ).toBe('LA6684-0');
    expect(extractedData.cancerGeneticVariant[0].component.genomicsSourceClass[0].interpretation.coding[0].system).toBe(
      'http://hl7.org/fhir/ValueSet/observation-interpretation'
    );
    expect(extractedData.cancerGeneticVariant[0].component.genomicsSourceClass[0].interpretation.coding[0].code).toBe(
      'A'
    );
  });

  it('checkExtractedCancerRelatedMedicationStatement', function () {
    const extractedData = new mcode.ExtractedMCODE(sampleData);
    expect(extractedData.cancerRelatedMedicationStatement[0].code).toBe('583214');
  });
});

describe('Missing Birthdate ExtractedMCODE Import', () => {
  let sampleData: fhir.Bundle;
  beforeAll(() => {
    return new Promise((resolve, reject) => {
      const patientDataPath = path.join(__dirname, '../../spec/data/patient_data_missing_birthdate.json');
      fs.readFile(patientDataPath, { encoding: 'utf8' }, (error, data) => {
        if (error) {
          console.error('Could not read spec file');
          reject(error);
          return;
        }
        try {
          sampleData = JSON.parse(data) as fhir.Bundle;
          // The object we resolve to doesn't really matter
          resolve(sampleData);
        } catch (ex) {
          reject(error);
        }
      });
    });
  });

  it('checkMissingBirthDate', function () {
    const extractedData = new mcode.ExtractedMCODE(sampleData);
    expect(extractedData.birthDate).toBe('NA');
  });
});


describe("checkMedicationStatementFilterLogic-NoMedications", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // anastrozole medication filter
  ms.push({ system: "RxNorm", code: "341545345", display: "N/A" } as Coding);
  ms.push({ system: "RxNorm", code: "563563", display: "N/A" } as Coding);
  ms.push({ system: "RxNorm", code: "35635463", display: "N/A" } as Coding);
  ms.push({ system: "RxNorm", code: "5365712", display: "N/A" } as Coding);
  ms.push({ system: "RxNorm", code: "2452456", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test anastrozole medication filter.", () => {
    expect(medications.length).toBe(0);
  });
});
describe("checkMedicationStatementFilterLogic-anastrozole", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // anastrozole medication filter
  ms.push({ system: "RxNorm", code: "1157702", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test anastrozole medication filter.", () => {
    expect(medications[0]).toBe("anastrozole");
  });
});
describe("checkMedicationStatementFilterLogic-exemestane", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // exemestane medication filter
  ms.push({ system: "RxNorm", code: "310261", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test exemestane medication filter.", () => {
    expect(medications[0]).toBe("exemestane");
  });
});
describe("checkMedicationStatementFilterLogic-letrozole", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // letrozole medication filter
  ms.push({ system: "RxNorm", code: "372571", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test letrozole medication filter.", () => {
    expect(medications[0]).toBe("letrozole");
  });
});
describe("checkMedicationStatementFilterLogic-tamoxifen", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // tamoxifen medication filter
  ms.push({ system: "RxNorm", code: "1184837", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test tamoxifen medication filter.", () => {
    expect(medications[0]).toBe("tamoxifen");
  });
});
describe("checkMedicationStatementFilterLogic-fulvestrant", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // fulvestrant medication filter
  ms.push({ system: "RxNorm", code: "203870", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test fulvestrant medication filter.", () => {
    expect(medications[0]).toBe("fulvestrant");
  });
});
describe("checkMedicationStatementFilterLogic-toremifene", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // toremifene medication filter
  ms.push({ system: "RxNorm", code: "38409", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test toremifene medication filter.", () => {
    expect(medications[0]).toBe("toremifene");
  });
});
describe("checkMedicationStatementFilterLogic-raloxifene_hcl", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // raloxifene_hcl medication filter
  ms.push({ system: "RxNorm", code: "1490064", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test raloxifene_hcl medication filter.", () => {
    expect(medications[0]).toBe("raloxifene_hcl");
  });
});
describe('checkMedicationStatementFilterLogic-trastuzumab', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // trastuzumab medication filter
  ms.push({ system: 'RxNorm', code: '1658082', display: 'N/A' } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it('Test trastuzumab medication filter.', () => {
    expect(medications.some(medication => medication == 'trastuzumab')).toBeTrue();
  });
});
describe('checkMedicationStatementFilterLogicTreatment-Trastuzumab', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // Treatment Trastuzumab medication filter
  ms.push({ system: 'RxNorm', code: '1162762', display: 'N/A' } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it('Test trastuzumab medication filter.', () => {
    expect(medications.some(medication => medication == 'trastuzumab')).toBeTrue();
  });
});
describe("checkMedicationStatementFilterLogic-trastuzumab_hyaluronidase_conjugate", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // trastuzumab_hyaluronidase_conjugate medication filter
  ms.push({ system: "RxNorm", code: "2119711", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test trastuzumab_hyaluronidase_conjugate medication filter.", () => {
    expect(medications.some(medication => medication == 'trastuzumab_hyaluronidase_conjugate')).toBeTrue();
    expect(medications.some(medication => medication == 'trastuzumab')).toBeTrue();
  });
});
describe("checkMedicationStatementFilterLogic-trastuzumab_deruxtecan_conjugate", () => {
  // NOTE: This medication does not have one of the mCODE Compliant Term Types. Has PIN and IN.
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // trastuzumab_deruxtecan_conjugate medication filter
  ms.push({ system: "RxNorm", code: "2267582", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test trastuzumab_deruxtecan_conjugate medication filter.", () => {
    expect(medications.some(medication => medication == 'trastuzumab_deruxtecan_conjugate')).toBeTrue();
    expect(medications.some(medication => medication == 'trastuzumab')).toBeTrue();
  });
});
describe("checkMedicationStatementFilterLogic-pertuzumab", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // pertuzumab medication filter
  ms.push({ system: "RxNorm", code: "1298952", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test xxx medication filter.", () => {
    expect(medications[0]).toBe("pertuzumab");
  });
});
describe("checkMedicationStatementFilterLogic-lapatinib", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // lapatinib medication filter
  ms.push({ system: "RxNorm", code: "672151", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test lapatinib medication filter.", () => {
    expect(medications[0]).toBe("lapatinib");
  });
});
describe("checkMedicationStatementFilterLogic-pertuzumab_trastuzumab_hyaluronidase", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // pertuzumab_trastuzumab_hyaluronidase medication filter
  ms.push({ system: "RxNorm", code: "2382607", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test pertuzumab_trastuzumab_hyaluronidase medication filter.", () => {
    expect(medications.some(medication => medication == 'pertuzumab_trastuzumab_hyaluronidase')).toBeTrue();
    expect(medications.some(medication => medication == 'trastuzumab_hyaluronidase_conjugate')).toBeTrue();
    expect(medications.some(medication => medication == 'trastuzumab')).toBeTrue();
  });
});
describe("checkMedicationStatementFilterLogic-tucatinib", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // tucatinib medication filter
  ms.push({ system: "RxNorm", code: "2361286", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test tucatinib medication filter.", () => {
    expect(medications[0]).toBe("tucatinib");
  });
});
describe("checkMedicationStatementFilterLogic-neratinib", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // neratinib medication filter
  ms.push({ system: "RxNorm", code: "1940644", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test neratinib medication filter.", () => {
    expect(medications[0]).toBe("neratinib");
  });
});
describe("checkMedicationStatementFilterLogic-tdm1", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // tdm1 medication filter
  ms.push({ system: "RxNorm", code: "1371049", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test tdm1 medication filter.", () => {
    expect(medications.some(medication => medication == 'tdm1')).toBeTrue();
  });
});
describe("checkMedicationStatementFilterLogic-doxorubicin", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // doxorubicin medication filter
  ms.push({ system: "RxNorm", code: "1799302", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test doxorubicin medication filter.", () => {
    expect(medications[0]).toBe("doxorubicin");
  });
});
describe("checkMedicationStatementFilterLogic-epirubicin", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // epirubicin medication filter
  ms.push({ system: "RxNorm", code: "1732174", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test epirubicin medication filter.", () => {
    expect(medications[0]).toBe("epirubicin");
  });
});
describe("checkMedicationStatementFilterLogic-cyclophosphamide", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // cyclophosphamide medication filter
  ms.push({ system: "RxNorm", code: "1734915", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test cyclophosphamide medication filter.", () => {
    expect(medications[0]).toBe("cyclophosphamide");
  });
});
describe("checkMedicationStatementFilterLogic-cisplatin", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // cisplatin medication filter
  ms.push({ system: "RxNorm", code: "376433", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test cisplatin medication filter.", () => {
    expect(medications[0]).toBe("cisplatin");
  });
});
describe("checkMedicationStatementFilterLogic-carboplatin", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // carboplatin medication filter
  ms.push({ system: "RxNorm", code: "93698", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test carboplatin medication filter.", () => {
    expect(medications[0]).toBe("carboplatin");
  });
});
describe("checkMedicationStatementFilterLogic-paclitaxel", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // paclitaxel medication filter
  ms.push({ system: "RxNorm", code: "1165953", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test paclitaxel medication filter.", () => {
    expect(medications[0]).toBe("paclitaxel");
  });
});
describe("checkMedicationStatementFilterLogic-docetaxel", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // docetaxel medication filter
  ms.push({ system: "RxNorm", code: "1093279", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test docetaxel medication filter.", () => {
    expect(medications[0]).toBe("docetaxel");
  });
});
describe("checkMedicationStatementFilterLogic-gemcitabine", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // gemcitabine medication filter
  ms.push({ system: "RxNorm", code: "1720977", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test gemcitabine medication filter.", () => {
    expect(medications[0]).toBe("gemcitabine");
  });
});
describe("checkMedicationStatementFilterLogic-capecitabine", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // capecitabine medication filter
  ms.push({ system: "RxNorm", code: "1158877", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test capecitabine medication filter.", () => {
    expect(medications[0]).toBe("capecitabine");
  });
});
describe("checkMedicationStatementFilterLogic-vinblastine_sulfate", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // vinblastine_sulfate medication filter
  ms.push({ system: "RxNorm", code: "376857", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test vinblastine_sulfate medication filter.", () => {
    expect(medications[0]).toBe("vinblastine_sulfate");
  });
});
describe("checkMedicationStatementFilterLogic-sacituzumab_govitecan_hziy", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // sacituzumab_govitecan_hziy medication filter
  ms.push({ system: "RxNorm", code: "2360533", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test sacituzumab_govitecan_hziy medication filter.", () => {
    expect(medications[0]).toBe("sacituzumab_govitecan_hziy");
  });
});
describe("checkMedicationStatementFilterLogic-methotrexate", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // methotrexate medication filter
  ms.push({ system: "RxNorm", code: "1921593", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test methotrexate medication filter.", () => {
    expect(medications[0]).toBe("methotrexate");
  });
});
describe("checkMedicationStatementFilterLogic-fluorouracil", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // fluorouracil medication filter
  ms.push({ system: "RxNorm", code: "105584", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test fluorouracil medication filter.", () => {
    expect(medications[0]).toBe("fluorouracil");
  });
});
describe("checkMedicationStatementFilterLogic-vinorelbine", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // xxx medication filter
  ms.push({ system: "RxNorm", code: "1180490", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test vinorelbine medication filter.", () => {
    expect(medications[0]).toBe("vinorelbine");
  });
});
describe('checkMedicationStatementFilterLogic-eribulin', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // eribuline medication filter
  ms.push({ system: 'RxNorm', code: '1736562', display: 'N/A' } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it('Test eribulin medication filter.', () => {
    expect(medications.some(medication => medication == 'eribulin')).toBeTrue();
  });
});
describe("checkMedicationStatementFilterLogic-ixabepilone", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // ixabepilone medication filter
  ms.push({ system: "RxNorm", code: "1726277", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test ixabepilone medication filter.", () => {
    expect(medications[0]).toBe("ixabepilone");
  });
});
describe("checkMedicationStatementFilterLogic-etoposide", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // etoposide medication filter
  ms.push({ system: "RxNorm", code: "1734344", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test etoposide medication filter.", () => {
    expect(medications[0]).toBe("etoposide");
  });
});
describe("checkMedicationStatementFilterLogic-pemetrexed", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // pemetrexed medication filter
  ms.push({ system: "RxNorm", code: "1728078", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test pemetrexed medication filter.", () => {
    expect(medications[0]).toBe("pemetrexed");
  });
});
describe("checkMedicationStatementFilterLogic-irinotecan", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // irinotecan medication filter
  ms.push({ system: "RxNorm", code: "2284502", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test irinotecan medication filter.", () => {
    expect(medications[0]).toBe("irinotecan");
  });
});
describe("checkMedicationStatementFilterLogic-topotecan", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // topotecan medication filter
  ms.push({ system: "RxNorm", code: "1172714", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test topotecan medication filter.", () => {
    expect(medications[0]).toBe("topotecan");
  });
});
describe("checkMedicationStatementFilterLogic-ifosfamide", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // ifosfamide medication filter
  ms.push({ system: "RxNorm", code: "1791587", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test ifosfamide medication filter.", () => {
    expect(medications[0]).toBe("ifosfamide");
  });
});
describe("checkMedicationStatementFilterLogic-nivolumab", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // nivolumab medication filter
  ms.push({ system: "RxNorm", code: "1597878", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test nivolumab medication filter.", () => {
    expect(medications[0]).toBe("nivolumab");
  });
});
describe("checkMedicationStatementFilterLogic-avelumab", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // avelumab medication filter
  ms.push({ system: "RxNorm", code: "1875540", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test avelumab medication filter.", () => {
    expect(medications[0]).toBe("avelumab");
  });
});
describe("checkMedicationStatementFilterLogic-thiotepa", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // thiotepa medication filter
  ms.push({ system: "RxNorm", code: "1919208", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test thiotepa medication filter.", () => {
    expect(medications[0]).toBe("thiotepa");
  });
});
describe("checkMedicationStatementFilterLogic-olaparib", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // olaparib medication filter
  ms.push({ system: "RxNorm", code: "1942483", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test olaparib medication filter.", () => {
    expect(medications[0]).toBe("olaparib");
  });
});
describe("checkMedicationStatementFilterLogic-talazoparib", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // talazoparib medication filter
  ms.push({ system: "RxNorm", code: "2099949", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test talazoparib medication filter.", () => {
    expect(medications[0]).toBe("talazoparib");
  });
});
describe("checkMedicationStatementFilterLogic-atezolizumab", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // atezolizumab medication filter
  ms.push({ system: "RxNorm", code: "1792778", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test atezolizumab medication filter.", () => {
    expect(medications[0]).toBe("atezolizumab");
  });
});
describe("checkMedicationStatementFilterLogic-pembrolizumab", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // pembrolizumab medication filter
  ms.push({ system: "RxNorm", code: "1657747", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test pembrolizumab medication filter.", () => {
    expect(medications[0]).toBe("pembrolizumab");
  });
});
describe("checkMedicationStatementFilterLogic-zoledronic_acid", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // zoledronic_acid medication filter
  ms.push({ system: "RxNorm", code: "1114086", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test zoledronic_acid medication filter.", () => {
    expect(medications[0]).toBe("zoledronic_acid");
  });
});
describe("checkMedicationStatementFilterLogic-pamidronate", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // pamidronate medication filter
  ms.push({ system: "RxNorm", code: "904918", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test pamidronate medication filter.", () => {
    expect(medications[0]).toBe("pamidronate");
  });
});
describe("checkMedicationStatementFilterLogic-denosumab", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // denosumab medication filter
  ms.push({ system: "RxNorm", code: "993457", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test denosumab medication filter.", () => {
    expect(medications[0]).toBe("denosumab");
  });
});
describe("checkMedicationStatementFilterLogic-bevacizumab", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // bevacizumab medication filter
  ms.push({ system: "RxNorm", code: "1175674", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test bevacizumab medication filter.", () => {
    expect(medications[0]).toBe("bevacizumab");
  });
});
describe("checkMedicationStatementFilterLogic-everolimus", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // everolimus medication filter
  ms.push({ system: "RxNorm", code: "1172066", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test everolimus medication filter.", () => {
    expect(medications[0]).toBe("everolimus");
  });
});
describe('checkMedicationStatementFilterLogic-progesterone', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // progestin medication filter
  ms.push({ system: 'RxNorm', code: '2537633', display: 'N/A' } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it('Test progesterone medication filter.', () => {
      expect(medications.some(medication => medication == 'progesterone')).toBeTrue();
  });
});
// TODO - Temporarily removed this medication because it's no longer present in the TJ object list document. Will ask Noam to confirm.
// describe('checkMedicationStatementFilterLogic-Hyaluronidase', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const ms: Coding[] = [] as Coding[];
//   // progestin medication filter
//   ms.push({ system: 'RxNorm', code: '630936', display: 'N/A' } as Coding);
//   extractedMCODE.cancerRelatedMedicationStatement = ms;
//   const medications: string[] = extractedMCODE.getMedicationStatementValues();
//   it('Test Hyaluronidase medication filter.', () => {
//       expect(medications.some(medication => medication == 'hyaluronidase')).toBeTrue();
//   });
// });
describe("checkMedicationStatementFilterLogic-fluoxymesterone", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // fluoxymesterone medication filter
  ms.push({ system: "RxNorm", code: "1175599", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test fluoxymesterone medication filter.", () => {
    expect(medications[0]).toBe("fluoxymesterone");
  });
});
describe('checkMedicationStatementFilterLogic-high_dose_estrogen', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // high_dose_estrogen medication filter
  ms.push({ system: 'RxNorm', code: '4099', display: 'N/A' } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it('Test high_dose_estrogen medication filter.', () => {
    expect(medications.includes('high_dose_estrogen')).toBeTrue();
  });
});
describe("checkMedicationStatementFilterLogic-palbociclib", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // palbociclib medication filter
  ms.push({ system: "RxNorm", code: "1601385", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test palbociclib medication filter.", () => {
    expect(medications[0]).toBe("palbociclib");
  });
});
describe("checkMedicationStatementFilterLogic-ribociclib", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // ribociclib medication filter
  ms.push({ system: "RxNorm", code: "1873987", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test ribociclib medication filter.", () => {
    expect(medications[0]).toBe("ribociclib");
  });
});
describe("checkMedicationStatementFilterLogic-abemaciclib", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // abemaciclib medication filter
  ms.push({ system: "RxNorm", code: "1946825", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test abemaciclib medication filter.", () => {
    expect(medications[0]).toBe("abemaciclib");
  });
});
describe("checkMedicationStatementFilterLogic-alpelisib", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // alpelisib medication filter
  ms.push({ system: "RxNorm", code: "2169317", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test alpelisib medication filter.", () => {
    expect(medications[0]).toBe("alpelisib");
  });
});
describe("checkMedicationStatementFilterLogic-seven_medications", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // letrozole medication filter
  ms.push({ system: "RxNorm", code: "372571", display: "N/A" } as Coding);
  // lapatinib medication filter
  ms.push({ system: "RxNorm", code: "672151", display: "N/A" } as Coding);
  // tucatinib medication filter
  ms.push({ system: "RxNorm", code: "2361286", display: "N/A" } as Coding);
  // topotecan medication filter
  ms.push({ system: "RxNorm", code: "1172714", display: "N/A" } as Coding);
  // palbociclib medication filter
  ms.push({ system: "RxNorm", code: "1601385", display: "N/A" } as Coding);
  // abemaciclib medication filter
  ms.push({ system: "RxNorm", code: "1946825", display: "N/A" } as Coding);
  // alpelisib medication filter
  ms.push({ system: "RxNorm", code: "2169317", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test alpelisib medication filter.", () => {
    expect(medications.length).toBe(7);
    expect(medications.indexOf("letrozole") > -1).toBeTrue();
    expect(medications.indexOf("lapatinib") > -1).toBeTrue();
    expect(medications.indexOf("tucatinib") > -1).toBeTrue();
    expect(medications.indexOf("topotecan") > -1).toBeTrue();
    expect(medications.indexOf("palbociclib") > -1).toBeTrue();
    expect(medications.indexOf("abemaciclib") > -1).toBeTrue();
    expect(medications.indexOf("alpelisib") > -1).toBeTrue();
  });
});
describe('checkStageFilterLogic-Stage0', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tnmPathological: Coding[] = [] as Coding[];
  // Stage 0 Filter Attributes
  tnmPathological.push({ system: 'snomed', code: '261645004', display: 'N/A' } as Coding); // Any code in 'Stage-0'
  extractedMCODE.TNMPathologicalStageGroup = tnmPathological;
  const stage: string = extractedMCODE.getStageValues();
  it('Test Stage 0 Filter', () => {
    expect(stage).toBe('0');
  });
});
describe('checkStageFilterLogic-Stage1', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tnmPathological: Coding[] = [] as Coding[];
  // Stage 1 Filter Attributes
  tnmPathological.push({ system: 'AJCC', code: '1', display: 'N/A' } as Coding); // Any code in 'Stage-1'
  extractedMCODE.TNMClinicalStageGroup = tnmPathological;
  const stage: string = extractedMCODE.getStageValues();
  it('Test Stage 1 Filter', () => {
    expect(stage).toBe('1');
  });
});
describe('checkStageFilterLogic-Stage1A', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tnmPathological: Coding[] = [] as Coding[];
  // Stage 1A Filter Attributes
  tnmPathological.push({ system: 'snomed', code: '261634002', display: 'N/A' } as Coding); // Any code in 'Stage-1A'
  extractedMCODE.TNMPathologicalStageGroup = tnmPathological;
  const stage: string = extractedMCODE.getStageValues();
  it('Test Stage 1A Filter', () => {
    expect(stage).toBe('1A');
  });
});
describe('checkStageFilterLogic-Stage1B', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tnmPathological: Coding[] = [] as Coding[];
  // Stage 1B Filter Attributes
  tnmPathological.push({ system: 'snomed', code: '261635001', display: 'N/A' } as Coding); // Any code in 'Stage-1B'
  extractedMCODE.TNMPathologicalStageGroup = tnmPathological;
  const stage: string = extractedMCODE.getStageValues();
  it('Test Stage 1B Filter', () => {
    expect(stage).toBe('1B');
  });
});
describe('checkStageFilterLogic-Stage1C', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tnmPathological: Coding[] = [] as Coding[];
  // Stage 1C Filter Attributes
  tnmPathological.push({ system: 'snomed', code: '261636000', display: 'N/A' } as Coding); // Any code in 'Stage-1C'
  extractedMCODE.TNMPathologicalStageGroup = tnmPathological;
  const stage: string = extractedMCODE.getStageValues();
  it('Test Stage 1C Filter', () => {
    expect(stage).toBe('1C');
  });
});
describe('checkStageFilterLogic-Stage2', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tnmPathological: Coding[] = [] as Coding[];
  // Stage 2 Filter Attributes
  tnmPathological.push({ system: 'AJCC', code: 'II', display: 'N/A' } as Coding); // Any code in 'Stage-2'
  extractedMCODE.TNMPathologicalStageGroup = tnmPathological;
  const stage: string = extractedMCODE.getStageValues();
  it('Test Stage 2 Filter', () => {
    expect(stage).toBe('2');
  });
});
describe('checkStageFilterLogic-Stage2A', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tnmPathological: Coding[] = [] as Coding[];
  // Stage 2A Filter Attributes
  tnmPathological.push({ system: 'snomed', code: '261614003', display: 'N/A' } as Coding); // Any code in 'Stage-2A'
  extractedMCODE.TNMPathologicalStageGroup = tnmPathological;
  const stage: string = extractedMCODE.getStageValues();
  it('Test Stage 2A Filter', () => {
    expect(stage).toBe('2A');
  });
});
describe('checkStageFilterLogic-Stage2B', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tnmPathological: Coding[] = [] as Coding[];
  // Stage 2B Filter Attributes
  tnmPathological.push({ system: 'snomed', code: '261615002', display: 'N/A' } as Coding); // Any code in 'Stage-2B'
  extractedMCODE.TNMPathologicalStageGroup = tnmPathological;
  const stage: string = extractedMCODE.getStageValues();
  it('Test Stage 2B Filter', () => {
    expect(stage).toBe('2B');
  });
});
describe('checkStageFilterLogic-Stage2C', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tnmPathological: Coding[] = [] as Coding[];
  // Stage 2C Filter Attributes
  tnmPathological.push({ system: 'snomed', code: '261637009', display: 'N/A' } as Coding); // Any code in 'Stage-2C'
  extractedMCODE.TNMPathologicalStageGroup = tnmPathological;
  const stage: string = extractedMCODE.getStageValues();
  it('Test Stage 2C Filter', () => {
    expect(stage).toBe('2C');
  });
});
describe('checkStageFilterLogic-Stage3', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tnmPathological: Coding[] = [] as Coding[];
  // Stage 3 Filter Attributes
  tnmPathological.push({ system: 'AJCC', code: '3', display: 'N/A' } as Coding); // Any code in 'Stage-3'
  extractedMCODE.TNMPathologicalStageGroup = tnmPathological;
  const stage: string = extractedMCODE.getStageValues();
  it('Test Stage 3 Filter', () => {
    expect(stage).toBe('3');
  });
});
describe('checkStageFilterLogic-Stage3A', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tnmPathological: Coding[] = [] as Coding[];
  // Stage 3A Filter Attributes
  tnmPathological.push({ system: 'AJCC', code: 'IIIA', display: 'N/A' } as Coding); // Any code in 'Stage-3A'
  extractedMCODE.TNMPathologicalStageGroup = tnmPathological;
  const stage: string = extractedMCODE.getStageValues();
  it('Test Stage 3A Filter', () => {
    expect(stage).toBe('3A');
  });
});
describe('checkStageFilterLogic-Stage3B', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tnmPathological: Coding[] = [] as Coding[];
  // Stage 3B Filter Attributes
  tnmPathological.push({ system: 'snomed', code: '261639007', display: 'N/A' } as Coding); // Any code in 'Stage-3B'
  extractedMCODE.TNMPathologicalStageGroup = tnmPathological;
  const stage: string = extractedMCODE.getStageValues();
  it('Test Stage 3B Filter', () => {
    expect(stage).toBe('3B');
  });
});
describe('checkStageFilterLogic-Stage3C', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tnmPathological: Coding[] = [] as Coding[];
  // Stage 3C Filter Attributes
  tnmPathological.push({ system: 'AJCC', code: '3c', display: 'N/A' } as Coding); // Any code in 'Stage-3C'
  extractedMCODE.TNMPathologicalStageGroup = tnmPathological;
  const stage: string = extractedMCODE.getStageValues();
  it('Test Stage 3C Filter', () => {
    expect(stage).toBe('3C');
  });
});
describe('checkStageFilterLogic-Stage4', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tnmPathological: Coding[] = [] as Coding[];
  // Stage 4 Filter Attributes
  tnmPathological.push({ system: 'SNOMED', code: '258228008', display: 'N/A' } as Coding); // Any code in 'Stage-4'
  extractedMCODE.TNMPathologicalStageGroup = tnmPathological;
  const stage: string = extractedMCODE.getStageValues();
  it('Test Stage 4 Filter', () => {
    expect(stage).toBe('4');
  });
});
describe('checkStageFilterLogic-Stage4A', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tnmPathological: Coding[] = [] as Coding[];
  // Stage 4A Filter Attributes
  tnmPathological.push({ system: 'ajcc', code: '4a', display: 'N/A' } as Coding); // Any code in 'Stage-4A'
  extractedMCODE.TNMPathologicalStageGroup = tnmPathological;
  const stage: string = extractedMCODE.getStageValues();
  it('Test Stage 4A Filter', () => {
    expect(stage).toBe('4A');
  });
});
describe('checkStageFilterLogic-Stage4B', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tnmPathological: Coding[] = [] as Coding[];
  // Stage 4B Filter Attributes
  tnmPathological.push({ system: 'snomed', code: '261643006', display: 'N/A' } as Coding); // Any code in 'Stage-4B'
  extractedMCODE.TNMPathologicalStageGroup = tnmPathological;
  const stage: string = extractedMCODE.getStageValues();
  it('Test Stage 4B Filter', () => {
    expect(stage).toBe('4B');
  });
});
describe('checkStageFilterLogic-Stage4C', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tnmPathological: Coding[] = [] as Coding[];
  // Stage 4C Filter Attributes
  tnmPathological.push({ system: 'ajcc', code: '4c', display: 'N/A' } as Coding); // Any code in 'Stage-4C'
  extractedMCODE.TNMPathologicalStageGroup = tnmPathological;
  const stage: string = extractedMCODE.getStageValues();
  it('Test Stage 4C Filter', () => {
    expect(stage).toBe('4C');
  });
});
describe('checkStageFilterLogic-Stage4C_With_Stage1_InOrder', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tnmPathological: Coding[] = [] as Coding[];
  // Stage 4C Filter Attributes
  tnmPathological.push({ system: 'AJCC', code: '1', display: 'N/A' } as Coding); // Any code in 'Stage-1'
  tnmPathological.push({ system: 'ajcc', code: '4c', display: 'N/A' } as Coding); // Any code in 'Stage-4C'
  extractedMCODE.TNMPathologicalStageGroup = tnmPathological;
  const stage: string = extractedMCODE.getStageValues();
  it('Test Stage 4C Filter With 1', () => {
    expect(stage).toBe('4C');
  });
});
describe('checkStageFilterLogic-Stage3C_With_Stage3B_NotOrdered', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tnmPathological: Coding[] = [] as Coding[];
  // Stage 4C Filter Attributes
  tnmPathological.push({ system: 'AJCC', code: '3c', display: 'N/A' } as Coding); // Any code in 'Stage-3C'
  tnmPathological.push({ system: 'snomed', code: '261639007', display: 'N/A' } as Coding); // Any code in 'Stage-3B'
  extractedMCODE.TNMPathologicalStageGroup = tnmPathological;
  const stage: string = extractedMCODE.getStageValues();
  it('Test Stage 3C Filter With 3B', () => {
    expect(stage).toBe('3C');
  });
});
describe('checkTumorMarkerFilterLogic-ER+', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tm = createEmptyTumorMarker();

  tm.coding.push({ system: 'http://loinc.info/sct', code: '16112-5', display: 'N/A' } as Coding); // Any code in 'Biomarker-ER'
  tm.interpretation.push({
    system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html',
    code: 'H',
    display: 'N/A'
  } as Coding);  extractedMCODE.tumorMarker.push(tm);
  const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
  it('Test ER+ Filter', () => {
    expect(tumorMarkerValues[0]).toBe('ER+');
  });
});
describe('checkTumorMarkerFilterLogic-ER+_2', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tm = createEmptyTumorMarker();

  tm.coding.push({ system: 'http://loinc.info/sct', code: '16112-5', display: 'N/A' } as Coding); // Any code in 'Biomarker-ER'
  tm.valueRatio.push({numerator: {value: 6, comparator: '>', unit: '%'}, denominator: {value: 3, comparator: '>', unit: '%'}, metric: '>'} as mcode.Ratio);
  extractedMCODE.tumorMarker.push(tm);
  const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
  it('Test ER+ Filter_2', () => {
    expect(tumorMarkerValues[0]).toBe('ER+');
  });
});
describe('checkTumorMarkerFilterLogic-ER-', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tm = createEmptyTumorMarker();

  tm.coding.push({ system: 'http://loinc.info/sct', code: '85310-1', display: 'N/A' } as Coding); // Any code in 'Biomarker-ER'
  tm.interpretation.push({
    system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html',
    code: 'NEG',
    display: 'N/A'
  } as Coding);
  extractedMCODE.tumorMarker.push(tm);
  const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
  it('Test ER- Filter', () => {
    expect(tumorMarkerValues[0]).toBe('ER-');
  });
});
describe('checkTumorMarkerFilterLogic-ER-_2', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tm = createEmptyTumorMarker();

  tm.coding.push({ system: 'http://loinc.info/sct', code: '85310-1', display: 'N/A' } as Coding); // Any code in 'Biomarker-ER'
  tm.valueRatio.push({numerator: {value: 1, comparator: '<', unit: '%'}, denominator: {value: 101, comparator: '<', unit: '%'}, metric: '<'} as mcode.Ratio);
  extractedMCODE.tumorMarker.push(tm);
  const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
  it('Test ER- Filter_2', () => {
    expect(tumorMarkerValues[0]).toBe('ER-');
  });
});
describe('checkTumorMarkerFilterLogic-PR+', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tm = createEmptyTumorMarker();

  tm.coding.push({ system: 'http://loinc.info/sct', code: '10861-3', display: 'N/A' } as Coding); // Any code in 'Biomarker-PR'
  tm.interpretation.push({
    system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html',
    code: 'H',
    display: 'N/A'
  } as Coding);  extractedMCODE.tumorMarker.push(tm);
  const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
  it('Test PR+ Filter', () => {
    expect(tumorMarkerValues[0]).toBe('PR+');
  });
});
describe('checkTumorMarkerFilterLogic-PR+_2', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tm = createEmptyTumorMarker();

  tm.coding.push({ system: 'http://loinc.info/sct', code: '10861-3', display: 'N/A' } as Coding); // Any code in 'Biomarker-PR'
  tm.valueRatio.push({numerator: {value: 6, comparator: '>', unit: '%'}, denominator: {value: 3, comparator: '>', unit: '%'}, metric: '>'} as mcode.Ratio);
  extractedMCODE.tumorMarker.push(tm);
  const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
  it('Test PR+ Filter_2', () => {
    expect(tumorMarkerValues[0]).toBe('PR+');
  });
});
describe('checkTumorMarkerFilterLogic-PR-', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tm = createEmptyTumorMarker();

  tm.coding.push({ system: 'http://loinc.info/sct', code: '10861-3', display: 'N/A' } as Coding); // Any code in 'Biomarker-PR'
  tm.valueCodeableConcept.push({
    system: 'snomed',
    code: '260385009',
    display: 'N/A'
  } as Coding);  extractedMCODE.tumorMarker.push(tm);
  const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
  it('Test PR- Filter', () => {
    expect(tumorMarkerValues[0]).toBe('PR-');
  });
});
describe('checkTumorMarkerFilterLogic-PR-_2', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
const tm = createEmptyTumorMarker();

  tm.coding.push({ system: 'http://loinc.info/sct', code: '10861-3', display: 'N/A' } as Coding); // Any code in 'Biomarker-PR'
  tm.valueRatio.push({numerator: {value: 1, comparator: '<', unit: '%'}, denominator: {value: 101, comparator: '<', unit: '%'}, metric: '<'} as mcode.Ratio);
  extractedMCODE.tumorMarker.push(tm);
  const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
  it('Test PR- Filter_2', () => {
    expect(tumorMarkerValues[0]).toBe('PR-');
  });
});
describe('checkTumorMarkerFilterLogic-BRCA1+', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '1100', display: 'BRCA1' });
  cgvGeneStudied.interpretation.coding.push({ system: 'N/A', code: 'CAR', display: 'CAR' });
  cgvGenomicSourceClass.valueCodeableConcept.coding.push({
    system: ' http://loinc.info/sct',
    code: 'LA6683-2',
    display: 'N/A'
  });

  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  it('Test BRCA+ Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('BRCA1+');
  });
});
describe('checkTumorMarkerFilterLogic-BRCA1+_2', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '1100', display: 'BRCA1' });
  cgvGeneStudied.interpretation.coding.push({ system: 'N/A', code: 'A', display: 'A' });
  cgvGenomicSourceClass.valueCodeableConcept.coding.push({
    system: ' http://loinc.info/sct',
    code: 'LA6683-2',
    display: 'N/A'
  });

  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  it('Test BRCA+ Filter+2', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('BRCA1+');
  });
});
describe('checkTumorMarkerFilterLogic-BRCA1+_3', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '1100', display: 'BRCA1' });
  cgvGeneStudied.interpretation.coding.push({ system: 'N/A', code: 'POS', display: 'POS' });
  cgvGenomicSourceClass.valueCodeableConcept.coding.push({
    system: ' http://loinc.info/sct',
    code: 'LA6683-2',
    display: 'N/A'
  });

  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  it('Test BRCA+ Filter_3', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('BRCA1+');
  });
});
describe('checkTumorMarkerFilterLogic-BRCA1-', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '1100', display: 'BRCA1' });
  cgv.valueCodeableConcept.push({ system: 'http://snomed.info/sct', code: '260385009', display: 'N/A' });

  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  it('Test BRCA- Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('BRCA1-');
  });
});
describe('checkTumorMarkerFilterLogic-BRCA2+', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '1101', display: 'BRCA2' });
  cgv.valueCodeableConcept.push({ system: 'http://snomed.info/sct', code: '10828004', display: 'N/A' });
  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  it('Test BRCA2+ Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('BRCA2+');
  });
});
describe('checkTumorMarkerFilterLogic-BRCA2-', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '1101', display: 'BRCA2' });
  cgv.valueCodeableConcept.push({ system: 'http://snomed.info/sct', code: '260385009', display: 'N/A' });
  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  it('Test BRCA2- Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('BRCA2-');
  });
});
describe('checkTumorMarkerFilterLogic-ATM-', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '795', display: 'ATM' });
  cgv.valueCodeableConcept.push({ system: 'http://snomed.info/sct', code: '260385009', display: 'N/A' });
  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  it('Test ATM- Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('ATM-');
  });
});
describe('checkTumorMarkerFilterLogic-ATM+', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '795', display: 'ATM' });
  cgv.valueCodeableConcept.push({ system: 'loinc', code: 'LA9633-4', display: 'Present' });
  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()

  it('Test ATM+ Filter', () => {
    expect(tumorMarkerValues[0]).toBe('ATM+');
  });
});
describe('checkTumorMarkerFilterLogic-CDH1+', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);

  const tumorMarker = createEmptyTumorMarker();

  tumorMarker.coding.push({ system: 'loinc', code: '21652-3', display: 'n/a' });
  tumorMarker.valueCodeableConcept.push({ system: 'SNOMED', code: '10828004', display: 'Present' });
  extractedMCODE.tumorMarker.push(tumorMarker);

  const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()

  it('Test CDH1+ Filter', () => {
    expect(tumorMarkerValues[0]).toBe('CDH1+');
  });
});
describe('checkTumorMarkerFilterLogic-CDH1-', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '1748', display: 'CDH1' });
  cgv.interpretation.push({ system: 'n/a', code: 'NEG', display: 'NEG' });
  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()

  it('Test CDH1- Filter', () => {
    expect(tumorMarkerValues[0]).toBe('CDH1-');
  });
});
describe('checkTumorMarkerFilterLogic-CHEK2+', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tumorMarker = createEmptyTumorMarker();

  tumorMarker.coding.push({ system: 'loinc', code: '72518-4', display: 'n/a' });
  tumorMarker.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'POS', display: 'POS'});

  extractedMCODE.tumorMarker.push(tumorMarker);

  it('Test CHEK2+ Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('CHEK2+');
  });
});
describe('checkTumorMarkerFilterLogic-CHEK2-', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '16627', display: 'CHEK2' });
  cgv.valueCodeableConcept.push({ system: 'snomed', code: '260385009', display: 'n/a' });
  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  it('Test CHEK2- Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('CHEK2-');
  });
});
describe('checkTumorMarkerFilterLogic-NBN+', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tumorMarker = createEmptyTumorMarker();

  tumorMarker.coding.push({ system: 'loinc', code: '82515-8', display: 'n/a' });
  tumorMarker.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'ND', display: 'ND'});

  extractedMCODE.tumorMarker.push(tumorMarker);

  it('Test NBN+ Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('NBN+');
  });
});
describe('checkTumorMarkerFilterLogic-NBN-', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tumorMarker = createEmptyTumorMarker();

  tumorMarker.coding.push({ system: 'loinc', code: '82515-8', display: 'n/a' });
  tumorMarker.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'DET', display: 'DET'});

  extractedMCODE.tumorMarker.push(tumorMarker);

  it('Test NBN- Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('NBN-');
  });
});
describe('checkTumorMarkerFilterLogic-NF1+', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tumorMarker = createEmptyTumorMarker();

  tumorMarker.coding.push({ system: 'loinc', code: '21717-4', display: 'n/a' });
  tumorMarker.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'L', display: 'n/a'});

  extractedMCODE.tumorMarker.push(tumorMarker);

  it('Test NF1+ Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('NF1+');
  });
});
describe('checkTumorMarkerFilterLogic-NF1-', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tumorMarker = createEmptyTumorMarker();

  tumorMarker.coding.push({ system: 'loinc', code: '21718-2', display: 'n/a' });
  tumorMarker.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'H', display: 'n/a'});

  extractedMCODE.tumorMarker.push(tumorMarker);

  it('Test NF1- Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('NF1-');
  });
});
describe('checkTumorMarkerFilterLogic-PALB2+', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '26144', display: 'PALB2' });
  cgv.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'CAR', display: 'CAR' });
  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  it('Test PALB2+ Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('PALB2+');
  });
});
describe('checkTumorMarkerFilterLogic-PALB2-', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '26144', display: 'PALB2' });
  cgv.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'N', display: 'N' });
  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  it('Test PALB2- Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('PALB2-');
  });
});
describe('checkTumorMarkerFilterLogic-PTEN+', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '9588', display: 'PTEN' });
  cgv.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'A', display: 'A' });
  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  it('Test PTEN+ Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('PTEN+');
  });
});
describe('checkTumorMarkerFilterLogic-PTEN-', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '9588', display: 'PTEN' });
  cgv.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'NEG', display: 'NEG' });
  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  it('Test PTEN- Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('PTEN-');
  });
});
describe('checkTumorMarkerFilterLogic-STK11+', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '11389', display: 'STK11' });
  cgv.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'POS', display: 'POS' });
  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  it('Test STK11+ Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('STK11+');
  });
});
describe('checkTumorMarkerFilterLogic-STK11-', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '11389', display: 'STK11' });
  cgv.valueCodeableConcept.push({ system: 'loinc', code: 'LA9634-2', display: 'Absent' });
  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  it('Test STK11- Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('STK11-');
  });
});
describe('checkTumorMarkerFilterLogic-P53+', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '11998', display: 'P53' });
  cgv.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'POS', display: 'POS' });
  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  it('Test P53+ Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('P53+');
  });
});
describe('checkTumorMarkerFilterLogic-P53-', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '11998', display: 'P53' });
  cgv.valueCodeableConcept.push({ system: 'loinc', code: 'LA9634-2', display: 'Absent' });
  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  it('Test P53- Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('P53-');
  });
});
describe('checkTumorMarkerFilterLogic-RB+', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tm = createEmptyTumorMarker();

  tm.coding.push({ system: 'http://loinc.info/sct', code: '42795-5', display: 'N/A' } as Coding); // Any code in 'Biomarker-RB'
  tm.valueQuantity.push({ value: '51', comparator: '>', unit: '%', code: '%' } as mcode.Quantity);
  extractedMCODE.tumorMarker.push(tm);

  it('Test RB+ Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('RB+');
  });
});
describe('checkTumorMarkerFilterLogic-RB+_2', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tm = createEmptyTumorMarker();

  tm.coding.push({ system: 'http://loinc.info/sct', code: '42795-5', display: 'N/A' } as Coding); // Any code in 'Biomarker-RB'
  tm.valueRatio.push({numerator: {value: 6, comparator: '>', unit: '%'}, denominator: {value: 3, comparator: '>', unit: '%'}, metric: '>'} as mcode.Ratio);
  extractedMCODE.tumorMarker.push(tm);

  it('Test RB+ Filter_2', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('RB+');
  });
});
describe('checkTumorMarkerFilterLogic-RB-', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
const tm = createEmptyTumorMarker();

  tm.coding.push({ system: 'http://loinc.info/sct', code: '42795-5', display: 'N/A' } as Coding); // Any code in 'Biomarker-RB'
  tm.valueQuantity.push({ value: '49', comparator: '<=', unit: '%', code: '%' } as mcode.Quantity);
  extractedMCODE.tumorMarker.push(tm);

  it('Test RB- Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('RB-');
  });
});
describe('checkTumorMarkerFilterLogic-RB-_2', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tm = createEmptyTumorMarker();

  tm.coding.push({ system: 'http://loinc.info/sct', code: '42795-5', display: 'N/A' } as Coding); // Any code in 'Biomarker-RB'
  tm.valueRatio.push({numerator: {value: 1, comparator: '<', unit: '%'}, denominator: {value: 101, comparator: '<', unit: '%'}, metric: '<'} as mcode.Ratio);
  extractedMCODE.tumorMarker.push(tm);

  it('Test RB- Filter_2', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('RB-');
  });
});
describe('checkTumorMarkerFilterLogic-HER2+', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tm = createEmptyTumorMarker();

  tm.coding.push({ system: 'http://loinc.info/sct', code: '32996-1', display: 'N/A' } as Coding); // Any code in 'Biomarker-HER2'
  tm.valueQuantity.push({ value: '3+', comparator: '=' } as mcode.Quantity);
  extractedMCODE.tumorMarker.push(tm);

  it('Test HER2+ Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('HER2+');
  });
});
describe('checkTumorMarkerFilterLogic-HER2-', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
const tm = createEmptyTumorMarker();

  tm.coding.push({ system: 'http://loinc.info/sct', code: '32996-1', display: 'N/A' } as Coding); // Any code in 'Biomarker-HER2'
  tm.valueQuantity.push({ value: '2+', comparator: '=' } as mcode.Quantity);
  extractedMCODE.tumorMarker.push(tm);

  it('Test HER2- Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('HER2-');
  });
});
describe('checkTumorMarkerFilterLogic-FGFR+', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tm = createEmptyTumorMarker();

  tm.coding.push({ system: 'http://loinc.info/sct', code: '42785-6', display: 'N/A' } as Coding); // Any code in 'Biomarker-FGFR'
  tm.valueQuantity.push({ value: '1', comparator: '>=', unit: '%', code: '%' } as mcode.Quantity);
  extractedMCODE.tumorMarker.push(tm);

  it('Test FGFR+ Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('FGFR+');
  });
});

describe('checkTumorMarkerFilterLogic-FGFR+_2', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tm = createEmptyTumorMarker();

  tm.coding.push({ system: 'http://loinc.info/sct', code: '42785-6', display: 'N/A' } as Coding); // Any code in 'Biomarker-FGFR'
  tm.valueRatio.push({numerator: {value: 6, comparator: '>', unit: '%'}, denominator: {value: 3, comparator: '>', unit: '%'}, metric: '>'} as mcode.Ratio);
  extractedMCODE.tumorMarker.push(tm);

  it('Test FGFR+ Filter_2', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('FGFR+');
  });
});
describe('checkTumorMarkerFilterLogic-FGFR-', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tm = createEmptyTumorMarker();

  tm.coding.push({ system: 'http://loinc.info/sct', code: '42785-6', display: 'N/A' } as Coding); // Any code in 'Biomarker-FGFR'
  tm.valueQuantity.push({ value: '0.5', comparator: '<', unit: '%', code: '%' } as mcode.Quantity);
  extractedMCODE.tumorMarker.push(tm);

  it('Test FGFR- Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('FGFR-');
  });
});
describe('checkTumorMarkerFilterLogic-FGFR-_2', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tm = createEmptyTumorMarker();

  tm.coding.push({ system: 'http://loinc.info/sct', code: '42785-6', display: 'N/A' } as Coding); // Any code in 'Biomarker-FGFR'
  tm.valueRatio.push({numerator: {value: 1, comparator: '<', unit: '%'}, denominator: {value: 101, comparator: '<', unit: '%'}, metric: '<'} as mcode.Ratio);
  extractedMCODE.tumorMarker.push(tm);

  it('Test FGFR- Filter_2', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('FGFR-');
  });
});
describe('checkTumorMarkerFilterLogic-ESR1+', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();



  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '3467', display: 'ESR1' });
  cgv.valueCodeableConcept.push({ system: 'loinc', code: 'LA9633-4', display: 'Present' });
  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  it('Test ESR1+ Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('ESR1+');
  });
});
describe('checkTumorMarkerFilterLogic-ESR1-', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();



  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '3467', display: 'ESR1' });
  cgv.valueCodeableConcept.push({ system: 'loinc', code: 'LA9634-2', display: 'Absent' });
  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  it('Test ESR1- Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('ESR1-');
  });
});
describe('checkTumorMarkerFilterLogic-PIK3CA+', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '8975', display: 'PIK3CA' });
  cgv.valueCodeableConcept.push({ system: 'snomed', code: '10828004', display: 'n/a' });
  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  it('Test PIK3CA+ Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('PIK3CA+');
  });
});
describe('checkTumorMarkerFilterLogic-PIK3CA-', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '8975', display: 'PIK3CA' });
  cgv.valueCodeableConcept.push({ system: 'snomed', code: '260385009', display: 'n/a' });
  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  it('Test PIK3CA- Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('PIK3CA-');
  });
});
describe('checkTumorMarkerFilterLogic-PDL1+', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tm = createEmptyTumorMarker();

  tm.coding.push({ system: 'http://loinc.info/sct', code: '96268-8', display: 'N/A' } as Coding);
  tm.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'POS', display: 'POS' } as Coding);
  extractedMCODE.tumorMarker.push(tm);

  it('Test PDL1+ Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('PDL1+');
  });
});
describe('checkTumorMarkerFilterLogic-PDL1-', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tm = createEmptyTumorMarker();

  tm.coding.push({ system: 'http://loinc.info/sct', code: '83052-1', display: 'N/A' } as Coding);
  tm.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'ND', display: 'ND' } as Coding);
  extractedMCODE.tumorMarker.push(tm);

  it('Test PDL1- Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('PDL1-');
  });
});
describe('checkTumorMarkerFilterLogic-NTRK_FUSION+', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '8031', display: 'NTRK_FUSION' });
  cgv.valueCodeableConcept.push({ system: 'snomed', code: '10828004', display: 'n/a' });
  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  it('Test NTRK_FUSION+ Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('NTRK_FUSION+');
  });
});
describe('checkTumorMarkerFilterLogic-NTRK_FUSION-', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '8031', display: 'NTRK_FUSION' });
  cgv.valueCodeableConcept.push({ system: 'snomed', code: '260385009', display: 'n/a' });
  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  it('Test NTRK_FUSION- Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues[0]).toBe('NTRK_FUSION-');
  });
})
describe('checkTumorMarkerFilterLogic-No_Match', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const cgv = createEmptyCancerGeneticVariant();
  const cgvComponent = createEmptyCancerGeneticVariantComponent();
  const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
  const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

  cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: 'XXX', display: 'XXX' });
  cgv.valueCodeableConcept.push({ system: 'snomed', code: 'XXX', display: 'n/a' });
  cgvComponent.geneStudied.push(cgvGeneStudied);
  cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
  cgv.component = cgvComponent;
  extractedMCODE.cancerGeneticVariant.push(cgv);

  it('Test No_Match- Filter', () => {
    const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarkerValues.length).toBe(0);
  });
})
describe('checkAgeFilterLogic', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const today: Date = new Date();

  it('Test Age is over 18 Filter', () => {
    const birthdate = '1950-06-11';
    const checkDate: Date = new Date(birthdate);
    const millisecondsAge = today.getTime() - checkDate.getTime();
    const milliseconds1Years = 1000 * 60 * 60 * 24 * 365;
    extractedMCODE.birthDate = birthdate;
    expect(extractedMCODE.getAgeValue()).toBe(Math.floor(millisecondsAge/milliseconds1Years));
  });

  it('Test Age is under 18 Filter', () => {
    const birthdate = '2021-10-10';
    const checkDate: Date = new Date(birthdate);
    const millisecondsAge = today.getTime() - checkDate.getTime();
    const milliseconds1Years = 1000 * 60 * 60 * 24 * 365;
    extractedMCODE.birthDate = birthdate;
    expect(extractedMCODE.getAgeValue()).toBe(Math.floor(millisecondsAge/milliseconds1Years));
  });
});
describe('checkHistologyMorphologyFilterLogic-ibc', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const pcc: PrimaryCancerCondition = {clinicalStatus: [] as Coding[], coding: [] as Coding[], histologyMorphologyBehavior: [] as Coding[]};

  // Invasive Breast Cancer Filter Attributes
  pcc.coding.push({ system: 'http://snomed.info/sct', code: '783541009', display: 'N/A' } as Coding); // Any Code in 'Cancer-Breast'
  pcc.histologyMorphologyBehavior.push({
    system: 'http://snomed.info/sct',
    code: '446688004',
    display: 'N/A'
  } as Coding); // Any code in 'Morphology-Invasive'

  extractedMCODE.primaryCancerCondition.push(pcc);

  it('Test Invasive Breast Cancer Filter', () => {
    expect(extractedMCODE.getHistologyMorphologyValue()).toBe('ibc');
  });
});
describe('checkHistologyMorphologyFilterLogic-idc', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const pcc: PrimaryCancerCondition = {clinicalStatus: [] as Coding[], coding: [] as Coding[], histologyMorphologyBehavior: [] as Coding[]};

  // Invasive Ductal Carcinoma Filter Attributes
  pcc.coding.push({ system: 'http://snomed.info/sct', code: '783541009', display: 'N/A' } as Coding); // Any Code in 'Cancer-Breast'
  pcc.histologyMorphologyBehavior.push({
    system: 'http://snomed.info/sct',
    code: '444134008',
    display: 'N/A'
  } as Coding); // Any code in 'Morphology-Invas_Duct_Carc'

  extractedMCODE.primaryCancerCondition.push(pcc);

  it('Test Invasive Invasive Ductal Carcinoma Filter', () => {
    expect(extractedMCODE.getHistologyMorphologyValue()).toBe('idc');
  });
});
describe('checkHistologyMorphologyFilterLogic-ilc', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const pcc: PrimaryCancerCondition = {clinicalStatus: [] as Coding[], coding: [] as Coding[], histologyMorphologyBehavior: [] as Coding[]};

  // Invasive Lobular Carcinoma Filter Attributes
  pcc.coding.push({ system: 'http://snomed.info/sct', code: '1080261000119100', display: 'N/A' } as Coding); // Any Code in 'Cancer-Invas Lob Carc'

  extractedMCODE.primaryCancerCondition.push(pcc);

  it('Test Invasive Lobular Carcinoma Filter', () => {
    expect(extractedMCODE.getHistologyMorphologyValue()).toBe('ilc');
  });
});
describe('checkHistologyMorphologyFilterLogic-dcis', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const pcc: PrimaryCancerCondition = {clinicalStatus: [] as Coding[], coding: [] as Coding[], histologyMorphologyBehavior: [] as Coding[]};

  // Ductal Carcinoma In Situ Filter Attributes
  pcc.coding.push({ system: 'http://snomed.info/sct', code: '783541009', display: 'N/A' } as Coding); // Any Code in 'Cancer-Breast'
  pcc.histologyMorphologyBehavior.push({
    system: 'http://snomed.info/sct',
    code: '18680006',
    display: 'N/A'
  } as Coding); // Any code in 'Morphology-Duct_Car_In_Situ'

  extractedMCODE.primaryCancerCondition.push(pcc);

  it('Test Ductal Carcinoma In Situ Filter', () => {
    expect(extractedMCODE.getHistologyMorphologyValue()).toBe('dcis');
  });
});
describe('checkHistologyMorphologyFilterLogic-lcis_1', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const pcc: PrimaryCancerCondition = {clinicalStatus: [] as Coding[], coding: [] as Coding[], histologyMorphologyBehavior: [] as Coding[]};
  pcc.coding = [] as Coding[];
  pcc.histologyMorphologyBehavior = [] as Coding[];

  // Lobular Carcinoma In Situ Filter Attributes
  pcc.coding.push({ system: 'http://snomed.info/sct', code: '109888004', display: 'N/A' } as Coding); // Any Code in 'lcis-condition'

  extractedMCODE.primaryCancerCondition.push(pcc);

  it('Test Lobular Carcinoma In Situ Filter_1', () => {
    expect(extractedMCODE.getHistologyMorphologyValue()).toBe('lcis');
  });
});
describe('checkHistologyMorphologyFilterLogic-lcis_2', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const pcc: PrimaryCancerCondition = {clinicalStatus: [] as Coding[], coding: [] as Coding[], histologyMorphologyBehavior: [] as Coding[]};

  // Lobular Carcinoma In Situ Filter Attributes
  pcc.histologyMorphologyBehavior.push({
    system: 'http://snomed.info/sct',
    code: '77284006',
    display: 'N/A'
  } as Coding); // Any Code in 'lcis-histology'

  extractedMCODE.primaryCancerCondition.push(pcc);

  it('Test Lobular Carcinoma In Situ Filter_2', () => {
    expect(extractedMCODE.getHistologyMorphologyValue()).toBe('lcis');
  });
});
describe('checkSecondaryCancerConditionLogic', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
    const scc: mcode.SecondaryCancerCondition = {clinicalStatus: [] as Coding[], coding: [] as Coding[]};

  scc.coding.push({ system: 'http://snomed.info/sct', code: '94222008' } as Coding);
  scc.coding.push({ system: 'http://snomed.info/sct', code: '00000000', display: 'Secondary malignant neoplasm of liver (disorder)' } as Coding);
  scc.coding.push({ display: 'Secondary malignant neoplasm of chest wall (disorder)' } as Coding);
  scc.coding.push({ display: 'Cannot be read' } as Coding);

  extractedMCODE.secondaryCancerCondition.push(scc);

  it('is populated', () => {
    expect(extractedMCODE.getSecondaryCancerValue()).not.toBeNull();
    expect(extractedMCODE.getSecondaryCancerValue()).toHaveSize(3);
  });
  it('uses snomed codes', () => {
    expect(extractedMCODE.getSecondaryCancerValue()).toContain("bone");
  });
  it('uses display text if code is not present', () => {
    expect(extractedMCODE.getSecondaryCancerValue()).toContain("liver");
  });
  it('uses display text if system and code is not present', () => {
    expect(extractedMCODE.getSecondaryCancerValue()).toContain("chest wall");
  });
  it('is null if no Secondary Cancer Conditions', () => {
    const emptyExtractedMCODE = new mcode.ExtractedMCODE(null);
    expect(emptyExtractedMCODE.getSecondaryCancerValue()).toBeNull();
  });
  it('is null if no matches', () => {
    const emptyExtractedMCODE = new mcode.ExtractedMCODE(null);
    const scc: mcode.SecondaryCancerCondition = {clinicalStatus: [] as Coding[], coding: [] as Coding[]};

    scc.coding.push({} as Coding);
    emptyExtractedMCODE.secondaryCancerCondition.push(scc);

    expect(emptyExtractedMCODE.getSecondaryCancerValue()).toBeNull();
  });
  it('is null if no coding', () => {
    const emptyExtractedMCODE = new mcode.ExtractedMCODE(null);
    const scc: mcode.SecondaryCancerCondition = {};

    emptyExtractedMCODE.secondaryCancerCondition.push(scc);

    expect(emptyExtractedMCODE.getSecondaryCancerValue()).toBeNull();
  });
});
describe('checkECOGFilterLogic', () => {
  //Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  extractedMCODE.ecogPerformaceStatus = 3;
  // ECOG Test
  it('Test ECOG Filter', () => {
    expect(extractedMCODE.getECOGScore()).toBe(3);
  });
});
describe('checkKarnofskyFilterLogic', () => {
  //Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  extractedMCODE.karnofskyPerformanceStatus = 90;
  // Karnofsky Test
  it('Test Karnofsky Filter', () => {
    expect(extractedMCODE.getKarnofskyScore()).toBe(90);
  });
});

/** Procedure Tests */

describe('checkRadiationProcedureFilterLogic-WBRT', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const crrp: mcode.CancerRelatedRadiationProcedure = {bodySite: [] as Coding[], coding: [] as Coding[]};

  // WBRT Filter Attributes
  crrp.coding.push({ system: 'http://snomed.info/sct', code: '108290001', display: 'N/A' } as Coding);
  crrp.bodySite.push({ system: 'http://snomed.info/sct', code: '12738006', display: 'N/A' } as Coding);

  extractedMCODE.cancerRelatedRadiationProcedure.push(crrp);

  it('Test WBRT Filter', () => {
    expect(extractedMCODE.getRadiationProcedureValue().includes('wbrt')).toBeTrue();
  });
});
describe('checkRadiationProcedureFilterLogic-EBRT', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const crrp: mcode.CancerRelatedRadiationProcedure = {bodySite: [] as Coding[], coding: [] as Coding[]};

  // EBRT Filter Attributes
  crrp.coding.push({ system: 'http://snomed.info/sct', code: '33356009', display: 'N/A' } as Coding);

  extractedMCODE.cancerRelatedRadiationProcedure.push(crrp);

  it('Test EBRT Filter', () => {
    expect(extractedMCODE.getRadiationProcedureValue().includes('ebrt')).toBeTrue();
  });
});
describe('checkRadiationProcedureFilterLogic-Ablation', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const crrp: mcode.CancerRelatedRadiationProcedure = {bodySite: [] as Coding[], coding: [] as Coding[]};

  // Ablation Filter Attributes
  crrp.coding.push({ system: 'http://snomed.info/sct', code: '228692005', display: 'N/A' } as Coding);

  extractedMCODE.cancerRelatedRadiationProcedure.push(crrp);

  it('Test Ablation Filter', () => {
    expect(extractedMCODE.getRadiationProcedureValue().includes('ablation')).toBeTrue();
  });
});
describe('checkRadiationProcedureFilterLogic-rfa', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const crrp: mcode.CancerRelatedRadiationProcedure = {bodySite: [] as Coding[], coding: [] as Coding[]};

  // rfa Filter Attributes
  crrp.coding.push({ system: 'http://snomed.info/sct', code: '879916008', display: 'N/A' } as Coding);

  extractedMCODE.cancerRelatedRadiationProcedure.push(crrp);

  it('Test rfa Filter', () => {
    expect(extractedMCODE.getRadiationProcedureValue().includes('rfa')).toBeTrue();
  });
});
describe('checkSurgicalProcedureFilterLogic-Lumpectomy', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const crsp: mcode.CancerRelatedSurgicalProcedure = {coding: [] as Coding[]};

  // Lumpectomy Filter Attributes
  crsp.coding.push({ system: 'http://snomed.info/sct', code: '392022002', display: 'N/A' } as Coding);

  extractedMCODE.cancerRelatedSurgicalProcedure.push(crsp);

  it('Test Lumpectomy Filter', () => {
    expect(extractedMCODE.getSurgicalProcedureValue().some(sp => sp == 'lumpectomy')).toBeTrue();
  });
});

describe('checkSurgicalProcedureFilterLogic-Mastectomy', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const crsp: mcode.CancerRelatedSurgicalProcedure = {coding: [] as Coding[]};

  // Mastectomy Filter Attributes
  crsp.coding.push({ system: 'http://snomed.info/sct', code: '429400009', display: 'N/A' } as Coding);

  extractedMCODE.cancerRelatedSurgicalProcedure.push(crsp);

  it('Test Mastectomy Filter', () => {
    expect(extractedMCODE.getSurgicalProcedureValue().some(sp => sp == 'mastectomy')).toBeTrue();
  });
});

describe('checkSurgicalProcedureFilterLogic-Alnd_1', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const crsp: mcode.CancerRelatedSurgicalProcedure = {coding: [] as Coding[]};

  // Alnd Filter Attributes
  crsp.coding.push({ system: 'http://snomed.info/sct', code: '234262008', display: 'N/A' } as Coding);

  extractedMCODE.cancerRelatedSurgicalProcedure.push(crsp);

  it('Test Alnd Filter_1', () => {
    expect(extractedMCODE.getSurgicalProcedureValue().includes('alnd')).toBeTrue();
  });
});

describe('checkSurgicalProcedureFilterLogic-Alnd_2', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const crsp: mcode.CancerRelatedSurgicalProcedure = {coding: [] as Coding[], bodySite: [] as Coding[]};

  // Alnd Filter Attributes
  crsp.coding.push({ system: 'http://snomed.info/sct', code: '122459003', display: 'N/A' } as Coding);
  crsp.bodySite.push({ system: 'http://snomed.info/sct', code: '746224000', display: 'N/A' } as Coding);

  extractedMCODE.cancerRelatedSurgicalProcedure.push(crsp);

  it('Test Alnd Filter_2', () => {
    expect(extractedMCODE.getSurgicalProcedureValue().includes('alnd')).toBeTrue();
  });
});

describe('checkSurgicalProcedureFilterLogic-Reconstruction', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const crsp: mcode.CancerRelatedSurgicalProcedure = {coding: [] as Coding[]};

  // Reconstruction Filter Attributes
  crsp.coding.push({ system: 'http://snomed.info/sct', code: '302342002', display: 'N/A' } as Coding);

  extractedMCODE.cancerRelatedSurgicalProcedure.push(crsp);

  it('Test Reconstruction Filter', () => {
    expect(extractedMCODE.getSurgicalProcedureValue().some(sp => sp == 'reconstruction')).toBeTrue();
  });
});

describe('checkSurgicalProcedureFilterLogic-Metastasis Resection', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const crsp: mcode.CancerRelatedSurgicalProcedure = {coding: [] as Coding[]};
  crsp.reasonReference = [] as mcode.ReasonReference;

  // Metastasis Resection Filter Attributes (surgical procedure reason reference = SecondaryCancerCondition)
  crsp.reasonReference = ({ meta_profile: 'mcode-secondary-cancer-condition' } as mcode.ReasonReference);

  extractedMCODE.cancerRelatedSurgicalProcedure.push(crsp);

  it('Test Metastasis Resection Filter', () => {
    expect(extractedMCODE.getSurgicalProcedureValue().some(sp => sp == 'metastasis_resection')).toBeTrue();
  });
});

describe('checkNIHSystemNormalizer', () => {
  it('Test NIH System Normalizer.', () => {
    expect(CodeMapper.normalizeCodeSystem("nih")).toBe(CodeSystemEnum.NIH);
  });
});

describe('checkNIHSystemNormalizer', () => {
  it('Test NIH System Normalizer.', () => {
    expect(CodeMapper.normalizeCodeSystem("nih")).toBe(CodeSystemEnum.NIH);
  });
});

describe('checkInvalidCodeSystemError', () => {
  it('Test Invalid Input to System Normalizer.', () => {
    var testFunc = function() {
      CodeMapper.normalizeCodeSystem("XXX")
    };
    expect(testFunc).toThrow(Error('Profile codes do not support code system: XXX'));
  });
});

describe('checkInvalidOperatorError', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const tm = createEmptyTumorMarker();

  it('Test Invalid Operator Input to Ratio of Tumor Marker.', () => {
    tm.coding.push({ system: 'http://loinc.info/sct', code: '16112-5', display: 'N/A' } as Coding); // Any code in 'Biomarker-ER'
    tm.valueRatio.push({} as mcode.Ratio);
    extractedMCODE.tumorMarker.push(tm);
    const tumorMarker = extractedMCODE.getTumorMarkerValue()
    expect(tumorMarker).toEqual([]);
  });
});