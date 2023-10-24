import { TrialjectoryMappingLogic } from '../src/trialjectorymappinglogic';

describe('TrialjectoryMappingLogic', () => {
  // This is currently essentially a smoke test
  it('pulls expected values out of the sample patient', () => {
    const instance = new TrialjectoryMappingLogic({
      resourceType: 'Bundle',
      type: 'collection',
      entry: [
        {
          resource: {
            resourceType: 'Parameters',
            id: '0',
            parameter: [
              {
                name: 'zipCode',
                valueString: '67446',
              },
              {
                name: 'travelRadius',
                valueString: '1500',
              },
            ],
          },
        },
        {
          resource: {
            resourceType: 'Patient',
            id: 'fglscNH3Ke3tYmWe-UQEu',
            gender: 'female',
            birthDate: '1968',
          },
          fullUrl: 'urn:uuid:fglscNH3Ke3tYmWe-UQEu',
        },
        {
          resource: {
            resourceType: 'Condition',
            meta: {
              profile: ['http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-primary-cancer-condition'],
            },
            subject: {
              reference: 'urn:uuid:fglscNH3Ke3tYmWe-UQEu',
              type: 'Patient',
            },
            code: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '408643008',
                  display: 'Infiltrating duct carcinoma of breast (disorder)',
                },
              ],
            },
            category: [
              {
                coding: [
                  {
                    system: 'http://snomed.info/sct',
                    code: '64572001',
                  },
                ],
              },
            ],
          },
        },
        {
          resource: {
            resourceType: 'Observation',
            status: 'final',
            subject: {
              reference: 'urn:uuid:fglscNH3Ke3tYmWe-UQEu',
              type: 'Patient',
            },
            interpretation: [
              {
                coding: [
                  {
                    system: 'http://loinc.org',
                    code: 'LA9622-7',
                    display: 'Fully active, able to carry on all pre-disease performance without restriction',
                  },
                ],
              },
            ],
            meta: {
              profile: ['http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-ecog-performance-status'],
            },
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '89247-1',
                },
              ],
            },
            valueInteger: 0,
            category: [
              {
                coding: [
                  {
                    system: 'http://hl7.org/fhir/us/core/CodeSystem/us-core-observation-category',
                    code: 'clinical-test',
                  },
                ],
              },
              {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                    code: 'survey',
                  },
                ],
              },
            ],
          },
        },
        {
          resource: {
            resourceType: 'Observation',
            status: 'final',
            subject: {
              reference: 'urn:uuid:fglscNH3Ke3tYmWe-UQEu',
              type: 'Patient',
            },
            interpretation: [
              {
                coding: [
                  {
                    system: 'http://loinc.org',
                    code: 'LA29175-9',
                    display: 'Normal; no complaints; no evidence of disease',
                  },
                ],
              },
            ],
            meta: {
              profile: ['http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-karnofsky-performance-status'],
            },
            code: {
              coding: [
                {
                  system: 'http://loinc.org',
                  code: '89243-0',
                },
              ],
            },
            valueInteger: 100,
            category: [
              {
                coding: [
                  {
                    system: 'http://hl7.org/fhir/us/core/CodeSystem/us-core-observation-category',
                    code: 'clinical-test',
                  },
                ],
              },
              {
                coding: [
                  {
                    system: 'http://terminology.hl7.org/CodeSystem/observation-category',
                    code: 'survey',
                  },
                ],
              },
            ],
          },
        },
        {
          resource: {
            resourceType: 'MedicationStatement',
            subject: {
              reference: 'urn:uuid:fglscNH3Ke3tYmWe-UQEu',
              type: 'Patient',
            },
            status: 'completed',
            medicationCodeableConcept: {
              coding: [
                {
                  system: 'http://www.nlm.nih.gov/research/umls/rxnorm',
                  code: '258494',
                  display: 'exemestane',
                },
              ],
            },
            meta: {
              profile: ['http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-cancer-related-medication-statement'],
            },
            effectiveDateTime: '2023-05-04T19:41:59.078Z',
          },
        },
        {
          resource: {
            resourceType: 'MedicationStatement',
            subject: {
              reference: 'urn:uuid:fglscNH3Ke3tYmWe-UQEu',
              type: 'Patient',
            },
            status: 'completed',
            medicationCodeableConcept: {
              coding: [
                {
                  system: 'http://snomed.info/sct',
                  code: '387017005',
                },
              ],
            },
            meta: {
              profile: ['http://hl7.org/fhir/us/mcode/StructureDefinition/mcode-cancer-related-medication-statement'],
            },
            effectiveDateTime: '2023-05-04T19:41:59.078Z',
          },
        },
      ],
    });
    expect(instance.getPrimaryCancerValues()).toEqual('breast_cancer');
    expect(instance.getSecondaryCancerValues()).toBeNull();
  });
});
