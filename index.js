const fs = require("fs");
const request = require('request');
const dsv = require('d3-dsv');
const arr = require('d3-array');

const COUNT = 50;

const template = fs.readFileSync("./template.html", "utf8");

const SHEET_OPTS = {
	id: '14q0-XFUKBGJSbUjkn79haheJSQ5EdCN1vt_fOI79COI',
	gid: '589998460'
};

function downloadSheet({ id, gid }) {
  return new Promise((resolve, reject) => {
    const base = 'https://docs.google.com/spreadsheets/u/1/d';
    const url = `${base}/${id}/export?format=csv&id=${id}&gid=${gid}`;

    request(url, (err, response, body) => {
      if (err) reject(err);
      const data = dsv.csvParse(body);
      resolve(data);
    });
  });
}

function parse(response) {
	const approved = response.filter(d => d.approved);
	approved.sort((a, b) => arr.descending(new Date(a.Timestamp), new Date(b.Timestamp)));
	const data = approved.slice(0, COUNT);
	return data;
}

function render(data) {
	const media = {
		text: '📖',
		video: '📺',
		interactive: '🕹️',
		image: '🖼️',
		audio: '🎧',
		other: '⁉️'
	};

	const getIcon = (d) => {
		const m = d['Media Type'];
		return m ? media[m] : media.other;
	};

	const createLink = (d) => {
		const date = new Date(d.Timestamp);
		const span = `<span>${getIcon(d)}</span>`;
		const a = `<a href="${d.Link}">${d.Title}</a>`;
		const time = `<time>${(date).toString().substring(4, 10)}</time>`;
		const li = `<li>${span}${a}${time}</li>`;
		return li;
	}

	const links = data.map(createLink).join('');
	const v = `version-${Date.now()}`;
	const html = template.replace("version-tk", v).replace("<!-- links -->", links);
	fs.writeFileSync("./index.html", html);
	return true;
}

async function init() {
	console.log("start");
	const sheet = await downloadSheet(SHEET_OPTS)
	const data = parse(sheet);
	render(data);
	console.log("stop");
}

init();
