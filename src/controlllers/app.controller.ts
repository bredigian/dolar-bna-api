import { Request, Response } from "express"

import { CotizacionDolar } from "../types/dolar.types"
import { DateTime } from "luxon"
import { WEB_TO_SCRAP } from "../const/api"
import { chromium } from "playwright"

type TQuery = {
  day: string
  month: string
  year: string
}

export const DolarController = {
  getByDate: async (req: Request, res: Response) => {
    try {
      const browser = await chromium.launch({ headless: true })
      const page = await browser.newPage()

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

      const selectedMontn = date.monthLong
      const selectedYear = date.year

      await page.goto(`${WEB_TO_SCRAP}/mes/${selectedMontn}-${selectedYear}`)

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
      })) as CotizacionDolar[]

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

      return res.status(200).json(dataOfSelectedDate)
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        message: "Internal Server Error",
        code: 500,
      })
    }
  },
}
