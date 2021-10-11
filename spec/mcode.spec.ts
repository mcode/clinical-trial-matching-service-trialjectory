import { fhir } from "clinical-trial-matching-service";
import {
  Bundle,
  Resource,
} from "clinical-trial-matching-service/dist/fhir-types";
import { TrialjectoryMappingLogic } from "../src/trialjectorymappinglogic";


function createMedicationStatementBundle(...coding: fhir.Coding[]): Bundle {
  const bundle: Bundle = {
    resourceType: "Bundle",
    type: "transaction",
    entry: [
      {
        resource: {
          resourceType: "MedicationStatement",
          meta: {
            profile: [
              "http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-cancer-related-medication-statement",
            ],
          },
          medicationCodeableConcept: {
            coding: coding
          },
        } as unknown as Resource,
      },
    ],
  };
  return bundle;
}

describe("Test Medication Logic", () => {

  // Function to eliminate redundant test setup.
  let createMedicationsToTest = (...coding: fhir.Coding[]): string[] => {
    const bundle = createMedicationStatementBundle(...coding);
    const extractedMCODE = new TrialjectoryMappingLogic(bundle);
    return extractedMCODE.getMedicationStatementValues();
  }

  it("Test with no valid medications", () => {
    const coding: fhir.Coding[] = [
      {
        system: "RxNorm",
        code: "341545345",
        display: "N/A",
      },
      {
        system: "RxNorm",
        code: "563563",
        display: "N/A",
      },
      {
        system: "RxNorm",
        code: "35635463",
        display: "N/A",
      },
      {
        system: "RxNorm",
        code: "5365712",
        display: "N/A",
      },
      {
        system: "RxNorm",
        code: "2452456",
        display: "N/A",
      }
    ];
    const medications = createMedicationsToTest(...coding);
    expect(medications.length).toBe(0);
  });

  it("Test medication anastrozole", () => {
    const coding: fhir.Coding[] = [
      {
        system: "RxNorm",
        code: "1157702",
        display: "N/A",
      }
    ];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("anastrozole");
  });

  it("Test medication fluoxymesterone", () => {
    const coding: fhir.Coding[] = [
      {
        system: "RxNorm",
        code: "1175599",
        display: "N/A",
      }
    ];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("fluoxymesterone");
  });

  it("Test medication high_dose_estrogen", () => {
    const coding: fhir.Coding[] = [
      {
        system: "RxNorm",
        code: "4099",
        display: "N/A",
      }
    ];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("high_dose_estrogen");
  });

  it("Test medication palbociclib", () => {
    const coding: fhir.Coding[] = [
      {
        system: "RxNorm",
        code: "1601385",
        display: "N/A",
      }
    ];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("palbociclib");
  });

  it("Test medication ribociclib", () => {
    const coding: fhir.Coding[] = [
      {
        system: "RxNorm",
        code: "1873987",
        display: "N/A",
      }
    ];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("ribociclib");
  });

  it("Test medication abemaciclib", () => {
    const coding: fhir.Coding[] = [
      {
        system: "RxNorm",
        code: "1946825",
        display: "N/A",
      }
    ];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("abemaciclib");
  });

  it("Test medication alpelisib", () => {
    const coding: fhir.Coding[] = [
      {
        system: "RxNorm",
        code: "2169317",
        display: "N/A",
      }
    ];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("alpelisib");
  });

  it("Test 7 medications together", () => {
    const coding: fhir.Coding[] = [
      {
        system: "RxNorm",
        code: "372571",
        display: "N/A",
      },
      {
        system: "RxNorm",
        code: "672151",
        display: "N/A",
      },
      {
        system: "RxNorm",
        code: "2361286",
        display: "N/A",
      },
      {
        system: "RxNorm",
        code: "1172714",
        display: "N/A",
      },
      {
        system: "RxNorm",
        code: "1601385",
        display: "N/A",
      },
      {
        system: "RxNorm",
        code: "1946825",
        display: "N/A",
      },
      {
        system: "RxNorm",
        code: "2169317",
        display: "N/A",
      }
    ]
    const medications = createMedicationsToTest(...coding);
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

function createTnmPathologicalBundle(...coding: fhir.Coding[]): Bundle {
  const bundle: Bundle = {
    resourceType: "Bundle",
    type: "transaction",
    entry: [
      {
        resource: {
          resourceType: "Observation",
          meta: {
            profile: [
              "http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-tnm-pathological-stage-group",
            ],
          },
          valueCodeableConcept: {
            coding:
              coding
          },
        } as unknown as Resource,
      },
    ],
  };
  return bundle;
}

describe('Test Stage Logic', () => {

  // Function to eliminate redundant test setup.
  let createStageToTest = (...coding: fhir.Coding[]): string => {
    const bundle = createTnmPathologicalBundle(...coding);
    const extractedMCODE = new TrialjectoryMappingLogic(bundle);
    return extractedMCODE.getStageValues();
  }

  it('Test Stage 0 Filter', () => {
    const coding: fhir.Coding = { system: 'snomed', code: '261645004', display: 'N/A' } as fhir.Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe('0');
  });

  it('Test Stage 1 Filter', () => {
    const coding: fhir.Coding = {system: 'AJCC', code: '1', display: 'N/A' } as fhir.Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe('1');
  });

  it('Test Stage 1A Filter', () => {
    const coding: fhir.Coding = { system: 'snomed', code: '261634002', display: 'N/A' } as fhir.Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe('1A');
  });

  it('Test Stage 1B Filter', () => {
    const coding: fhir.Coding = { system: 'snomed', code: '261635001', display: 'N/A' } as fhir.Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe('1B');
  });

  it('Test Stage 1C Filter', () => {
    const coding: fhir.Coding = { system: 'snomed', code: '261636000', display: 'N/A' } as fhir.Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe('1C');
  });

  it('Test Stage 2 Filter', () => {
    const coding: fhir.Coding = { system: 'AJCC', code: 'II', display: 'N/A' } as fhir.Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe('2');
  });

  it('Test Stage 2A Filter', () => {
    const coding: fhir.Coding = { system: 'snomed', code: '261614003', display: 'N/A' } as fhir.Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe('2A');
  });

  it('Test Stage 2B Filter', () => {
    const coding: fhir.Coding = { system: 'snomed', code: '261615002', display: 'N/A' } as fhir.Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe('2B');
  });

  it('Test Stage 2C Filter', () => {
    const coding: fhir.Coding = { system: 'snomed', code: '261637009', display: 'N/A' } as fhir.Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe('2C');
  });

  it('Test Stage 3 Filter', () => {
    const coding: fhir.Coding = { system: 'AJCC', code: '3', display: 'N/A' } as fhir.Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe('3');
  });

  it('Test Stage 3A Filter', () => {
    const coding: fhir.Coding = { system: 'AJCC', code: 'IIIA', display: 'N/A' } as fhir.Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe('3A');
  });

  it('Test Stage 3B Filter', () => {
    const coding: fhir.Coding = { system: 'snomed', code: '261639007', display: 'N/A' } as fhir.Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe('3B');
  });

  it('Test Stage 3C Filter', () => {
    const coding: fhir.Coding = { system: 'AJCC', code: '3c', display: 'N/A' } as fhir.Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe('3C');
  });

  it('Test Stage 4 Filter', () => {
    const coding: fhir.Coding = { system: 'SNOMED', code: '258228008', display: 'N/A' } as fhir.Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe('4');
  });

  it('Test Stage 4A Filter', () => {
    const coding: fhir.Coding = { system: 'aJcC', code: '4a', display: 'N/A' } as fhir.Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe('4A');
  });

  it('Test Stage 4B Filter', () => {
    const coding: fhir.Coding = { system: 'snomed', code: '261643006', display: 'N/A' } as fhir.Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe('4B');
  });

  it('Test Stage 4C Filter', () => {
    const coding: fhir.Coding = { system: 'aJcC', code: '4c', display: 'N/A' } as fhir.Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe('4C');
  });

  it('Test Stage 4C Filter with Stage 1 Ordering', () => {
    const coding4c: fhir.Coding = { system: 'aJcC', code: '4c', display: 'N/A' } as fhir.Coding;
    const coding1: fhir.Coding = { system: 'aJcC', code: '1', display: 'N/A' } as fhir.Coding;
    const stage = createStageToTest(coding4c, coding1);
    expect(stage).toBe('4C');
  });

  it('Test Stage 3C Filter with Stage 3B Ordering', () => {
    const coding3b: fhir.Coding = { system: 'aJcC', code: '3c', display: 'N/A' } as fhir.Coding;
    const coding3c: fhir.Coding = { system: 'SnOmEd', code: '261639007', display: 'N/A' } as fhir.Coding;
    const stage = createStageToTest(coding3b, coding3c);
    expect(stage).toBe('3C');
  });
});


// describe('checkTumorMarkerFilterLogic-ER+', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const tm = createEmptyTumorMarker();

//   tm.coding.push({ system: 'http://loinc.info/sct', code: '16112-5', display: 'N/A' } as Coding); // Any code in 'Biomarker-ER'
//   tm.interpretation.push({
//     system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html',
//     code: 'H',
//     display: 'N/A'
//   } as Coding);  extractedMCODE.tumorMarker.push(tm);
//   const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//   it('Test ER+ Filter', () => {
//     expect(tumorMarkerValues[0]).toBe('ER+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-ER+_2', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const tm = createEmptyTumorMarker();

//   tm.coding.push({ system: 'http://loinc.info/sct', code: '16112-5', display: 'N/A' } as Coding); // Any code in 'Biomarker-ER'
//   tm.valueRatio.push({numerator: {value: 6, comparator: '>', unit: '%'}, denominator: {value: 3, comparator: '>', unit: '%'}, metric: '>'} as mcode.Ratio);
//   extractedMCODE.tumorMarker.push(tm);
//   const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//   it('Test ER+ Filter_2', () => {
//     expect(tumorMarkerValues[0]).toBe('ER+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-ER-', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const tm = createEmptyTumorMarker();

//   tm.coding.push({ system: 'http://loinc.info/sct', code: '85310-1', display: 'N/A' } as Coding); // Any code in 'Biomarker-ER'
//   tm.interpretation.push({
//     system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html',
//     code: 'NEG',
//     display: 'N/A'
//   } as Coding);
//   extractedMCODE.tumorMarker.push(tm);
//   const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//   it('Test ER- Filter', () => {
//     expect(tumorMarkerValues[0]).toBe('ER-');
//   });
// });
// describe('checkTumorMarkerFilterLogic-ER-_2', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const tm = createEmptyTumorMarker();

//   tm.coding.push({ system: 'http://loinc.info/sct', code: '85310-1', display: 'N/A' } as Coding); // Any code in 'Biomarker-ER'
//   tm.valueRatio.push({numerator: {value: 1, comparator: '<', unit: '%'}, denominator: {value: 101, comparator: '<', unit: '%'}, metric: '<'} as mcode.Ratio);
//   extractedMCODE.tumorMarker.push(tm);
//   const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//   it('Test ER- Filter_2', () => {
//     expect(tumorMarkerValues[0]).toBe('ER-');
//   });
// });
// describe('checkTumorMarkerFilterLogic-PR+', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const tm = createEmptyTumorMarker();

//   tm.coding.push({ system: 'http://loinc.info/sct', code: '10861-3', display: 'N/A' } as Coding); // Any code in 'Biomarker-PR'
//   tm.interpretation.push({
//     system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html',
//     code: 'H',
//     display: 'N/A'
//   } as Coding);  extractedMCODE.tumorMarker.push(tm);
//   const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//   it('Test PR+ Filter', () => {
//     expect(tumorMarkerValues[0]).toBe('PR+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-PR+_2', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const tm = createEmptyTumorMarker();

//   tm.coding.push({ system: 'http://loinc.info/sct', code: '10861-3', display: 'N/A' } as Coding); // Any code in 'Biomarker-PR'
//   tm.valueRatio.push({numerator: {value: 6, comparator: '>', unit: '%'}, denominator: {value: 3, comparator: '>', unit: '%'}, metric: '>'} as mcode.Ratio);
//   extractedMCODE.tumorMarker.push(tm);
//   const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//   it('Test PR+ Filter_2', () => {
//     expect(tumorMarkerValues[0]).toBe('PR+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-PR-', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const tm = createEmptyTumorMarker();

//   tm.coding.push({ system: 'http://loinc.info/sct', code: '10861-3', display: 'N/A' } as Coding); // Any code in 'Biomarker-PR'
//   tm.valueCodeableConcept.push({
//     system: 'snomed',
//     code: '260385009',
//     display: 'N/A'
//   } as Coding);  extractedMCODE.tumorMarker.push(tm);
//   const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//   it('Test PR- Filter', () => {
//     expect(tumorMarkerValues[0]).toBe('PR-');
//   });
// });
// describe('checkTumorMarkerFilterLogic-PR-_2', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
// const tm = createEmptyTumorMarker();

//   tm.coding.push({ system: 'http://loinc.info/sct', code: '10861-3', display: 'N/A' } as Coding); // Any code in 'Biomarker-PR'
//   tm.valueRatio.push({numerator: {value: 1, comparator: '<', unit: '%'}, denominator: {value: 101, comparator: '<', unit: '%'}, metric: '<'} as mcode.Ratio);
//   extractedMCODE.tumorMarker.push(tm);
//   const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//   it('Test PR- Filter_2', () => {
//     expect(tumorMarkerValues[0]).toBe('PR-');
//   });
// });
// describe('checkTumorMarkerFilterLogic-BRCA1+', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '1100', display: 'BRCA1' });
//   cgvGeneStudied.interpretation.coding.push({ system: 'N/A', code: 'CAR', display: 'CAR' });
//   cgvGenomicSourceClass.valueCodeableConcept.coding.push({
//     system: ' http://loinc.info/sct',
//     code: 'LA6683-2',
//     display: 'N/A'
//   });

//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test BRCA+ Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('BRCA1+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-BRCA1+_2', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '1100', display: 'BRCA1' });
//   cgvGeneStudied.interpretation.coding.push({ system: 'N/A', code: 'A', display: 'A' });
//   cgvGenomicSourceClass.valueCodeableConcept.coding.push({
//     system: ' http://loinc.info/sct',
//     code: 'LA6683-2',
//     display: 'N/A'
//   });

//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test BRCA+ Filter+2', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('BRCA1+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-BRCA1+_3', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '1100', display: 'BRCA1' });
//   cgvGeneStudied.interpretation.coding.push({ system: 'N/A', code: 'POS', display: 'POS' });
//   cgvGenomicSourceClass.valueCodeableConcept.coding.push({
//     system: ' http://loinc.info/sct',
//     code: 'LA6683-2',
//     display: 'N/A'
//   });

//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test BRCA+ Filter_3', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('BRCA1+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-BRCA1-', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '1100', display: 'BRCA1' });
//   cgv.valueCodeableConcept.push({ system: 'http://snomed.info/sct', code: '260385009', display: 'N/A' });

//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test BRCA- Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('BRCA1-');
//   });
// });
// describe('checkTumorMarkerFilterLogic-BRCA2+', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '1101', display: 'BRCA2' });
//   cgv.valueCodeableConcept.push({ system: 'http://snomed.info/sct', code: '10828004', display: 'N/A' });
//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test BRCA2+ Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('BRCA2+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-BRCA2-', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '1101', display: 'BRCA2' });
//   cgv.valueCodeableConcept.push({ system: 'http://snomed.info/sct', code: '260385009', display: 'N/A' });
//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test BRCA2- Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('BRCA2-');
//   });
// });
// describe('checkTumorMarkerFilterLogic-ATM-', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '795', display: 'ATM' });
//   cgv.valueCodeableConcept.push({ system: 'http://snomed.info/sct', code: '260385009', display: 'N/A' });
//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test ATM- Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('ATM-');
//   });
// });
// describe('checkTumorMarkerFilterLogic-ATM+', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '795', display: 'ATM' });
//   cgv.valueCodeableConcept.push({ system: 'loinc', code: 'LA9633-4', display: 'Present' });
//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()

//   it('Test ATM+ Filter', () => {
//     expect(tumorMarkerValues[0]).toBe('ATM+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-CDH1+', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);

//   const tumorMarker = createEmptyTumorMarker();

// //   it('Test BRCA+ Filter', () => {
// //     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
// //     expect(tumorMarkerValues[0]).toBe('BRCA1+');
// //   });
// // });
// // describe('checkTumorMarkerFilterLogic-BRCA1+_2', () => {
// //   // Initialize
// //   const extractedMCODE = new TrialjectoryMappingLogic(null);
// //   const cgv: mappinglogic.CancerGeneticVariant = {
// //     valueCodeableConcept: [] as fhir.Coding[],
// //     interpretation: [] as fhir.Coding[],
// //     component: {} as mappinglogic.CancerGeneticVariantComponent
// //   };
// //   const cgvComponent: mappinglogic.CancerGeneticVariantComponent = {
// //     geneStudied: [] as mappinglogic.CancerGeneticVariantComponentType[],
// //     genomicsSourceClass: [] as mappinglogic.CancerGeneticVariantComponentType[]
// //   };
// //   const cgvGeneStudied: mappinglogic.CancerGeneticVariantComponentType = {
// //     valueCodeableConcept: { coding: [] as fhir.Coding[] },
// //     interpretation: { coding: [] as fhir.Coding[] }
// //   };
// //   const cgvGenomicSourceClass: mappinglogic.CancerGeneticVariantComponentType = {
// //     valueCodeableConcept: { coding: [] as fhir.Coding[] },
// //     interpretation: { coding: [] as fhir.Coding[] }
// //   };

// //   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '1100', display: 'BRCA1' });
// //   cgvGeneStudied.interpretation.coding.push({ system: 'N/A', code: 'A', display: 'A' });
// //   cgvGenomicSourceClass.valueCodeableConcept.coding.push({
// //     system: ' http://loinc.info/sct',
// //     code: 'LA6683-2',
// //     display: 'N/A'
// //   });

// //   cgvComponent.geneStudied.push(cgvGeneStudied);
// //   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
// //   cgv.component = cgvComponent;
// //   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test CDH1+ Filter', () => {
//     expect(tumorMarkerValues[0]).toBe('CDH1+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-CDH1-', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '1748', display: 'CDH1' });
//   cgv.interpretation.push({ system: 'n/a', code: 'NEG', display: 'NEG' });
//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()

//   it('Test CDH1- Filter', () => {
//     expect(tumorMarkerValues[0]).toBe('CDH1-');
//   });
// });
// describe('checkTumorMarkerFilterLogic-CHEK2+', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const tumorMarker = createEmptyTumorMarker();

//   tumorMarker.coding.push({ system: 'loinc', code: '72518-4', display: 'n/a' });
//   tumorMarker.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'POS', display: 'POS'});

//   extractedMCODE.tumorMarker.push(tumorMarker);

//   it('Test CHEK2+ Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('CHEK2+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-CHEK2-', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '16627', display: 'CHEK2' });
//   cgv.valueCodeableConcept.push({ system: 'snomed', code: '260385009', display: 'n/a' });
//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test CHEK2- Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('CHEK2-');
//   });
// });
// describe('checkTumorMarkerFilterLogic-NBN+', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const tumorMarker = createEmptyTumorMarker();

//   tumorMarker.coding.push({ system: 'loinc', code: '82515-8', display: 'n/a' });
//   tumorMarker.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'ND', display: 'ND'});

//   extractedMCODE.tumorMarker.push(tumorMarker);

//   it('Test NBN+ Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('NBN+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-NBN-', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const tumorMarker = createEmptyTumorMarker();

//   tumorMarker.coding.push({ system: 'loinc', code: '82515-8', display: 'n/a' });
//   tumorMarker.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'DET', display: 'DET'});

//   extractedMCODE.tumorMarker.push(tumorMarker);

//   it('Test NBN- Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('NBN-');
//   });
// });
// describe('checkTumorMarkerFilterLogic-NF1+', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const tumorMarker = createEmptyTumorMarker();

//   tumorMarker.coding.push({ system: 'loinc', code: '21717-4', display: 'n/a' });
//   tumorMarker.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'L', display: 'n/a'});

//   extractedMCODE.tumorMarker.push(tumorMarker);

//   it('Test NF1+ Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('NF1+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-NF1-', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const tumorMarker = createEmptyTumorMarker();

//   tumorMarker.coding.push({ system: 'loinc', code: '21718-2', display: 'n/a' });
//   tumorMarker.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'H', display: 'n/a'});

//   extractedMCODE.tumorMarker.push(tumorMarker);

//   it('Test NF1- Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('NF1-');
//   });
// });
// describe('checkTumorMarkerFilterLogic-PALB2+', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '26144', display: 'PALB2' });
//   cgv.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'CAR', display: 'CAR' });
//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test PALB2+ Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('PALB2+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-PALB2-', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '26144', display: 'PALB2' });
//   cgv.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'N', display: 'N' });
//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test PALB2- Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('PALB2-');
//   });
// });
// describe('checkTumorMarkerFilterLogic-PTEN+', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '9588', display: 'PTEN' });
//   cgv.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'A', display: 'A' });
//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test PTEN+ Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('PTEN+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-PTEN-', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '9588', display: 'PTEN' });
//   cgv.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'NEG', display: 'NEG' });
//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test PTEN- Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('PTEN-');
//   });
// });
// describe('checkTumorMarkerFilterLogic-STK11+', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '11389', display: 'STK11' });
//   cgv.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'POS', display: 'POS' });
//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test STK11+ Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('STK11+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-STK11-', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '11389', display: 'STK11' });
//   cgv.valueCodeableConcept.push({ system: 'loinc', code: 'LA9634-2', display: 'Absent' });
//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test STK11- Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('STK11-');
//   });
// });
// describe('checkTumorMarkerFilterLogic-P53+', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '11998', display: 'P53' });
//   cgv.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'POS', display: 'POS' });
//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test P53+ Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('P53+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-P53-', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '11998', display: 'P53' });
//   cgv.valueCodeableConcept.push({ system: 'loinc', code: 'LA9634-2', display: 'Absent' });
//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test P53- Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('P53-');
//   });
// });
// describe('checkTumorMarkerFilterLogic-RB+', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const tm = createEmptyTumorMarker();

//   tm.coding.push({ system: 'http://loinc.info/sct', code: '42795-5', display: 'N/A' } as Coding); // Any code in 'Biomarker-RB'
//   tm.valueQuantity.push({ value: '51', comparator: '>', unit: '%', code: '%' } as mcode.Quantity);
//   extractedMCODE.tumorMarker.push(tm);

//   it('Test RB+ Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('RB+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-RB+_2', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const tm = createEmptyTumorMarker();

//   tm.coding.push({ system: 'http://loinc.info/sct', code: '42795-5', display: 'N/A' } as Coding); // Any code in 'Biomarker-RB'
//   tm.valueRatio.push({numerator: {value: 6, comparator: '>', unit: '%'}, denominator: {value: 3, comparator: '>', unit: '%'}, metric: '>'} as mcode.Ratio);
//   extractedMCODE.tumorMarker.push(tm);

//   it('Test RB+ Filter_2', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('RB+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-RB-', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
// const tm = createEmptyTumorMarker();

//   tm.coding.push({ system: 'http://loinc.info/sct', code: '42795-5', display: 'N/A' } as Coding); // Any code in 'Biomarker-RB'
//   tm.valueQuantity.push({ value: '49', comparator: '<=', unit: '%', code: '%' } as mcode.Quantity);
//   extractedMCODE.tumorMarker.push(tm);

//   it('Test RB- Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('RB-');
//   });
// });
// describe('checkTumorMarkerFilterLogic-RB-_2', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const tm = createEmptyTumorMarker();

//   tm.coding.push({ system: 'http://loinc.info/sct', code: '42795-5', display: 'N/A' } as Coding); // Any code in 'Biomarker-RB'
//   tm.valueRatio.push({numerator: {value: 1, comparator: '<', unit: '%'}, denominator: {value: 101, comparator: '<', unit: '%'}, metric: '<'} as mcode.Ratio);
//   extractedMCODE.tumorMarker.push(tm);

//   it('Test RB- Filter_2', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('RB-');
//   });
// });
// describe('checkTumorMarkerFilterLogic-HER2+', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const tm = createEmptyTumorMarker();

//   tm.coding.push({ system: 'http://loinc.info/sct', code: '32996-1', display: 'N/A' } as Coding); // Any code in 'Biomarker-HER2'
//   tm.valueQuantity.push({ value: '3+', comparator: '=' } as mcode.Quantity);
//   extractedMCODE.tumorMarker.push(tm);

//   it('Test HER2+ Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('HER2+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-HER2-', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
// const tm = createEmptyTumorMarker();

//   tm.coding.push({ system: 'http://loinc.info/sct', code: '32996-1', display: 'N/A' } as Coding); // Any code in 'Biomarker-HER2'
//   tm.valueQuantity.push({ value: '2+', comparator: '=' } as mcode.Quantity);
//   extractedMCODE.tumorMarker.push(tm);

//   it('Test HER2- Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('HER2-');
//   });
// });
// describe('checkTumorMarkerFilterLogic-FGFR+', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const tm = createEmptyTumorMarker();

//   tm.coding.push({ system: 'http://loinc.info/sct', code: '42785-6', display: 'N/A' } as Coding); // Any code in 'Biomarker-FGFR'
//   tm.valueQuantity.push({ value: '1', comparator: '>=', unit: '%', code: '%' } as mcode.Quantity);
//   extractedMCODE.tumorMarker.push(tm);

//   it('Test FGFR+ Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('FGFR+');
//   });
// });

// describe('checkTumorMarkerFilterLogic-FGFR+_2', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const tm = createEmptyTumorMarker();

//   tm.coding.push({ system: 'http://loinc.info/sct', code: '42785-6', display: 'N/A' } as Coding); // Any code in 'Biomarker-FGFR'
//   tm.valueRatio.push({numerator: {value: 6, comparator: '>', unit: '%'}, denominator: {value: 3, comparator: '>', unit: '%'}, metric: '>'} as mcode.Ratio);
//   extractedMCODE.tumorMarker.push(tm);

//   it('Test FGFR+ Filter_2', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('FGFR+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-FGFR-', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const tm = createEmptyTumorMarker();

//   tm.coding.push({ system: 'http://loinc.info/sct', code: '42785-6', display: 'N/A' } as Coding); // Any code in 'Biomarker-FGFR'
//   tm.valueQuantity.push({ value: '0.5', comparator: '<', unit: '%', code: '%' } as mcode.Quantity);
//   extractedMCODE.tumorMarker.push(tm);

//   it('Test FGFR- Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('FGFR-');
//   });
// });
// describe('checkTumorMarkerFilterLogic-FGFR-_2', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const tm = createEmptyTumorMarker();

//   tm.coding.push({ system: 'http://loinc.info/sct', code: '42785-6', display: 'N/A' } as Coding); // Any code in 'Biomarker-FGFR'
//   tm.valueRatio.push({numerator: {value: 1, comparator: '<', unit: '%'}, denominator: {value: 101, comparator: '<', unit: '%'}, metric: '<'} as mcode.Ratio);
//   extractedMCODE.tumorMarker.push(tm);

//   it('Test FGFR- Filter_2', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('FGFR-');
//   });
// });
// describe('checkTumorMarkerFilterLogic-ESR1+', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '3467', display: 'ESR1' });
//   cgv.valueCodeableConcept.push({ system: 'loinc', code: 'LA9633-4', display: 'Present' });
//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test ESR1+ Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('ESR1+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-ESR1-', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '3467', display: 'ESR1' });
//   cgv.valueCodeableConcept.push({ system: 'loinc', code: 'LA9634-2', display: 'Absent' });
//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test ESR1- Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('ESR1-');
//   });
// });
// describe('checkTumorMarkerFilterLogic-PIK3CA+', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '8975', display: 'PIK3CA' });
//   cgv.valueCodeableConcept.push({ system: 'snomed', code: '10828004', display: 'n/a' });
//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test PIK3CA+ Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('PIK3CA+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-PIK3CA-', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '8975', display: 'PIK3CA' });
//   cgv.valueCodeableConcept.push({ system: 'snomed', code: '260385009', display: 'n/a' });
//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test PIK3CA- Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('PIK3CA-');
//   });
// });
// describe('checkTumorMarkerFilterLogic-PDL1+', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const tm = createEmptyTumorMarker();

//   tm.coding.push({ system: 'http://loinc.info/sct', code: '96268-8', display: 'N/A' } as Coding);
//   tm.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'POS', display: 'POS' } as Coding);
//   extractedMCODE.tumorMarker.push(tm);

//   it('Test PDL1+ Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('PDL1+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-PDL1-', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const tm = createEmptyTumorMarker();

//   tm.coding.push({ system: 'http://loinc.info/sct', code: '83052-1', display: 'N/A' } as Coding);
//   tm.interpretation.push({ system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'ND', display: 'ND' } as Coding);
//   extractedMCODE.tumorMarker.push(tm);

//   it('Test PDL1- Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('PDL1-');
//   });
// });
// describe('checkTumorMarkerFilterLogic-NTRK_FUSION+', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '8031', display: 'NTRK_FUSION' });
//   cgv.valueCodeableConcept.push({ system: 'snomed', code: '10828004', display: 'n/a' });
//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test NTRK_FUSION+ Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('NTRK_FUSION+');
//   });
// });
// describe('checkTumorMarkerFilterLogic-NTRK_FUSION-', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '8031', display: 'NTRK_FUSION' });
//   cgv.valueCodeableConcept.push({ system: 'snomed', code: '260385009', display: 'n/a' });
//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test NTRK_FUSION- Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues[0]).toBe('NTRK_FUSION-');
//   });
// })
// describe('checkTumorMarkerFilterLogic-No_Match', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const cgv = createEmptyCancerGeneticVariant();
//   const cgvComponent = createEmptyCancerGeneticVariantComponent();
//   const cgvGeneStudied = createEmptyCancerGeneticVariantGeneStudied();
//   const cgvGenomicSourceClass = createEmptyCancerGeneticVariantGenomicsSource();

//   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: 'XXX', display: 'XXX' });
//   cgv.valueCodeableConcept.push({ system: 'snomed', code: 'XXX', display: 'n/a' });
//   cgvComponent.geneStudied.push(cgvGeneStudied);
//   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
//   cgv.component = cgvComponent;
//   extractedMCODE.cancerGeneticVariant.push(cgv);

//   it('Test No_Match- Filter', () => {
//     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarkerValues.length).toBe(0);
//   });
// })
// describe('checkAgeFilterLogic', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const today: Date = new Date();

//   it('Test Age is over 18 Filter', () => {
//     const birthdate = '1950-06-11';
//     const checkDate: Date = new Date(birthdate);
//     const millisecondsAge = today.getTime() - checkDate.getTime();
//     const milliseconds1Years = 1000 * 60 * 60 * 24 * 365;
//     extractedMCODE.birthDate = birthdate;
//     expect(extractedMCODE.getAgeValue()).toBe(Math.floor(millisecondsAge/milliseconds1Years));
//   });

//   it('Test Age is under 18 Filter', () => {
//     const birthdate = '2021-10-10';
//     const checkDate: Date = new Date(birthdate);
//     const millisecondsAge = today.getTime() - checkDate.getTime();
//     const milliseconds1Years = 1000 * 60 * 60 * 24 * 365;
//     extractedMCODE.birthDate = birthdate;
//     expect(extractedMCODE.getAgeValue()).toBe(Math.floor(millisecondsAge/milliseconds1Years));
//   });
// });
// describe('checkHistologyMorphologyFilterLogic-ibc', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const pcc: PrimaryCancerCondition = {clinicalStatus: [] as Coding[], coding: [] as Coding[], histologyMorphologyBehavior: [] as Coding[]};

//   // Invasive Breast Cancer Filter Attributes
//   pcc.coding.push({ system: 'http://snomed.info/sct', code: '783541009', display: 'N/A' } as Coding); // Any Code in 'Cancer-Breast'
//   pcc.histologyMorphologyBehavior.push({
//     system: 'http://snomed.info/sct',
//     code: '446688004',
//     display: 'N/A'
//   } as Coding); // Any code in 'Morphology-Invasive'

//   extractedMCODE.primaryCancerCondition.push(pcc);

//   it('Test Invasive Breast Cancer Filter', () => {
//     expect(extractedMCODE.getHistologyMorphologyValue()).toBe('ibc');
//   });
// });
// describe('checkHistologyMorphologyFilterLogic-idc', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const pcc: PrimaryCancerCondition = {clinicalStatus: [] as Coding[], coding: [] as Coding[], histologyMorphologyBehavior: [] as Coding[]};

//   // Invasive Ductal Carcinoma Filter Attributes
//   pcc.coding.push({ system: 'http://snomed.info/sct', code: '783541009', display: 'N/A' } as Coding); // Any Code in 'Cancer-Breast'
//   pcc.histologyMorphologyBehavior.push({
//     system: 'http://snomed.info/sct',
//     code: '444134008',
//     display: 'N/A'
//   } as Coding); // Any code in 'Morphology-Invas_Duct_Carc'

//   extractedMCODE.primaryCancerCondition.push(pcc);

//   it('Test Invasive Invasive Ductal Carcinoma Filter', () => {
//     expect(extractedMCODE.getHistologyMorphologyValue()).toBe('idc');
//   });
// });
// describe('checkHistologyMorphologyFilterLogic-ilc', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const pcc: PrimaryCancerCondition = {clinicalStatus: [] as Coding[], coding: [] as Coding[], histologyMorphologyBehavior: [] as Coding[]};

// //   it('Test BRCA+ Filter_3', () => {
// //     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
// //     expect(tumorMarkerValues[0]).toBe('BRCA1+');
// //   });
// // });
// // describe('checkTumorMarkerFilterLogic-BRCA1-', () => {
// //   // Initialize
// //   const extractedMCODE = new TrialjectoryMappingLogic(null);
// //   const cgv: mappinglogic.CancerGeneticVariant = {
// //     valueCodeableConcept: [] as fhir.Coding[],
// //     interpretation: [] as fhir.Coding[],
// //     component: {} as mappinglogic.CancerGeneticVariantComponent
// //   };
// //   const cgvComponent: mappinglogic.CancerGeneticVariantComponent = {
// //     geneStudied: [] as mappinglogic.CancerGeneticVariantComponentType[],
// //     genomicsSourceClass: [] as mappinglogic.CancerGeneticVariantComponentType[]
// //   };
// //   const cgvGeneStudied: mappinglogic.CancerGeneticVariantComponentType = {
// //     valueCodeableConcept: { coding: [] as fhir.Coding[] },
// //     interpretation: { coding: [] as fhir.Coding[] }
// //   };
// //   const cgvGenomicSourceClass: mappinglogic.CancerGeneticVariantComponentType = {
// //     valueCodeableConcept: { coding: [] as fhir.Coding[] },
// //     interpretation: { coding: [] as fhir.Coding[] }
// //   };

// //   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '1100', display: 'BRCA1' });
// //   cgv.valueCodeableConcept.push({ system: 'http://snomed.info/sct', code: '260385009', display: 'N/A' });

// //   cgvComponent.geneStudied.push(cgvGeneStudied);
// //   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
// //   cgv.component = cgvComponent;
// //   extractedMCODE.cancerGeneticVariant.push(cgv);

// //   it('Test BRCA- Filter', () => {
// //     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
// //     expect(tumorMarkerValues[0]).toBe('BRCA1-');
// //   });
// // });
// // describe('checkTumorMarkerFilterLogic-BRCA2+', () => {
// //   // Initialize
// //   const extractedMCODE = new TrialjectoryMappingLogic(null);
// //   const cgv: mappinglogic.CancerGeneticVariant = {
// //     valueCodeableConcept: [] as fhir.Coding[],
// //     interpretation: [] as fhir.Coding[],
// //     component: {} as mappinglogic.CancerGeneticVariantComponent
// //   };
// //   const cgvComponent: mappinglogic.CancerGeneticVariantComponent = {
// //     geneStudied: [] as mappinglogic.CancerGeneticVariantComponentType[],
// //     genomicsSourceClass: [] as mappinglogic.CancerGeneticVariantComponentType[]
// //   };
// //   const cgvGeneStudied: mappinglogic.CancerGeneticVariantComponentType = {
// //     valueCodeableConcept: { coding: [] as fhir.Coding[] },
// //     interpretation: { coding: [] as fhir.Coding[] }
// //   };
// //   const cgvGenomicSourceClass: mappinglogic.CancerGeneticVariantComponentType = {
// //     valueCodeableConcept: { coding: [] as fhir.Coding[] },
// //     interpretation: { coding: [] as fhir.Coding[] }
// //   };

// //   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '1101', display: 'BRCA2' });
// //   cgv.valueCodeableConcept.push({ system: 'http://snomed.info/sct', code: '10828004', display: 'N/A' });

// //   cgvComponent.geneStudied.push(cgvGeneStudied);
// //   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
// //   cgv.component = cgvComponent;
// //   extractedMCODE.cancerGeneticVariant.push(cgv);

// //   it('Test BRCA2+ Filter', () => {
// //     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
// //     expect(tumorMarkerValues[0]).toBe('BRCA2+');
// //   });
// // });
// // describe('checkTumorMarkerFilterLogic-BRCA2-', () => {
// //   // Initialize
// //   const extractedMCODE = new TrialjectoryMappingLogic(null);
// //   const cgv: mappinglogic.CancerGeneticVariant = {
// //     valueCodeableConcept: [] as fhir.Coding[],
// //     interpretation: [] as fhir.Coding[],
// //     component: {} as mappinglogic.CancerGeneticVariantComponent
// //   };
// //   const cgvComponent: mappinglogic.CancerGeneticVariantComponent = {
// //     geneStudied: [] as mappinglogic.CancerGeneticVariantComponentType[],
// //     genomicsSourceClass: [] as mappinglogic.CancerGeneticVariantComponentType[]
// //   };
// //   const cgvGeneStudied: mappinglogic.CancerGeneticVariantComponentType = {
// //     valueCodeableConcept: { coding: [] as fhir.Coding[] },
// //     interpretation: { coding: [] as fhir.Coding[] }
// //   };
// //   const cgvGenomicSourceClass: mappinglogic.CancerGeneticVariantComponentType = {
// //     valueCodeableConcept: { coding: [] as fhir.Coding[] },
// //     interpretation: { coding: [] as fhir.Coding[] }
// //   };

// //   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '1101', display: 'BRCA2' });
// //   cgv.valueCodeableConcept.push({ system: 'http://snomed.info/sct', code: '260385009', display: 'N/A' });

// //   cgvComponent.geneStudied.push(cgvGeneStudied);
// //   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
// //   cgv.component = cgvComponent;
// //   extractedMCODE.cancerGeneticVariant.push(cgv);

// //   it('Test BRCA2- Filter', () => {
// //     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
// //     expect(tumorMarkerValues[0]).toBe('BRCA2-');
// //   });
// // });
// // describe('checkTumorMarkerFilterLogic-ATM-', () => {
// //   // Initialize
// //   const extractedMCODE = new TrialjectoryMappingLogic(null);
// //   const cgv: mappinglogic.CancerGeneticVariant = {
// //     valueCodeableConcept: [] as fhir.Coding[],
// //     interpretation: [] as fhir.Coding[],
// //     component: {} as mappinglogic.CancerGeneticVariantComponent
// //   };
// //   const cgvComponent: mappinglogic.CancerGeneticVariantComponent = {
// //     geneStudied: [] as mappinglogic.CancerGeneticVariantComponentType[],
// //     genomicsSourceClass: [] as mappinglogic.CancerGeneticVariantComponentType[]
// //   };
// //   const cgvGeneStudied: mappinglogic.CancerGeneticVariantComponentType = {
// //     valueCodeableConcept: { coding: [] as fhir.Coding[] },
// //     interpretation: { coding: [] as fhir.Coding[] }
// //   };
// //   const cgvGenomicSourceClass: mappinglogic.CancerGeneticVariantComponentType = {
// //     valueCodeableConcept: { coding: [] as fhir.Coding[] },
// //     interpretation: { coding: [] as fhir.Coding[] }
// //   };

// //   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '795', display: 'ATM' });
// //   cgv.valueCodeableConcept.push({ system: 'http://snomed.info/sct', code: '260385009', display: 'N/A' });

// //   cgvComponent.geneStudied.push(cgvGeneStudied);
// //   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
// //   cgv.component = cgvComponent;
// //   extractedMCODE.cancerGeneticVariant.push(cgv);

// //   it('Test ATM- Filter', () => {
// //     const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()
// //     expect(tumorMarkerValues[0]).toBe('ATM-');
// //   });
// // });
// // describe('checkTumorMarkerFilterLogic-ATM+', () => {
// //   // Initialize
// //   const extractedMCODE = new TrialjectoryMappingLogic(null);
// //   const cgv: mappinglogic.CancerGeneticVariant = {
// //     valueCodeableConcept: [] as fhir.Coding[],
// //     interpretation: [] as fhir.Coding[],
// //     component: {} as mappinglogic.CancerGeneticVariantComponent
// //   };
// //   const cgvComponent: mappinglogic.CancerGeneticVariantComponent = {
// //     geneStudied: [] as mappinglogic.CancerGeneticVariantComponentType[],
// //     genomicsSourceClass: [] as mappinglogic.CancerGeneticVariantComponentType[]
// //   };
// //   const cgvGeneStudied: mappinglogic.CancerGeneticVariantComponentType = {
// //     valueCodeableConcept: { coding: [] as fhir.Coding[] },
// //     interpretation: { coding: [] as fhir.Coding[] }
// //   };
// //   const cgvGenomicSourceClass: mappinglogic.CancerGeneticVariantComponentType = {
// //     valueCodeableConcept: { coding: [] as fhir.Coding[] },
// //     interpretation: { coding: [] as fhir.Coding[] }
// //   };

// //   cgvGeneStudied.valueCodeableConcept.coding.push({ system: 'hgnc', code: '795', display: 'ATM' });
// //   cgv.valueCodeableConcept.push({ system: 'loinc', code: 'LA9633-4', display: 'Present' });

// //   cgvComponent.geneStudied.push(cgvGeneStudied);
// //   cgvComponent.genomicsSourceClass.push(cgvGenomicSourceClass);
// //   cgv.component = cgvComponent;
// //   extractedMCODE.cancerGeneticVariant.push(cgv);

// //   const tumorMarkerValues: string[] = extractedMCODE.getTumorMarkerValue()

// //   it('Test ATM+ Filter', () => {
// //     expect(tumorMarkerValues[0]).toBe('ATM+');
// //   });
// // });
// // describe('checkTumorMarkerFilterLogic-CDH1+', () => {
// //   // Initialize
// //   const extractedMCODE = new TrialjectoryMappingLogic(null);

// //   const tumorMarker : mappinglogic.TumorMarker = {
// //     coding: [] as fhir.Coding[],
// //     valueCodeableConcept: [] as fhir.Coding[],
// //     interpretation: [] as fhir.Coding[],
// //     valueQuantity: [] as fhir.Coding[],
// //     valueRatio: [] as mappinglogic.Ratio[]
// //   };

//   it('Test Invasive Lobular Carcinoma Filter', () => {
//     expect(extractedMCODE.getHistologyMorphologyValue()).toBe('ilc');
//   });
// });
// describe('checkHistologyMorphologyFilterLogic-dcis', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const pcc: PrimaryCancerCondition = {clinicalStatus: [] as Coding[], coding: [] as Coding[], histologyMorphologyBehavior: [] as Coding[]};

//   // Ductal Carcinoma In Situ Filter Attributes
//   pcc.coding.push({ system: 'http://snomed.info/sct', code: '783541009', display: 'N/A' } as Coding); // Any Code in 'Cancer-Breast'
//   pcc.histologyMorphologyBehavior.push({
//     system: 'http://snomed.info/sct',
//     code: '18680006',
//     display: 'N/A'
//   } as Coding); // Any code in 'Morphology-Duct_Car_In_Situ'

//   extractedMCODE.primaryCancerCondition.push(pcc);

//   it('Test Ductal Carcinoma In Situ Filter', () => {
//     expect(extractedMCODE.getHistologyMorphologyValue()).toBe('dcis');
//   });
// });
// describe('checkHistologyMorphologyFilterLogic-lcis_1', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const pcc: PrimaryCancerCondition = {clinicalStatus: [] as Coding[], coding: [] as Coding[], histologyMorphologyBehavior: [] as Coding[]};
//   pcc.coding = [] as Coding[];
//   pcc.histologyMorphologyBehavior = [] as Coding[];

// //   // Invasive Lobular Carcinoma Filter Attributes
// //   pcc.coding.push({ system: 'http://snomed.info/sct', code: '1080261000119100', display: 'N/A' } as fhir.Coding); // Any Code in 'Cancer-Invas Lob Carc'

// //   extractedMCODE.primaryCancerCondition.push(pcc);

//   it('Test Lobular Carcinoma In Situ Filter_1', () => {
//     expect(extractedMCODE.getHistologyMorphologyValue()).toBe('lcis');
//   });
// });
// describe('checkHistologyMorphologyFilterLogic-lcis_2', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const pcc: PrimaryCancerCondition = {clinicalStatus: [] as Coding[], coding: [] as Coding[], histologyMorphologyBehavior: [] as Coding[]};

//   // Lobular Carcinoma In Situ Filter Attributes
//   pcc.histologyMorphologyBehavior.push({
//     system: 'http://snomed.info/sct',
//     code: '77284006',
//     display: 'N/A'
//   } as Coding); // Any Code in 'lcis-histology'

//   extractedMCODE.primaryCancerCondition.push(pcc);

//   it('Test Lobular Carcinoma In Situ Filter_2', () => {
//     expect(extractedMCODE.getHistologyMorphologyValue()).toBe('lcis');
//   });
// });
// describe('checkSecondaryCancerConditionLogic', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//     const scc: mcode.SecondaryCancerCondition = {clinicalStatus: [] as Coding[], coding: [] as Coding[]};

// //   extractedMCODE.primaryCancerCondition.push(pcc);

// //   it('Test Lobular Carcinoma In Situ Filter_1', () => {
// //     expect(extractedMCODE.getHistologyMorphologyValue()).toBe('lcis');
// //   });
// // });
// // describe('checkHistologyMorphologyFilterLogic-lcis_2', () => {
// //   // Initialize
// //   const extractedMCODE = new TrialjectoryMappingLogic(null);
// //   const pcc: PrimaryCancerCondition = {};
// //   pcc.clinicalStatus = [] as fhir.Coding[];
// //   pcc.coding = [] as fhir.Coding[];
// //   pcc.histologyMorphologyBehavior = [] as fhir.Coding[];

// //   // Lobular Carcinoma In Situ Filter Attributes
// //   pcc.histologyMorphologyBehavior.push({
// //     system: 'http://snomed.info/sct',
// //     code: '77284006',
// //     display: 'N/A'
// //   } as fhir.Coding); // Any Code in 'lcis-histology'

// //   extractedMCODE.primaryCancerCondition.push(pcc);

// //   it('Test Lobular Carcinoma In Situ Filter_2', () => {
// //     expect(extractedMCODE.getHistologyMorphologyValue()).toBe('lcis');
// //   });
// // });
// // describe('checkSecondaryCancerConditionLogic', () => {
// //   // Initialize
// //   const extractedMCODE = new TrialjectoryMappingLogic(null);
// //   const scc: mappinglogic.SecondaryCancerCondition = {};
// //   scc.clinicalStatus = [] as fhir.Coding[];
// //   scc.coding = [] as fhir.Coding[];

//   it('is populated', () => {
//     expect(extractedMCODE.getSecondaryCancerValue()).not.toBeNull();
//     expect(extractedMCODE.getSecondaryCancerValue()).toHaveSize(3);
//   });
//   it('uses snomed codes', () => {
//     expect(extractedMCODE.getSecondaryCancerValue()).toContain("bone");
//   });
//   it('uses display text if code is not present', () => {
//     expect(extractedMCODE.getSecondaryCancerValue()).toContain("liver");
//   });
//   it('uses display text if system and code is not present', () => {
//     expect(extractedMCODE.getSecondaryCancerValue()).toContain("chest wall");
//   });
//   it('is null if no Secondary Cancer Conditions', () => {
//     const emptyExtractedMCODE = new mcode.ExtractedMCODE(null);
//     expect(emptyExtractedMCODE.getSecondaryCancerValue()).toBeNull();
//   });
//   it('is null if no matches', () => {
//     const emptyExtractedMCODE = new mcode.ExtractedMCODE(null);
//     const scc: mcode.SecondaryCancerCondition = {clinicalStatus: [] as Coding[], coding: [] as Coding[]};

//     scc.coding.push({} as Coding);
//     emptyExtractedMCODE.secondaryCancerCondition.push(scc);

// //   extractedMCODE.secondaryCancerCondition.push(scc);

// //   it('is populated', () => {
// //     expect(extractedMCODE.getSecondaryCancerValue()).not.toBeNull();
// //     expect(extractedMCODE.getSecondaryCancerValue()).toHaveSize(3);
// //   });
// //   it('uses snomed codes', () => {
// //     expect(extractedMCODE.getSecondaryCancerValue()).toContain("bone");
// //   });
// //   it('uses display text if code is not present', () => {
// //     expect(extractedMCODE.getSecondaryCancerValue()).toContain("liver");
// //   });
// //   it('uses display text if system and code is not present', () => {
// //     expect(extractedMCODE.getSecondaryCancerValue()).toContain("chest wall");
// //   });
// //   it('is null if no Secondary Cancer Conditions', () => {
// //     const emptyExtractedMCODE = new TrialjectoryMappingLogic(null);
// //     expect(emptyExtractedMCODE.getSecondaryCancerValue()).toBeNull();
// //   });
// //   it('is null if no matches', () => {
// //     const emptyExtractedMCODE = new TrialjectoryMappingLogic(null);
// //     const scc: mappinglogic.SecondaryCancerCondition = {};
// //     scc.clinicalStatus = [] as fhir.Coding[];
// //     scc.coding = [] as fhir.Coding[];
// //     scc.coding.push({} as fhir.Coding);

// //     emptyExtractedMCODE.secondaryCancerCondition.push(scc);

// //     expect(emptyExtractedMCODE.getSecondaryCancerValue()).toBeNull();
// //   });
// //   it('is null if no coding', () => {
// //     const emptyExtractedMCODE = new TrialjectoryMappingLogic(null);
// //     const scc: mappinglogic.SecondaryCancerCondition = {};

// describe('checkRadiationProcedureFilterLogic-WBRT', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const crrp: mcode.CancerRelatedRadiationProcedure = {bodySite: [] as Coding[], coding: [] as Coding[]};

// // /** Procedure Tests */

// // describe('checkRadiationProcedureFilterLogic-WBRT', () => {
// //   // Initialize
// //   const extractedMCODE = new TrialjectoryMappingLogic(null);
// //   const crrp: mappinglogic.CancerRelatedRadiationProcedure = {};
// //   crrp.bodySite = [] as fhir.Coding[];
// //   crrp.coding = [] as fhir.Coding[];

//   it('Test WBRT Filter', () => {
//     expect(extractedMCODE.getRadiationProcedureValue().includes('wbrt')).toBeTrue();
//   });
// });
// describe('checkRadiationProcedureFilterLogic-EBRT', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const crrp: mcode.CancerRelatedRadiationProcedure = {bodySite: [] as Coding[], coding: [] as Coding[]};

// //   extractedMCODE.cancerRelatedRadiationProcedure.push(crrp);

// //   it('Test WBRT Filter', () => {
// //     expect(extractedMCODE.getRadiationProcedureValue().includes('wbrt')).toBeTrue();
// //   });
// // });
// // describe('checkRadiationProcedureFilterLogic-EBRT', () => {
// //   // Initialize
// //   const extractedMCODE = new TrialjectoryMappingLogic(null);
// //   const crrp: mappinglogic.CancerRelatedRadiationProcedure = {};
// //   crrp.bodySite = [] as fhir.Coding[];
// //   crrp.coding = [] as fhir.Coding[];

//   it('Test EBRT Filter', () => {
//     expect(extractedMCODE.getRadiationProcedureValue().includes('ebrt')).toBeTrue();
//   });
// });
// describe('checkRadiationProcedureFilterLogic-Ablation', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const crrp: mcode.CancerRelatedRadiationProcedure = {bodySite: [] as Coding[], coding: [] as Coding[]};

// //   extractedMCODE.cancerRelatedRadiationProcedure.push(crrp);

// //   it('Test EBRT Filter', () => {
// //     expect(extractedMCODE.getRadiationProcedureValue().includes('ebrt')).toBeTrue();
// //   });
// // });
// // describe('checkRadiationProcedureFilterLogic-Ablation', () => {
// //   // Initialize
// //   const extractedMCODE = new TrialjectoryMappingLogic(null);
// //   const crrp: mappinglogic.CancerRelatedRadiationProcedure = {};
// //   crrp.bodySite = [] as fhir.Coding[];
// //   crrp.coding = [] as fhir.Coding[];

//   it('Test Ablation Filter', () => {
//     expect(extractedMCODE.getRadiationProcedureValue().includes('ablation')).toBeTrue();
//   });
// });
// describe('checkRadiationProcedureFilterLogic-rfa', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const crrp: mcode.CancerRelatedRadiationProcedure = {bodySite: [] as Coding[], coding: [] as Coding[]};

// //   extractedMCODE.cancerRelatedRadiationProcedure.push(crrp);

// //   it('Test Ablation Filter', () => {
// //     expect(extractedMCODE.getRadiationProcedureValue().includes('ablation')).toBeTrue();
// //   });
// // });
// // describe('checkRadiationProcedureFilterLogic-rfa', () => {
// //   // Initialize
// //   const extractedMCODE = new TrialjectoryMappingLogic(null);
// //   const crrp: mappinglogic.CancerRelatedRadiationProcedure = {};
// //   crrp.bodySite = [] as fhir.Coding[];
// //   crrp.coding = [] as fhir.Coding[];

//   it('Test rfa Filter', () => {
//     expect(extractedMCODE.getRadiationProcedureValue().includes('rfa')).toBeTrue();
//   });
// });
// describe('checkSurgicalProcedureFilterLogic-Lumpectomy', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const crsp: mcode.CancerRelatedSurgicalProcedure = {coding: [] as Coding[]};

// //   extractedMCODE.cancerRelatedRadiationProcedure.push(crrp);

// //   it('Test rfa Filter', () => {
// //     expect(extractedMCODE.getRadiationProcedureValue().includes('rfa')).toBeTrue();
// //   });
// // });
// // describe('checkSurgicalProcedureFilterLogic-Lumpectomy', () => {
// //   // Initialize
// //   const extractedMCODE = new TrialjectoryMappingLogic(null);
// //   const crsp: mappinglogic.CancerRelatedSurgicalProcedure = {};
// //   crsp.coding = [] as fhir.Coding[];

// //   // Lumpectomy Filter Attributes
// //   crsp.coding.push({ system: 'http://snomed.info/sct', code: '392022002', display: 'N/A' } as fhir.Coding);

// describe('checkSurgicalProcedureFilterLogic-Mastectomy', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const crsp: mcode.CancerRelatedSurgicalProcedure = {coding: [] as Coding[]};

// // describe('checkSurgicalProcedureFilterLogic-Mastectomy', () => {
// //   // Initialize
// //   const extractedMCODE = new TrialjectoryMappingLogic(null);
// //   const crsp: mappinglogic.CancerRelatedSurgicalProcedure = {};
// //   crsp.coding = [] as fhir.Coding[];

// //   // Mastectomy Filter Attributes
// //   crsp.coding.push({ system: 'http://snomed.info/sct', code: '429400009', display: 'N/A' } as fhir.Coding);

// //   extractedMCODE.cancerRelatedSurgicalProcedure.push(crsp);

// describe('checkSurgicalProcedureFilterLogic-Alnd_1', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const crsp: mcode.CancerRelatedSurgicalProcedure = {coding: [] as Coding[]};

// // describe('checkSurgicalProcedureFilterLogic-Alnd_1', () => {
// //   // Initialize
// //   const extractedMCODE = new TrialjectoryMappingLogic(null);
// //   const crsp: mappinglogic.CancerRelatedSurgicalProcedure = {};
// //   crsp.coding = [] as fhir.Coding[];

// //   // Alnd Filter Attributes
// //   crsp.coding.push({ system: 'http://snomed.info/sct', code: '234262008', display: 'N/A' } as fhir.Coding);

// //   extractedMCODE.cancerRelatedSurgicalProcedure.push(crsp);

// describe('checkSurgicalProcedureFilterLogic-Alnd_2', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const crsp: mcode.CancerRelatedSurgicalProcedure = {coding: [] as Coding[], bodySite: [] as Coding[]};

// // describe('checkSurgicalProcedureFilterLogic-Alnd_2', () => {
// //   // Initialize
// //   const extractedMCODE = new TrialjectoryMappingLogic(null);
// //   const crsp: mappinglogic.CancerRelatedSurgicalProcedure = {};
// //   crsp.coding = [] as fhir.Coding[];
// //   crsp.bodySite = [] as fhir.Coding[];

// //   // Alnd Filter Attributes
// //   crsp.coding.push({ system: 'http://snomed.info/sct', code: '122459003', display: 'N/A' } as fhir.Coding);
// //   crsp.bodySite.push({ system: 'http://snomed.info/sct', code: '746224000', display: 'N/A' } as fhir.Coding);

// //   extractedMCODE.cancerRelatedSurgicalProcedure.push(crsp);

// describe('checkSurgicalProcedureFilterLogic-Reconstruction', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const crsp: mcode.CancerRelatedSurgicalProcedure = {coding: [] as Coding[]};

// // describe('checkSurgicalProcedureFilterLogic-Reconstruction', () => {
// //   // Initialize
// //   const extractedMCODE = new TrialjectoryMappingLogic(null);
// //   const crsp: mappinglogic.CancerRelatedSurgicalProcedure = {};
// //   crsp.coding = [] as fhir.Coding[];

// //   // Reconstruction Filter Attributes
// //   crsp.coding.push({ system: 'http://snomed.info/sct', code: '302342002', display: 'N/A' } as fhir.Coding);

// //   extractedMCODE.cancerRelatedSurgicalProcedure.push(crsp);

// describe('checkSurgicalProcedureFilterLogic-Metastasis Resection', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const crsp: mcode.CancerRelatedSurgicalProcedure = {coding: [] as Coding[]};
//   crsp.reasonReference = [] as mcode.ReasonReference;

//   // Metastasis Resection Filter Attributes (surgical procedure reason reference = SecondaryCancerCondition)
//   crsp.reasonReference = ({ meta_profile: 'mcode-secondary-cancer-condition' } as mcode.ReasonReference);

// //   // Metastasis Resection Filter Attributes (surgical procedure reason reference = SecondaryCancerCondition)
// //   crsp.reasonReference = ({ reference_meta_profile: 'mcode-secondary-cancer-condition' } as mappinglogic.ReasonReference);

//   it('Test Metastasis Resection Filter', () => {
//     expect(extractedMCODE.getSurgicalProcedureValue().some(sp => sp == 'metastasis_resection')).toBeTrue();
//   });
// });

// describe('checkNIHSystemNormalizer', () => {
//   it('Test NIH System Normalizer.', () => {
//     expect(CodeMapper.normalizeCodeSystem("nih")).toBe(CodeSystemEnum.NIH);
//   });
// });

// describe('checkNIHSystemNormalizer', () => {
//   it('Test NIH System Normalizer.', () => {
//     expect(CodeMapper.normalizeCodeSystem("nih")).toBe(CodeSystemEnum.NIH);
//   });
// });

// describe('checkInvalidCodeSystemError', () => {
//   it('Test Invalid Input to System Normalizer.', () => {
//     const testFunc = function() {
//       CodeMapper.normalizeCodeSystem("XXX")
//     };
//     expect(testFunc).toThrow(Error('Profile codes do not support code system: XXX'));
//   });
// });

// describe('checkInvalidQuantityMatchError', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);

//   it('Test Invalid Input to System Normalizer.', () => {
//     expect(extractedMCODE.quantityMatch("0", "mm", ["test"], ">>", "mm")).toBeFalse();
//   });
// });

// describe('checkInvalidRatioMatchError', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);

//   it('Test Invalid Input to System Normalizer.', () => {
//     expect(extractedMCODE.ratioMatch({value: "0", comparator: "0", code: "0", unit: "0", system: "0"}, {value: "0", comparator: "0", code: "0", unit: "0", system: "0"}, 0, ">>")).toBeFalse();
//   });
// });

// describe('checkInvalidOperatorError', () => {
//   // Initialize
//   const extractedMCODE = new mcode.ExtractedMCODE(null);
//   const tm = createEmptyTumorMarker();

//   it('Test Invalid Operator Input to Ratio of Tumor Marker.', () => {
//     tm.coding.push({ system: 'http://loinc.info/sct', code: '16112-5', display: 'N/A' } as Coding); // Any code in 'Biomarker-ER'
//     tm.valueRatio.push({} as mcode.Ratio);
//     extractedMCODE.tumorMarker.push(tm);
//     const tumorMarker = extractedMCODE.getTumorMarkerValue()
//     expect(tumorMarker).toEqual([]);
//   });
// });
