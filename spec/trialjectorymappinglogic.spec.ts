import { Quantity, Ratio } from "clinical-trial-matching-service";
import {
  Bundle,
  BundleEntry,
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

const createPrimaryCancerResource = (
  primaryCoding: Coding,
  histologyBehavior: Coding,
  clinicalStatus: Coding,
  tnmClinical: Coding,
  tnmPathological: Coding
): Bundle => {
  const primaryCancerBundle: Bundle = {
    resourceType: 'Bundle',
    type: 'transaction',
    entry: [
      {
        fullUrl: 'urn:uuid:4dee068c-5ffe-4977-8677-4ff9b518e763',
        resource: {
          resourceType: 'Condition',
          id: '4dee068c-5ffe-4977-8677-4ff9b518e763',
          meta: {
            profile: [
              'http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-primary-cancer-condition',
              'http://hl7.org/fhir/us/core/StructureDefinition/us-core-condition'
            ],
            lastUpdated: ''
          }
        } as Condition
      }
    ]
  };

  if (primaryCoding) {
    primaryCancerBundle.entry[0].resource.code = {
      coding: [primaryCoding],
      text: 'Malignant neoplasm of breast (disorder)'
    };
  }

  if (histologyBehavior) {
    primaryCancerBundle.entry[0].resource.extension = [
      {
        url: 'http://hl7.org/fhir/us/mcode/ValueSet/mcode-histology-morphology-behavior-vs',
        valueCodeableConcept: {
          coding: [histologyBehavior]
        }
      }
    ];
  }

  if (clinicalStatus) {
    (primaryCancerBundle.entry[0].resource as Condition).clinicalStatus = {
      coding: [clinicalStatus]
    };
  }

  if (tnmClinical) {
    const tnmClinicalResource: BundleEntry = {
      resource: ({
        resourceType: 'Observation',
        meta: {
          profile: ['http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-tnm-clinical-stage-group']
        },
        valueCodeableConcept: {
          coding: tnmClinical
        }
      } as unknown) as Resource
    };
    primaryCancerBundle.entry.push(tnmClinicalResource);
  }

  if (tnmPathological) {
    const tnmPathologicalResource: BundleEntry = {
      resource: ({
        resourceType: 'Observation',
        meta: {
          profile: ['http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-tnm-pathological-stage-group']
        },
        valueCodeableConcept: {
          coding: tnmPathological
        }
      } as unknown) as Resource
    };
    primaryCancerBundle.entry.push(tnmPathologicalResource);
  }

  return primaryCancerBundle;
};

describe('Check Primary Cancer Logic', () => {
  const createPrimaryCancerValues = (
    primaryCoding: Coding,
    histologyBehavior: Coding,
    clinicalStatus: Coding,
    tnmClinical: Coding,
    tnmPathological: Coding
  ): string => {
    const mappingLogic = new TrialjectoryMappingLogic(
      createPrimaryCancerResource(primaryCoding, histologyBehavior, clinicalStatus, tnmClinical, tnmPathological)
    );
    return mappingLogic.getPrimaryCancerValues();
  };

  it('Test Malignant neoplasm of colon and/or rectum (disorder) - Colorectal', () => {
    const coding = { system: 'http://snomed.info/sct', code: '781382000', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Malignant neoplasm of colon and/or rectum (disorder)'
    );
  });
  it('Test Microsatellite instability-high colorectal cancer - Colorectal', () => {
    const coding = { system: 'http://snomed.info/sct', code: '737058005', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Microsatellite instability-high colorectal cancer'
    );
  });
  it('Test Hereditary nonpolyposis colon cancer - Colorectal', () => {
    const coding = { system: 'http://snomed.info/sct', code: '315058005', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Hereditary nonpolyposis colon cancer'
    );
  });

  it('Test Adenocarcinoma of lung (disorder) - Lung', () => {
    const coding = { system: 'http://snomed.info/sct', code: '254626006', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Adenocarcinoma of lung (disorder)'
    );
  });
  it('Test Adenocarcinoma of left lung (disorder) - Lung', () => {
    const coding = { system: 'http://snomed.info/sct', code: '15956341000119105', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Adenocarcinoma of left lung (disorder)'
    );
  });
  it('Test Adenocarcinoma of right lung (disorder) - Lung', () => {
    const coding = { system: 'http://snomed.info/sct', code: '15956381000119100', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Adenocarcinoma of right lung (disorder)'
    );
  });
  it('Test Primary adenocarcinoma of lung (disorder) - Lung', () => {
    const coding = { system: 'http://snomed.info/sct', code: '707451005', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Primary adenocarcinoma of lung (disorder)'
    );
  });
  it('Test Squamous cell carcinoma of lung (disorder) - Lung', () => {
    const coding = { system: 'http://snomed.info/sct', code: '254634000', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Squamous cell carcinoma of lung (disorder)'
    );
  });
  it('Test Squamous cell carcinoma of left lung (disorder) - Lung', () => {
    const coding = { system: 'http://snomed.info/sct', code: '12240951000119107', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Squamous cell carcinoma of left lung (disorder)'
    );
  });
  it('Test Squamous cell carcinoma of right lung (disorder) - Lung', () => {
    const coding = { system: 'http://snomed.info/sct', code: '12240991000119102', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Squamous cell carcinoma of right lung (disorder)'
    );
  });
  it('Test Large cell carcinoma of lung (disorder) - Lung', () => {
    const coding = { system: 'http://snomed.info/sct', code: '254629004', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Large cell carcinoma of lung (disorder)'
    );
  });
  it('Test Small cell carcinoma of lung (disorder) - Lung', () => {
    const coding = { system: 'http://snomed.info/sct', code: '254632001', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Small cell carcinoma of lung (disorder)'
    );
  });
  it('Test Primary malignant neoplasm of lung (disorder) - Lung', () => {
    const coding = { system: 'http://snomed.info/sct', code: '93880001', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Primary malignant neoplasm of lung (disorder)'
    );
  });
  it('Test Malignant tumor of lung (disorder) - Lung', () => {
    const coding = { system: 'http://snomed.info/sct', code: '363358000', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Malignant tumor of lung (disorder)'
    );
  });

  it('Test Malignant melanoma (disorder) - Melanoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '372244006', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Malignant melanoma (disorder)'
    );
  });
  it('Test Lentigo maligna melanoma (disorder) - Melanoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '302837001', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Lentigo maligna melanoma (disorder)'
    );
  });
  it('Test Desmoplastic malignant melanoma (disorder) - Melanoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '403924008', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Desmoplastic malignant melanoma (disorder)'
    );
  });
  it('Test Spindle cell malignant melanoma (disorder) - Melanoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '403923002', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Spindle cell malignant melanoma (disorder)'
    );
  });
  it('Test Amelanotic malignant melanoma of skin (disorder) - Melanoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '276751004', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Amelanotic malignant melanoma of skin (disorder)'
    );
  });

  it('Test Polycythemia vera (disorder) - Melanoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '109992005', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Polycythemia vera (disorder)'
    );
  });
  it('Test Myelosclerosis with myeloid metaplasia (disorder) - Melanoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '307651005', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Myelosclerosis with myeloid metaplasia (disorder)'
    );
  });
  it('Test Essential thrombocythemia (disorder) - Melanoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '109994006', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Essential thrombocythemia (disorder)'
    );
  });
  it('Test Chronic neutrophilic leukemia (disorder) - Melanoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '188734009', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Chronic neutrophilic leukemia (disorder)'
    );
  });
  it('Test Chronic eosinophilic leukemia (disorder) - Melanoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '188733003', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Chronic eosinophilic leukemia (disorder)'
    );
  });

  it('Test Multiple myeloma (disorder) - Multiple Myeloma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '109989006', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Multiple myeloma (disorder)'
    );
  });

  it("Test Non-Hodgkin's lymphoma (disorder) - Non-Hodgkin Lymphoma", () => {
    const coding = { system: 'http://snomed.info/sct', code: '118601006', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      "Non-Hodgkin's lymphoma (disorder)"
    );
  });
  it('Test Primary mediastinal (thymic) large B-cell lymphoma (disorder) - Non-Hodgkin Lymphoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '444910004', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Primary mediastinal (thymic) large B-cell lymphoma (disorder)'
    );
  });
  it("Test Follicular non-Hodgkin's lymphoma (disorder) - Non-Hodgkin Lymphoma", () => {
    const coding = { system: 'http://snomed.info/sct', code: '308121000', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      "Follicular non-Hodgkin's lymphoma (disorder)"
    );
  });
  it('Test Chronic lymphoid leukemia, disease (disorder) - Non-Hodgkin Lymphoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '92814006', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Chronic lymphoid leukemia, disease (disorder)'
    );
  });
  it('Test T-cell chronic lymphocytic leukemia (disorder) - Non-Hodgkin Lymphoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '277545003', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'T-cell chronic lymphocytic leukemia (disorder)'
    );
  });
  it('Test B-cell chronic lymphocytic leukemia (disorder) - Non-Hodgkin Lymphoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '277473004', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'B-cell chronic lymphocytic leukemia (disorder)'
    );
  });
  it('Test Mantle cell lymphoma (disorder) - Non-Hodgkin Lymphoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '443487006', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Mantle cell lymphoma (disorder)'
    );
  });
  it('Test Mucosa-associated lymphoma (disorder) - Non-Hodgkin Lymphoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '277622004', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Mucosa-associated lymphoma (disorder)'
    );
  });
  it('Test Nodal marginal zone B-cell lymphoma (disorder) - Non-Hodgkin Lymphoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '726721002', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Nodal marginal zone B-cell lymphoma (disorder)'
    );
  });
  it('Test Splenic marginal zone B-cell lymphoma (disorder) - Non-Hodgkin Lymphoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '763666008', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Splenic marginal zone B-cell lymphoma (disorder)'
    );
  });
  it('Test Malignant lymphoma - lymphoplasmacytic (disorder) - Non-Hodgkin Lymphoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '307623001', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Malignant lymphoma - lymphoplasmacytic (disorder)'
    );
  }); it('Test Hairy cell leukemia (disorder) - Non-Hodgkin Lymphoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '118613001', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Hairy cell leukemia (disorder)'
    );
  });
  it('Test Microglioma (disorder) - Non-Hodgkin Lymphoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '307649006', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Microglioma (disorder)'
    );
  });
  it('Test Intraocular non-Hodgkin malignant lymphoma (disorder) - Non-Hodgkin Lymphoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '420788006', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Intraocular non-Hodgkin malignant lymphoma (disorder)'
    );
  });
  it('Test Primary cutaneous T-cell lymphoma (disorder) - Non-Hodgkin Lymphoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '400122007', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Primary cutaneous T-cell lymphoma (disorder)'
    );
  });
  it('Test Adult T-cell leukemia/lymphoma (disorder) - Non-Hodgkin Lymphoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '110007008', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Adult T-cell leukemia/lymphoma (disorder)'
    );
  });
  it('Test Angioimmunoblastic T-cell lymphoma (disorder) - Non-Hodgkin Lymphoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '413537009', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Angioimmunoblastic T-cell lymphoma (disorder)'
    );
  });
  it('Test Extranodal natural killer/T-cell lymphoma, nasal type (disorder) - Non-Hodgkin Lymphoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '414166008', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Extranodal natural killer/T-cell lymphoma, nasal type (disorder)'
    );
  });
  it('Test Enteropathy-associated T-cell lymphoma (disorder) - Non-Hodgkin Lymphoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '277654008', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Enteropathy-associated T-cell lymphoma (disorder)'
    );
  });
  it('Test Large cell anaplastic lymphoma (disorder) - Non-Hodgkin Lymphoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '277637000', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Large cell anaplastic lymphoma (disorder)'
    );
  });
  it('Test Primary cutaneous anaplastic large cell lymphoma (disorder) - Non-Hodgkin Lymphoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '773995001', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Primary cutaneous anaplastic large cell lymphoma (disorder)'
    );
  });
  it('Test Anaplastic large T-cell systemic malignant lymphoma (disorder) - Non-Hodgkin Lymphoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '404134006', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Anaplastic large T-cell systemic malignant lymphoma (disorder)'
    );
  });
  it('Test Breast implant associated anaplastic large-cell lymphoma (disorder) - Non-Hodgkin Lymphoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '783541009', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Breast implant associated anaplastic large-cell lymphoma (disorder)'
    );
  });
  it('Test Peripheral T-cell lymphoma (disorder) - Non-Hodgkin Lymphoma', () => {
    const coding = { system: 'http://snomed.info/sct', code: '109977009', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Peripheral T-cell lymphoma (disorder)'
    );
  });

  it('Test Primary malignant neoplasm of brain (disorder) - Brain', () => {
    const coding = { system: 'http://snomed.info/sct', code: '93727008', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Primary malignant neoplasm of brain (disorder)'
    );
  });
  it('Test Malignant neoplasm of brain (disorder) - Brain', () => {
    const coding = { system: 'http://snomed.info/sct', code: '428061005', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Malignant neoplasm of brain (disorder)'
    );
  });
  it('Test Astrocytoma of brain (disorder) - Brain', () => {
    const coding = { system: 'http://snomed.info/sct', code: '254938000', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Astrocytoma of brain (disorder)'
    );
  });
  it('Test Oligodendroglioma (disorder) - Brain', () => {
    const coding = { system: 'http://snomed.info/sct', code: '443936004', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Oligodendroglioma (disorder)'
    );
  });
  it('Test Oligodendroglioma of brain (disorder) - Brain', () => {
    const coding = { system: 'http://snomed.info/sct', code: '254940005', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Oligodendroglioma of brain (disorder)'
    );
  });
  it('Test Glioblastoma multiforme of brain - Brain', () => {
    const coding = { system: 'http://snomed.info/sct', code: '276828006', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Glioblastoma multiforme of brain'
    );
  });
  it('Test Anaplastic astrocytoma of brain (disorder) - Brain', () => {
    const coding = { system: 'http://snomed.info/sct', code: '277461004', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Anaplastic astrocytoma of brain (disorder)'
    );
  });
  it('Test Medulloblastoma (disorder) - Brain', () => {
    const coding = { system: 'http://snomed.info/sct', code: '443333004', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Medulloblastoma (disorder)'
    );
  });
  it('Test Anaplastic ganglioglioma (disorder) - Brain', () => {
    const coding = { system: 'http://snomed.info/sct', code: '1157071000', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Anaplastic ganglioglioma (disorder)'
    );
  });
  it('Test Malignant peripheral nerve sheath tumor (disorder) - Brain', () => {
    const coding = { system: 'http://snomed.info/sct', code: '404037002', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Malignant peripheral nerve sheath tumor (disorder)'
    );
  });

  it('Test Malignant neoplasm of uterus (disorder) - Uterine', () => {
    const coding = { system: 'http://snomed.info/sct', code: '371973000', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Malignant neoplasm of uterus (disorder)'
    );
  });
  it('Test Sarcoma of uterus (disorder) - Uterine', () => {
    const coding = { system: 'http://snomed.info/sct', code: '254877001', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Sarcoma of uterus (disorder)'
    );
  });
  it('Test Adenocarcinoma of uterus (disorder) - Uterine', () => {
    const coding = { system: 'http://snomed.info/sct', code: '309245001', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Adenocarcinoma of uterus (disorder)'
    );
  });
  it('Test Carcinosarcoma of uterus (disorder) - Uterine', () => {
    const coding = { system: 'http://snomed.info/sct', code: '702369008', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Carcinosarcoma of uterus (disorder)'
    );
  });
  it('Test Squamous cell carcinoma (disorder) - Uterine', () => {
    const coding = { system: 'http://snomed.info/sct', code: '402815007', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Squamous cell carcinoma (disorder)'
    );
  });
  it('Test Endometrial stromal sarcoma (disorder) - Uterine', () => {
    const coding = { system: 'http://snomed.info/sct', code: '699356008', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Endometrial stromal sarcoma (disorder)'
    );
  });

  it('Test Primary malignant neoplasm of prostate (disorder) - Prostate', () => {
    const coding = { system: 'http://snomed.info/sct', code: '93974005', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Primary malignant neoplasm of prostate (disorder)'
    );
  });
  it('Test Malignant tumor of prostate (disorder) - Prostate', () => {
    const coding = { system: 'http://snomed.info/sct', code: '399068003', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Malignant tumor of prostate (disorder)'
    );
  });
  it('Test Small cell carcinoma of prostate (disorder) - Prostate', () => {
    const coding = { system: 'http://snomed.info/sct', code: '396198006', display: 'N/A' } as Coding;
    expect(createPrimaryCancerValues(coding, undefined, undefined, undefined, undefined)).toBe(
      'Small cell carcinoma of prostate (disorder)'
    );
  });

});

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

  it("Test medication 5-Fluorouracil - Colorectal", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "224945", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("5-Fluorouracil");
  });
  it("Test medication Xeloda - Colorectal", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "220961", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("Xeloda");
  });
  it("Test medication Camptosar - Colorectal", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1172305", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("Camptosar");
  });
  it("Test medication Eloxatin - Colorectal", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "32592", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Eloxatin");
  });
  it("Test medication Lonsurf - Colorectal", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1670311", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Lonsurf");
  });
  it("Test medication avastin - Colorectal", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "337521", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("avastin");
  });
  it("Test medication Cyramza - Colorectal", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1535996", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Cyramza");
  });

  it("Test medication Zaltrap - Colorectal", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1304483", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Zaltrap");
  });

  it("Test medication Erbitux - Colorectal", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "355460", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Erbitux");
  });

  it("Test medication Vectibix - Colorectal", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1187748", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Vectibix");
  });
  it("Test medication Braftovi - Colorectal", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2049112", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Braftovi");
  });
  it("Test medication Keytruda - Colorectal", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1547553", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("Keytruda");
  });
  it("Test medication Opdivo - Colorectal", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2569081", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("opdivo");
  });
  it("Test medication Yervoy - Colorectal", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1094837", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Yervoy");
  });

  it("Test Carboplatin - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "152200", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("carboplatin");
  });
  it("Test Cisplatin  - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1736852", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("cisplatin");
  });
  it("Test PAClitaxel - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "583218", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("paclitaxel");
  });
  it("Test Abraxane - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1165953", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("abraxane");
  });
  it("Test Docetaxel - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1001406", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("docetaxel");
  });
  it("Test Gemcitabine - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "12574", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("gemcitabine");
  });
  it("Test Vinorelbine - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "53557", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("vinorelbine");
  });
  it("Test Etoposide - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1157929", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("etoposide");
  });
  it("Test Pemetrexed - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1175526", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("pemetrexed");
  });
  it("Test avastin - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "337521", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("avastin");
  });
  it("Test Cyramza - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1657776", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Cyramza");
  });
  it("Test Sotorasib - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2550723", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Sotorasib");
  });
  it("Test Erlotinib - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "337526", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Erlotinib");
  });
  it("Test Afatinib - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1430272", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Afatinib");
  });
  it("Test Gefitinib - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "402435", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Gefitinib");
  });
  it("Test Osimertinib - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1721566", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Osimertinib");
  });
  it("Test Dacomitinib - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2058930", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Dacomitinib");
  });
  it("Test Mobocertinib - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2570743", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Mobocertinib");
  });
  it("Test Necitumumab - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1723746", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Necitumumab");
  });
  it("Test Crizotinib - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1186299", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Crizotinib");
  });
  it("Test Ceritinib - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1535468", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Ceritinib");
  });
  it("Test Alectinib - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1727480", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Alectinib");
  });
  it("Test Brigatinib - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1988786", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Brigatinib");
  });
  it("Test Lorlatinib - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2103173", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Lorlatinib");
  });
  it("Test Entrectinib - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2197877", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Entrectinib");
  });
  it("Test Dabrafenib - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1425223", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Dabrafenib");
  });
  it("Test Trametinib - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1425109", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Trametinib");
  });
  it("Test Selpercatinib - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2370169", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Selpercatinib");
  });
  it("Test Pralsetinib - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2394945", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Pralsetinib");
  });
  it("Test Capmatinib - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2362235", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Capmatinib");
  });
  it("Test Tepotinib - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2477264", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Tepotinib");
  });
  it("Test Larotrectinib - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2105652", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Larotrectinib");
  });
  it("Test Cemiplimab - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2058826", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Cemiplimab");
  });
  it("Test Atezolizumab - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1792779", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("atezolizumab");
  });
  it("Test Durvalumab - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1919512", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Durvalumab");
  });
  it("Test Yervoy - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1094833", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Yervoy");
  });
  it("Test Camptosar - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1726333", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("Camptosar");
  });
  it("Test Lurbinectedin - Lung", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2374729", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Lurbinectedin");
  });

  it("Test Keytruda - Melanoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1657751", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("Keytruda");
  });
  it("Test Opdivo - Melanoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1597884", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("opdivo");
  });
  it("Test Atezolizumab - Melanoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1792784", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("atezolizumab");
  });
  it("Test Cobimetinib - Melanoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1722371", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Cobimetinib");
  });
  it("Test vemurafenib - Melanoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1147224", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("vemurafenib");
  });
  it("Test Yervoy - Melanoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1186646", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Yervoy");
  });
  it("Test imlygic - Melanoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1721282", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("imlygic");
  });
  it("Test imiquimod - Melanoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "215085", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("imiquimod");
  });
  it("Test Dabrafenib - Melanoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1425227", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Dabrafenib");
  });
  it("Test Braftovi - Melanoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2049109", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Braftovi");
  });
  it("Test Trametinib - Melanoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1425107", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Trametinib");
  });
  it("Test binimetinib - Melanoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2049122", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("binimetinib");
  });
  it("Test imatinib - Melanoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "282388", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("imatinib");
  });
  it("Test nilotinib - Melanoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1179058", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("nilotinib");
  });
  it("Test dacarbazine - Melanoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "3098", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("dacarbazine");
  });
  it("Test temozolomide - Melanoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1181415", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("temozolomide");
  });
  it("Test Cisplatin - Melanoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2555", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("cisplatin");
  });
  it("Test Carboplatin - Melanoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1182364", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("carboplatin");
  });

  it("Test adriamycin - MPN", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "42512", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("adriamycin");
  });
  it("Test arsenic trioxide - MPN", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1992545", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("arsenic trioxide");
  });
  it("Test azaCITIDine - MPN", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "545203", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("azaCITIDine");
  });
  it("Test DAUNOrubicin hydrochloride - MPN", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "3109", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("DAUNOrubicin hydrochloride");
  });
  it("Test cyclophosphamide - MPN", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "315747", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("cyclophosphamide");
  });
  it("Test cytarabine - MPN", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1942747", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("cytarabine");
  });
  it("Test Dacogen - MPN", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "636242", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Dacogen");
  });
  it("Test dasatinib - MPN", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "643171", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("dasatinib");
  });
  it("Test cedazuridine - MPN", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2384459", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("cedazuridine");
  });
  it("Test fedratinib hydrochloride - MPN", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2197594", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("fedratinib hydrochloride");
  });
  it("Test imatinib - MPN", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1171231", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("imatinib");
  });
  it("Test jakafi - MPN", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1193332", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("jakafi");
  });
  it("Test nilotinib - MPN", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "735866", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("nilotinib");
  });

  it("Test cyclophosphamide - Multiple Myeloma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "3002", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("cyclophosphamide");
  });
  it("Test Etoposide - Multiple Myeloma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "310248", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("etoposide");
  });
  it("Test adriamycin - Multiple Myeloma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1799304", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("adriamycin");
  });
  it("Test Melphalan - Multiple Myeloma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "151325", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Melphalan");
  });
  it("Test Bendamustine - Multiple Myeloma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "741098", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Bendamustine");
  });
  it("Test thalidomide - Multiple Myeloma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1184930", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("thalidomide");
  });
  it("Test lenalidomide - Multiple Myeloma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "337535", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("lenalidomide");
  });
  it("Test Pomalidomide - Multiple Myeloma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1369723", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Pomalidomide");
  });
  it("Test Bortezomib - Multiple Myeloma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "356733", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Bortezomib");
  });
  it("Test Carfilzomib - Multiple Myeloma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1302974", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Carfilzomib");
  });
  it("Test Ixazomib - Multiple Myeloma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1723758", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Ixazomib");
  });
  it("Test Daratumumab - Multiple Myeloma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1721952", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Daratumumab");
  });
  it("Test Isatuximab - Multiple Myeloma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2282022", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Isatuximab");
  });
  it("Test Elotuzumab - Multiple Myeloma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1726111", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Elotuzumab");
  });
  it("Test Blenrep - Multiple Myeloma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2387834", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Blenrep");
  });
  it("Test Selinexor - Multiple Myeloma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2548742", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Selinexor");
  });
  it("Test Idecabtagene vicleucel - Multiple Myeloma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2536438", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Idecabtagene vicleucel");
  });

  it("Test cyclophosphamide - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "3002", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("cyclophosphamide");
  });
  it("Test chlorambucil - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1166067", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("chlorambucil");
  });
  it("Test Bendamustine - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1805002", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Bendamustine");
  });
  it("Test Ifosfamide - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "352384", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("ifosfamide");
  });
  it("Test Carboplatin - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "597195", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("carboplatin");
  });
  it("Test Eloxatin - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1736775", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Eloxatin");
  });
  it("Test Fludarabine - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "828705", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Fludarabine");
  });
  it("Test Pentostatin - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "240573", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Pentostatin");
  });
  it("Test cladribine - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2122650", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("cladribine");
  });
  it("Test cytarabine - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1942744", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("cytarabine");
  });
  it("Test Gemcitabine - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1167718", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("gemcitabine");
  });
  it("Test Methotrexate - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1921596", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("methotrexate");
  });
  it("Test PRALAtrexate - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "865180", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("PRALAtrexate");
  });
  it("Test adriamycin - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1790095", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("adriamycin");
  });
  it("Test Vincristine - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1304990", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Vincristine");
  });
  it("Test Mitoxantrone - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1165375", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Mitoxantrone");
  });
  it("Test Etoposide - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1178005", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("etoposide");
  });
  it("Test Bleomycin - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1622", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Bleomycin");
  });
  it("Test riTUXimab - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2105831", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("riTUXimab");
  });
  it("Test obinutuzumab - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1442697", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("obinutuzumab");
  });
  it("Test ofatumumab - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2390953", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("ofatumumab");
  });
  it("Test ibritumomab tiuxetan - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "262323", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("ibritumomab tiuxetan");
  });
  it("Test Tafasitamab - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2387339", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Tafasitamab");
  });
  it("Test loncastuximab tesirine-lpyl - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2540968", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("loncastuximab tesirine-lpyl");
  });
  it("Test alemtuzumab - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "284679", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("alemtuzumab");
  });
  it("Test brentuximab vedotin - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1170611", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("brentuximab vedotin");
  });
  it("Test polatuzumab vedotin - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2174090", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("polatuzumab vedotin");
  });
  it("Test thalidomide - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "374072", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("thalidomide");
  });
  it("Test lenalidomide - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "337535", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("lenalidomide");
  });
  it("Test axicabtagene ciloleucel - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1987403", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("axicabtagene ciloleucel");
  });
  it("Test Tisagenlecleucel - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2044973", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Tisagenlecleucel");
  });
  it("Test Lisocabtagene Maraleucel - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2479143", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Lisocabtagene Maraleucel");
  });
  it("Test brexucabtagene autoleucel - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2387277", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("brexucabtagene autoleucel");
  });
  it("Test Bortezomib - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1187756", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Bortezomib");
  });
  it("Test belinostat - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1543547", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("belinostat");
  });
  it("Test ibrutinib - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1442991", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("ibrutinib");
  });
  it("Test Calquence - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1986814", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Calquence");
  });
  it("Test zanubrutinib - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2262445", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("zanubrutinib");
  });
  it("Test idelalisib - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1544468", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("idelalisib");
  });
  it("Test Copanlisib - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1945085", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Copanlisib");
  });
  it("Test Duvelisib - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2058524", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Duvelisib");
  });
  it("Test umbralisib - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2478445", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("umbralisib");
  });
  it("Test tazemetostat - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2274378", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("tazemetostat");
  });
  it("Test Selinexor - Non-Hodgkin Lymphoma", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2178401", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Selinexor");
  });

  it("Test Avastin - Brain", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "544556", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("avastin");
  });
  it("Test everolimus - Brain", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "141704", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("everolimus");
  });
  it("Test Carboplatin - Brain", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "378363", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("carboplatin");
  });
  it("Test Carmustine - Brain", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "378774", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Carmustine");
  });
  it("Test Cisplatin - Brain", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "376433", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("cisplatin");
  });
  it("Test cyclophosphamide - Brain", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1156183", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("cyclophosphamide");
  });
  it("Test Etoposide - Brain", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "372132", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("etoposide");
  });
  it("Test Camptosar - Brain", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1161334", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("Camptosar");
  });
  it("Test Lomustine - Brain", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "316162", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Lomustine");
  });
  it("Test Methotrexate - Brain", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1544398", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("methotrexate");
  });
  it("Test Procarbazine - Brain", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1161733", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Procarbazine");
  });
  it("Test temozolomide - Brain", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "317160", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("temozolomide");
  });
  it("Test Vincristine - Brain", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1186612", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Vincristine");
  });
 
  it("Test PAClitaxel - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "589511", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("paclitaxel");
  });
  it("Test Carboplatin - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1182364", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("carboplatin");
  });
  it("Test adriamycin - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1799307", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("adriamycin");
  });
  it("Test Cisplatin - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1152129", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("cisplatin");
  });
  it("Test Docetaxel - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1180259", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("docetaxel");
  });
  it("Test tamoxifen - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "281964", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("tamoxifen");
  });
  it("Test Provera - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1000114", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("Provera");
  });
  it("Test Megace - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "203000", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("Megace");
  });
  it("Test Goserelin - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "105641", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Goserelin");
  });
  it("Test Lupron - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "825334", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Lupron");
  });
  it("Test Femara - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "153124", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("Femara");
  });
  it("Test Arimidex - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "367866", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("Arimidex");
  });
  it("Test Exemestane - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "330333", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("exemestane");
  });
  it("Test Lenvima - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1604346", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Lenvima");
  });
  it("Test Avastin - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1161185", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("avastin");
  });
  it("Test everolimus - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1310137", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("everolimus");
  });
  it("Test temsirolimus - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "723805", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("temsirolimus");
  });
  it("Test Keytruda - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1547550", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("Keytruda");
  });
  it("Test Jemperli - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2539976", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Jemperli");
  });
  it("Test dacarbazine - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "3098", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("dacarbazine");
  });
  it("Test Docetaxel - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1860481", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("docetaxel");
  });
  it("Test adriamycin - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1799310", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("adriamycin");
  });
  it("Test Ellence - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "203766", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("Ellence");
  });
  it("Test Gemcitabine - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2058859", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("gemcitabine");
  });
  it("Test Ifosfamide - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1791593", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("ifosfamide");
  });
  it("Test PAClitaxel - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1663181", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("paclitaxel");
  });
  it("Test temozolomide - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "261289", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("temozolomide");
  });
  it("Test Yondelis - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1718592", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Yondelis");
  });
  it("Test Vinorelbine - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1729404", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("vinorelbine");
  });
  it("Test PAZOPanib - Uterine", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1187596", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("PAZOPanib");
  });

  it("Test Lupron - Prostate", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "825333", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Lupron");
  });
  it("Test Goserelin - Prostate", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "564142", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Goserelin");
  });
  it("Test Trelstar - Prostate", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "905054", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Trelstar");
  });
  it("Test degarelix - Prostate", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1169000", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("degarelix");
  });
  it("Test relugolix - Prostate", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2472781", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("relugolix");
  });
  it("Test Zytiga - Prostate", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1100079", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Zytiga");
  });
  it("Test Nizoral - Prostate", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1296820", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Nizoral");
  });
  it("Test Flutamide - Prostate", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1161459", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Flutamide");
  });
  it("Test bicalutamide - Prostate", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "371070", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("bicalutamide");
  });
  it("Test Nilandron - Prostate", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "218741", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Nilandron");
  });
  it("Test enzalutamide - Prostate", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1307304", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("enzalutamide");
  });
  it("Test apalutamide - Prostate", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1999582", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("apalutamide");
  });
  it("Test darolutamide - Prostate", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "2180335", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("darolutamide");
  });
  it("Test Docetaxel - Prostate", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1101770", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("docetaxel");
  });
  it("Test Jevtana - Prostate", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1167866", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Jevtana");
  });
  it("Test Mitoxantrone - Prostate", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "7005", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("Mitoxantrone");
  });
  it("Test Keytruda - Prostate", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1547545", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications).toContain("Keytruda");
  });
  it("Test rucaparib - Prostate", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1862589", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("rucaparib");
  });
  it("Test olaparib - Prostate", () => {
    const coding: Coding[] = [{system: "RxNorm", code: "1597592", display: "N/A"}];
    const medications = createMedicationsToTest(...coding);
    expect(medications[0]).toBe("olaparib");
  });

  it("Test 8 medications together with one duplicate (372571)", () => {
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
    expect(medications.length).toBe(8);
    expect(medications).toContain("letrozole");
    expect(medications).toContain("lapatinib");
    expect(medications).toContain("tucatinib");
    expect(medications).toContain("topotecan");
    expect(medications).toContain("palbociclib");
    expect(medications).toContain("abemaciclib");
    expect(medications).toContain("alpelisib");
    expect(medications).toContain("Femara");
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

describe("Test Tumor Marker and Biomarker Logic", () => {

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

  it("Test er+ Logic 1", () => {
    const coding = {
      system: "http://loinc.info/sct",
      code: "16112-5",
      display: "N/A",
    } as Coding; // Any code in 'Biomarker-er'
    const interpretation = {
      system: "http://hl7.org/fhir/R4/valueset-observation-interpretation.html",
      code: "H",
      display: "N/A",
    } as Coding;
    const tumorMarkerValues = createTumorMarkerValues(undefined, undefined, interpretation, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("er+");
  });

  it("Test er+ Logic 2", () => {
    const coding = {
      system: "http://loinc.info/sct",
      code: "16112-5",
      display: "N/A",
    } as Coding; // Any code in 'Biomarker-er'
    const valueratio = {
      numerator: { value: 6, comparator: ">", unit: "%" },
      denominator: { value: 3, comparator: ">", unit: "%" },
      metric: ">",
    } as Ratio;
    const tumorMarkerValues = createTumorMarkerValues(valueratio, undefined, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("er+");
  });

  it("Test er- Logic 1", () => {
    const coding = {
      system: "http://loinc.info/sct",
      code: "85310-1",
      display: "N/A",
    } as Coding; // Any code in 'Biomarker-er'
    const interpretation = {
      system: "http://hl7.org/fhir/R4/valueset-observation-interpretation.html",
      code: "NEG",
      display: "N/A",
    } as Coding;
    const tumorMarkerValues = createTumorMarkerValues(undefined, undefined, interpretation, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("er-");
  });

  it("Test er- Logic 2", () => {
    const coding = {
      system: "http://loinc.info/sct",
      code: "16112-5",
      display: "N/A",
    } as Coding; // Any code in 'Biomarker-er'
    const valueratio = {
      numerator: { value: 1, comparator: "<", unit: "%" },
      denominator: { value: 101, comparator: "<", unit: "%" },
      metric: "<",
    } as Ratio;
    const tumorMarkerValues = createTumorMarkerValues(valueratio, undefined, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("er-");
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
    } as Coding; // Any code in 'Biomarker-er'
    const valueratio = {} as Ratio;
    const tumorMarkerValues = createTumorMarkerValues(valueratio, undefined, undefined, coding);
    expect(tumorMarkerValues).toEqual([]);
  });

  it("Test pr+ Logic 1", () => {
    const coding = {
      system: "http://loinc.info/sct",
      code: "10861-3",
      display: "N/A",
    } as Coding; // Any code in 'Biomarker-pr'
    const interpretation = {
      system: "http://hl7.org/fhir/R4/valueset-observation-interpretation.html",
      code: "H",
      display: "N/A",
    } as Coding;
    const tumorMarkerValues = createTumorMarkerValues(undefined, undefined, interpretation, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("pr+");
  });

  it("Test pr+ Logic 2", () => {
    const coding = {
      system: "http://loinc.info/sct",
      code: "10861-3",
      display: "N/A",
    } as Coding; // Any code in 'Biomarker-pr'
    const valueratio = {
      numerator: { value: 6, comparator: ">", unit: "%" },
      denominator: { value: 3, comparator: ">", unit: "%" },
      metric: ">",
    } as Ratio;
    const tumorMarkerValues = createTumorMarkerValues(valueratio, undefined, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("pr+");
  });

  it("Test pr- Logic 1", () => {
    const coding = {
      system: "http://loinc.info/sct",
      code: "10861-3",
      display: "N/A",
    } as Coding; // Any code in 'Biomarker-pr'
    const valueCodeableConcept = {
      system: "snomed",
      code: "260385009",
      display: "N/A",
    } as Coding;
    const tumorMarkerValues = createTumorMarkerValues(undefined, undefined, undefined, valueCodeableConcept, coding);
    expect(tumorMarkerValues[0]).toBe("pr-");
  });

  it("Test pr- Logic 2", () => {
    const coding = {
      system: "http://loinc.info/sct",
      code: "10861-3",
      display: "N/A",
    } as Coding; // Any code in 'Biomarker-pr'
    const valueratio = {
      numerator: { value: 1, comparator: "<", unit: "%" },
      denominator: { value: 101, comparator: "<", unit: "%" },
      metric: "<",
    } as Ratio;
    const tumorMarkerValues = createTumorMarkerValues(valueratio, undefined, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("pr-");
  });

  it('Test brca1+ Filter 1', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '1100', display: 'brca1' };
    const cgvGeneStudiedInterpretation: Coding = { system: 'N/A', code: 'CAR', display: 'CAR' };
    const cgvGenomicSourceClassVcc: Coding = {system: ' http://loinc.info/sct', code: 'LA6683-2', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, cgvGeneStudiedInterpretation, cgvGenomicSourceClassVcc, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('brca1+');
  });

  it('Test brca1+ Filter 2', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '1100', display: 'brca1' };
    const cgvGeneStudiedInterpretation: Coding = { system: 'N/A', code: 'A', display: 'A' };
    const cgvGenomicSourceClassVcc: Coding = {system: ' http://loinc.info/sct', code: 'LA6683-2', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, cgvGeneStudiedInterpretation, cgvGenomicSourceClassVcc, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('brca1+');
  });

  it('Test brca1+ Filter 3', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '1100', display: 'brca1' };
    const cgvGeneStudiedInterpretation: Coding = { system: 'N/A', code: 'POS', display: 'POS' };
    const cgvGenomicSourceClassVcc: Coding = {system: ' http://loinc.info/sct', code: 'LA6683-2', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, cgvGeneStudiedInterpretation, cgvGenomicSourceClassVcc, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('brca1+');
  });

  it('Test brca1- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '1100', display: 'brca1' };
    const cgvVcc: Coding = {system: 'http://snomed.info/sct', code: '260385009', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('brca1-');
  });

  it('Test brca2+ Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '1101', display: 'N/A' };
    const cgvVcc: Coding = {system: 'http://snomed.info/sct', code: '10828004', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('brca2+');
  });

  it('Test brca2- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '1101', display: 'N/A' };
    const cgvVcc: Coding = {system: 'http://snomed.info/sct', code: '260385009', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('brca2-');
  });

  it('Test atm+ Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '795', display: 'N/A' };
    const cgvVcc: Coding = {system: 'http://loinc.info/sct', code: 'LA9633-4', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('atm+');
  });

  it('Test atm- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '795', display: 'N/A' };
    const cgvVcc: Coding = {system: 'http://snomed.info/sct', code: '260385009', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('atm-');
  });

  it('Test cdh1+ Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '1748', display: 'N/A' };
    const cgvInterpretation: Coding = {system: 'n/a', code: 'POS', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, cgvInterpretation);
    expect(tumorMarkerValues[0]).toBe('cdh1+');
  });

  it('Test cdh1- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '1748', display: 'N/A' };
    const cgvInterpretation: Coding = {system: 'n/a', code: 'NEG', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, cgvInterpretation);
    expect(tumorMarkerValues[0]).toBe('cdh1-');
  });

  it("Test chek2+ Logic", () => {
    const coding = {system: "http://loinc.info/sct", code: "72518-4", display: "N/A"} as Coding;
    const interpretation = {
      system: "http://hl7.org/fhir/R4/valueset-observation-interpretation.html",
      code: "POS",
      display: "N/A",
    } as Coding;
    const tumorMarkerValues = createTumorMarkerValues(undefined, undefined, interpretation, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("chek2+");
  });

  it('Test chek2- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '16627', display: 'N/A' };
    const cgvVcc: Coding = {system: 'http://snomed.info/sct', code: '260385009', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('chek2-');
  });

  it("Test nbn+ Logic", () => {
    const coding = {system: "http://loinc.info/sct", code: "82515-8", display: "N/A"} as Coding;
    const interpretation = {
      system: "http://hl7.org/fhir/R4/valueset-observation-interpretation.html",
      code: "ND",
      display: "N/A",
    } as Coding;
    const tumorMarkerValues = createTumorMarkerValues(undefined, undefined, interpretation, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("nbn+");
  });

  it("Test nbn- Logic", () => {
    const coding = {system: "http://loinc.info/sct", code: "82515-8", display: "N/A"} as Coding;
    const interpretation = {
      system: "http://hl7.org/fhir/R4/valueset-observation-interpretation.html",
      code: "DET",
      display: "N/A",
    } as Coding;
    const tumorMarkerValues = createTumorMarkerValues(undefined, undefined, interpretation, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("nbn-");
  });

  it("Test nf1+ Logic", () => {
    const coding = {system: "http://loinc.info/sct", code: "21717-4", display: "N/A"} as Coding;
    const interpretation = {
      system: "http://hl7.org/fhir/R4/valueset-observation-interpretation.html",
      code: "L",
      display: "N/A",
    } as Coding;
    const tumorMarkerValues = createTumorMarkerValues(undefined, undefined, interpretation, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("nf1+");
  });

  it("Test nf1- Logic", () => {
    const coding = {system: "http://loinc.info/sct", code: "21717-4", display: "N/A"} as Coding;
    const interpretation = {
      system: "http://hl7.org/fhir/R4/valueset-observation-interpretation.html",
      code: "H",
      display: "N/A",
    } as Coding;
    const tumorMarkerValues = createTumorMarkerValues(undefined, undefined, interpretation, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("nf1-");
  });

  it('Test palb2+ Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '26144', display: 'N/A' };
    const cgvInterpretation: Coding = {system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'CAR', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, cgvInterpretation);
    expect(tumorMarkerValues[0]).toBe('palb2+');
  });

  it('Test palb2- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '26144', display: 'N/A' };
    const cgvInterpretation: Coding = {system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'N', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, cgvInterpretation);
    expect(tumorMarkerValues[0]).toBe('palb2-');
  });

  it('Test pten+ Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '9588', display: 'N/A' };
    const cgvInterpretation: Coding = {system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'A', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, cgvInterpretation);
    expect(tumorMarkerValues[0]).toBe('pten+');
  });

  it('Test pten- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '9588', display: 'N/A' };
    const cgvInterpretation: Coding = {system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'NEG', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, cgvInterpretation);
    expect(tumorMarkerValues[0]).toBe('pten-');
  });

  it('Test stk11+ Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '11389', display: 'N/A' };
    const cgvInterpretation: Coding = {system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'POS', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, cgvInterpretation);
    expect(tumorMarkerValues[0]).toBe('stk11+');
  });

  it('Test stk11- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '11389', display: 'N/A' };
    const cgvVcc: Coding = {system: 'http://loinc.info/sct', code: 'LA9634-2', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('stk11-');
  });

  it('Test p53+ Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '11998', display: 'N/A' };
    const cgvInterpretation: Coding = {system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'POS', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, cgvInterpretation);
    expect(tumorMarkerValues[0]).toBe('p53+');
  });

  it('Test p53- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '11998', display: 'N/A' };
    const cgvVcc: Coding = {system: 'http://loinc.info/sct', code: 'LA9634-2', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('p53-');
  });

  it("Test rb+ Logic 1", () => {
    const coding = {system: "http://loinc.info/sct", code: "42795-5", display: "N/A" } as Coding; // Any code in 'Biomarker-rb'
    const valueQuantity = ({ value: '51', comparator: '>', unit: '%', code: '%' } as Quantity);
    const tumorMarkerValues = createTumorMarkerValues(undefined, valueQuantity, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("rb+");
  });

  it("Test rb+ Logic 2", () => {
    const coding = {system: "http://loinc.info/sct", code: "42795-5", display: "N/A" } as Coding; // Any code in 'Biomarker-rb'
    const valueratio = {numerator: {value: 6, comparator: '>', unit: '%'}, denominator: {value: 3, comparator: '>', unit: '%'}, metric: '>'} as Ratio
    const tumorMarkerValues = createTumorMarkerValues(valueratio, undefined, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("rb+");
  });

  it("Test rb- Logic 1", () => {
    const coding = {system: "http://loinc.info/sct", code: "42795-5", display: "N/A" } as Coding; // Any code in 'Biomarker-rb'
    const valueQuantity = ({ value: '49', comparator: '<=', unit: '%', code: '%' } as Quantity);
    const tumorMarkerValues = createTumorMarkerValues(undefined, valueQuantity, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("rb-");
  });

  it("Test rb- Logic 2", () => {
    const coding = {system: "http://loinc.info/sct", code: "42795-5", display: "N/A" } as Coding; // Any code in 'Biomarker-rb'
    const valueratio = {numerator: {value: 1, comparator: '<', unit: '%'}, denominator: {value: 101, comparator: '<', unit: '%'}, metric: '<'} as Ratio
    const tumorMarkerValues = createTumorMarkerValues(valueratio, undefined, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("rb-");
  });

  it("Test her2+ Logic", () => {
    const coding = {system: "http://loinc.info/sct", code: "32996-1", display: "N/A" } as Coding; // Any code in 'Biomarker-her2'
    const valueQuantity = ({ value: '3+', comparator: '=' } as Quantity);
    const tumorMarkerValues = createTumorMarkerValues(undefined, valueQuantity, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("her2+");
  });

  it("Test her2- Logic", () => {
    const coding = {system: "http://loinc.info/sct", code: "32996-1", display: "N/A" } as Coding; // Any code in 'Biomarker-her2'
    const valueQuantity = ({ value: '2+', comparator: '=' } as Quantity);
    const tumorMarkerValues = createTumorMarkerValues(undefined, valueQuantity, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("her2-");
  });

  it("Test fgfr+ Logic 1", () => {
    const coding = {system: "http://loinc.info/sct", code: "42785-6", display: "N/A" } as Coding; // Any code in 'Biomarker-fgfr'
    const valueQuantity = ({ value: '1', comparator: '>=', unit: '%', code: '%' } as Quantity);
    const tumorMarkerValues = createTumorMarkerValues(undefined, valueQuantity, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("fgfr+");
  });

  it("Test fgfr+ Logic 2", () => {
    const coding = {system: "http://loinc.info/sct", code: "42785-6", display: "N/A" } as Coding; // Any code in 'Biomarker-fgfr'
    const valueratio = {numerator: {value: 6, comparator: '>', unit: '%'}, denominator: {value: 3, comparator: '>', unit: '%'}, metric: '>'} as Ratio
    const tumorMarkerValues = createTumorMarkerValues(valueratio, undefined, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("fgfr+");
  });

  it("Test fgfr- Logic 1", () => {
    const coding = {system: "http://loinc.info/sct", code: "42785-6", display: "N/A" } as Coding; // Any code in 'Biomarker-fgfr'
    const valueQuantity = ({ value: '0.5', comparator: '<', unit: '%', code: '%' } as Quantity);
    const tumorMarkerValues = createTumorMarkerValues(undefined, valueQuantity, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("fgfr-");
  });

  it("Test fgfr- Logic 2", () => {
    const coding = {system: "http://loinc.info/sct", code: "42785-6", display: "N/A" } as Coding; // Any code in 'Biomarker-fgfr'
    const valueratio = {numerator: {value: 1, comparator: '<', unit: '%'}, denominator: {value: 101, comparator: '<', unit: '%'}, metric: '<'} as Ratio
    const tumorMarkerValues = createTumorMarkerValues(valueratio, undefined, undefined, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("fgfr-");
  });

  it('Test esr1+ Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '3467', display: 'N/A' };
    const cgvVcc: Coding = {system: 'http://loinc.info/sct', code: 'LA9633-4', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('esr1+');
  });

  it('Test esr1- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '3467', display: 'N/A' };
    const cgvVcc: Coding = {system: 'http://loinc.info/sct', code: 'LA9634-2', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('esr1-');
  });

  it('Test pik3ca+ Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '8975', display: 'N/A' };
    const cgvVcc: Coding = {system: 'httsnomed/sct', code: '10828004', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('pik3ca+');
  });

  it('Test pik3ca- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '8975', display: 'N/A' };
    const cgvVcc: Coding = {system: 'httsnomed/sct', code: '260385009', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('pik3ca-');
  });

  it("Test pdl1+ Logic", () => {
    const coding = {system: "http://loinc.info/sct", code: "96268-8", display: "N/A"} as Coding;
    const interpretation = {system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'POS', display: 'POS'} as Coding;
    const tumorMarkerValues = createTumorMarkerValues(undefined, undefined, interpretation, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("pdl1+");
  });

  it("Test pdl1- Logic", () => {
    const coding = {system: "http://loinc.info/sct", code: "83052-1", display: "N/A"} as Coding;
    const interpretation = {system: 'http://hl7.org/fhir/R4/valueset-observation-interpretation.html', code: 'ND', display: 'ND'} as Coding;
    const tumorMarkerValues = createTumorMarkerValues(undefined, undefined, interpretation, undefined, coding);
    expect(tumorMarkerValues[0]).toBe("pdl1-");
  });

  it('Test ntrk_fusion+ Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '8031', display: 'N/A' };
    const cgvVcc: Coding = {system: 'httsnomed/sct', code: '10828004', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('ntrk_fusion+');
  });

  it('Test ntrk_fusion- Filter', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '8031', display: 'N/A' };
    const cgvVcc: Coding = {system: 'httsnomed/sct', code: '260385009', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues[0]).toBe('ntrk_fusion-');
  });

  it('Test No-Match Tumor Marker', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: 'XXX', display: 'N/A' };
    const cgvVcc: Coding = {system: 'httsnomed/sct', code: 'XXX', display: 'N/A'};
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, cgvVcc, undefined);
    expect(tumorMarkerValues.length).toBe(0);
  });

  it('Test apc gene Filter - Colorectal', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '583', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('apc gene');
  });
  it('Test mlh1 Filter - Colorectal', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '7127', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('mlh1');
  });

  it('Test msh2 Filter - Colorectal', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '7325', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('msh2');
  });

  it('Test msh6 Filter - Colorectal', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '7329', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('msh6');
  });
  it('Test pms2 Filter - Colorectal', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '9122', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('pms2');
  });
  it('Test epcam Filter - Colorectal', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '11529', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('epcam');
  });
  it('Test stk11 Filter - Colorectal', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '11389', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('stk11');
  });
  it('Test mutyh Filter - Colorectal', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '7527', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('mutyh');
  });

  it('Test EGFR - Lung', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '3236', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('egfr');
  });
  it('Test RB1 - Lung', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '9884', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('rb1');
  });
  it('Test TP53 - Lung', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '11998', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('tp53');
  });
  it('Test KRAS - Lung', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '6407', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('kras');
  });
  it('Test ALK - Lung', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '427', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('alk');
  });
  it('Test ROS1 - Lung', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '10261', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('ros1');
  });
  it('Test RET - Lung', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '9967', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('ret');
  });
  it('Test BRAF - Lung', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '1097', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('braf');
  });
  it('Test MET - Lung', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '7029', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('met');
  });

  it('Test BRAF - Melanoma', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '1097', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('braf');
  });
  it('Test NRAS - Melanoma', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '7989', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('nras');
  });
  it('Test CDKN2A - Melanoma', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '1787', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('cdkn2a');
  });
  it('Test NF1 - Melanoma', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '7765', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('nf1');
  });
  it('Test KIT - Melanoma', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '6342', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('kit');
  });
  it('Test CDK4 - Melanoma', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '1773', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('cdk4');
  });

  it('Test MYC - Multiple Myeloma', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '7553', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('myc');
  });
  it('Test TP53 - Multiple Myeloma', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '11998', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('tp53');
  });

  it('Test BCL2 - Non-Hodgkin Lymphoma', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '990', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('bcl2');
  });

  it('Test NF1 - Brain', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '7765', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('nf1');
  });
  it('Test NF2 - Brain', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '7773', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('nf2');
  });
  it('Test TSC1 - Brain', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '12362', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('tsc1');
  });
  it('Test TSC2 - Brain', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '12363', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('tsc2');
  });
  it('Test MLH1 - Brain', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '7127', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('mlh1');
  });
  it('Test PMS2 - Brain', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '9122', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('pms2');
  });

  it('Test RB1 - Uterine', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '9884', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('rb1');
  });

  it('Test BRCA1 - Prostate', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '1100', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('brca1');
  });
  it('Test BRCA2 - Prostate', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '1101', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('brca2');
  });
  it('Test CHEK2 - Prostate', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '16627', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('chek2');
  });
  it('Test ATM - Prostate', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '795', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('atm');
  });
  it('Test PALB2 - Prostate', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '26144', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('palb2');
  });
  it('Test RAD51D - Prostate', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '9823', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('rad51d');
  });
  it('Test MSH2 - Prostate', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '7325', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('msh2');
  });
  it('Test MSH6 - Prostate', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '7329', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('msh6');
  });
  it('Test MLH1 - Prostate', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '7127', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('mlh1');
  });
  it('Test PMS2 - Prostate', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '9122', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('pms2');
  });
  it('Test RNASEL - Prostate', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '10050', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('rnasel');
  });
  it('Test HOXB13 - Prostate', () => {
    const cgvGeneStudiedVcc: Coding = { system: 'hgnc', code: '5112', display: 'N/A' };
    const tumorMarkerValues = createCgvTumorMarkerValues(cgvGeneStudiedVcc, undefined, undefined, undefined, undefined);
    expect(tumorMarkerValues[0]).toBe('hoxb13');
  });

});

