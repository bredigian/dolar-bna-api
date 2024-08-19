import { Schema, model, models } from "mongoose"

import { Cotizacion } from "../types/cotizacion.types"

const CotizacionSchema: Schema<Cotizacion> = new Schema(
  {
    venta: Number,
    compra: Number,
    fecha: String,
    variacion: String,
  },
  { _id: true, timestamps: true }
)

export default models.Cotizacion ||
  model<Cotizacion>("Cotizacion", CotizacionSchema, "cotizaciones")
