import cotizacionModel from "../models/cotizacion.model"

export const findAll = async () => await cotizacionModel.find()

export const findCotizacion = async (date: string) =>
  await cotizacionModel.findOne({ fecha: date })
