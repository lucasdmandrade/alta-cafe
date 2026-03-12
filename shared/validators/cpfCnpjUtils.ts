export const cpfCnpjUtils = {
  validarCPF(cpf: string): boolean {
    const digits = cpf.replace(/\D/g, '');
    if (digits.length !== 11) return false;
    if (/^(\d)\1+$/.test(digits)) return false;

    let sum = 0;
    for (let i = 0; i < 9; i++) sum += parseInt(digits[i]) * (10 - i);
    let rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(digits[9])) return false;

    sum = 0;
    for (let i = 0; i < 10; i++) sum += parseInt(digits[i]) * (11 - i);
    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    return rest === parseInt(digits[10]);
  },

  validarCNPJ(cnpj: string): boolean {
    const digits = cnpj.replace(/\D/g, '');
    if (digits.length !== 14) return false;
    if (/^(\d)\1+$/.test(digits)) return false;

    const calcDigit = (d: string, weights: number[]): number => {
      const sum = weights.reduce((acc, w, i) => acc + parseInt(d[i]) * w, 0);
      const rest = sum % 11;
      return rest < 2 ? 0 : 11 - rest;
    };

    const w1 = [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
    const w2 = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];

    if (calcDigit(digits, w1) !== parseInt(digits[12])) return false;
    if (calcDigit(digits, w2) !== parseInt(digits[13])) return false;
    return true;
  },
};
