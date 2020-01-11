
const { get_palette } = require("../../../util");

module.exports = async (req, res) => {
	let page_collection = {
		title: "Collectie test",
		description: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.",
		members: [
			{
				"slug": "jip",
				"role": "admin"
			},
			{
				"slug": "mevrouwjip",
				"role": "member"
			}
		],
		palettes: [
			{
				id: "5dm8c-cisr8-ue8dq-nr4wj-qrtqf-4lp8g-vekxk-g5lmc-9v1nt-9s4ij"
			}, {
				id: "dofbc-jblx8-bbzif-e2a3p-fkrev-xnchj-u3wr2-piwkf-e26hq-z769f"
			}
		]
	}

	let palettes = await Promise.all(
		page_collection.palettes.map(obj => get_palette(obj.id, (req.user || {}).id))
	);
	palettes = palettes.filter(i => i);

	res.json({
		palettes
	});
}