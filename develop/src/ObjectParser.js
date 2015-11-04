import UtilParser from './UtilParser';

export function parseTab(rows)
{
	let objectRows = {};
	rows.forEach(row => {
		if(typeof row.id === 'undefined') {
			throw `In object parse must be id`;
		}

	UtilParser.deepen(row.id, )


	});
}