import { DolarController } from "./controlllers/app.controller"
import Express from "express"
import { config } from "dotenv"
import cors from "cors"

config()

const app = Express()

app.use(cors())
app.use(Express.json())

const PORT = 4040

//Recibe 3 query params (year, month, day) y devuelve los datos correspondientes a la fecha.
app.get("/", DolarController.getByDate)

app.listen(PORT, () => console.log(`Dolar BNA Scrapper API at PORT ${PORT}`))

export default app
