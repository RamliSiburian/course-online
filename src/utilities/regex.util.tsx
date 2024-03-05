export default abstract class RegexText {
  static email() {
    return /^([\S]+(@)+[a-zA-Z0-9]+(.)+[a-z0-9\.])$/g
  }

  static historyPath() {
    return /^\/history\/[\w-]+$/
  }

  static verifyLength(min: number, max: number) {
    return new RegExp(`^[\\w\\W\\s\\W]{${min},${max}}$`, 'g')
  }
  static standartPassword() {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,32}$/g
  }

  static phoneNumber() {
    return new RegExp('+?([ -]?d+)+|(d+)([ -]d+)')
  }
}
