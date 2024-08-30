import { Request, Response } from "express"

import { DateTime } from "luxon"
import { DolarController } from "../controlllers/dolar.controller"

const mockRequest: Request = {
  query: {
    day: (29).toString(),
    month: (8).toString(),
    year: (2024).toString(),
  },
} as any as Request

const mockResponse: Response = {
  status: jest.fn(() => mockResponse),
  json: jest.fn(),
} as any as Response

describe("cotizacion tests", () => {
  it("should response with 200", async () => {
    await DolarController.getByDate(mockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(200)
    expect(mockResponse.json).toHaveBeenCalledTimes(1)
  })

  it("should reponse with 404 beacuse is out of the date range", async () => {
    const INIT_DATE = DateTime.fromObject({
      year: 2011,
      month: 1,
      day: 3,
    })

    const query = {
      day: (2).toString(),
      month: (1).toString(),
      year: (2011).toString(),
    }
    const date = `${query.day}-${query.month}-${query.year}`

    const copyMockRequest = { ...mockRequest, query } as any as Request

    await DolarController.getByDate(copyMockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: `Los datos inician a partir de ${INIT_DATE.toLocaleString()}`,
      compra: null,
      venta: null,
      variacion: null,
      fecha: date,
    })
  })

  it("should response with 400 because invalid params from request", async () => {
    const query = {
      day: (32).toString(),
      month: (1).toString(),
      year: (2011).toString(),
    }
    const copyMockRequest = { ...mockRequest, query } as any as Request

    await DolarController.getByDate(copyMockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(400)
    expect(mockResponse.json).toHaveBeenCalledWith({
      message: "Los parametros son inválidos y/o el año es mayor al presente",
      compra: null,
      venta: null,
      variacion: null,
      fecha: null,
    })
  })

  it("should response with 404 because the date received is not laboral day", async () => {
    const query = {
      day: (21).toString(),
      month: (4).toString(),
      year: (2024).toString(),
    }

    const lastCotizacion = {
      _id: "66c3c0c228ef55900fea0a9b",
      venta: 889,
      compra: 849,
      fecha: "19-4-2024",
      variacion: "0,06%",
      createdAt: new Date("2024-08-19T22:01:38.836Z"),
      updatedAt: new Date("2024-08-19T22:01:38.836Z"),
    }

    const { compra, venta, variacion, fecha, _id, createdAt, updatedAt } =
      lastCotizacion

    const copyMockRequest = { ...mockRequest, query } as any as Request

    await DolarController.getByDate(copyMockRequest, mockResponse)

    expect(mockResponse.status).toHaveBeenCalledWith(404)
    expect(mockResponse.json).toHaveBeenCalledWith({
      message:
        "No se encontraron datos de la fecha indicada. Se le devuelve los datos de la fecha mas cercana.",
      _id,
      venta,
      compra,
      fecha,
      variacion,
      createdAt,
      updatedAt,
    })
  })
})