describe('checkAgeFilterLogic', () => {

  const createBirthdateBundle = (birthdate: string): Bundle => {
    const birthdateresource: Bundle = {
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
      return birthdateresource;
    };

  const today: Date = new Date();
  const millisecondsPerYear = 1000 * 60 * 60 * 24 * 365;

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

  it('Test Adenocarcinoma, no subtype (morphologic abnormality) Filter - Colorectal', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '35917007', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Adenocarcinoma, no subtype (morphologic abnormality)');
  });

  it('Test Mucinous adenocarcinoma Filter - Colorectal', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '72495009', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Mucinous adenocarcinoma');
  });

  it('Test Signet ring cell carcinoma (morphologic abnormality) Filter - Colorectal', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '87737001', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Signet ring cell carcinoma (morphologic abnormality)');
  });

  it('Test Carcinoid tumor - morphology (morphologic abnormality) Filter - Colorectal', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '189607006', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Carcinoid tumor - morphology (morphologic abnormality)');
  });

  it('Test Gastrointestinal stromal tumor, uncertain malignant potential (morphologic abnormality) Filter - Colorectal', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '128755003', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Gastrointestinal stromal tumor, uncertain malignant potential (morphologic abnormality)');
  });

  it('Test Sarcoma, no International Classification of Diseases for Oncology subtype (morphologic abnormality) Filter - Colorectal', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '2424003', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Sarcoma, no International Classification of Diseases for Oncology subtype (morphologic abnormality)');
  });

  it('Test Adenocarcinoma, no subtype (morphologic abnormality) - Lung', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '35917007', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Adenocarcinoma, no subtype (morphologic abnormality)');
  });

  it('Test Adenocarcinoma in situ (morphologic abnormality) - Lung', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '51642000', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Adenocarcinoma in situ (morphologic abnormality)');
  });

  it('Test Squamous cell carcinoma, no International Classification of Diseases for Oncology subtype (morphologic abnormality) - Lung', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '28899001', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Squamous cell carcinoma, no International Classification of Diseases for Oncology subtype (morphologic abnormality)');
  });

  it('Test Large cell carcinoma (morphologic abnormality) - Lung', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '22687000', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Large cell carcinoma (morphologic abnormality)');
  });

  it('Test Large cell neuroendocrine carcinoma (morphologic abnormality) - Lung', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '128628002', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Large cell neuroendocrine carcinoma (morphologic abnormality)');
  });

  it('Test Superficial spreading melanoma (morphologic abnormality) - Melanoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '55320002', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Superficial spreading melanoma (morphologic abnormality)');
  });
  it('Test Nodular melanoma (morphologic abnormality) - Melanoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '2142002', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Nodular melanoma (morphologic abnormality)');
  });
  it('Test Hutchinson\'s melanotic freckle (morphologic abnormality) - Melanoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '61217001', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe("Hutchinson's melanotic freckle (morphologic abnormality)");
  });
  it('Test Acral lentiginous melanoma, malignant (morphologic abnormality) - Melanoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '16974005', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Acral lentiginous melanoma, malignant (morphologic abnormality)');
  });
  it('Test Desmoplastic melanoma, malignant (morphologic abnormality) - Melanoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '51757004', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Desmoplastic melanoma, malignant (morphologic abnormality)');
  });
  it('Test Spindle cell melanoma (morphologic abnormality) - Melanoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '68827007', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Spindle cell melanoma (morphologic abnormality)');
  });
  it('Test Minimal deviation melanoma (morphologic abnormality) - Melanoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '399475009', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Minimal deviation melanoma (morphologic abnormality)');
  });
  it('Test Amelanotic melanoma (morphologic abnormality) - Melanoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '70594002', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Amelanotic melanoma (morphologic abnormality)');
  });

  it('Test Polycythemia vera (morphologic abnormality) - MPN', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '128841001', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Polycythemia vera (morphologic abnormality)');
  });
  it('Test Myelosclerosis with myeloid metaplasia (morphologic abnormality) - MPN', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '128843003', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Myelosclerosis with myeloid metaplasia (morphologic abnormality)');
  });
  it('Test Essential thrombocythemia (morphologic abnormality) - MPN', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '128844009', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Essential thrombocythemia (morphologic abnormality)');
  });
  it('Test Chronic neutrophilic leukemia (morphologic abnormality) - MPN', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '128834007', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Chronic neutrophilic leukemia (morphologic abnormality)');
  });
  it('Test Chronic eosinophilic leukemia (morphologic abnormality) - MPN', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '413836008', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Chronic eosinophilic leukemia (morphologic abnormality)');
  });

  it('Test Multiple myeloma, no International Classification of Diseases for Oncology subtype (morphologic abnormality) - Myeloma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '55921005', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe(' Multiple myeloma, no International Classification of Diseases for Oncology subtype (morphologic abnormality)');
  });

  it('Test Non-Hodgkin lymphoma, no International Classification of Diseases for Oncology subtype (morphologic abnormality) - Non-Hodgkin Lymphoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '1929004', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Non-Hodgkin lymphoma, no International Classification of Diseases for Oncology subtype (morphologic abnormality)');
  });
  it('Test Non-Hodgkin lymphoma - category (morphologic abnormality) - Non-Hodgkin Lymphoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '128929007', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Non-Hodgkin lymphoma - category (morphologic abnormality)');
  });
  it('Test Malignant lymphoma, large B-cell, diffuse, no International Classification of Diseases for Oncology subtype (morphologic abnormality) - Non-Hodgkin Lymphoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '46732000', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Malignant lymphoma, large B-cell, diffuse, no International Classification of Diseases for Oncology subtype (morphologic abnormality)');
  });
  it('Test Diffuse large B-cell lymphoma - category (morphologic abnormality) - Non-Hodgkin Lymphoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '413990004', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Diffuse large B-cell lymphoma - category (morphologic abnormality)');
  });
  it('Test Diffuse large B-cell lymphoma activated B-cell subtype (morphologic abnormality) - Non-Hodgkin Lymphoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '787565006', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Diffuse large B-cell lymphoma activated B-cell subtype (morphologic abnormality)');
  });
  it('Test Follicular lymphoma (morphologic abnormality) - Non-Hodgkin Lymphoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '55150002', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Follicular lymphoma (morphologic abnormality)');
  });
  it('Test B-cell chronic lymphocytic leukemia/small lymphocytic lymphoma (morphologic abnormality) - Non-Hodgkin Lymphoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '51092000', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('B-cell chronic lymphocytic leukemia/small lymphocytic lymphoma (morphologic abnormality)');
  });
  it('Test Mantle cell lymphoma (morphologic abnormality) - Non-Hodgkin Lymphoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '374654000', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Mantle cell lymphoma (morphologic abnormality)');
  });
  it('Test Nodal marginal zone B-cell lymphoma (morphologic abnormality) - Non-Hodgkin Lymphoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '397349003', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Nodal marginal zone B-cell lymphoma (morphologic abnormality)');
  });
  it('Test Burkitt lymphoma (morphologic abnormality) - Non-Hodgkin Lymphoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '77381001', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Burkitt lymphoma (morphologic abnormality)');
  });
  it('Test Malignant lymphoma, lymphoplasmacytic (morphologic abnormality) - Non-Hodgkin Lymphoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '19340000', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Malignant lymphoma, lymphoplasmacytic (morphologic abnormality)');
  });
  it('Test Hairy cell leukemia (morphologic abnormality) - Non-Hodgkin Lymphoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '54087003', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Hairy cell leukemia (morphologic abnormality)');
  });
  it('Test Precursor T cell lymphoblastic leukemia/lymphoblastic lymphoma (morphologic abnormality) - Non-Hodgkin Lymphoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '397348006', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Precursor T cell lymphoblastic leukemia/lymphoblastic lymphoma (morphologic abnormality)');
  });
  it('Test Cutaneous T-cell lymphoma, no International Classification of Diseases for Oncology subtype (morphologic abnormality) - Non-Hodgkin Lymphoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '28054005', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Cutaneous T-cell lymphoma, no International Classification of Diseases for Oncology subtype (morphologic abnormality)');
  });
  it('Test Angioimmunoblastic T-cell lymphoma (morphologic abnormality) - Non-Hodgkin Lymphoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '835009', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Angioimmunoblastic T-cell lymphoma (morphologic abnormality)');
  });
  it('Test Primary cutaneous anaplastic large T-cell lymphoma, CD30-positive (morphologic abnormality) - Non-Hodgkin Lymphoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '397352006', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Primary cutaneous anaplastic large T-cell lymphoma, CD30-positive (morphologic abnormality)');
  });
  it('Test Peripheral T-cell lymphoma, no International Classification of Diseases for Oncology subtype (morphologic abnormality) - Non-Hodgkin Lymphoma', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '3172003', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Peripheral T-cell lymphoma, no International Classification of Diseases for Oncology subtype (morphologic abnormality)');
  });

  it('Test Astrocytoma (morphologic abnormality) - Brain', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '1157043006', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Astrocytoma (morphologic abnormality)');
  });
  it('Test Oligodendroglioma (morphologic abnormality) - Brain', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '1156974002', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Oligodendroglioma (morphologic abnormality)');
  });
  it('Test Malignant ependymoma (morphologic abnormality) - Brain', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '1156903009', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Malignant ependymoma (morphologic abnormality)');
  });
  it('Test Glioblastoma, no International Classification of Diseases for Oncology subtype (morphologic abnormality) - Brain', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '63634009', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Glioblastoma, no International Classification of Diseases for Oncology subtype (morphologic abnormality)');
  });
  it('Test Astrocytoma, anaplastic (morphologic abnormality) - Brain', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '55353007', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Astrocytoma, anaplastic (morphologic abnormality)');
  });
  it('Test Oligodendroglioma, anaplastic (morphologic abnormality) - Brain', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '3102004', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Oligodendroglioma, anaplastic (morphologic abnormality)');
  });
  it('Test Ependymoma, anaplastic (morphologic abnormality) - Brain', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '21589007', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Ependymoma, anaplastic (morphologic abnormality)');
  });
  it('Test Meningioma, malignant (morphologic abnormality) - Brain', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '78303004', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Meningioma, malignant (morphologic abnormality)');
  });
  it('Test Primary malignant meningioma (disorder) - Brain', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '722718001', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Primary malignant meningioma (disorder)');
  });
  it('Test Medulloblastoma (morphologic abnormality) - Brain', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '1156923005', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Medulloblastoma (morphologic abnormality)');
  });
  it('Test Ganglioglioma, anaplastic (morphologic abnormality) - Brain', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '128912009', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Ganglioglioma, anaplastic (morphologic abnormality)');
  });
  it('Test Melanotic malignant peripheral nerve sheath tumor (morphologic abnormality) - Brain', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '253094006', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Melanotic malignant peripheral nerve sheath tumor (morphologic abnormality)');
  });

  it('Test Adenocarcinoma, no subtype (morphologic abnormality) - Uterine', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '35917007', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Adenocarcinoma, no subtype (morphologic abnormality)');
  });
  it('Test Carcinosarcoma (morphologic abnormality) - Uterine', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '63264007', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Carcinosarcoma (morphologic abnormality)');
  });
  it('Test Squamous cell carcinoma, no International Classification of Diseases for Oncology subtype (morphologic abnormality) - Uterine', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '28899001', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Squamous cell carcinoma, no International Classification of Diseases for Oncology subtype (morphologic abnormality)');
  });
  it('Test Small cell carcinoma (morphologic abnormality) - Uterine', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '74364000', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Small cell carcinoma (morphologic abnormality)');
  });
  it('Test Transitional cell carcinoma (morphologic abnormality) - Uterine', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '27090000', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Transitional cell carcinoma (morphologic abnormality)');
  });
  it('Test Serous carcinoma (morphologic abnormality) - Uterine', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '90725004', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Serous carcinoma (morphologic abnormality)');
  });
  it('Test Leiomyosarcoma, no subtype (morphologic abnormality) - Uterine', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '51549004', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Leiomyosarcoma, no subtype (morphologic abnormality)');
  });
  it('Test Endometrial stromal sarcoma, high grade (morphologic abnormality) - Uterine', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '70555003', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Endometrial stromal sarcoma, high grade (morphologic abnormality)');
  });

  it('Test Small cell carcinoma (morphologic abnormality) - Prostate', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '74364000', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Small cell carcinoma (morphologic abnormality)');
  });
  it('Test Neuroendocrine tumor (morphologic abnormality) - Prostate', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '55937004', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Neuroendocrine tumor (morphologic abnormality)');
  });
  it('Test Transitional cell carcinoma (morphologic abnormality) - Prostate', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '27090000', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Transitional cell carcinoma (morphologic abnormality)');
  });
  it('Test Sarcoma, no International Classification of Diseases for Oncology subtype (morphologic abnormality) - Prostate', () => {
    const histologyBehavior = { system: 'http://snomed.info/sct', code: '2424003', display: 'N/A' } as Coding;
    const mappingLogic = new TrialjectoryMappingLogic(createHistologyMorphologyResource(undefined, histologyBehavior));
    expect(mappingLogic.getHistologyMorphologyValue()).toBe('Sarcoma, no International Classification of Diseases for Oncology subtype (morphologic abnormality)');
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
          },
          clinicalStatus: {coding: []},
          bodySite: {coding: []}
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
            },
            clinicalStatus: {coding: []},
            bodySite: {coding: []}
          }
        }
      ]
    };
    const emptyExtractedMCODE = new TrialjectoryMappingLogic(falseSecondaryCancerBundle)
    expect(emptyExtractedMCODE.getSecondaryCancerValues()).toBeNull();
  });
});

