import * as mcode from "../src/mcode";
import { Coding } from "../src/mcode";

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
  ms.push({ system: "RxNorm", code: "727762", display: "N/A" } as Coding);
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
//   describe('checkMedicationStatementFilterLogic-trastuzumab', () => {
//     // TODO - Need feedback from Noam on trastuzumab.
//     // Initialize
//     const extractedMCODE = new mcode.ExtractedMCODE(null);
//     const ms: Coding[] = [] as Coding[];
//     // trastuzumab medication filter
//     ms.push({ system: 'RxNorm', code: 'XXXXX', display: 'N/A' } as Coding);
//     extractedMCODE.cancerRelatedMedicationStatement = ms;
//     const medications: string[] = extractedMCODE.getMedicationStatementValues();
//     it('Test trastuzumab medication filter.', () => {
//         expect(medications[0]).toBe('trastuzumab');
//     });
//   });
describe("checkMedicationStatementFilterLogic-trastuzumab_hyaluronidase_conjugate", () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // trastuzumab_hyaluronidase_conjugate medication filter
  ms.push({ system: "RxNorm", code: "2119711", display: "N/A" } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it("Test trastuzumab_hyaluronidase_conjugate medication filter.", () => {
    expect(medications[0]).toBe("trastuzumab_hyaluronidase_conjugate");
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
    expect(medications[0]).toBe("trastuzumab_deruxtecan_conjugate");
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
    expect(medications.length).toBe(2);
    expect(
      medications.indexOf("pertuzumab_trastuzumab_hyaluronidase") > -1
    ).toBe(true);
    expect(
      medications.indexOf("trastuzumab_hyaluronidase_conjugate") > -1
    ).toBe(true);
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
    expect(medications[0]).toBe("tdm1");
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
//   describe('checkMedicationStatementFilterLogic-eribuline', () => {
//     // TODO - Need feedback from Noam on this Medication.
//     // Initialize
//     const extractedMCODE = new mcode.ExtractedMCODE(null);
//     const ms: Coding[] = [] as Coding[];
//     // eribuline medication filter
//     ms.push({ system: 'RxNorm', code: 'XXXXXX', display: 'N/A' } as Coding);
//     extractedMCODE.cancerRelatedMedicationStatement = ms;
//     const medications: string[] = extractedMCODE.getMedicationStatementValues();
//     it('Test eribuline medication filter.', () => {
//         expect(medications[0]).toBe('eribuline');
//     });
//   });
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
//   describe('checkMedicationStatementFilterLogic-progestin', () => {
//     // TODO - Need feedback from Noam for this medication.
//     // Initialize
//     const extractedMCODE = new mcode.ExtractedMCODE(null);
//     const ms: Coding[] = [] as Coding[];
//     // progestin medication filter
//     ms.push({ system: 'RxNorm', code: 'XXXXX', display: 'N/A' } as Coding);
//     extractedMCODE.cancerRelatedMedicationStatement = ms;
//     const medications: string[] = extractedMCODE.getMedicationStatementValues();
//     it('Test progestin medication filter.', () => {
//         expect(medications[0]).toBe('progestin');
//     });
//   });
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
//   describe('checkMedicationStatementFilterLogic-high_dose_estrogen', () => {
//     // TODO - Need feedback from Noam for this medication.
//     // Initialize
//     const extractedMCODE = new mcode.ExtractedMCODE(null);
//     const ms: Coding[] = [] as Coding[];
//     // high_dose_estrogen medication filter
//     ms.push({ system: 'RxNorm', code: 'XXXXX', display: 'N/A' } as Coding);
//     extractedMCODE.cancerRelatedMedicationStatement = ms;
//     const medications: string[] = extractedMCODE.getMedicationStatementValues();
//     it('Test high_dose_estrogen medication filter.', () => {
//         expect(medications[0]).toBe('high_dose_estrogen');
//     });
//   });
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
    expect(medications.indexOf("letrozole") > -1).toBe(true);
    expect(medications.indexOf("lapatinib") > -1).toBe(true);
    expect(medications.indexOf("tucatinib") > -1).toBe(true);
    expect(medications.indexOf("topotecan") > -1).toBe(true);
    expect(medications.indexOf("palbociclib") > -1).toBe(true);
    expect(medications.indexOf("abemaciclib") > -1).toBe(true);
    expect(medications.indexOf("alpelisib") > -1).toBe(true);
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