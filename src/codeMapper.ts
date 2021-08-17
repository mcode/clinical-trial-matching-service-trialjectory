import { Coding } from "./mcode";

/**
 * Enumeration of the possible code systems.
 * Source: https://masteringjs.io/tutorials/fundamentals/enum
 * This source also details a more sophisticated approach using classes, may be worth implementing.
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

  /**
   * Field.
   */
  system: string;

  /**
   * Constructor
   * @param system 
   */
  constructor(system: string){
    this.system = system;
  }

  toString(){
    return this.system;
  }
}

/**
 * A class that acts a Code Mapper.
 */
export class CodeMapper {
  // Map<Profile -> MedicalCode[]>
  code_map: Map<string, MedicalCode[]>;
  // Map<MedicalCode -> Profile>
  // code_map: Map<MedicalCode, string[]>;

  /**
   * Constructor for a Code Mapper.
   * @param code_mapping_file The file that dictates the code mapping.
   */
  constructor(code_mapping_file: any) {
    this.code_map = CodeMapper.convertJsonToMap(code_mapping_file);
  }

  /**
   * Converts the JSON object to the Map<Profile -> Map<System -> List<Codes>>> format.
   * @param obj The JSON object.
   * @returns Map<String. Map<String -> List<String>>>
   */
  static convertJsonToMap(obj: {
    [key: string]: ProfileSystemCodes;
  }): Map<string, MedicalCode[]> {
    const profile_map = new Map<string, MedicalCode[]>();
    for (const profile of Object.keys(obj)) {
      const code_list: MedicalCode[] = [];
      for (const system of Object.keys(obj[profile])) {
        const codes = obj[profile][system];
        codes.forEach((code) => code_list.push(new MedicalCode(code, system)))
      }
      // For the current profile, insert the list of associated medical codes.
      profile_map.set(profile, code_list);
    }

    // throw profile_map
    // const medicalCodes = [];
    // for(var medicalcodelist of profile_map.values()){

    //       // Filter any duplicate values.
    //       medicalcodelist = medicalcodelist.filter((a, b) => medicalcodelist.indexOf(a) === b)

    //   for(const medicalcode of medicalcodelist){
    //     medicalCodes.push(medicalcode.system + "|" + medicalcode.code);
    //   }
    // }

    // // throw medicalCodes;

    // let findDuplicates = (arr: any[]) => arr.filter((item: any, index: any) => arr.indexOf(item) != index);

    // throw "duplicates" + findDuplicates(medicalCodes);

    return profile_map;
  }

  /**
   * Checks whether the given code is within one of the given profile mappings.
   */
  codeIsInMapping(coding: Coding, ...profiles: string[]): boolean {
    for (const profile of profiles) {
      if (!this.code_map.has(profile)) {
        throw "Profile '" + profile + "' does not exist in the given profile mappings."
      }
      const medical_codes: MedicalCode[] = this.code_map.get(profile); // Pull the codes for the profile.
      const medical_code = new MedicalCode(coding.code, coding.system); // Create the medical code of this coding.
      if (medical_codes.some(element => element.equalsMedicalCode(medical_code))) { // Check if the given code is in the list of Medical Codes.
        return true;
      }
    }
    return false;
  }

  /**
   * Checks whether one of the given codes is within one of the given profile mappings.
   */
    aCodeIsInMapping(coding: Coding[], ...profiles: string[]): boolean {
      return coding.some(code => {
        return this.codeIsInMapping(code, ...profiles);
      });
    }

    /**
     * Returns whether the given coding equals the given code attributes.
     * @param input_coding
     * @param system 
     * @param code 
     */
    static codesEqual(input_coding: Coding, system: CodeSystemEnum, code: string) {
      return new MedicalCode(null, null, null, input_coding).equalsMedicalCode(new MedicalCode(code, null, system));
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
    } else if (lowerCaseCodeSystem.includes("icd-10") || lowerCaseCodeSystem.includes("icd10")) {
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
      throw ("Profile codes do not support code system: " + codeSystem);
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
   * 
   * @param coding 
   * @param code_string 
   * @param system_string 
   * @param system_enum 
   */
  constructor(code_string?: string, system_string?: string, system_enum?: CodeSystemEnum, coding?: Coding) {
    if(coding) {
      code_string = coding.code
      system_string = coding.system
    }
    if(code_string) {
      this.code = code_string;
    }
    if(system_string){
      this.system = CodeMapper.normalizeCodeSystem(system_string);
    }
    else if(system_enum) {
      this.system = system_enum;
    }
  }


  toString() {
    return 'Medical Code: {code: ' + this.code + ', system: ' + this.system + '}';
  }

  valueOf() {
    return this.code + this.system;
  }

  equalsMedicalCode(that: MedicalCode) {
    return this.valueOf() === that.valueOf()
  }

}

/**
 * Describes the format that the JSON object should be made up of.
 */
interface ProfileSystemCodes {
  [system: string]: string[];
}