describe('Check Radiation Procedure Logic', () => {

  const createradiationBundle = (coding: Coding, bodySite: Coding): Bundle => {
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

    if(bodySite){
      (radiationBundle.entry[0].resource as Procedure).bodySite = [{coding: [bodySite]}];
    }
    
    return radiationBundle;
  };

  it('Test WBRT Filter', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '108290001', display: 'N/A' } as Coding);
    const bodySite = ({ system: 'http://snomed.info/sct', code: '12738006', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, bodySite));
    expect(mappingLogic.getRadiationProcedureValues().includes('wbrt')).toBeTrue();
  });

  it('Test EBRT Filter', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '33356009', display: 'N/A' } as Coding);
    const bodySite = ({ system: 'http://snomed.info/sct', code: 'test', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, bodySite));
    expect(mappingLogic.getRadiationProcedureValues().includes('ebrt')).toBeTrue();
  });

  it('Test ablation Filter', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '228692005', display: 'N/A' } as Coding);
    const bodySite = ({ system: 'http://snomed.info/sct', code: 'test', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, bodySite));
    expect(mappingLogic.getRadiationProcedureValues().includes('ablation')).toBeTrue();
  });

  it('Test RFA Filter', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '879916008', display: 'N/A' } as Coding);
    const bodySite = ({ system: 'http://snomed.info/sct', code: 'test', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, bodySite));
    expect(mappingLogic.getRadiationProcedureValues().includes('rfa')).toBeTrue();
  });
  it('Test Destructive procedure (procedure) Filter - Colorectal', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '64597002', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('Destructive procedure (procedure)')).toBeTrue();
  });
  it('Test Radiofrequency ablation (procedure) Filter - Colorectal', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '879916008', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('Radiofrequency ablation (procedure)')).toBeTrue();
  });
  it('Test External beam radiation therapy procedure (procedure) Filter - Colorectal', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '33195004', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('External beam radiation therapy procedure (procedure)')).toBeTrue();
  });
  it('Test Brachytherapy (procedure) Filter - Colorectal', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '152198000', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('Brachytherapy (procedure)')).toBeTrue();
  });
  it('Test Interstitial brachytherapy (procedure) Filter - Colorectal', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '113120007', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('Interstitial brachytherapy (procedure)')).toBeTrue();
  });

  it('Test Destructive procedure (procedure) - Lung', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '64597002', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('Destructive procedure (procedure)')).toBeTrue();
  });
  it('Test Radiofrequency ablation (procedure) - Lung', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '879916008', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('Radiofrequency ablation (procedure)')).toBeTrue();
  });
  it('Test External beam radiation therapy procedure (procedure) - Lung', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '33195004', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('External beam radiation therapy procedure (procedure)')).toBeTrue();
  });
  it('Test Brachytherapy (procedure) - Lung', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '152198000', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('Brachytherapy (procedure)')).toBeTrue();
  });
  it('Test Interstitial brachytherapy (procedure) - Lung', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '113120007', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('Interstitial brachytherapy (procedure)')).toBeTrue();
  });
  it('Test Intensity modulated radiation therapy (procedure) - Lung', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '441799006', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('Intensity modulated radiation therapy (procedure)')).toBeTrue();
  });
  it('Test Stereotactic radiosurgery (procedure) - Lung', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '115959002', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('Stereotactic radiosurgery (procedure)')).toBeTrue();
  });

  it('Test External beam radiation therapy procedure (procedure) - Melanoma', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '33195004', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('External beam radiation therapy procedure (procedure)')).toBeTrue();
  });
  it('Test Stereotactic radiosurgery (procedure) - Melanoma', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '115959002', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('Stereotactic radiosurgery (procedure)')).toBeTrue();
  });

  it('Test Splenectomy (procedure) - MPN', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '234319005', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('Splenectomy (procedure)')).toBeTrue();
  });
  it('Test Total splenectomy (procedure) - MPN', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '174776001', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('Total splenectomy (procedure)')).toBeTrue();
  });

  it('Test External beam radiation therapy procedure (procedure) - Multiple Myeloma', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '33195004', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('External beam radiation therapy procedure (procedure)')).toBeTrue();
  });

  it('Test External beam radiation therapy procedure (procedure) - Non-Hodkgins Lymphoma', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '33195004', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('External beam radiation therapy procedure (procedure)')).toBeTrue();
  });

  it('Test External beam radiation therapy procedure (procedure) - Brain', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '33195004', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('External beam radiation therapy procedure (procedure)')).toBeTrue();
  });
  it('Test Intensity modulated radiation therapy (procedure) - Brain', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '441799006', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('Intensity modulated radiation therapy (procedure)')).toBeTrue();
  });
  it('Test Volumetric modulated arc therapy (procedure) - Brain', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '1156530009', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('Volumetric modulated arc therapy (procedure)')).toBeTrue();
  });
  it('Test Stereotactic radiosurgery (procedure) - Brain', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '115959002', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('Stereotactic radiosurgery (procedure)')).toBeTrue();
  });
  it('Test Brachytherapy (procedure) - Brain', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '152198000', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('Brachytherapy (procedure)')).toBeTrue();
  });

  it('Test External beam radiation therapy procedure (procedure) - Uterine', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '33195004', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('External beam radiation therapy procedure (procedure)')).toBeTrue();
  });
  it('Test Brachytherapy (procedure) - Uterine', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '152198000', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('Brachytherapy (procedure)')).toBeTrue();
  });

  it('Test External beam radiation therapy procedure (procedure) - Uterine', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '33195004', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('External beam radiation therapy procedure (procedure)')).toBeTrue();
  });
  it('Test Brachytherapy (procedure) - Prostate', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '152198000', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('Brachytherapy (procedure)')).toBeTrue();
  });
  it('Test Intensity modulated radiation therapy (procedure) - Brain', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '441799006', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('Intensity modulated radiation therapy (procedure)')).toBeTrue();
  });
  it('Test External beam radiation therapy protons (procedure) - Brain', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '10611004', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createradiationBundle(coding, undefined));
    expect(mappingLogic.getRadiationProcedureValues().includes('External beam radiation therapy protons (procedure)')).toBeTrue();
  });

});

