import { Quantity, Ratio } from "clinical-trial-matching-service";
import {
  Bundle,
  Coding,
  Condition,
  Observation,
  Procedure,
  Resource,
} from "clinical-trial-matching-service/dist/fhir-types";
import { TrialjectoryMappingLogic } from "../src/trialjectorymappinglogic";

function createMedicationStatementBundle(...coding: Coding[]): Bundle {
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
            coding: coding,
          },
        } as unknown as Resource,
      }
    ]
  };
  return bundle;
}

describe("Test Medication Logic", () => {
  // Function to eliminate redundant test setup.
  const createMedicationsToTest = (...coding: Coding[]): string[] => {
    const bundle = createMedicationStatementBundle(...coding);
    const extractedMCODE = new TrialjectoryMappingLogic(bundle);
    return extractedMCODE.getMedicationStatementValues();
  };

  it("Test with no valid medications", () => {
    const coding: Coding[] = [
      { system: "RxNorm", code: "341545345", display: "N/A" },
      { system: "RxNorm", code: "563563", display: "N/A" },
      { system: "RxNorm", code: "35635463", display: "N/A" },
      { system: "RxNorm", code: "5365712", display: "N/A" },
      { system: "RxNorm", code: "2452456", display: "N/A" },
    ];
    const medications = createMedicationsToTest(...coding);
    expect(medications.length).toBe(0);
  });

  it("Test medication anastrozole", () => {
    const coding: Coding[] = [{ system: "RxNorm", code: "1157702", display: "N/A" }];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("anastrozole");
  });

  it("Test medication fluoxymesterone", () => {
    const coding: Coding[] = [{ system: "RxNorm", code: "1175599", display: "N/A" }];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("fluoxymesterone");
  });

  it("Test medication high_dose_estrogen", () => {
    const coding: Coding[] = [{ system: "RxNorm", code: "4099", display: "N/A" }];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("high_dose_estrogen");
  });

  it("Test medication palbociclib", () => {
    const coding: Coding[] = [{ system: "RxNorm", code: "1601385", display: "N/A" },];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("palbociclib");
  });

  it("Test medication ribociclib", () => {
    const coding: Coding[] = [{ system: "RxNorm", code: "1873987", display: "N/A" },];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("ribociclib");
  });

  it("Test medication abemaciclib", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1946825", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("abemaciclib");
  });

  it("Test medication alpelisib", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2169317", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("alpelisib");
  });

  it("Test 7 medications together", () => {
    const coding: Coding[] = [
      {system: "RxNorm", code: "372571", display: "N/A"},
      {system: "RxNorm", code: "672151", display: "N/A"},
      {system: "RxNorm", code: "2361286", display: "N/A"},
      {system: "RxNorm", code: "1172714", display: "N/A"},
      {system: "RxNorm", code: "1601385", display: "N/A"},
      {system: "RxNorm", code: "1946825", display: "N/A"},
      {system: "RxNorm", code: "2169317", display: "N/A"},
    ];
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

function createTnmPathologicalBundle(...coding: Coding[]): Bundle {
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
            coding: coding,
          },
        } as unknown as Resource,
      }
    ]
  };
  return bundle;
}

describe("Test Stage Logic", () => {
  // Function to eliminate redundant test setup.
  const createStageToTest = (...coding: Coding[]): string => {
    const bundle = createTnmPathologicalBundle(...coding);
    const extractedMCODE = new TrialjectoryMappingLogic(bundle);
    return extractedMCODE.getStageValues();
  };

  it("Test Stage 0 Filter", () => {
    const coding: Coding = {system: "snomed", code: "261645004", display: "N/A"} as Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe("0");
  });

  it("Test Stage 1 Filter", () => {
    const coding: Coding = {system: "AJCC", code: "1", display: "N/A"} as Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe("1");
  });

  it("Test Stage 1A Filter", () => {
    const coding: Coding = {system: "snomed", code: "261634002", display: "N/A"} as Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe("1A");
  });

  it("Test Stage 1B Filter", () => {
    const coding: Coding = {system: "snomed", code: "261635001", display: "N/A"} as Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe("1B");
  });

  it("Test Stage 1C Filter", () => {
    const coding: Coding = {system: "snomed", code: "261636000", display: "N/A"} as Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe("1C");
  });

  it("Test Stage 2 Filter", () => {
    const coding: Coding = {system: "AJCC", code: "II", display: "N/A"} as Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe("2");
  });

  it("Test Stage 2A Filter", () => {
    const coding: Coding = {system: "snomed", code: "261614003", display: "N/A"} as Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe("2A");
  });

  it("Test Stage 2B Filter", () => {
    const coding: Coding = {system: "snomed", code: "261615002", display: "N/A"} as Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe("2B");
  });

  it("Test Stage 2C Filter", () => {
    const coding: Coding = {system: "snomed", code: "261637009", display: "N/A"} as Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe("2C");
  });

  it("Test Stage 3 Filter", () => {
    const coding: Coding = {system: "AJCC", code: "3", display: "N/A"} as Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe("3");
  });

  it("Test Stage 3A Filter", () => {
    const coding: Coding = {system: "AJCC", code: "IIIA", display: "N/A"} as Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe("3A");
  });

  it("Test Stage 3B Filter", () => {
    const coding: Coding = {system: "snomed", code: "261639007", display: "N/A"} as Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe("3B");
  });

  it("Test Stage 3C Filter", () => {
    const coding: Coding = {system: "AJCC", code: "3c", display: "N/A"} as Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe("3C");
  });

  it("Test Stage 4 Filter", () => {
    const coding: Coding = {system: "SNOMED", code: "258228008", display: "N/A"} as Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe("4");
  });

  it("Test Stage 4A Filter", () => {
    const coding: Coding = {system: "aJcC", code: "4a", display: "N/A"} as Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe("4A");
  });

  it("Test Stage 4B Filter", () => {
    const coding: Coding = {system: "snomed", code: "261643006", display: "N/A"} as Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe("4B");
  });

  it("Test Stage 4C Filter", () => {
    const coding: Coding = {system: "aJcC", code: "4c", display: "N/A"} as Coding;
    const stage = createStageToTest(coding);
    expect(stage).toBe("4C");
  });

  it("Test Stage 4C Filter with Stage 1 Ordering", () => {
    const coding4c: Coding = {system: "aJcC", code: "4c", display: "N/A",
    } as Coding;
    const coding1: Coding = {system: "aJcC", code: "1", display: "N/A"} as Coding;
    const stage = createStageToTest(coding4c, coding1);
    expect(stage).toBe("4C");
  });

  it("Test Stage 3C Filter with Stage 3B Ordering", () => {
    const coding3b: Coding = {system: "aJcC", code: "3c", display: "N/A"} as Coding;
    const coding3c: Coding = {system: "SnOmEd", code: "261639007", display: "N/A"} as Coding;
    const stage = createStageToTest(coding3b, coding3c);
    expect(stage).toBe("3C");
  });
});

