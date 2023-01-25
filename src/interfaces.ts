// Interface for the country drop-down list
export interface ICountry {
  label: string
  short: string
}

// Interface for the column information received from VA
export interface IColumn {
  name: string
  label: string
  type: string
}

// Interface for the data received from VA
export interface IRow extends Array<string|number>{
  row : (string|number)[]
}

// Interface for the data received from VA
export interface IReportObjectResultData {
  resultName: string
  rowCount: number
  columns: IColumn[]
  data: IRow[]
}

// Interface for the HTML report element
export interface IReportElement extends HTMLElement {
  getReportHandle: () => Promise<IReportHandle>
}

// Interface for the HTML object element
export interface IObjectElement extends HTMLElement {
  getObjectHandle: () => Promise<IObjectHandle>
}

// Interface for the report handle
export interface IReportHandle extends Object {
  setReportParameters : (parameters: Object| null) => void
}

// Interface for the object handle
export interface IObjectHandle extends Object {
  getSelectedData: (options?: Object) => IReportObjectResultData[]
  addEventListener: (eventType: string, listener: Object) => void
}