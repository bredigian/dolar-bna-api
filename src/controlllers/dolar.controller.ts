import { $connect, $disconnect } from "../lib/db"
import { Request, Response } from "express"
import { findCotizacion, findLast } from "../services/cotizacion.service"

import { Cotizacion } from "../types/cotizacion.types"
import { DateTime } from "luxon"
import { dateIsValid } from "../lib/validate"
import path from "path"

type TQuery = {
  day: string
  month: string
  year: string
}

export const DolarController = {
  getHome: async (_: Request, res: Response) => {
    return res.sendFile(
      path.join(__dirname, "..", "..", "public", "index.html")
    )
  },
  getByDate: async (req: Request, res: Response) => {
    try {
      const { day, month, year } = req?.query as TQuery

      if (!day || !month || !year)
        return res.status(400).json({
          message: "Los parametros no fueron recibidos.",
          error: 400,
          name: "Bad Request",
        })

      if (!dateIsValid(+day, +month, +year))
        return res.status(400).json({
          message:
            "Los parametros son inválidos y/o el año es mayor al presente",
          compra: null,
          venta: null,
          variacion: null,
          fecha: null,
        })

      const date = `${day}-${month}-${year}`

      const INIT_DATE = DateTime.fromObject({
        year: 2011,
        month: 1,
        day: 3,
      })

      if (
        DateTime.fromObject({
          year: +year,
          month: +month,
          day: +day,
        }).toMillis() < INIT_DATE.toMillis()
      )
        return res.status(400).json({
          message: `Los datos inician a partir de ${INIT_DATE.toLocaleString()}`,
          compra: null,
          venta: null,
          variacion: null,
          fecha: date,
        } as Cotizacion)

      await $connect()

      const exists: Cotizacion | undefined | null = await findCotizacion(date)

      if (!exists) {
        const lastCotizacion: Cotizacion = await findLast(date)
        const { compra, venta, variacion, fecha, _id, createdAt, updatedAt } =
          lastCotizacion

        await $disconnect()

        return res.status(404).json({
          message:
            "No se encontraron datos de la fecha indicada. Se le devuelve los datos de la fecha mas cercana.",
          _id: _id?.toString(),
          venta,
          compra,
          fecha,
          variacion,
          createdAt,
          updatedAt,
        } as Cotizacion)
      }

      await $disconnect()

      return res.status(200).json(exists)
    } catch (error) {
      console.error(error)
      await $disconnect()

      return res.status(500).json({
        message: "Internal Server Error",
        code: 500,
        error,
      })
    }
  },
}
