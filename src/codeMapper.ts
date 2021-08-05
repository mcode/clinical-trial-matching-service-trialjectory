import { Coding } from "./mcode";

export class CodeMapper {
  // Map<Profile -> Map<System -> List<Codes>>>
  code_map: Map<String, Map<String, String[]>>;

  /**
   * Constructor
   * @param code_mapping_file
   */
  constructor(code_mapping_file: any) {
    this.code_map = CodeMapper.convertJsonToMap(code_mapping_file);
    console.log(this.code_map);
    console.log(JSON.stringify(this.code_map));
  }

  static convertJsonToMap(obj: {
    [key: string]: ProfileSystemCodes;
  }): Map<String, Map<String, String[]>> {
    const profile_map = new Map<String, Map<String, String[]>>();
    for (const profile_key of Object.keys(obj)) {
      const code_map = new Map<String, String[]>();
      for (const system_key of Object.keys(obj[profile_key])) {
        const codes = obj[profile_key][system_key];
        const code_strings: String[] = codes.map(function (code) {
          return code.code;
        });
        code_map.set(system_key, code_strings);
      }
      //inserting new key value pair inside map
      profile_map.set(profile_key, code_map);
    }
    return profile_map;
  }

  /**
   * Checks whether the given code is within one of the given profile mappings.
   */
  codeIsInMapping(coding: Coding, ...profiles: string[]): boolean {
    const system = CodeMapper.normalizeCodeSystem(coding.system);
    for (const profile of profiles) {
      const code_profiles: Map<String, String[]> = this.code_map.get(profile); // Pull the codes for the profile
      console.log(profile)
      console.log("Stringified: " + JSON.stringify(this.code_map));
      console.log("Str8 up: " + (this.code_map));
      const codes_to_check: String[] = code_profiles.get(system);
      if(codes_to_check == undefined){
        throw "Profile \'" + profile + "\' does not exist in the given profile mappings."
      }
      if (
        codes_to_check.includes(coding.code) ||
        codes_to_check.includes(coding.display)
      ) {
        return true;
      }
    }
    return false;
  }

  /**
   * Returns whether the given code is any code not in the given profile.
   */
  codeIsNotInMapping(coding: Coding, profile: string): boolean {
    if (coding.code == undefined || coding.code == null) {
      return false;
    } else {
      return !this.codeIsInMapping(coding, profile);
    }
  }

  /**
   * Normalize the code system.
   * @param codeSystem
   * @returns
   */
  static normalizeCodeSystem(codeSystem: string): string {
    const lowerCaseCodeSystem: string = codeSystem.toLowerCase();
    if (lowerCaseCodeSystem.includes("snomed")) {
      return "SNOMED";
    } else if (lowerCaseCodeSystem.includes("rxnorm")) {
      return "RxNorm";
    } else if (lowerCaseCodeSystem.includes("icd-10")) {
      return "ICD-10";
    } else if (
      lowerCaseCodeSystem.includes("ajcc") ||
      lowerCaseCodeSystem.includes("cancerstaging.org")
    ) {
      return "AJCC";
    } else if (lowerCaseCodeSystem.includes("loinc")) {
      return "LOINC";
    } else if (lowerCaseCodeSystem.includes("nih")) {
      return "NIH";
    } else if (
      lowerCaseCodeSystem.includes("hgnc") ||
      lowerCaseCodeSystem.includes("genenames.org")
    ) {
      return "HGNC";
    } else if (lowerCaseCodeSystem.includes("hl7")) {
      return "HL7";
    } else {
      console.log("Profile codes do not support code system: " + codeSystem);
      return "";
    }
  }
}

interface ProfileSystemCodes {
  [system: string]: { code: String }[];
}
