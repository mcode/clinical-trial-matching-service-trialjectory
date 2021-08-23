import { Coding } from "./mcode";

/**
 * Enumeration of the possible code systems.
 * Source: https://masteringjs.io/tutorials/fundamentals/enum
 */
export class CodeSystemEnum {
  /**
   * Enums.
   */
  static ICD10 = new CodeSystemEnum("ICD10");
  static SNOMED = new CodeSystemEnum("SNOMED");
  static RXNORM = new CodeSystemEnum("RXNORM");
  static AJCC = new CodeSystemEnum("AJCC");
  static LOINC = new CodeSystemEnum("LOINC");
  static NIH = new CodeSystemEnum("NIH");
  static HGNC = new CodeSystemEnum("HGNC");
  static HL7 = new CodeSystemEnum("HL7");

  system: string;

  /**
   * Constructor
   * @param system
   */
  constructor(system: string) {
    this.system = system;
  }

  toString(): string {
    return this.system;
  }
}

/**
 * A class that acts a Code Mapper.
 */
export class CodeMapper {
  // Map<Profile -> MedicalCode[]>
  profile_map: Map<string, MedicalCode[]>;
  // Map<MedicalCode -> Profile[]>
  code_map: Map<string, string[]>;

  /**
   * Constructor for a Code Mapper.
   * @param code_mapping_file The file that dictates the code mapping.
   */
  constructor(code_mapping_file: {[key: string]: ProfileSystemCodes;}) {
    this.code_map = CodeMapper.convertJsonToCodeMap(code_mapping_file);
    this.profile_map = CodeMapper.convertJsonToProfileMap(code_mapping_file);
  }

  /**
   * Converts the JSON object to the Map<Code -> Profile[]> format.
   * @param obj The JSON object.
   * @returns Map<String. Map<String -> List<String>>>
   */
  static convertJsonToCodeMap(obj: {
    [key: string]: ProfileSystemCodes;
  }): Map<string, string[]> {
    const code_map = new Map<string, string[]>();
    for (const profile of Object.keys(obj)) {
      for (const system of Object.keys(obj[profile])) {
        for (const code of obj[profile][system]) {
          const code_string = new MedicalCode(code, system).toString();
          if (code_map.get(code_string) == undefined) {
            code_map.set(code_string, []);
          }
          code_map.get(code_string).push(profile);
        }
      }
    }
    return code_map;
  }

  /**
   * Converts the JSON object to the Map<Profile -> Map<System -> List<Codes>>> format.
   * @param obj The JSON object.
   * @returns Map<String. Map<String -> MedicalCode[]>
   */
  static convertJsonToProfileMap(obj: {
    [key: string]: ProfileSystemCodes;
  }): Map<string, MedicalCode[]> {
    const profile_map = new Map<string, MedicalCode[]>();
    for (const profile of Object.keys(obj)) {
      const code_list: MedicalCode[] = [];
      for (const system of Object.keys(obj[profile])) {
        const codes = obj[profile][system];
        codes.forEach((code) => code_list.push(new MedicalCode(code, system)));
      }
      // For the current profile, insert the list of associated medical codes.
      profile_map.set(profile, code_list);
    }

    return profile_map;
  }

  extractCodeMappings(coding: Coding[]): string[] {
    const extracted_mappings: string[] = [];
    for (const code of coding) {
      const medical_code_key = new MedicalCode(code.code, code.system).toString();
      if (this.code_map.has(medical_code_key)) {
        extracted_mappings.push(...this.code_map.get(medical_code_key));
      }
    }
    return extracted_mappings;
  }

  /**
   * Checks whether the given code is within one of the given profile mappings.
   */
  codeIsInMapping(coding: Coding, ...profiles: string[]): boolean {
    for (const profile of profiles) {
      if (!this.profile_map.has(profile)) {
        throw ("Profile '" + profile + "' does not exist in the given profile mappings.");
      }
      const medical_codes: MedicalCode[] = this.profile_map.get(profile); // Pull the codes for the profile.
      const medical_code = new MedicalCode(coding.code, coding.system); // Create the medical code of this coding.
      if (medical_codes.some((element) => element.equalsMedicalCode(medical_code))) { // Check if the given code is in the list of Medical Codes.
        return true;
      }
    }
    return false;
  }

  /**
   * Checks whether one of the given codes is within one of the given profile mappings.
   */
  aCodeIsInMapping(coding: Coding[], ...profiles: string[]): boolean {
    return coding.some((code) => {
      return this.codeIsInMapping(code, ...profiles);
    });
  }

  /**
   * Returns whether the given coding equals the given code attributes.
   * @param input_coding
   * @param system
   * @param code
   */
  static codesEqual(input_coding: Coding, system: CodeSystemEnum, code: string ): boolean {
    return new MedicalCode(input_coding.code, input_coding.system).equalsMedicalCode(new MedicalCode(code, system.toString()));
  }

  /**
   * Returns whether the given code is any code not in the given profile.
   */
  codeIsNotInMapping(coding: Coding, profile: string): boolean {
    if (coding == undefined || coding == null) {
      return false;
    } else {
      return !this.codeIsInMapping(coding, profile);
    }
  }

  /**
   * Normalize the code system to a consistent format.
   * @param codeSystem  The code system to normalize.
   * @returns The normalized code system.
   */
  static normalizeCodeSystem(codeSystem: string): CodeSystemEnum {
    const lowerCaseCodeSystem: string = codeSystem.toLowerCase();
    if (lowerCaseCodeSystem.includes("snomed")) {
      return CodeSystemEnum.SNOMED;
    } else if (lowerCaseCodeSystem.includes("rxnorm")) {
      return CodeSystemEnum.RXNORM;
    } else if (
      lowerCaseCodeSystem.includes("icd-10") ||
      lowerCaseCodeSystem.includes("icd10")
    ) {
      return CodeSystemEnum.ICD10;
    } else if (
      lowerCaseCodeSystem.includes("ajcc") ||
      lowerCaseCodeSystem.includes("cancerstaging.org")
    ) {
      return CodeSystemEnum.AJCC;
    } else if (lowerCaseCodeSystem.includes("loinc")) {
      return CodeSystemEnum.LOINC;
    } else if (lowerCaseCodeSystem.includes("nih")) {
      return CodeSystemEnum.NIH;
    } else if (
      lowerCaseCodeSystem.includes("hgnc") ||
      lowerCaseCodeSystem.includes("genenames.org")
    ) {
      return CodeSystemEnum.HGNC;
    } else if (lowerCaseCodeSystem.includes("hl7")) {
      return CodeSystemEnum.HL7;
    } else {
      throw "Profile codes do not support code system: " + codeSystem;
    }
  }
}

/**
 * A class that defines a medical code.
 */
class MedicalCode {
  code: string;
  system: CodeSystemEnum;

  /**
   * Constructor.
   * @param code_string
   * @param system_string
   * @param system_enum
   */
  constructor(
    code_string?: string,
    system_string?: string,
  ) {
    this.code = code_string;
    this.system = CodeMapper.normalizeCodeSystem(system_string);
  }

  toString() {
    return (
      "Medical Code {code: " + this.code + ", system: " + this.system.toString() + "}"
    );
  }

  equalsMedicalCode(that: MedicalCode) {
    return this.toString() === that.toString();
  }
}

/**
 * Describes the format that the JSON object should be made up of.
 */
interface ProfileSystemCodes {
  // System -> Code[]
  [system: string]: string[];
}
