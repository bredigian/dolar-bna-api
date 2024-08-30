export type Cotizacion = {
  _id?: string
  fecha: string
  compra: number | null
  venta: number | null
  variacion: string | null
  createdAt?: Date | string
  updatedAt?: Date | string
}
