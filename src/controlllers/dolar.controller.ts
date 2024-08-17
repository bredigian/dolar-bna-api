import { Request, Response } from "express"

import { $connect } from "../lib/db"
import { Cotizacion } from "../types/cotizacion.types"
import { DateTime } from "luxon"
import { findCotizacion } from "../services/cotizacion.service"
import path from "path"

type TQuery = {
  day: string
  month: string
  year: string
}

export const DolarController = {
  getByDate: async (req: Request, res: Response) => {
    try {
      const { day, month, year } = req?.query as TQuery

      if (!day || !month || !year)
        return res.sendFile(
          path.join(__dirname, "..", "..", "public", "index.html")
        )

      const date = DateTime.local(
        Number(year),
        Number(month),
        Number(day)
      ).setLocale("es-AR")

      await $connect()

      const exists: Cotizacion | undefined | null = await findCotizacion(
        date.toJSDate()
      )

      if (!exists)
        return res.status(404).json({
          message: "No se encontraron datos de la fecha indicada.",
          fecha: date.toISO(),
          compra: null,
          venta: null,
          variacion: null,
        } as Cotizacion)

      return res.status(200).json(exists)
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        message: "Internal Server Error",
        code: 500,
        error,
      })
    }
  },
}
