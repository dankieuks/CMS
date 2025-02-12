import { atom, selector } from "recoil";

export const ordersState = atom({
  key: "ordersState",
  default: [],
});

export const totalOrdersSelector = selector({
  key: "totalOrdersSelector",
  get: ({ get }) => {
    const orders = get(ordersState);
    return orders.length;
  },
});
