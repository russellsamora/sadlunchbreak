(function() {
  var ul = d3.select('ul.links');
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

  d3.json(url)
    .then(function(response) {
      console.log('last updated: ', new Date(response.timestamp));
      console.log(response);
      var li = ul
        .selectAll('.li')
        .data(response.data)
        .enter()
        .append('li');

      li.append('span').text(getIcon);

      li.append('a')
        .attr('href', function(d) {
          return d.Link;
        })
        .attr('target', '_blank')
        .text(function(d) {
          return d.Title;
        });

      li.append('time').text(function(d) {
        var date = new Date(d.Timestamp);
        return '' + d3.timeFormat('%b %d')(date) + '';
      });
    })
    .catch(console.error);
})();
