import cors from 'cors'
import express, { Request, Response } from 'express'
import axios from 'axios'
import { StackAPIResponse, SvgDetails, StackTags, Options } from './types'
import { formatSvg } from './lib/formatSvg'
import { join } from 'path'
import { Themes } from './lib/themes'
import { stringToBoolean } from './lib/conversions'

const app = express()

app.use(cors())
app.use(express.static(join(__dirname, 'public')))

app.get('/user/:id', async (req: Request, res: Response) => {
	try {
		const { id } = req.params

		const { showBadges, showTags, rounded, theme } = req.query

		let options: Options = {
			showBadges: true,
			showTags: true,
			rounded: false,
			theme: Themes.SUNSET,
		}

		// Set options according to request URL
		if (!stringToBoolean(String(showBadges), true)) options.showBadges = false
		if (!stringToBoolean(String(showTags), true)) options.showTags = false
		if (stringToBoolean(String(rounded), false)) options.rounded = true
		if (
			['sunset', 'dark', 'light', 'cyberpunk', 'retro'].includes(
				String(theme).toLowerCase()
			)
		) {
			switch (theme) {
				case 'sunset':
					options.theme = Themes.SUNSET
					break
				case 'dark':
					options.theme = Themes.DARK
					break
				case 'light':
					options.theme = Themes.LIGHT
					break
				case 'cyberpunk':
					options.theme = Themes.CYBERPUNK
					break
				case 'retro':
					options.theme = Themes.RETRO
					break
				default:
					options.theme = Themes.SUNSET
					break
			}
		}

		const user = `https://api.stackexchange.com/2.3/users/${id}?site=stackoverflow&key=U4DMV*8nvpm3EOpvf69Rxw((`
		const result = await axios.get(user, { method: 'GET' })

		// if there is no result.data.items[0], the user id does not exist

		const tags = `https://api.stackexchange.com/2.3/users/${id}/tags?order=desc&sort=popular&site=stackoverflow`
		const tagsResult = await axios.get(tags, { method: 'GET' })

		const userData: StackAPIResponse = result.data

		const tagsData: Array<StackTags> = tagsResult.data.items

		if (!userData.items[0])
			res
				.status(400)
				.json({ message: `The account with Id ${id} does not exist` })

		const svg = await formatSvg(
			userData.items[0] as SvgDetails,
			tagsData,
			Themes.SUNSET,
			options
		)

		res.header('Content-Type', 'image/svg+xml')

		res.status(200).send(svg)
	} catch (err) {}
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
	console.log(`Server listening: ${PORT}`)
})
