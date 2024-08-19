import cotizacionModel from "../models/cotizacion.model"

export const findCotizacion = async (date: string) =>
  await cotizacionModel.findOne({ fecha: date })
