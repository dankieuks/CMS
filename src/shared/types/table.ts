type AlignType = "left" | "center" | "right";
export interface Column {
  title: string;
  dataIndex: string;
  key: string;
  align?: AlignType;
  render?: (text: string, record: any) => JSX.Element;
}
