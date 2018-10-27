(function() {
  var ul = document.querySelector('ul.links');
  var v = Date.now();
  var url = 'https://pudding.cool/misc/sadlunchbreak/data.json?version=' + v;

  var media = {
    text: '📖',
    video: '📺',
    interactive: '🕹️',
    image: '🖼️',
    other: '⁉️'
  };

  function getIcon(d) {
    var m = d['Media Type'];
    return m ? media[m] : media.other;
  }

  function createLi(d) {
    var span = '<span>' + getIcon(d) + '</span>';
    var a = '<a href="' + d.Link + '" target="_blank">' + d.Title + '</a>';
    var time = d3.timeFormat('%b %d')(new Date(d.Timestamp));
    var li = '<li>' + span + a + time + '</li>';
    return li;
  }

  d3.json(url)
    .then(function(response) {
      console.log('last updated: ', new Date(response.timestamp));
      const html = response.data.map(createLi).join('');
      ul.innerHTML = html;
    })
    .catch(console.error);
})();
