export default function useDecimalPart(num) {
    if (Number.isInteger(num)) {
      return 0;
    }
  
    const decimalStr = num.toString().split('.')[1];
    return Number(decimalStr);
  }