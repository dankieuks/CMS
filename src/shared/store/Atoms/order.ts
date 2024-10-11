import { atom, selector } from "recoil";

// Quản lý danh sách đơn hàng theo bàn
export const ordersState = atom({
  key: "ordersState",
  default: [],
});

// Lấy ra tổng số đơn hàng
export const totalOrdersSelector = selector({
  key: "totalOrdersSelector",
  get: ({ get }) => {
    const orders = get(ordersState);
    return orders.length;
  },
});
