import { Product } from "@/shared/types/product";
import { atom } from "recoil";

export const selectedBrandState = atom<string>({
  key: "selectedBrandState",
  default: "", // Giá trị mặc định là không có thương hiệu nào được chọn
});
export const cartState = atom<Product[]>({
  key: "cartState",
  default: [],
});

// State lưu trữ từ khóa tìm kiếm
export const searchTermState = atom<string>({
  key: "searchTermState",
  default: "",
});

// State lưu trữ bàn đã chọn
export const selectedTableState = atom<string>({
  key: "selectedTableState",
  default: "",
});