describe("Test Tumor Marker Logic", () => {

  const createTumorMarkerValues = (
    valueRatio: Ratio,
    valueQuantity: Quantity,
    interpretation: Coding,
    valueCodeableConcept: Coding,
    ...coding: Coding[]
  ): string[] => {
    const mappingLogic = new TrialjectoryMappingLogic(createTumorMarkerBundle(valueRatio,
      valueQuantity,
      interpretation,
      valueCodeableConcept,
      ...coding));
    return mappingLogic.getTumorMarkerValues();
  }

  const createTumorMarkerBundle = (
    valueRatio: Ratio,
    valueQuantity: Quantity,
    interpretation: Coding,
    valueCodeableConcept: Coding,
    ...coding: Coding[]
  ): Bundle => {
    let bundle: Bundle = undefined;
  
    if (interpretation) {
      bundle = {
        resourceType: "Bundle",
        type: "transaction",
        entry: [
          {
            resource: {
              resourceType: "Observation",
              meta: {
                profile: [
                  "http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-tumor-marker",
                ],
              },
              interpretation: {
                coding: [interpretation],
              },
              code: {
                coding: coding,
              },
            } as unknown as Resource,
          },
        ],
      };
    } else if (valueCodeableConcept) {
      bundle = {
        resourceType: "Bundle",
        type: "transaction",
        entry: [
          {
            resource: {
              resourceType: "Observation",
              meta: {
                profile: [
                  "http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-tumor-marker",
                ],
              },
              valueCodeableConcept: {
                coding: [valueCodeableConcept],
              },
              code: {
                coding: coding,
              },
            } as unknown as Resource,
          },
        ],
      };
    } else if (valueRatio) {
      bundle = {
        resourceType: "Bundle",
        type: "transaction",
        entry: [
          {
            resource: {
              resourceType: "Observation",
              meta: {
                profile: [
                  "http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-tumor-marker",
                ],
              },
              code: {
                coding: coding,
              },
              valueRatio: valueRatio,
            } as unknown as Resource,
          },
        ],
      };
    } else if(valueQuantity) {
      bundle = {
        resourceType: "Bundle",
        type: "transaction",
        entry: [
          {
            resource: {
              resourceType: "Observation",
              meta: {
                profile: [
                  "http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-tumor-marker",
                ],
              },
              code: {
                coding: coding,
              },
              valueQuantity: valueQuantity,
            } as unknown as Resource,
          },
        ],
      };
    } else {
      bundle = {
        resourceType: "Bundle",
        type: "transaction",
        entry: [
          {
            resource: {
              resourceType: "Observation",
              meta: {
                profile: [
                  "http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-tumor-marker",
                ],
              }
            } as unknown as Resource,
          },
        ],
      };
    }
  
    return bundle;
  }

  const createCgvTumorMarkerValues = (cgvGeneStudiedVcc: Coding, cgvGeneStudiedInterpretation: Coding, cgvGenomicSourceClassVcc: Coding, cgvVcc: Coding, cgvInterpretation: Coding): string[] => {
    const mappingLogic = new TrialjectoryMappingLogic(createCgvTumorMarkerBundle(cgvGeneStudiedVcc, cgvGeneStudiedInterpretation, cgvGenomicSourceClassVcc, cgvVcc, cgvInterpretation));
    return mappingLogic.getTumorMarkerValues();
  }
  const createCgvTumorMarkerBundle = (cgvGeneStudiedVcc: Coding, cgvGeneStudiedInterpretation: Coding, cgvGenomicSourceClassVcc: Coding, cgvVcc: Coding, cgvInterpretation: Coding): Bundle => {
    const bundle: Bundle = {
        resourceType: "Bundle",
        type: "transaction",
        entry: [
          {
            fullUrl: "urn:uuid:6556b6b3-678c-4fd6-9309-8df77xxxxxxx",
            resource: {
              resourceType: "Observation",
              id: "6556b6b3-678c-4fd6-9309-8df77xxxxxxx",
              meta: {
                profile: [
                  "http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-cancer-genetic-variant"
                ],
                lastUpdated: ""
              },
              component: [
                {
                  code: {
                    coding: [
                      {
                        system: "http://loinc.org",
                        code: "48018-6"
                      }
                    ]
                  },
                  valueCodeableConcept: {
                    coding: [
                      cgvGeneStudiedVcc
                    ]
                  },
                  interpretation: {
                    coding: []
                  }
                },
                {
                  code: {
                    coding: [
                      {
                        system: "http://loinc.org",
                        code: "48002-0"
                      }
                    ]
                  },
                  valueCodeableConcept: {
                    coding: []
                  }
                }
              ]
            } as unknown as Observation
          }
        ]
    };

    if(cgvGeneStudiedInterpretation != undefined) {
      bundle.entry[0].resource.component[0].interpretation = {coding: [
        cgvGeneStudiedInterpretation
      ]};
    }

    if(cgvGenomicSourceClassVcc != undefined) {
      bundle.entry[0].resource.component[1].valueCodeableConcept = {coding: [
        cgvGenomicSourceClassVcc
      ]};
    }

    if(cgvVcc != undefined){
      bundle.entry[0].resource.valueCodeableConcept = {
        coding: [
            cgvVcc
        ]
      }
    }

    if(cgvInterpretation != undefined){
      bundle.entry[0].resource.interpretation = {
        coding: [
          cgvInterpretation
        ]
      }
    }

    return bundle;
  };

  it("Test ER+ Logic 1", () => {
    const coding = {
      system: "http://loinc.info/sct",
      code: "16112-5",
      display: "N/A",
    } as Coding; // Any code in 'Biomarker-ER'
    const interpretation = {
      system: "http://hl7.org/fhir/R4/valueset-observation-interpretation.html",
      code: "H",
      display: "N/A",
    } as Coding;
    const tumorMarkerValues = createTumorMarkerValues(undefined, undefined, interpretation, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("ER+");
  });

  it("Test ER+ Logic 2", () => {
    const coding = {
      system: "http://loinc.info/sct",
      code: "16112-5",
      display: "N/A",
    } as Coding; // Any code in 'Biomarker-ER'
    const valueRatio = {
      numerator: { value: 6, comparator: ">", unit: "%" },
      denominator: { value: 3, comparator: ">", unit: "%" },
      metric: ">",
    } as Ratio;
    const tumorMarkerValues = createTumorMarkerValues(valueRatio, undefined, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("ER+");
  });

  it("Test ER- Logic 1", () => {
    const coding = {
      system: "http://loinc.info/sct",
      code: "85310-1",
      display: "N/A",
    } as Coding; // Any code in 'Biomarker-ER'
    const interpretation = {
      system: "http://hl7.org/fhir/R4/valueset-observation-interpretation.html",
      code: "NEG",
      display: "N/A",
    } as Coding;
    const tumorMarkerValues = createTumorMarkerValues(undefined, undefined, interpretation, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("ER-");
  });

  it("Test ER- Logic 2", () => {
    const coding = {
      system: "http://loinc.info/sct",
      code: "16112-5",
      display: "N/A",
    } as Coding; // Any code in 'Biomarker-ER'
    const valueRatio = {
      numerator: { value: 1, comparator: "<", unit: "%" },
      denominator: { value: 101, comparator: "<", unit: "%" },
      metric: "<",
    } as Ratio;
    const tumorMarkerValues = createTumorMarkerValues(valueRatio, undefined, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("ER-");
  });

  it("Test Invalid Quantity", () => {
    const mappingLogic = new TrialjectoryMappingLogic(createTumorMarkerBundle(undefined, undefined, undefined, undefined));
    expect(
      mappingLogic.quantityMatch("0", "mm", ["test"], ">>", "mm")
    ).toBeFalse();
  });

  it("Test Invalid Ratio Match", () => {
    const mappingLogic = new TrialjectoryMappingLogic(createTumorMarkerBundle(undefined, undefined, undefined, undefined));
    expect(
      mappingLogic.ratioMatch(
        { value: "0", comparator: "0", code: "0", unit: "0", system: "0" },
        { value: "0", comparator: "0", code: "0", unit: "0", system: "0" }, 0, ">>"
      )
    ).toBeFalse();
  });

  it("Test Invalid Operator Input to Ratio of Tumor Marker.", () => {
    const coding = {
      system: "http://loinc.info/sct",
      code: "16112-5",
      display: "N/A",
    } as Coding; // Any code in 'Biomarker-ER'
    const valueRatio = {} as Ratio;
    const tumorMarkerValues = createTumorMarkerValues(valueRatio, undefined, undefined, coding);
    expect(tumorMarkerValues).toEqual([]);
  });

  it("Test PR+ Logic 1", () => {
    const coding = {
      system: "http://loinc.info/sct",
      code: "10861-3",
      display: "N/A",
    } as Coding; // Any code in 'Biomarker-PR'
    const interpretation = {
      system: "http://hl7.org/fhir/R4/valueset-observation-interpretation.html",
      code: "H",
      display: "N/A",
    } as Coding;
    const tumorMarkerValues = createTumorMarkerValues(undefined, undefined, interpretation, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("PR+");
  });

  it("Test PR+ Logic 2", () => {
    const coding = {
      system: "http://loinc.info/sct",
      code: "10861-3",
      display: "N/A",
    } as Coding; // Any code in 'Biomarker-PR'
    const valueRatio = {
      numerator: { value: 6, comparator: ">", unit: "%" },
      denominator: { value: 3, comparator: ">", unit: "%" },
      metric: ">",
    } as Ratio;
    const tumorMarkerValues = createTumorMarkerValues(valueRatio, undefined, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("PR+");
  });

  it("Test PR- Logic 1", () => {
    const coding = {
      system: "http://loinc.info/sct",
      code: "10861-3",
      display: "N/A",
    } as Coding; // Any code in 'Biomarker-PR'
    const valueCodeableConcept = {
      system: "snomed",
      code: "260385009",
      display: "N/A",
    } as Coding;
    const tumorMarkerValues = createTumorMarkerValues(undefined, undefined, undefined, valueCodeableConcept, coding);
    expect(tumorMarkerValues[0]).toBe("PR-");
  });

  it("Test PR- Logic 2", () => {
    const coding = {
      system: "http://loinc.info/sct",
      code: "10861-3",
      display: "N/A",
    } as Coding; // Any code in 'Biomarker-PR'
    const valueRatio = {
      numerator: { value: 1, comparator: "<", unit: "%" },
      denominator: { value: 101, comparator: "<", unit: "%" },
      metric: "<",
    } as Ratio;
    const tumorMarkerValues = createTumorMarkerValues(valueRatio, undefined, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("PR-");
  });

  it('Test BRCA1+ Filter 1', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '1100', display: 'BRCA1' };
    const cgvGeneStudiedInterpretation: Coding = { system: 'N/A', code: 'CAR', display: 'CAR' };
    const cgvGenomicSourceClassVcc: Coding = {system: ' http://loinc.info/sct', code: 'LA6683-2', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, cgvGeneStudiedInterpretation, cgvGenomicSourceClassVcc, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('BRCA1+');
  });

  it('Test BRCA1+ Filter 2', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '1100', display: 'BRCA1' };
    const cgvGeneStudiedInterpretation: Coding = { system: 'N/A', code: 'A', display: 'A' };
    const cgvGenomicSourceClassVcc: Coding = {system: ' http://loinc.info/sct', code: 'LA6683-2', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, cgvGeneStudiedInterpretation, cgvGenomicSourceClassVcc, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('BRCA1+');
  });

  it('Test BRCA1+ Filter 3', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '1100', display: 'BRCA1' };
    const cgvGeneStudiedInterpretation: Coding = { system: 'N/A', code: 'POS', display: 'POS' };
    const cgvGenomicSourceClassVcc: Coding = {system: ' http://loinc.info/sct', code: 'LA6683-2', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, cgvGeneStudiedInterpretation, cgvGenomicSourceClassVcc, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('BRCA1+');
  });

  it('Test BRCA1- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '1100', display: 'BRCA1' };
    const cgvVcc: Coding = {system: 'http://snomed.info/sct', code: '260385009', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('BRCA1-');
  });

  it('Test BRCA2+ Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '1101', display: 'N/A' };
    const cgvVcc: Coding = {system: 'http://snomed.info/sct', code: '10828004', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('BRCA2+');
  });

  it('Test BRCA2- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '1101', display: 'N/A' };
    const cgvVcc: Coding = {system: 'http://snomed.info/sct', code: '260385009', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('BRCA2-');
  });

  it('Test ATM+ Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '795', display: 'N/A' };
    const cgvVcc: Coding = {system: 'http://loinc.info/sct', code: 'LA9633-4', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('ATM+');
  });

  it('Test ATM- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '795', display: 'N/A' };
    const cgvVcc: Coding = {system: 'http://snomed.info/sct', code: '260385009', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('ATM-');
  });

  it('Test CDH1+ Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '1748', display: 'N/A' };
    const cgvInterpretation: Coding = {system: 'n/a', code: 'POS', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, cgvInterpretation);
    expect(tumorMarkerValues[0]).toBe('CDH1+');
  });

  it('Test CDH1- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '1748', display: 'N/A' };
    const cgvInterpretation: Coding = {system: 'n/a', code: 'NEG', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, cgvInterpretation);
    expect(tumorMarkerValues[0]).toBe('CDH1-');
  });

  it("Test CHEK2+ Logic", () => {
    const coding = {system: "http://loinc.info/sct", code: "72518-4", display: "N/A"} as Coding;
    const interpretation = {
      system: "http://hl7.org/fhir/R4/valueset-observation-interpretation.html",
      code: "POS",
      display: "N/A",
    } as Coding;
    const tumorMarkerValues = createTumorMarkerValues(undefined, undefined, interpretation, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("CHEK2+");
  });

  it('Test CHEK2- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '16627', display: 'N/A' };
    const cgvVcc: Coding = {system: 'http://snomed.info/sct', code: '260385009', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('CHEK2-');
  });

  it("Test NBN+ Logic", () => {
    const coding = {system: "http://loinc.info/sct", code: "82515-8", display: "N/A"} as Coding;
    const interpretation = {
      system: "http://hl7.org/fhir/R4/valueset-observation-interpretation.html",
      code: "ND",
      display: "N/A",
    } as Coding;
    const tumorMarkerValues = createTumorMarkerValues(undefined, undefined, interpretation, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("NBN+");
  });

  it("Test NBN- Logic", () => {
    const coding = {system: "http://loinc.info/sct", code: "82515-8", display: "N/A"} as Coding;
    const interpretation = {
      system: "http://hl7.org/fhir/R4/valueset-observation-interpretation.html",
      code: "DET",
      display: "N/A",
    } as Coding;
    const tumorMarkerValues = createTumorMarkerValues(undefined, undefined, interpretation, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("NBN-");
  });

  it("Test NF1+ Logic", () => {
    const coding = {system: "http://loinc.info/sct", code: "21717-4", display: "N/A"} as Coding;
    const interpretation = {
      system: "http://hl7.org/fhir/R4/valueset-observation-interpretation.html",
      code: "L",
      display: "N/A",
    } as Coding;
    const tumorMarkerValues = createTumorMarkerValues(undefined, undefined, interpretation, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("NF1+");
  });

  it("Test NF1- Logic", () => {
    const coding = {system: "http://loinc.info/sct", code: "21717-4", display: "N/A"} as Coding;
    const interpretation = {
      system: "http://hl7.org/fhir/R4/valueset-observation-interpretation.html",
      code: "H",
      display: "N/A",
    } as Coding;
    const tumorMarkerValues = createTumorMarkerValues(undefined, undefined, interpretation, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("NF1-");
  });

  it('Test PALB2+ Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '26144', display: 'N/A' };
    const cgvInterpretation: Coding = {system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'CAR', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, cgvInterpretation);
    expect(tumorMarkerValues[0]).toBe('PALB2+');
  });

  it('Test PALB2- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '26144', display: 'N/A' };
    const cgvInterpretation: Coding = {system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'N', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, cgvInterpretation);
    expect(tumorMarkerValues[0]).toBe('PALB2-');
  });

  it('Test PTEN+ Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '9588', display: 'N/A' };
    const cgvInterpretation: Coding = {system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'A', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, cgvInterpretation);
    expect(tumorMarkerValues[0]).toBe('PTEN+');
  });

  it('Test PTEN- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '9588', display: 'N/A' };
    const cgvInterpretation: Coding = {system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'NEG', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, cgvInterpretation);
    expect(tumorMarkerValues[0]).toBe('PTEN-');
  });

  it('Test STK11+ Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '11389', display: 'N/A' };
    const cgvInterpretation: Coding = {system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'POS', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, cgvInterpretation);
    expect(tumorMarkerValues[0]).toBe('STK11+');
  });

  it('Test STK11- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '11389', display: 'N/A' };
    const cgvVcc: Coding = {system: 'http://loinc.info/sct', code: 'LA9634-2', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('STK11-');
  });

  it('Test P53+ Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '11998', display: 'N/A' };
    const cgvInterpretation: Coding = {system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'POS', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, cgvInterpretation);
    expect(tumorMarkerValues[0]).toBe('P53+');
  });

  it('Test P53- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '11998', display: 'N/A' };
    const cgvVcc: Coding = {system: 'http://loinc.info/sct', code: 'LA9634-2', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('P53-');
  });

  it("Test RB+ Logic 1", () => {
    const coding = {system: "http://loinc.info/sct", code: "42795-5", display: "N/A" } as Coding; // Any code in 'Biomarker-RB'
    const valueQuantity = ({ value: '51', comparator: '>', unit: '%', code: '%' } as Quantity);
    const tumorMarkerValues = createTumorMarkerValues(undefined, valueQuantity, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("RB+");
  });

  it("Test RB+ Logic 2", () => {
    const coding = {system: "http://loinc.info/sct", code: "42795-5", display: "N/A" } as Coding; // Any code in 'Biomarker-RB'
    const valueRatio = {numerator: {value: 6, comparator: '>', unit: '%'}, denominator: {value: 3, comparator: '>', unit: '%'}, metric: '>'} as Ratio
    const tumorMarkerValues = createTumorMarkerValues(valueRatio, undefined, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("RB+");
  });

  it("Test RB- Logic 1", () => {
    const coding = {system: "http://loinc.info/sct", code: "42795-5", display: "N/A" } as Coding; // Any code in 'Biomarker-RB'
    const valueQuantity = ({ value: '49', comparator: '<=', unit: '%', code: '%' } as Quantity);
    const tumorMarkerValues = createTumorMarkerValues(undefined, valueQuantity, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("RB-");
  });

  it("Test RB- Logic 2", () => {
    const coding = {system: "http://loinc.info/sct", code: "42795-5", display: "N/A" } as Coding; // Any code in 'Biomarker-RB'
    const valueRatio = {numerator: {value: 1, comparator: '<', unit: '%'}, denominator: {value: 101, comparator: '<', unit: '%'}, metric: '<'} as Ratio
    const tumorMarkerValues = createTumorMarkerValues(valueRatio, undefined, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("RB-");
  });

  it("Test HER2+ Logic", () => {
    const coding = {system: "http://loinc.info/sct", code: "32996-1", display: "N/A" } as Coding; // Any code in 'Biomarker-HER2'
    const valueQuantity = ({ value: '3+', comparator: '=' } as Quantity);
    const tumorMarkerValues = createTumorMarkerValues(undefined, valueQuantity, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("HER2+");
  });

  it("Test HER2- Logic", () => {
    const coding = {system: "http://loinc.info/sct", code: "32996-1", display: "N/A" } as Coding; // Any code in 'Biomarker-HER2'
    const valueQuantity = ({ value: '2+', comparator: '=' } as Quantity);
    const tumorMarkerValues = createTumorMarkerValues(undefined, valueQuantity, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("HER2-");
  });

  it("Test FGFR+ Logic 1", () => {
    const coding = {system: "http://loinc.info/sct", code: "42785-6", display: "N/A" } as Coding; // Any code in 'Biomarker-FGFR'
    const valueQuantity = ({ value: '1', comparator: '>=', unit: '%', code: '%' } as Quantity);
    const tumorMarkerValues = createTumorMarkerValues(undefined, valueQuantity, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("FGFR+");
  });

  it("Test FGFR+ Logic 2", () => {
    const coding = {system: "http://loinc.info/sct", code: "42785-6", display: "N/A" } as Coding; // Any code in 'Biomarker-FGFR'
    const valueRatio = {numerator: {value: 6, comparator: '>', unit: '%'}, denominator: {value: 3, comparator: '>', unit: '%'}, metric: '>'} as Ratio
    const tumorMarkerValues = createTumorMarkerValues(valueRatio, undefined, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("FGFR+");
  });

  it("Test FGFR- Logic 1", () => {
    const coding = {system: "http://loinc.info/sct", code: "42785-6", display: "N/A" } as Coding; // Any code in 'Biomarker-FGFR'
    const valueQuantity = ({ value: '0.5', comparator: '<', unit: '%', code: '%' } as Quantity);
    const tumorMarkerValues = createTumorMarkerValues(undefined, valueQuantity, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("FGFR-");
  });

  it("Test FGFR- Logic 2", () => {
    const coding = {system: "http://loinc.info/sct", code: "42785-6", display: "N/A" } as Coding; // Any code in 'Biomarker-FGFR'
    const valueRatio = {numerator: {value: 1, comparator: '<', unit: '%'}, denominator: {value: 101, comparator: '<', unit: '%'}, metric: '<'} as Ratio
    const tumorMarkerValues = createTumorMarkerValues(valueRatio, undefined, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("FGFR-");
  });

  it('Test ESR1+ Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '3467', display: 'N/A' };
    const cgvVcc: Coding = {system: 'http://loinc.info/sct', code: 'LA9633-4', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('ESR1+');
  });

  it('Test ESR1- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '3467', display: 'N/A' };
    const cgvVcc: Coding = {system: 'http://loinc.info/sct', code: 'LA9634-2', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('ESR1-');
  });

  it('Test PIK3CA+ Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '8975', display: 'N/A' };
    const cgvVcc: Coding = {system: 'httsnomed/sct', code: '10828004', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('PIK3CA+');
  });

  it('Test PIK3CA- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '8975', display: 'N/A' };
    const cgvVcc: Coding = {system: 'httsnomed/sct', code: '260385009', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('PIK3CA-');
  });

  it("Test PDL1+ Logic", () => {
    const coding = {system: "http://loinc.info/sct", code: "96268-8", display: "N/A"} as Coding;
    const interpretation = {system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'POS', display: 'POS'} as Coding;
    const tumorMarkerValues = createTumorMarkerValues(undefined, undefined, interpretation, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("PDL1+");
  });

  it("Test PDL1- Logic", () => {
    const coding = {system: "http://loinc.info/sct", code: "83052-1", display: "N/A"} as Coding;
    const interpretation = {system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'ND', display: 'ND'} as Coding;
    const tumorMarkerValues = createTumorMarkerValues(undefined, undefined, interpretation, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("PDL1-");
  });

  it('Test NTRK_FUSION+ Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '8031', display: 'N/A' };
    const cgvVcc: Coding = {system: 'httsnomed/sct', code: '10828004', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('NTRK_FUSION+');
  });

  it('Test NTRK_FUSION- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '8031', display: 'N/A' };
    const cgvVcc: Coding = {system: 'httsnomed/sct', code: '260385009', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('NTRK_FUSION-');
  });

  it('Test No-Match Tumor Marker', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: 'XXX', display: 'N/A' };
    const cgvVcc: Coding = {system: 'httsnomed/sct', code: 'XXX', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues.length).toBe(0);
  });

});

describe('checkAgeFilterLogic', () => {
  // Initialize
  const today: Date = new Date("Oct-09-2021");
  const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365;

  const createBirthdateBundle = (birthdate: string): Bundle => {
    const birthdateResource: Bundle = {
      resourceType: "Bundle",
      type: "transaction",
      entry: [
        {
          fullUrl: "urn:uuid:1e208b6b-77f1-4808-a32b-9f9caf1ec334",
          resource: {
            resourceType: "Patient",
            id: "1e208b6b-77f1-4808-a32b-9f9caf1ec334",
            meta: {
              profile: [
                "http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-cancer-patient",
                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-patient"
              ],
              lastUpdated: ""
            },
            gender: "female",
            birthDate: birthdate
            }
          }
        ]
      };
      return birthdateResource;
    };
  

  it('Test Age is over 18 Filter', () => {
    const birthdate = '1950-06-11';
    const mappingLogic = new TrialjectoryMappingLogic(createBirthdateBundle(birthdate));
    const checkDate: Date = new Date(birthdate);
    const millisecondsAge = today.getTime() - checkDate.getTime();
    expect(mappingLogic.getAgeValue()).toBe(Math.floor(millisecondsAge/millisecondsPerYear));
  });

  it('Test Age is under 18 Filter', () => {
    const birthdate = '2020-11-11';
    const mappingLogic = new TrialjectoryMappingLogic(createBirthdateBundle(birthdate));
    const checkDate: Date = new Date(birthdate);
    const millisecondsAge = today.getTime() - checkDate.getTime();
    expect(mappingLogic.getAgeValue()).toBe(Math.floor(millisecondsAge/millisecondsPerYear));
  });
});

describe('checkHistologyMorphologyFilterLogic', () => {

  const createHistologyMorphologyResource = (primaryCoding: Coding, histologyBehavior?: Coding): Bundle => {
    const histologyMorphology: Bundle = {
      resourceType: "Bundle",
      type: "transaction",
      entry: [
        {
          fullUrl: "urn:uuid:4dee068c-5ffe-4977-8677-4ff9b518e763",
          resource: {
            resourceType: "Condition",
            id: "4dee068c-5ffe-4977-8677-4ff9b518e763",
            meta: {
              profile: [
                "http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-primary-cancer-condition",
                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-condition"
              ],
              lastUpdated: ""
            }
          } as Condition
        }
      ]
    };

    if(primaryCoding) {
      histologyMorphology.entry[0].resource.code = {
        coding: [
          primaryCoding
        ],
        text: "Malignant neoplasm of breast (disorder)"
      }
    }

    if(histologyBehavior){
      histologyMorphology.entry[0].resource.extension = [
        {
          url: "http://hl7.org/fhir/us/mcode/ValueSet/mcode-histology-morphology-behavior-vs",
          valueCodeableConcept: {
            coding: [
              histologyBehavior
            ]
          }
        }
      ]
    }

    return histologyMorphology;
  }

  it('Test Invasive Breast Cancer Filter', () => {
    const primaryCoding = { system: 'http://snomed.info/sct', code: '783541009', display: 'N/A' } as Coding;
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '446688004', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(primaryCoding, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('ibc');
  });

  it('Test Invasive Invasive Ductal Carcinoma Filter', () => {
    const primaryCoding = { system: 'http://snomed.info/sct', code: '783541009', display: 'N/A' } as Coding;
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '444134008', display: 'N/A' } as Coding; // Any code in 'Morphology-Invas_Duct_Carc'
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(primaryCoding, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('idc');
  });

  it('Test Invasive Invasive Lobular Carcinoma Filter', () => {
    const primaryCoding = { system: 'http://snomed.info/sct', code: '783541009', display: 'N/A' } as Coding;
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '443757001', display: 'N/A' } as Coding; // Any code in 'Morphology-Invas_Lob_Carc'
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(primaryCoding, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('ilc');
  });

  it('Test Ductal Carcinoma In Situ Filter', () => {
    const primaryCoding = { system: 'http://snomed.info/sct', code: '783541009', display: 'N/A' } as Coding;
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '18680006', display: 'N/A' } as Coding; // Any code in 'Morphology-Invas_Lob_Carc'
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(primaryCoding, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('dcis');
  });

  it('Test Lobular Carcinoma In Situ Filter_1', () => {
    const primaryCoding = { system: 'http://snomed.info/sct', code: '109888004', display: 'N/A' } as Coding; // Any Code in 'lcis-condition'
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(primaryCoding, undefined));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('lcis');
  });

  it('Test Lobular Carcinoma In Situ Filter_2', () => {
    const primaryCoding = { system: 'http://snomed.info/sct', code: '77284006', display: 'N/A' } as Coding;
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '77284006', display: 'N/A' } as Coding; // Any code in 'lcis-histology'
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(primaryCoding, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('lcis');
  });
});

describe('checkSecondaryCancerConditionLogic', () => {

  const secondaryCancerCondition: Coding[] = [];
  secondaryCancerCondition.push({ system: 'http://snomed.info/sct', code: '94222008' } as Coding);
  secondaryCancerCondition.push({ system: 'http://snomed.info/sct', code: '00000000', display: 'Secondary malignant neoplasm of liver (disorder)' } as Coding);
  secondaryCancerCondition.push({ display: 'Secondary malignant neoplasm of chest wall (disorder)' } as Coding);
  secondaryCancerCondition.push({ display: 'Cannot be read' } as Coding);
  const secondaryCancerBundle: Bundle = {
    resourceType: "Bundle",
    type: "transaction",
    entry: [
      {
        fullUrl: "urn:uuid:4dee068c-5ffe-4977-8677-4ff9b518e763",
        resource: {
          resourceType: "Condition",
          id: "4dee068c-5ffe-4977-8677-4ff9b518e763",
          meta: {
            profile: [
              "http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-secondary-cancer-condition",
              "http://hl7.org/fhir/us/core/StructureDefinition/us-core-condition"
            ],
            lastUpdated: ""
          },
          code: {
            coding: secondaryCancerCondition,
            text: "Malignant neoplasm of breast (disorder)"
          }
        }
      }
    ]
  };

  const mappingLogic = new TrialjectoryMappingLogic(secondaryCancerBundle);
  it('is populated', () => {
    expect(mappingLogic.getSecondaryCancerValues()).not.toBeNull();
    expect(mappingLogic.getSecondaryCancerValues()).toHaveSize(3);
  });
  it('uses snomed codes', () => {
    expect(mappingLogic.getSecondaryCancerValues()).toContain("bone");
  });
  it('uses display text if code is not present', () => {
    expect(mappingLogic.getSecondaryCancerValues()).toContain("liver");
  });
  it('uses display text if system and code is not present', () => {
    expect(mappingLogic.getSecondaryCancerValues()).toContain("chest wall");
  });
  it('is null if no Secondary Cancer Conditions', () => {
    const emptyBundle: Bundle = {
      resourceType: "Bundle",
      type: "transaction",
      entry: []
    };
    const mappingLogicNoSecondary = new TrialjectoryMappingLogic(emptyBundle);
    expect(mappingLogicNoSecondary.getSecondaryCancerValues()).toBeNull();
  });
  it('is null if no matches', () => {
    const falseSecondaryCancerCondition: Coding = { system: 'http://snomed.info/sct', code: 'test', display: 'test' } as Coding;
    const falseSecondaryCancerBundle: Bundle = {
      resourceType: "Bundle",
      type: "transaction",
      entry: [
        {
          fullUrl: "urn:uuid:4dee068c-5ffe-4977-8677-4ff9b518e763",
          resource: {
            resourceType: "Condition",
            id: "4dee068c-5ffe-4977-8677-4ff9b518e763",
            meta: {
              profile: [
                "http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-secondary-cancer-condition",
                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-condition"
              ],
              lastUpdated: ""
            },
            code: {
              coding: [falseSecondaryCancerCondition],
              text: "Malignant neoplasm of breast (disorder)"
            }
          }
        }
      ]
    };
    const emptyExtractedMCODE = new TrialjectoryMappingLogic(falseSecondaryCancerBundle)
    expect(emptyExtractedMCODE.getSecondaryCancerValues()).toBeNull();
  });
});

describe('checkRadiationProcedureFilterLogic', () => {

  const createRadiationBundle = (coding: Coding, bodySite: Coding): Bundle => {
    const radiationBundle: Bundle = {
      resourceType: "Bundle",
      type: "transaction",
      entry: [
        {
          fullUrl: "urn:uuid:92df8252-84bd-4cbe-b1dc-f80a9f28d1cc",
          resource: {
            resourceType: "Procedure",
            id: "92df8252-84bd-4cbe-b1dc-f80a9f28d1cc",
            meta: {
              profile: [
                "http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-cancer-related-radiation-procedure",
                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-procedure"
              ],
              lastUpdated: ""
            },
            code: {
              coding: [coding],
            },
            bodySite: [
              {
                coding: [bodySite]
              }
            ],
            reasonReference: [
              {
                "reference": "4dee068c-5ffe-4977-8677-4ff9b518e763",
                "display": "Malignant neoplasm of breast (disorder)"
              }
            ]
          } as Procedure
        }
      ]
    };
    return radiationBundle;
  };

  it('Test WBRT Filter', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '108290001', display: 'N/A' } as Coding);
    const bodySite = ({ system: 'http://snomed.info/sct', code: '12738006', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createRadiationBundle(coding, bodySite));
    expect(mappingLogic.getRadiationProcedureValues().includes('wbrt')).toBeTrue();
  });

  it('Test EBRT Filter', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '33356009', display: 'N/A' } as Coding);
    const bodySite = ({ system: 'http://snomed.info/sct', code: 'test', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createRadiationBundle(coding, bodySite));
    expect(mappingLogic.getRadiationProcedureValues().includes('ebrt')).toBeTrue();
  });

  it('Test ablation Filter', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '228692005', display: 'N/A' } as Coding);
    const bodySite = ({ system: 'http://snomed.info/sct', code: 'test', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createRadiationBundle(coding, bodySite));
    expect(mappingLogic.getRadiationProcedureValues().includes('ablation')).toBeTrue();
  });

  it('Test RFA Filter', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '879916008', display: 'N/A' } as Coding);
    const bodySite = ({ system: 'http://snomed.info/sct', code: 'test', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createRadiationBundle(coding, bodySite));
    expect(mappingLogic.getRadiationProcedureValues().includes('rfa')).toBeTrue();
  });
});

describe('checkSurgicalProcedureFilterLogic', () => {

  const createSurgicalBundle = (coding: Coding, bodySite: Coding): Bundle => {
    const surgicalBundle: Bundle = {
      resourceType: "Bundle",
      type: "transaction",
      entry: [
        {
          fullUrl: "urn:uuid:6a401855-9277-4b01-ac59-48ac734eece6",
          resource: {
            resourceType: "Procedure",
            id: "6a401855-9277-4b01-ac59-48ac734eece6xxx",
            meta: {
              profile: [
                "http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-cancer-related-surgical-procedure",
                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-procedure"
              ],
              lastUpdated: ""
            },
            code: {coding: [coding],},
            bodySite: [{coding: [bodySite]}],
            reasonReference: [
              {
                reference: "4dee068c-5ffe-4977-8677-4ff9b518e763x",
                display: "Secondary Cancer Condition Reference - for tests."
              }
            ]
         } as Procedure
      }
    ]
    };
    return surgicalBundle;
  };

  it('Test Lumpectomy Filter', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '392022002', display: 'N/A' } as Coding);
    const bodySite = ({ system: 'http://snomed.info/sct', code: 'TEST', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, bodySite));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'lumpectomy')).toBeTrue();
  });

  it('Test Mastectomy Filter', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '429400009', display: 'N/A' } as Coding);
    const bodySite = ({ system: 'http://snomed.info/sct', code: 'TEST', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, bodySite));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'mastectomy')).toBeTrue();
  });

  it('Test ALND Filter 1', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '234262008', display: 'N/A' } as Coding);
    const bodySite = ({ system: 'http://snomed.info/sct', code: 'TEST', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, bodySite));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'alnd')).toBeTrue();
  });

  it('Test ALND Filter 1', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '122459003', display: 'N/A' } as Coding);
    const bodySite = ({ system: 'http://snomed.info/sct', code: '746224000', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, bodySite));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'alnd')).toBeTrue();
  });


  it('Test Reconstruction Filter 1', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '302342002', display: 'N/A' } as Coding);
    const bodySite = ({ system: 'http://snomed.info/sct', code: 'TEST', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, bodySite));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'reconstruction')).toBeTrue();
  });

  it('Test Metastasis Resection Filter 1', () => {
    const reasonReferenceBundle: Bundle = {
      resourceType: "Bundle",
      type: "transaction",
      entry: [
        {
          fullUrl: "urn:uuid:6a401855-9277-4b01-ac59-48ac734eece6",
          resource: {
            resourceType: "Procedure",
            id: "6a401855-9277-4b01-ac59-48ac734eece6xxx",
            meta: {
              profile: [
                "http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-cancer-related-surgical-procedure",
                "http://hl7.org/fhir/us/core/StructureDefinition/us-core-procedure"
              ],
              lastUpdated: ""
            },
            status: "completed",
            code: {coding: []},
            bodySite: [{coding: []}],
            reasonReference: [
              {
                reference: "TEST-SEC",
                display: "Secondary Cancer Condition Reference - for tests."
              }
            ]
         } as Procedure
      },
      {
        fullUrl: "urn:uuid:4dee068c-5ffe-4977-8677-4ff9b518e763",
        resource: {
          resourceType: "Condition",
          id: "TEST-SEC",
          meta: {
            profile: [
              "http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-secondary-cancer-condition",
              "http://hl7.org/fhir/us/core/StructureDefinition/us-core-condition"
            ],
            lastUpdated: ""
          },
          code: {
            coding: {},
            text: "Malignant neoplasm of breast (disorder)"
          }
        } as Condition
      }
    ]
    };
    const mappingLogic = new TrialjectoryMappingLogic(reasonReferenceBundle);
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'metastasis_resection')).toBeTrue();
  });
});
