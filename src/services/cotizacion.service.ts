import cotizacionModel from "../models/cotizacion.model"

export const findCotizacion = async (date: Date) =>
  await cotizacionModel.findOne({ fecha: date })
