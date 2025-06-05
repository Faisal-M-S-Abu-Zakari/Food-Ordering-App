// this function will formate the price number , to appear as usd price
export const formateCurrency = (number: number) => {
  // intl is built in node , give it the country wich is united state , then the currency to be USD
  const CURRENCY_FORMATTER = new Intl.NumberFormat("en-US", {
    currency: "USD",
    style: "currency",
  });
  //  then formate the number
  return CURRENCY_FORMATTER.format(number);
};
