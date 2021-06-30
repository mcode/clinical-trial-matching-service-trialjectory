import * as mcode from "../src/mcode";
import { Coding, PrimaryCancerCondition } from "../src/mcode";

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
describe('checkMedicationStatementFilterLogic-trastuzumab', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // trastuzumab medication filter
  ms.push({ system: 'RxNorm', code: '1658082', display: 'N/A' } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it('Test trastuzumab medication filter.', () => {
    expect(medications.some(medication => medication == 'trastuzumab')).toBe(true);
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
    expect(medications.some(medication => medication == 'trastuzumab_hyaluronidase_conjugate')).toBe(true);
    expect(medications.some(medication => medication == 'trastuzumab')).toBe(true);
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
    expect(medications.some(medication => medication == 'trastuzumab_deruxtecan_conjugate')).toBe(true);
    expect(medications.some(medication => medication == 'trastuzumab')).toBe(true);
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
    expect(medications.some(medication => medication == 'pertuzumab_trastuzumab_hyaluronidase')).toBe(true);
    expect(medications.some(medication => medication == 'trastuzumab_hyaluronidase_conjugate')).toBe(true);
    expect(medications.some(medication => medication == 'trastuzumab')).toBe(true);
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
    expect(medications.some(medication => medication == 'tdm1')).toBe(true);
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
    expect(medications.some(medication => medication == 'eribulin')).toBe(true);
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
      expect(medications.some(medication => medication == 'progesterone')).toBe(true);
  });
});
describe('checkMedicationStatementFilterLogic-Hyaluronidase', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const ms: Coding[] = [] as Coding[];
  // progestin medication filter
  ms.push({ system: 'RxNorm', code: '630936', display: 'N/A' } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it('Test Hyaluronidase medication filter.', () => {
      expect(medications.some(medication => medication == 'hyaluronidase')).toBe(true);
  });
});
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
  ms.push({ system: 'RxNorm', code: '4100', display: 'N/A' } as Coding);
  extractedMCODE.cancerRelatedMedicationStatement = ms;
  const medications: string[] = extractedMCODE.getMedicationStatementValues();
  it('Test high_dose_estrogen medication filter.', () => {
    expect(medications.some(medication => medication == 'high_dose_estrogen')).toBe(true);
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
  const tm: mcode.TumorMarker = {};
  tm.code = [] as Coding[];
  tm.interpretation = [] as Coding[];
  tm.valueCodeableConcept = [] as Coding[];
  tm.valueQuantity = [] as mcode.Quantity[];
  tm.valueRatio = [] as mcode.Ratio[];

  tm.code.push({ system: 'http://loinc.info/sct', code: '16112-5', display: 'N/A' } as Coding); // Any code in 'Biomarker-ER'
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
  const tm: mcode.TumorMarker = {};
  tm.code = [] as Coding[];
  tm.interpretation = [] as Coding[];
  tm.valueCodeableConcept = [] as Coding[];
  tm.valueQuantity = [] as mcode.Quantity[];
  tm.valueRatio = [] as mcode.Ratio[];

  tm.code.push({ system: 'http://loinc.info/sct', code: '16112-5', display: 'N/A' } as Coding); // Any code in 'Biomarker-ER'
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
  const tm: mcode.TumorMarker = {};
  tm.code = [] as Coding[];
  tm.interpretation = [] as Coding[];
  tm.valueCodeableConcept = [] as Coding[];
  tm.valueQuantity = [] as mcode.Quantity[];
  tm.valueRatio = [] as mcode.Ratio[];

  tm.code.push({ system: 'http://loinc.info/sct', code: '85310-1', display: 'N/A' } as Coding); // Any code in 'Biomarker-ER'
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
  const tm: mcode.TumorMarker = {};
  tm.code = [] as Coding[];
  tm.interpretation = [] as Coding[];
  tm.valueCodeableConcept = [] as Coding[];
  tm.valueQuantity = [] as mcode.Quantity[];
  tm.valueRatio = [] as mcode.Ratio[];

  tm.code.push({ system: 'http://loinc.info/sct', code: '85310-1', display: 'N/A' } as Coding); // Any code in 'Biomarker-ER'
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
  const tm: mcode.TumorMarker = {};
  tm.code = [] as Coding[];
  tm.interpretation = [] as Coding[];
  tm.valueCodeableConcept = [] as Coding[];
  tm.valueQuantity = [] as mcode.Quantity[];
  tm.valueRatio = [] as mcode.Ratio[];

  tm.code.push({ system: 'http://loinc.info/sct', code: '10861-3', display: 'N/A' } as Coding); // Any code in 'Biomarker-PR'
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
  const tm: mcode.TumorMarker = {};
  tm.code = [] as Coding[];
  tm.interpretation = [] as Coding[];
  tm.valueCodeableConcept = [] as Coding[];
  tm.valueQuantity = [] as mcode.Quantity[];
  tm.valueRatio = [] as mcode.Ratio[];

  tm.code.push({ system: 'http://loinc.info/sct', code: '10861-3', display: 'N/A' } as Coding); // Any code in 'Biomarker-PR'
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
  const tm: mcode.TumorMarker = {};
  tm.code = [] as Coding[];
  tm.interpretation = [] as Coding[];
  tm.valueCodeableConcept = [] as Coding[];
  tm.valueQuantity = [] as mcode.Quantity[];
  tm.valueRatio = [] as mcode.Ratio[];

  tm.code.push({ system: 'http://loinc.info/sct', code: '10861-3', display: 'N/A' } as Coding); // Any code in 'Biomarker-PR'
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
  const tm: mcode.TumorMarker = {};
  tm.code = [] as Coding[];
  tm.interpretation = [] as Coding[];
  tm.valueCodeableConcept = [] as Coding[];
  tm.valueQuantity = [] as mcode.Quantity[];
  tm.valueRatio = [] as mcode.Ratio[];

  tm.code.push({ system: 'http://loinc.info/sct', code: '10861-3', display: 'N/A' } as Coding); // Any code in 'Biomarker-PR'
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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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

  const tumorMarker : mcode.TumorMarker = {
    code: [] as Coding[],
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    valueQuantity: [] as Coding[],
    valueRatio: [] as mcode.Ratio[]
  };

  tumorMarker.code.push({ system: 'loinc', code: '21652-3', display: 'n/a' });
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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
  const tumorMarker : mcode.TumorMarker = {
    code: [] as Coding[],
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    valueQuantity: [] as Coding[],
    valueRatio: [] as mcode.Ratio[]
  };

  tumorMarker.code.push({ system: 'loinc', code: '72518-4', display: 'n/a' });
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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
  const tumorMarker : mcode.TumorMarker = {
    code: [] as Coding[],
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    valueQuantity: [] as Coding[],
    valueRatio: [] as mcode.Ratio[]
  };

  tumorMarker.code.push({ system: 'loinc', code: '82515-8', display: 'n/a' });
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
  const tumorMarker : mcode.TumorMarker = {
    code: [] as Coding[],
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    valueQuantity: [] as Coding[],
    valueRatio: [] as mcode.Ratio[]
  };

  tumorMarker.code.push({ system: 'loinc', code: '82515-8', display: 'n/a' });
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
  const tumorMarker : mcode.TumorMarker = {
    code: [] as Coding[],
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    valueQuantity: [] as Coding[],
    valueRatio: [] as mcode.Ratio[]
  };

  tumorMarker.code.push({ system: 'loinc', code: '21717-4', display: 'n/a' });
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
  const tumorMarker : mcode.TumorMarker = {
    code: [] as Coding[],
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    valueQuantity: [] as Coding[],
    valueRatio: [] as mcode.Ratio[]
  };

  tumorMarker.code.push({ system: 'loinc', code: '21718-2', display: 'n/a' });
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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
  const tm: mcode.TumorMarker = {};
  tm.code = [] as Coding[];
  tm.interpretation = [] as Coding[];
  tm.valueCodeableConcept = [] as Coding[];
  tm.valueQuantity = [] as mcode.Quantity[];
  tm.valueRatio = [] as mcode.Ratio[];

  tm.code.push({ system: 'http://loinc.info/sct', code: '42795-5', display: 'N/A' } as Coding); // Any code in 'Biomarker-RB'
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
  const tm: mcode.TumorMarker = {};
  tm.code = [] as Coding[];
  tm.interpretation = [] as Coding[];
  tm.valueCodeableConcept = [] as Coding[];
  tm.valueQuantity = [] as mcode.Quantity[];
  tm.valueRatio = [] as mcode.Ratio[];

  tm.code.push({ system: 'http://loinc.info/sct', code: '42795-5', display: 'N/A' } as Coding); // Any code in 'Biomarker-RB'
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
  const tm: mcode.TumorMarker = {};
  tm.code = [] as Coding[];
  tm.interpretation = [] as Coding[];
  tm.valueCodeableConcept = [] as Coding[];
  tm.valueQuantity = [] as mcode.Quantity[];
  tm.valueRatio = [] as mcode.Ratio[];

  tm.code.push({ system: 'http://loinc.info/sct', code: '42795-5', display: 'N/A' } as Coding); // Any code in 'Biomarker-RB'
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
  const tm: mcode.TumorMarker = {};
  tm.code = [] as Coding[];
  tm.interpretation = [] as Coding[];
  tm.valueCodeableConcept = [] as Coding[];
  tm.valueQuantity = [] as mcode.Quantity[];
  tm.valueRatio = [] as mcode.Ratio[];

  tm.code.push({ system: 'http://loinc.info/sct', code: '42795-5', display: 'N/A' } as Coding); // Any code in 'Biomarker-RB'
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
  const tm: mcode.TumorMarker = {};
  tm.code = [] as Coding[];
  tm.interpretation = [] as Coding[];
  tm.valueCodeableConcept = [] as Coding[];
  tm.valueQuantity = [] as mcode.Quantity[];
  tm.valueRatio = [] as mcode.Ratio[];

  tm.code.push({ system: 'http://loinc.info/sct', code: '32996-1', display: 'N/A' } as Coding); // Any code in 'Biomarker-HER2'
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
  const tm: mcode.TumorMarker = {};
  tm.code = [] as Coding[];
  tm.interpretation = [] as Coding[];
  tm.valueCodeableConcept = [] as Coding[];
  tm.valueQuantity = [] as mcode.Quantity[];
  tm.valueRatio = [] as mcode.Ratio[];

  tm.code.push({ system: 'http://loinc.info/sct', code: '32996-1', display: 'N/A' } as Coding); // Any code in 'Biomarker-HER2'
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
  const tm: mcode.TumorMarker = {};
  tm.code = [] as Coding[];
  tm.interpretation = [] as Coding[];
  tm.valueCodeableConcept = [] as Coding[];
  tm.valueQuantity = [] as mcode.Quantity[];
  tm.valueRatio = [] as mcode.Ratio[];

  tm.code.push({ system: 'http://loinc.info/sct', code: '42785-6', display: 'N/A' } as Coding); // Any code in 'Biomarker-FGFR'
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
  const tm: mcode.TumorMarker = {};
  tm.code = [] as Coding[];
  tm.interpretation = [] as Coding[];
  tm.valueCodeableConcept = [] as Coding[];
  tm.valueQuantity = [] as mcode.Quantity[];
  tm.valueRatio = [] as mcode.Ratio[];

  tm.code.push({ system: 'http://loinc.info/sct', code: '42785-6', display: 'N/A' } as Coding); // Any code in 'Biomarker-FGFR'
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
  const tm: mcode.TumorMarker = {};
  tm.code = [] as Coding[];
  tm.interpretation = [] as Coding[];
  tm.valueCodeableConcept = [] as Coding[];
  tm.valueQuantity = [] as mcode.Quantity[];
  tm.valueRatio = [] as mcode.Ratio[];

  tm.code.push({ system: 'http://loinc.info/sct', code: '42785-6', display: 'N/A' } as Coding); // Any code in 'Biomarker-FGFR'
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
  const tm: mcode.TumorMarker = {};
  tm.code = [] as Coding[];
  tm.interpretation = [] as Coding[];
  tm.valueCodeableConcept = [] as Coding[];
  tm.valueQuantity = [] as mcode.Quantity[];
  tm.valueRatio = [] as mcode.Ratio[];

  tm.code.push({ system: 'http://loinc.info/sct', code: '42785-6', display: 'N/A' } as Coding); // Any code in 'Biomarker-FGFR'
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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
  const tm: mcode.TumorMarker = {};
  tm.code = [] as Coding[];
  tm.interpretation = [] as Coding[];
  tm.valueCodeableConcept = [] as Coding[];
  tm.valueQuantity = [] as mcode.Quantity[];
  tm.valueRatio = [] as mcode.Ratio[];

  tm.code.push({ system: 'http://loinc.info/sct', code: '96268-8', display: 'N/A' } as Coding);
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
  const tm: mcode.TumorMarker = {};
  tm.code = [] as Coding[];
  tm.interpretation = [] as Coding[];
  tm.valueCodeableConcept = [] as Coding[];
  tm.valueQuantity = [] as mcode.Quantity[];
  tm.valueRatio = [] as mcode.Ratio[];

  tm.code.push({ system: 'http://loinc.info/sct', code: '83052-1', display: 'N/A' } as Coding);
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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
  const cgv: mcode.CancerGeneticVariant = {
    valueCodeableConcept: [] as Coding[],
    interpretation: [] as Coding[],
    component: {} as mcode.CancerGeneticVariantComponent
  };
  const cgvComponent: mcode.CancerGeneticVariantComponent = {
    geneStudied: [] as mcode.CancerGeneticVariantComponentType[],
    genomicsSourceClass: [] as mcode.CancerGeneticVariantComponentType[]
  };
  const cgvGeneStudied: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };
  const cgvGenomicSourceClass: mcode.CancerGeneticVariantComponentType = {
    valueCodeableConcept: { coding: [] as Coding[] },
    interpretation: { coding: [] as Coding[] }
  };

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
describe('checkHistologyMorphologyFilterLogic-INVASIVE_BREAST_CANCER', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const pcc: PrimaryCancerCondition = {};
  pcc.clinicalStatus = [] as Coding[];
  pcc.coding = [] as Coding[];
  pcc.histologyMorphologyBehavior = [] as Coding[];

  // Invasive Breast Cancer Filter Attributes
  pcc.coding.push({ system: 'http://snomed.info/sct', code: '783541009', display: 'N/A' } as Coding); // Any Code in 'Cancer-Breast'
  pcc.histologyMorphologyBehavior.push({
    system: 'http://snomed.info/sct',
    code: '446688004',
    display: 'N/A'
  } as Coding); // Any code in 'Morphology-Invasive'

  extractedMCODE.primaryCancerCondition.push(pcc);

  it('Test Invasive Breast Cancer Filter', () => {
    expect(extractedMCODE.getHistologyMorphologyValue()).toBe('INVASIVE_BREAST_CANCER');
  });
});
describe('checkHistologyMorphologyFilterLogic-INVASIVE_DUCTAL_CARCINOMA', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const pcc: PrimaryCancerCondition = {};
  pcc.clinicalStatus = [] as Coding[];
  pcc.coding = [] as Coding[];
  pcc.histologyMorphologyBehavior = [] as Coding[];

  // Invasive Ductal Carcinoma Filter Attributes
  pcc.coding.push({ system: 'http://snomed.info/sct', code: '783541009', display: 'N/A' } as Coding); // Any Code in 'Cancer-Breast'
  pcc.histologyMorphologyBehavior.push({
    system: 'http://snomed.info/sct',
    code: '444134008',
    display: 'N/A'
  } as Coding); // Any code in 'Morphology-Invas_Duct_Carc'

  extractedMCODE.primaryCancerCondition.push(pcc);

  it('Test Invasive Invasive Ductal Carcinoma Filter', () => {
    expect(extractedMCODE.getHistologyMorphologyValue()).toBe('INVASIVE_DUCTAL_CARCINOMA');
  });
});
describe('checkHistologyMorphologyFilterLogic-INVASIVE_LOBULAR_CARCINOMA', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const pcc: PrimaryCancerCondition = {};
  pcc.clinicalStatus = [] as Coding[];
  pcc.coding = [] as Coding[];
  pcc.histologyMorphologyBehavior = [] as Coding[];

  // Invasive Lobular Carcinoma Filter Attributes
  pcc.coding.push({ system: 'http://snomed.info/sct', code: '1080261000119100', display: 'N/A' } as Coding); // Any Code in 'Cancer-Invas Lob Carc'

  extractedMCODE.primaryCancerCondition.push(pcc);

  it('Test Invasive Lobular Carcinoma Filter', () => {
    expect(extractedMCODE.getHistologyMorphologyValue()).toBe('INVASIVE_LOBULAR_CARCINOMA');
  });
});
describe('checkHistologyMorphologyFilterLogic-DUCTAL_CARCINOMA_IN_SITU', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const pcc: PrimaryCancerCondition = {};
  pcc.clinicalStatus = [] as Coding[];
  pcc.coding = [] as Coding[];
  pcc.histologyMorphologyBehavior = [] as Coding[];

  // Ductal Carcinoma In Situ Filter Attributes
  pcc.coding.push({ system: 'http://snomed.info/sct', code: '783541009', display: 'N/A' } as Coding); // Any Code in 'Cancer-Breast'
  pcc.histologyMorphologyBehavior.push({
    system: 'http://snomed.info/sct',
    code: '18680006',
    display: 'N/A'
  } as Coding); // Any code in 'Morphology-Duct_Car_In_Situ'

  extractedMCODE.primaryCancerCondition.push(pcc);

  it('Test Ductal Carcinoma In Situ Filter', () => {
    expect(extractedMCODE.getHistologyMorphologyValue()).toBe('DUCTAL_CARCINOMA_IN_SITU');
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

/* Test Primary Cancer Condition logic */
describe('checkPrimaryCancerFilterLogic-LocallyRecurrent', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const pcc: PrimaryCancerCondition = {};
  pcc.clinicalStatus = [] as Coding[];
  pcc.coding = [] as Coding[];
  pcc.histologyMorphologyBehavior = [] as Coding[];

  // Locally Recurrent Filter Attributes
  pcc.coding.push({ system: 'http://snomed.info/sct', code: '783541009', display: 'N/A' } as Coding);
  pcc.clinicalStatus.push({ system: 'N/A', code: 'recurrence', display: 'N/A' } as Coding);

  extractedMCODE.primaryCancerCondition.push(pcc);

  it('Test Locally Recurrent Filter', () => {
    expect(extractedMCODE.getPrimaryCancerValue()).toBe('LOCALLY_RECURRENT');
  });
});
describe('checkPrimaryCancerFilterLogic-InvasiveBreastCancerandRecurrent', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const pcc: PrimaryCancerCondition = {};
  pcc.clinicalStatus = [] as Coding[];
  pcc.coding = [] as Coding[];
  pcc.histologyMorphologyBehavior = [] as Coding[];

  // Invasive Breast Cancer and Recurrent Filter Attributes
  pcc.coding.push({ system: 'http://snomed.info/sct', code: '783541009', display: 'N/A' } as Coding); // Any Code in 'Cancer-Breast'
  pcc.histologyMorphologyBehavior.push({
    system: 'http://snomed.info/sct',
    code: '734075007',
    display: 'N/A'
  } as Coding); // Any code in 'Morphology-Invasive'
  pcc.clinicalStatus.push({ system: 'N/A', code: 'recurrence', display: 'N/A' } as Coding);

  extractedMCODE.primaryCancerCondition.push(pcc);

  it('Test Invasive Breast Cancer and Recurrent Filter', () => {
    expect(extractedMCODE.getPrimaryCancerValue()).toBe('INVASIVE_BREAST_CANCER_AND_RECURRENT');
  });
});
describe('checkPrimaryCancerFilterLogic-BreastCancer', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const pcc: PrimaryCancerCondition = {};
  pcc.clinicalStatus = [] as Coding[];
  pcc.coding = [] as Coding[];
  pcc.histologyMorphologyBehavior = [] as Coding[];

  // Breast Cancer Filter Attributes
  pcc.clinicalStatus.push({ system: 'N/A', code: 'N/A', display: 'N/A' } as Coding);
  pcc.coding.push({ system: 'http://snomed.info/sct', code: '783541009', display: 'N/A' } as Coding);
  pcc.histologyMorphologyBehavior.push({ system: 'N/A', code: 'N/A', display: 'N/A' } as Coding);

  extractedMCODE.primaryCancerCondition.push(pcc);

  it('Test Breast Cancer Filter', () => {
    expect(extractedMCODE.getPrimaryCancerValue()).toBe('BREAST_CANCER');
  });
});
describe('checkPrimaryCancerFilterLogic-ConcomitantInvasiveMalignancies', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const pcc: PrimaryCancerCondition = {};
  pcc.clinicalStatus = [] as Coding[];
  pcc.coding = [] as Coding[];
  pcc.histologyMorphologyBehavior = [] as Coding[];
  const tnmClinical: Coding[] = [] as Coding[];
  const tnmPathological: Coding[] = [] as Coding[];

  // Concomitant invasive malignancies Filter Attributes
  pcc.coding.push({ system: 'http://snomed.info/sct', code: '67097003', display: 'N/A' } as Coding); // Any code not in 'Cancer-Breast'
  pcc.histologyMorphologyBehavior.push({ system: 'N/A', code: 'N/A', display: 'N/A' } as Coding);
  pcc.clinicalStatus.push({ system: 'N/A', code: 'active', display: 'N/A' } as Coding);
  tnmClinical.push({ system: 'AJCC', code: 'II', display: 'N/A' } as Coding); // Any code in 'Stage-2'

  extractedMCODE.primaryCancerCondition.push(pcc);
  extractedMCODE.TNMClinicalStageGroup = tnmClinical;
  extractedMCODE.TNMPathologicalStageGroup = tnmPathological;

  it('Test Concomitant invasive malignancies Filter', () => {
    expect(extractedMCODE.getPrimaryCancerValue()).toBe('CONCOMITANT_INVASIVE_MALIGNANCIES');
  });
});
describe('checkPrimaryCancerFilterLogic-OtherMalignancyExceptSkinOrCervical ', () => {
  // Initialize
  const extractedMCODE = new mcode.ExtractedMCODE(null);
  const pcc: PrimaryCancerCondition = {};
  pcc.clinicalStatus = [] as Coding[];
  pcc.coding = [] as Coding[];
  pcc.histologyMorphologyBehavior = [] as Coding[];

  // Other malignancy - except skin or cervical  Filter Attributes
  pcc.coding.push({ system: 'http://snomed.info/sct', code: '67097003', display: 'N/A' } as Coding); // Any code not in 'Cancer-Breast'
  pcc.clinicalStatus.push({ system: 'N/A', code: 'active', display: 'N/A' } as Coding);

  extractedMCODE.primaryCancerCondition.push(pcc);

  it('Test Other malignancy - except skin or cervical  Filter', () => {
    expect(extractedMCODE.getPrimaryCancerValue()).toBe('OTHER_MALIGNANCY_EXCEPT_SKIN_OR_CERVICAL');
  });
});