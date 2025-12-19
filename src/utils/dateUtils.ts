import { format, parseISO, addDays, startOfDay, isValid } from 'date-fns';

export const parseDate = (input: string): string | null => {
	if (!input) return null;

	const normalized = input.toLowerCase().trim();

	if (normalized === 'today') {
		return startOfDay(new Date()).toISOString();
	}

	if (normalized === 'tomorrow') {
		return startOfDay(addDays(new Date(), 1)).toISOString();
	}

	// Try parsing as ISO
	const parsedISO = parseISO(input);
	if (isValid(parsedISO)) {
		return parsedISO.toISOString();
	}

	return null;
};

export const formatDate = (isoString: string | undefined): string => {
	if (!isoString) return '';
	try {
		const date = parseISO(isoString);
		if (!isValid(date)) return '';
		return format(date, 'MMM d, yyyy');
	} catch {
		return '';
	}
};
