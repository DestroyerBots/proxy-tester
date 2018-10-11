/* eslint-disable no-undef,no-unused-vars */

/**
 * ***** generate row field
 */
function generateRow(lastElementNumber = Number(0), ip = '', port = '', user = '', password = '') {
  return (`
    <tr>
        <th scope='row'>
            <input type='checkbox'>
            <span class='checkmark'></span>
        </th>
        <td>${lastElementNumber + 1}</td>
        <td>${ip}</td>
        <td>${port}</td>
        <td>${user}</td>
        <td>${password}</td>
        <td>idle</td>
    </tr>
    `);
}

function setResult(row, time) {
  const timeDiv = $('#tbody').find(`:nth-child(${row + 1})`).find(':nth-child(7)');
  if (time < 0) {
    timeDiv.text('Failed');
    timeDiv.addClass('bad');
    return;
  }

  timeDiv.text(`${time}ms`);

  if (time < 100) {
    timeDiv.addClass('good');
  } else {
    timeDiv.addClass('ok');
  }
}

function clearFailed() {
  const bad = $('#tbody').children().find('.bad').toArray();
  bad.forEach((badRow) => {
    $(badRow).parent().remove();
  });
}

function clearAll() {
  $('#tbody').empty();
}

function getProxies() {
  const allRows = $('#tbody').children().toArray();
  const data = [];
  allRows.forEach((row) => {
    const ip = $(row).find(':nth-child(3)').text();
    const port = $(row).find(':nth-child(4)').text();
    const user = $(row).find(':nth-child(5)').text();
    const password = $(row).find(':nth-child(6)').text();
    const proxy = {
      row: allRows.indexOf(row),
    };
    if (user === '' || !user) { // if there is no username then we assume IP auth
      proxy.details = `${ip}:${port}`;
    } else {
      proxy.details = `${user}:${password}@${ip}:${port}`;
    }
    data.push(proxy);
  });

  return data;
}

function startTest() {
  const proxies = getProxies();
  const host = $('#url-bar').val();

  if (!host) {
    return;
  }

  console.log(proxies);

  sendProxies(proxies, host);
}

$(document).ready(() => {
  /**
   * automatically get current screen width and height => set them to body
   */
  const body = $('body');

  body.height($(window).innerHeight());
  body.width($(window).innerWidth());

  $(window).resize(() => {
    /**
     * listen for window resize and update body width and height
     */
    body.height($(window).innerHeight());
    body.width($(window).innerWidth());
  });

  /**
   * handel menu click
   * add clicked element text to btn
   */
  $('#dropdown-menu a').click(function () {
    $('#dropdown-menu-btn').text($(this).text());
    $('#url-bar').val($(this).attr('data-site-url'));
  });

  /**
   * **********  handel unCheckAll button
   */
  $('#unCheckAll').click(() => {
    const checkedInputs = $('#tbody input').toArray();
    const anyChecked = checkedInputs.filter(el => $(el).prop('checked')).length > 0;
    checkedInputs.forEach(input => $(input).prop('checked', !anyChecked));
  });


  /**
   * trigger submit function on click submit button
   */
  $('#submitProxies').click(() => {
    $('#addProxyForm').trigger('submit');
  });


  /**
   * show modal on submit form
   */
  $('#addProxyForm').on('submit', (e) => {
    /**
     * prevent default submit action
     */
    e.preventDefault();
    /**
     * get text box proxies split by new line RegEX
     */
    const proxies = $('#proxiesBox').val().split('\n');
    /**
     * iterate on inputWrapper for all input fields
     */
    proxies.forEach((proxy) => {
      /**
       * split every input by : default
       */
      const eleValSplit = proxy.split(':');


      const eleValLength = eleValSplit.length;
      // console.log('len : ',eleValSplit);
      /**
       * constraintes min ip and port should input
       * =accepted if ip:port or ip:port:user:pass
       */
      if (eleValLength === 2 || eleValLength === 4) {
        /** partial input to ip port user password */
        const ip = eleValSplit[0];


        const port = eleValSplit[1];


        const user = eleValSplit[2] || '';


        const password = eleValSplit[3] || '';
        /**
         * if input have last val ':' then will add last element as empty string
         */
        if (eleValSplit[eleValLength - 1] !== '') {
          /**
           * get last element number
           * add input values to table form
           */
          const lastElementNumber = $('#tbody').children().length;

          $('#tbody').append(generateRow(lastElementNumber, ip, port, user, password));
          /**
           * empty text box
           */
          $('#proxiesBox').val('');
        }
      }
    });

    /**
     * hide model on submit
     */
    $('#importProxiesModal').modal('hide');
  });

  $('#start').click(() => {
    startTest();
  });

  /**
   * ***** handel clear failed button
   */
  $('#clearFailed').click(() => {
    clearFailed();
  });


  /**
   * ***** handel clear All button
   */
  $('#clearAll').click(() => {
    clearAll();
  });


  /**
   * import file and read it
   */
  $('#exportProxies').click(() => {
    /**
       * get all proxies
       */
    const allRows = $('#tbody').children().toArray();
    let data = '';
    allRows.forEach((row) => {
      const ip = $(row).find(':nth-child(3)').text();
      const port = $(row).find(':nth-child(4)').text();
      const user = $(row).find(':nth-child(5)').text();
      const password = $(row).find(':nth-child(6)').text();
      data += `${ip}:${port}:${user}:${password}\n`;
    });

    const blob = new Blob([data, '\n'],
      {
        type: 'text/html',
        endings: 'native',
      });
      /**
       * create download link and trigger it
       */
    const save = document.createElement('a');
    save.setAttribute('download', 'proxies.txt');
    save.setAttribute('href', window.URL.createObjectURL(blob));
    save.click();
  });
});
