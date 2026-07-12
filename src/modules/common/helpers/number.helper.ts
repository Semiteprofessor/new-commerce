export function formatNumber(number, options: any = {}) {
  const {
    isCurrency = false,
    locale = 'en-US',
    currency = 'NGN',
    minDecimals = 2,
    maxDecimals = 2,
  } = options;

  const formatter = new Intl.NumberFormat(locale, {
    style: isCurrency ? 'currency' : 'decimal',
    currency: isCurrency ? currency : undefined,
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
  });

  return formatter.format(number);
}

export function nairaToKobo(nairaAmount) {
  console.log(nairaAmount);
  console.log(typeof nairaAmount);
  if (typeof nairaAmount !== 'number' || isNaN(nairaAmount)) {
    throw new Error('Invalid input: nairaAmount must be a valid number');
  }

  return Math.round(nairaAmount * 100);
}

export function formatNaira(number, options = {}) {
  return formatNumber(number, {
    isCurrency: true,
    currency: 'NGN',
    locale: 'en-NG',
    ...options,
  });
}

export function koboToNaira(koboAmount) {
  return koboAmount / 100;
}
function formatKoboAsNaira(koboAmount, options = {}) {
  const nairaAmount = koboToNaira(koboAmount);
  return formatNaira(nairaAmount, options);
}
