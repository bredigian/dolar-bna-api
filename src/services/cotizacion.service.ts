import { DateTime } from "luxon"
import cotizacionModel from "../models/cotizacion.model"

export const findCotizacion = async (date: string) =>
  await cotizacionModel.findOne({ fecha: date })

export const findLast = async (date: string) => {
  let finded = false

  const [day, month, year] = date.split("-")
  let lastDateWithCotizacion = DateTime.fromObject({
    year: +year,
    month: +month,
    day: +day,
  })
    .setZone()
    .minus({ days: 1 })

  while (!finded) {
    const dateString = `${lastDateWithCotizacion.day}-${lastDateWithCotizacion.month}-${lastDateWithCotizacion.year}`

    const exists = await findCotizacion(dateString)
    if (exists) {
      finded = true
      return exists
    }

    lastDateWithCotizacion = lastDateWithCotizacion.minus({ days: 1 })
  }

  return null
}
