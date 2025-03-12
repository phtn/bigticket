import axios from "axios";

const data = JSON.stringify({
  buyer_locale: "ph",
  total_price: {
    amount: "100",
    currency: "php",
  },
  metadata: {
    custom_field: "01id",
    custom_field_two: "user",
  },
  pricing_type: "fixed_price",
  requested_info: "email",
});

const config = {
  method: "post",
  maxBodyLength: Infinity,
  url: "https://api.commerce.coinbase.com/checkouts",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    "X-CC-Api-Key": "s",
  },
  data: data,
};

axios
  .request(config)
  .then((response) => {
    console.log(JSON.stringify(response.data));
  })
  .catch((error) => {
    console.log(error);
  });
