export type Cotizacion = {
  _id?: string
  fecha: Date | string
  compra: number | null
  venta: number | null
  variacion: string | null
  createdAt?: Date
  updatedAt?: Date
}
