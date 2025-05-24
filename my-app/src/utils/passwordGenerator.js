const UPPERCASE_CHAR_CODES = Array.from(Array(26)).map((_, i) => i + 65);
const LOWERCASE_CHAR_CODES = Array.from(Array(26)).map((_, i) => i + 97);
const NUMBER_CHAR_CODES = Array.from(Array(10)).map((_, i) => i + 48);
const SYMBOL_CHAR_CODES = Array.from(Array(11)).map((_, i) => i + 33) // !"#$%&'()*+
  .concat(Array.from(Array(7)).map((_, i) => i + 58)) // :;<=>?@
  .concat(Array.from(Array(6)).map((_, i) => i + 91)) // [\]^_`
  .concat(Array.from(Array(4)).map((_, i) => i + 123)); // {|}~

export function generatePassword(length, includeUppercase, includeLowercase, includeNumbers, includeSymbols) {
  let charCodes = [];
  if (includeUppercase) charCodes = charCodes.concat(UPPERCASE_CHAR_CODES);
  if (includeLowercase) charCodes = charCodes.concat(LOWERCASE_CHAR_CODES);
  if (includeNumbers) charCodes = charCodes.concat(NUMBER_CHAR_CODES);
  if (includeSymbols) charCodes = charCodes.concat(SYMBOL_CHAR_CODES);

  if (charCodes.length === 0) {
    // Default to lowercase if no character type is selected
    // Alternatively, could return an error or empty string.
    // For this implementation, let's default to lowercase.
    charCodes = LOWERCASE_CHAR_CODES;
    if (charCodes.length === 0) return ""; // Should not happen with current defaults
  }

  const passwordCharacters = [];
  
  // Ensure at least one character from each selected type
  const selectedTypes = [];
  if (includeUppercase) selectedTypes.push(UPPERCASE_CHAR_CODES);
  if (includeLowercase) selectedTypes.push(LOWERCASE_CHAR_CODES);
  if (includeNumbers) selectedTypes.push(NUMBER_CHAR_CODES);
  if (includeSymbols) selectedTypes.push(SYMBOL_CHAR_CODES);

  // If no types are selected but we defaulted to lowercase, reflect that.
  if (selectedTypes.length === 0 && charCodes === LOWERCASE_CHAR_CODES) {
      selectedTypes.push(LOWERCASE_CHAR_CODES);
  }
  
  // Ensure length is sufficient for all selected types
  if (length < selectedTypes.length) {
      // This case needs careful handling. For now, let's generate
      // from the combined pool if length is too short.
      // A better approach might be to throw an error or adjust length.
      // console.warn("Password length is too short to include all selected character types. Generating from combined pool.");
  } else {
    selectedTypes.forEach(typeSet => {
      if (typeSet.length > 0) { // Ensure the typeSet is not empty
        const randomBytes = new Uint32Array(1);
        window.crypto.getRandomValues(randomBytes);
        const characterCode = typeSet[randomBytes[0] % typeSet.length];
        passwordCharacters.push(String.fromCharCode(characterCode));
      }
    });
  }


  const remainingLength = length - passwordCharacters.length;
  if (remainingLength > 0 && charCodes.length > 0) { // Check if charCodes is not empty
    const randomValues = new Uint32Array(remainingLength);
    window.crypto.getRandomValues(randomValues);
    for (let i = 0; i < remainingLength; i++) {
      const characterCode = charCodes[randomValues[i] % charCodes.length];
      passwordCharacters.push(String.fromCharCode(characterCode));
    }
  } else if (remainingLength < 0 && charCodes.length > 0) {
      // This means more mandatory characters were added than the password length.
      // Trim to the desired length. This might remove some of the guaranteed characters.
      // This scenario implies length < selectedTypes.length
      while(passwordCharacters.length > length) {
          passwordCharacters.pop();
      }
  }


  // Shuffle the password characters to ensure randomness of positions
  // for the guaranteed characters.
  for (let i = passwordCharacters.length - 1; i > 0; i--) {
    const randomBytes = new Uint32Array(1);
    window.crypto.getRandomValues(randomBytes);
    const j = randomBytes[0] % (i + 1);
    [passwordCharacters[i], passwordCharacters[j]] = [passwordCharacters[j], passwordCharacters[i]];
  }

  return passwordCharacters.join('');
}