describe('Check Surgical Procedure Logic', () => {

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

    if(bodySite){
      (surgicalBundle.entry[0].resource as Procedure).bodySite = [{coding: [bodySite]}];
    }

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

  it('Test Resection of polyp (procedure) Filter - Colorectal', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '82035006', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Resection of polyp (procedure)')).toBeTrue();
  });
  it('Test Left colectomy (procedure) Filter - Colorectal', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '82619000', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Left colectomy (procedure)')).toBeTrue();
  });
  it('Test Right colectomy (procedure) Filter - Colorectal', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '359571009', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Right colectomy (procedure)')).toBeTrue();
  });
  it('Test Partial resection of colon (procedure) Filter - Colorectal', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '43075005', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Partial resection of colon (procedure)')).toBeTrue();
  });
  it('Test Multiple segmental resections of large intestine (procedure) Filter - Colorectal', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '54747001', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Multiple segmental resections of large intestine (procedure)')).toBeTrue();
  });
  it('Test Total colectomy (procedure) Filter - Colorectal', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '26390003', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Total colectomy (procedure)')).toBeTrue();
  });
  it('Test Excision of malignant tumor of rectum by transanal approach (procedure) Filter - Colorectal', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '33507007', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Excision of malignant tumor of rectum by transanal approach (procedure)')).toBeTrue();
  });
  it('Test Low anterior resection of rectum (procedure) Filter - Colorectal', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '314592008', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Low anterior resection of rectum (procedure)')).toBeTrue();
  });
  it('Test Resection of rectum (procedure) Filter - Colorectal', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '87677003', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Resection of rectum (procedure)')).toBeTrue();
  });
  it('Test Total proctectomy (procedure) Filter - Colorectal', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '235364003', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Total proctectomy (procedure)')).toBeTrue();
  });
  it('Test Excision of part of rectum (procedure) Filter - Colorectal', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '12827003', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Excision of part of rectum (procedure)')).toBeTrue();
  });
  it('Test Abdominoperineal resection of rectum (procedure) Filter - Colorectal', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '265414003', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Abdominoperineal resection of rectum (procedure)')).toBeTrue();
  });

  it('Test Total pneumonectomy (procedure) - Lung', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '49795001', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Total pneumonectomy (procedure)')).toBeTrue();
  });
  it('Test Complete excision of left lung (procedure) - Lung', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '735015005', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Complete excision of left lung (procedure)')).toBeTrue();
  });
  it('Test Completion pneumonectomy (procedure) - Lung', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '232646009', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Completion pneumonectomy (procedure)')).toBeTrue();
  });
  it('Test Complete excision of right lung (procedure) - Lung', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '735016006', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Complete excision of right lung (procedure)')).toBeTrue();
  });
  it('Test Lobectomy (procedure) - Lung', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '125571002', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Lobectomy (procedure)')).toBeTrue();
  });
  it('Test Lobectomy of lung (procedure) - Lung', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '173171007', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Lobectomy of lung (procedure)')).toBeTrue();
  });
  it('Test Wedge resection (procedure) - Lung', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '20418004', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Wedge resection (procedure)')).toBeTrue();
  });
  it('Test Thoracoscopic wedge resection of lung (procedure) - Lung', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '444188003', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Thoracoscopic wedge resection of lung (procedure)')).toBeTrue();
  });
  it('Test Pneumonectomy with tracheobronchoplasty (procedure) - Lung', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '232647000', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Pneumonectomy with tracheobronchoplasty (procedure)')).toBeTrue();
  });

  it('Test Wide excision (procedure) - Melanoma', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '787439005', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Wide excision (procedure)')).toBeTrue();
  });
  it('Test Wide excision of skin lesion (procedure) - Melanoma', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '177302005', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Wide excision of skin lesion (procedure)')).toBeTrue();
  });
  it('Test Mohs surgery (procedure) - Melanoma', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '418024000', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Mohs surgery (procedure)')).toBeTrue();
  });
  it('Test Amputation (procedure) - Melanoma', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '81723002', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Amputation (procedure)')).toBeTrue();
  });
  it('Test Dissection of lymph node (procedure) - Melanoma', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '11971000224104', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Dissection of lymph node (procedure)')).toBeTrue();
  });

  it('Test Splenectomy (procedure) - MPN', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '234319005', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Splenectomy (procedure)')).toBeTrue();
  });
  it('Test Total splenectomy (procedure) - MPN', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '174776001', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Total splenectomy (procedure)')).toBeTrue();
  });

  it('Test Craniotomy (procedure) - Brain', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '25353009', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Craniotomy (procedure)')).toBeTrue();
  });

  it('Test Hysterectomy (procedure) - Uterine', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '236886002', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Hysterectomy (procedure)')).toBeTrue();
  });
  it('Test Total hysterectomy (procedure) - Uterine', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '116140006', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Total hysterectomy (procedure)')).toBeTrue();
  });
  it('Test Abdominal hysterectomy (procedure) - Uterine', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '116141005', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Abdominal hysterectomy (procedure)')).toBeTrue();
  });
  it('Test Total abdominal hysterectomy (procedure) - Uterine', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '116143008', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Total abdominal hysterectomy (procedure)')).toBeTrue();
  });
  it('Test Vaginal hysterectomy (procedure) - Uterine', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '265056007', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Vaginal hysterectomy (procedure)')).toBeTrue();
  });
  it('Test Total hysterectomy via vaginal approach (procedure) - Uterine', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '767610009', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Total hysterectomy via vaginal approach (procedure)')).toBeTrue();
  });
  it('Test Radical hysterectomy (procedure) - Uterine', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '116142003', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Radical hysterectomy (procedure)')).toBeTrue();
  });
  it('Test Bilateral salpingectomy with oophorectomy (procedure) - Uterine', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '29827000', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Bilateral salpingectomy with oophorectomy (procedure)')).toBeTrue();
  });
  it('Test Dissection of lymph node (procedure) - Uterine', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '11971000224104', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Dissection of lymph node (procedure)')).toBeTrue();
  });

  it('Test Radical prostatectomy (procedure) - Prostate', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '26294005', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Radical prostatectomy (procedure)')).toBeTrue();
  });
  it('Test Open prostatectomy (procedure) - Prostate', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '176258007', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Open prostatectomy (procedure)')).toBeTrue();
  });
  it('Test Radical retropubic prostatectomy (procedure) - Prostate', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '65551008', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Radical retropubic prostatectomy (procedure)')).toBeTrue();
  });
  it('Test Radical perineal prostatectomy (procedure) - Prostate', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '8782006', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Radical perineal prostatectomy (procedure)')).toBeTrue();
  });
  it('Test Laparoscopic radical prostatectomy using robotic assistance (procedure) - Prostate', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '708919000', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Laparoscopic radical prostatectomy using robotic assistance (procedure)')).toBeTrue();
  });
  it('Test Total orchidectomy (procedure) - Prostate', () => {
    const coding = ({ system: 'http://snomed.info/sct', code: '236334001', display: 'N/A' } as Coding);
    const mappingLogic = new TrialjectoryMappingLogic(createSurgicalBundle(coding, undefined));
    expect(mappingLogic.getSurgicalProcedureValues().some(sp => sp == 'Total orchidectomy (procedure)')).toBeTrue();
  });

});
