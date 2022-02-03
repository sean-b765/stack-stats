export type StackAPIResponse = {
	items: Array<StackUser>
	has_more: boolean
	quota_max: number
	quota_remaining: number
}

export type StackTags = {
	has_synonyms: boolean
	user_id: number
	is_moderator_only: boolean
	is_required: boolean
	count: number
	name: string
}

export type StackUser = {
	badge_counts: {
		bronze: number
		silver: number
		gold: number
	}
	account_id: number
	is_employee: boolean
	last_modified_date: number
	last_access_date: number
	reputation_change_year: number
	reputation_change_quarter: number
	reputation_change_month: number
	reputation_change_week: number
	reputation_change_day: number
	reputation: number
	creation_date: number
	user_type: string
	user_id: number
	website_url: string
	link: string
	profile_image: string
	display_name: string
}

export type SvgDetails = {
	badge_counts: {
		bronze: number
		silver: number
		gold: number
	}
	reputation: number
	reputation_change_month: number
	creation_date: number
	profile_image: string
	display_name: string
}

export type ThemeType = {
	'text-primary': string
	'text-accent': string
	reputation: string
	gr1: string
	gr2: string
	fontFamily: string
	fontSize: string
	fontSrc: string
	gold: string
	silver: string
	bronze: string
}

export type Options = {
	rounded: boolean
	showBadges: boolean
	showTags: boolean
	theme: ThemeType
}
