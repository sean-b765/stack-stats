/**
 * Author: Sean Boaden
 * Date: 02/02/2022
 * Description: Handles all the SVG generation
 */

import { SvgDetails, StackTags, ThemeType, Options } from '../types'
import axios from 'axios'
import { Themes } from './themes'

let avatarRadius = 50
let avatarOffsetX = 30
let avatarOffsetY = 50

export const formatSvg = async (
	user: SvgDetails,
	_tags: Array<StackTags>,
	options: Options
) => {
	if (options.rounded) avatarOffsetX = 50

	const tags = [_tags[0], _tags[1], _tags[2]]

	console.log(options)

	return `
  <svg width="500" font-size="${
		options.theme.fontSize
	}" height="200" xmlns="http://www.w3.org/2000/svg">
    <defs>
    <linearGradient id='gradient'>
      ${formatTheme(options.theme)}
    </linearGradient>

    <style type="text/css">
    @import url(http://fonts.googleapis.com/css?family=${options.theme.font});

    * {
      font-family: ${options.theme.fontFamily};
    }
    .accent {
      fill: ${options.theme['text-accent']};
    }
    .primary {
      fill: ${options.theme['text-primary']};
    }
    .rep {
      fill: ${options.theme.reputation};
    }
    
    .gold {
      fill: ${options.theme.gold};
    }
    .silver {
      fill: ${options.theme.silver};
    }
    .bronze {
      fill: ${options.theme.bronze};
    }
    
    .anim {
      opacity: 0;
      animation: opacity 1s 0s linear forwards;
    }
    .anim--1 {
      opacity: 0; 
      animation: opacity 0.7s 1s linear forwards;
    }
    .anim--2 {
      opacity: 0;
      animation: opacity 0.7s 1.5s linear forwards;
    }
    .anim--3 {
      opacity: 0;
      animation: opacity 0.7s 2s linear forwards;
    }
    .anim--4 {
      opacity: 0;
      animation: opacity 0.7s 2.5s linear forwards;
    }
    
    @keyframes opacity {
      from {
        opacity: 0;
        transform: translateX(3px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    </style>
    </defs>

    <rect class='anim' x="0" y="0" width="500" height="200" rx="${
			options.rounded ? '100' : '5'
		}" ry="${options.rounded ? '100' : '5'}" fill="url(#gradient)" />
    
    ${await formatImage(user.profile_image)}
    ${formatName(
			user.display_name,
			options.rounded
				? avatarOffsetX * 2 + avatarRadius * 2 - 20
				: avatarOffsetX * 2 + avatarRadius * 2,
			options.showTags ? avatarOffsetY + 30 : avatarOffsetY + 42,
			options.theme
		)}
    ${formatReputation(
			user.reputation,
			options.rounded
				? avatarOffsetX * 2 + avatarRadius * 2 - 20
				: avatarOffsetX * 2 + avatarRadius * 2,
			options.showTags ? avatarOffsetY + 60 : avatarOffsetY + 72
		)}

    ${
			options.showBadges &&
			formatBadges(user.badge_counts, 500 - avatarOffsetX * 2 + 25)
		}
    ${
			options.showTags &&
			formatTags(
				tags,
				options.rounded
					? avatarOffsetX * 2 + avatarRadius * 2 - 20
					: avatarOffsetX * 2 + avatarRadius * 2
			)
		}
    
    </svg>`
}

const formatTags = (tags: Array<StackTags>, x: number) => {
	return `
  <g>
      <text class='accent anim--4' x="${x}" y="${
		avatarOffsetY + 85
	}" font-size='0.6rem'>#</text>
        <text class='accent anim--4' x="${x + 15}" y="${
		avatarOffsetY + 85
	}" font-size='0.75rem'>${tags[0].name}, ${tags[1].name}, ${tags[2].name}
      </text>
    </g>
    `
}

const formatTheme = (theme: ThemeType) => {
	return `<stop offset="0%" stop-color="${theme.gr1}"/>
  <stop offset="100%" stop-color="${theme.gr2}"/>`
}

const formatImage = async (url: string) => {
	const res = await axios.get(url, {
		responseType: 'arraybuffer',
	})

	const data = res.data

	const b64 = Buffer.from(data, 'binary').toString('base64')

	return `
    <clipPath id="clipCircle">
      <circle r="${avatarRadius}" cx="${
		avatarRadius + avatarOffsetX + 5
	}" cy="${avatarRadius + avatarOffsetY}"/>
    </clipPath>
    <image class="anim--1" clip-path="url(#clipCircle)" x="${
			avatarOffsetX + 5
		}" y="${avatarOffsetY}" height="100" width="100" href="data:image/jpeg;base64,${b64}">
    </image>`
}

const formatName = (text: string, x: number, y: number, theme?: ThemeType) => {
	return `<text class='primary anim--2' x="${x}" y="${y}" font-size='1.1rem'>
    ${
			theme === Themes.RETRO
				? `<animate attributeName="fill" values="#ff00bf;#00ffd9;#ff00bf" dur="3s" repeatCount="indefinite" />`
				: ''
		}
    ${text}
  </text>`
}

const formatReputation = (reputation: number, x: number, y: number) => {
	return `
  <text class='rep anim--3' x="${x}" y="${y}" font-size='0.9rem'>
    ${formatLargeNumber(reputation)}
  </text>`
}

const formatBadges = (
	badges: {
		bronze: number
		silver: number
		gold: number
	},
	x: number
) => {
	return `<g>
  <circle r="3" class='gold anim--4' cx="${x}" cy="${avatarOffsetY + 25}" />
  <text class='gold anim--4' text-anchor="end" font-size='0.8rem' x="${
		x - 13
	}" y="${avatarOffsetY + 30}">
    ${formatLargeNumber(badges.gold)}
  </text>

  <circle r="3" class='silver anim--4' cx="${x}" cy="${avatarOffsetY + 50}" />
  <text class='silver anim--4' text-anchor="end" font-size='0.8rem' x="${
		x - 13
	}" y="${avatarOffsetY + 55}">
    ${formatLargeNumber(badges.silver)}
  </text>

  <circle r="3" class='bronze anim--4' cx="${x}" cy="${avatarOffsetY + 75}" />
  <text class='bronze anim--4' text-anchor="end" font-size='0.8rem' x="${
		x - 13
	}" y="${avatarOffsetY + 80}">
    ${formatLargeNumber(badges.bronze)}
  </text>
  </g>
  `
}

const formatLargeNumber = (num: number) => {
	if (num > 1_000_000) return `${parseFloat((num / 1000000).toFixed(1))}m`
	else if (num > 100_000) return `${parseFloat((num / 1000).toFixed(1))}k`
	else if (num > 10_000) return `${parseFloat((num / 1000).toFixed(1))}k`
	else if (num > 1_000) return `${parseFloat((num / 1000).toFixed(1))}k`
	else return `${num}`
}
