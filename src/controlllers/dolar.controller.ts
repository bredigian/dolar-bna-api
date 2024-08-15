import { Request, Response } from "express"
import {
  addCotizacion,
  findAll,
  findCotizacion,
} from "../services/cotizacion.service"

import { $connect } from "../lib/db"
import { Cotizacion } from "../types/cotizacion.types"
import { DateTime } from "luxon"
import { URL_TO_SCRAP } from "../const/api"
import { chromium } from "playwright"

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
        return res.status(400).json({
          message: "La fecha no fue recibida y se produjo un error.",
          name: "Bad Request",
          code: 400,
        })

      const date = DateTime.local(
        Number(year),
        Number(month),
        Number(day)
      ).setLocale("es-AR")

      await $connect()

      const exists: Cotizacion | undefined | null = await findCotizacion(
        date.toJSDate()
      )

      if (exists) return res.status(200).json(exists)

      const selectedMontn = date.monthLong
      const selectedYear = date.year

      const browser = await chromium.launch({ headless: true })
      const page = await browser.newPage()

      await page.goto(`${URL_TO_SCRAP}/mes/${selectedMontn}-${selectedYear}`)

      const data = (await page.$$eval("#dataTable tbody tr", (rows) => {
        return rows.map((row) => {
          const cells = row.querySelectorAll("td")
          const [day, month, year] = cells[0].textContent
            ?.trim()
            .split("/")
            .map((item) => Number(item as string)) as number[]

          return {
            fecha: new Date(year, month - 1, day),
            compra: parseFloat(
              (cells[1]?.textContent?.trim() as string).replace(",", ".")
            ),
            venta: parseFloat(
              (cells[2]?.textContent?.trim() as string).replace(",", ".")
            ),
            variacion: cells[3]?.textContent?.trim(),
          }
        })
      })) as Cotizacion[]

      await browser.close()

      const dataOfSelectedDate = data.find(
        (item) => new Date(item.fecha).getTime() === date.toMillis()
      )

      if (!dataOfSelectedDate)
        return res.status(404).json({
          message: "No se encontraron registros de la fecha indicada.",
          name: "Not Found",
          code: 404,
        })

      const added = await addCotizacion(dataOfSelectedDate)
      console.log(added)

      return res.status(200).json(dataOfSelectedDate)
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        message: "Internal Server Error",
        code: 500,
        error,
      })
    }
  },
  getStoredData: async (_: Request, res: Response) => {
    try {
      await $connect()

      return res.status(200).json(await findAll())
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
