// ==UserScript==
// @name                Omerta Beyond
// @id                  Omerta Beyond
// @version             2.0
// @date                20-02-2013
// @description         Omerta Beyond 2.0 (We're back to reclaim the throne ;))
// @homepageURL         http://www.omertabeyond.com/
// @namespace           v4.omertabeyond.com
// @updateURL           https://raw.github.com/OmertaBeyond/OBv2/master/beyond.meta.js
// @supportURL          https://github.com/OmertaBeyond/OBv2/issues
// @icon                https://raw.github.com/OmertaBeyond/OBv2/master/images/logo.small.png
// @screenshot          https://raw.github.com/OmertaBeyond/OBv2/master/images/logo.small.png
// @author              OBDev Team <info@omertabeyond.com>
// @author              vBm <vbm@omertabeyond.com>
// @author              Dopedog <dopedog@omertabeyond.com>
// @author              Rix <rix@omertabeyond.com>
// @author              MrWhite <mrwhite@omertabeyond.com>
// @license             GNU General Public License v3
// @contributionURL     https://www.paypal.com/cgi-bin/webscr?cmd=_donations&business=sbanks%40omertabeyond%2ecom&lc=GB&item_name=Omerta%20Beyond&currency_code=EUR&bn=PP%2dDonationsBF%3abtn_donateCC_LG%2egif%3aNonHosted
// @contributionAmount  €3.00
// @encoding            UTF-8
// @priority            1
// @require             https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @resource    favicon https://raw.github.com/OmertaBeyond/OBv2/master/images/favicon.png
// @resource    logo    https://raw.github.com/OmertaBeyond/OBv2/master/images/logo.png
// @resource    prev    https://raw.github.com/OmertaBeyond/OBv2/master/images/prev.png
// @resource    next    https://raw.github.com/OmertaBeyond/OBv2/master/images/next.png
// @resource    reply   https://raw.github.com/OmertaBeyond/OBv2/master/images/reply.png
// @resource    delete  https://raw.github.com/OmertaBeyond/OBv2/master/images/delete.png
// @include             http://*.omerta3.com/*
// @include             http://omerta3.com/*
// @include             http://*.barafranca.com/*
// @include             http://barafranca.com/*
// @include             http://*.barafranca.us/*
// @include             http://barafranca.us/*
// ==/UserScript==

// Prevent Omerta's jQuery to conflict with our
this.$ = this.jQuery = jQuery.noConflict(true);

// some global defines

const OB_WEBSITE = 'http://www.omertabeyond.com';
const OB_API_WEBSITE = 'http://gm.omertabeyond.com';
const OB_NEWS_WEBSITE = 'http://news.omertabeyond.com';
const OB_STATS_WEBSITE = 'http://stats.omertabeyond.com';
const v = 'com';

function on_page(str) {
	if (window.location.hash.indexOf(str) != -1) {
		return true;
	} else {
		return false;
	}
}
function getV(name, standard) {
    return localStorage[name+'_'+v] || standard;
}
function setV(name, value) {
    return localStorage[name+'_'+v] = value;
}
function time() {
	return Math.floor(parseInt(new Date().getTime(), 10) / 1000);
}
$.urlParam = function(name){
    var results = new RegExp('[\\?&amp;]' + name + '=([^&amp;#]*)').exec(window.location.href);
    return results[1] || 0;
}

if (document.getElementById('game_container') !== null) {
	document.getElementById('game_container').addEventListener('DOMNodeInserted', function(event) {
		if (event.target.nodeType != 1) {
			return false;
		}
		if ($(event.target).attr('data-beyond-fired') !== undefined) {
			return false;
		}

		$(event.target).attr('data-beyond-fired', 'true');

		var wlh = window.location.hash;
		var nn  = event.target.tagName.toLowerCase();

		if (on_page('family.php') && nn == 'center') {

			// add HR, Deaths and Worth
			var famid = wlh.split('=')[1];
			var famIdFromImg = $('img[src*="family_image.php"]').attr('src').match(/\d+/g)[0];
			var famname = $('td.profilerow').text().split(' ')[0].trim().toLowerCase();
			var url = (famid === famIdFromImg) ? 'id='+famid : 'ing='+famname;

			$.getJSON(OB_API_WEBSITE + '/?p=stats&w=fampage&v=com&' + url, function(data) {

				/*
				 * Family position and worth
				 */
				$('td.subtableheader').first().closest('tr').after(
					$('<tr>').append(
						$('<td>').addClass('subtableheader').text('Position:'),
						$('<td>').addClass('profilerow').text('#'+data['pos']+' - Worth: '+data['worth']+'')
					)
				);

				// add HR
				$('table.thinline').first().find('tbody').append(
					$('<tr>').append(
						$('<td>').addClass('subtableheader').text('Ranks:'),
						$('<td>').addClass('profilerow').append(
							$('<table>').attr('width', '100%').append(
								$('<tr>').append($('<td>').text('Godfather/First Lady:'), $('<td>').addClass('bold').text(data['hr']['gf'])),
								$('<tr>').append($('<td>').text('Capodecina:'), $('<td>').addClass('bold').text(data['hr']['cd'])),
								$('<tr>').append($('<td>').text('Bruglione:'), $('<td>').addClass('bold').text(data['hr']['brug'])),
								$('<tr>').append($('<td>').text('Chief:'), $('<td>').addClass('bold').text(data['hr']['chief'])),
								$('<tr>').append($('<td>').text('Local Chief:'), $('<td>').addClass('bold').text(data['hr']['lc'])),
								$('<tr>').append($('<td>').text('Assassin:'), $('<td>').addClass('bold').text(data['hr']['assa'])),
								$('<tr>').append($('<td>').text('Swindler:'), $('<td>').addClass('bold').text(data['hr']['swin'])),
								$('<tr>').append($('<td>').attr('colspan', '2').append($('<hr />'))),
								$('<tr>').append($('<td>').text('Total points:'), $('<td>').addClass('bold').text(data['hr']['pts']))
							)
						)
					)
				);

				/*
				 * Family deaths
				 */
				$('table.thinline:eq(1)').closest('td').append(
					$('<br />'),
					$('<table>').addClass('thinline').css('width', '100%').attr('cellspacing', '0').attr('cellpadding', '2').attr('rules', 'none').append(
						$('<tr>').append(
							$('<td>').addClass('tableheader').attr('colspan', '100%').text('Last family deaths').append(
								$('<div>').css({'float': 'right', 'margin-right': '5px', 'margin-top': '3px'}).append(
									$('<a>').attr('href', OB_NEWS_WEBSITE + '/deathslog/' + famid).attr('target', '_blank').append(
										$('<img>').addClass('brcImg').attr('title', 'View full deathslog')
									)
								)
							)
						),
						$('<tr>').append(
							$('<td>').attr('colspan', '100%').attr('bgcolor', 'black').attr('height', '1')
						),
						$('<tr>').append(
							$('<td>').addClass('bold').css('width', '28%').attr('align', 'left').text('Name'),
							$('<td>').addClass('bold').attr('align', 'center').text('Rank'),
							$('<td>').addClass('bold').attr('align', 'center').text('Date'),
							$('<td>').addClass('bold').css('text-align', 'right').text('Ago')
						)
					)
				);

				var deaths_body = $('table.thinline:eq(2)').find('tbody');
				if (data['deaths']) {
					$.each(data['deaths'], function(k, v) {
						var extra = (v['Akill'] == 1)?'(<b>A</b>) ':(v['BF'] == 1)?'(<b>BF</b>) ':'';

						deaths_body.append(
							$('<tr>').append(
								$('<td>').html(extra).append(
									$('<a>').attr('href', 'user.php?name=' + v['Name']).text(v['Name'])
								),
								$('<td>').attr('align', 'center').append(
									$('<a>').attr('href', OB_STATS_WEBSITE + '/history.php?v=com&name=' + v['Name']).text(v['Rank'])
								),
								$('<td>').attr('align', 'center').text(v['Date']),
								$('<td>').css('text-align', 'right').text(v['Agod'] + 'd ' + v['Agoh'] + 'h ' + v['Agom'] + 'm')
							)
						);
					});
				} else {
					deaths_body.append(
						$('<tr>').append(
							$('<td>').addClass('red').css('text-align', 'center').attr('colspan', '4').text('There are no deaths yet!')
						)
					);
				}

				// add Famlog
				$('table.thinline:eq(1)').closest('td').append(
					$('<br />'),
					$('<table>').addClass('thinline').css('width', '100%').attr('cellspacing', '0').attr('cellpadding', '2').attr('rules', 'none').append(
						$('<tr>').append(
							$('<td>').addClass('tableheader').attr('colspan', '100%').text('Last family changes').append(
								$('<div>').css({'float': 'right', 'margin-right': '5px', 'margin-top': '3px'}).append(
									$('<a>').attr('href', OB_NEWS_WEBSITE + '/famlog/' + famid).attr('target', '_blank').append(
										$('<img>').addClass('brcImg').attr('title', 'View full changelog')
									)
								)
							)
						),
						$('<tr>').append(
							$('<td>').attr('colspan', '100%').attr('bgcolor', 'black').attr('height', '1')
						),
						$('<tr>').append(
							$('<td>').addClass('bold').css('width', '28%').attr('align', 'left').text('Date'),
							$('<td>').addClass('bold').attr('align', 'left').text('Change')
						)
					)
				);

				var changes_body = $('table.thinline:eq(3)').find('tbody');
				if (data['changes']) {
					$.each(data['changes'], function(k, v) {
						changes_body.append(
							$('<tr>').append(
								$('<td>').css('width', '28%').attr('align', 'left').attr('valign', 'top').text(v['date']),
								$('<td>').attr('align', 'left').text(v['text'])
							)
						);
					});
				} else {
					changes_body.append(
						$('<tr>').append(
							$('<td>').addClass('red').css('text-align', 'center').attr('colspan', '2').text('There are no changes yet!')
						)
					);
				}
			});
		}
		// 1 click voter
		if (on_page('/vfo.php') && nn == 'center') {
			$('a[href*="votelot.php"]').attr('name', 'forticket');
			function voteNow(save) {
				$('a[name="forticket"]').each(function() {
					window.open(this);
				});
				if (save) {//store last voting time
					setV('lastvote', time());
				}
			}
			$('td[class="tableheader"]:first').html(
				$('<span>').addClass('orange').css({'cursor': 'pointer', 'color': 'orange'}).attr({'id': 'votelink', 'title': ''}).text($('td[class="tableheader"]:first').text())
			).click(function () {
					voteNow(false);
			});
			var lastVote = getV('lastvote', 0); //get last voting time
			if (lastVote == 0) {
				if (confirm('You haven\'t used the 1-click voter yet!\nDo you want to use it now?')) {
					voteNow(true);
				}
			} else { //not first run
				var till = (parseInt(lastVote, 10) + 86400) - time(); // time till next vote
				var msg = '';
				if (till <= 0) { // user can vote again so ask
					var ago = time() - lastVote; // time since last vote
					msg += 'You haven\'t used the 1-click voter today!' + '\n' + 'Since you last used the 1-click voter, it\'s been:\n';
					msg += Math.floor(ago / 86400) + ' days, '; // days
					msg += Math.floor((ago % 86400) / 3600) + ' hours, '; // hours
					msg += Math.floor((ago % 3600) / 60) + ' minutes and '; // minutes
					msg += Math.floor(ago % 60) + ' seconds.'; // seconds
					msg += '\n' + 'Do you want to use the 1-click voter now?';
				} else { // can't vote yet
					msg += 'You can\'t vote again yet!\nPlease wait another:\n';
					msg += Math.floor(till / 3600) + ' hours, '; // hours
					msg += Math.floor((till % 3600) / 60) + ' minutes and '; // minutes
					msg += Math.floor(till % 60) + ' seconds.'; // seconds
					msg += '\n' + 'Do you still want to vote?';
				}
				if (confirm(msg)) {
					voteNow(true);
				}
			}
		}
		// GroupCrime accept focus
		if (on_page('module=GroupCrimes') && nn == 'center') {
			//focus on accept
			$('a').filter(function(){
				return (/Accept/i).test($(this).text())
			}).focus();
			//focus on transfer
			$('a').filter(function(){
				return (/Make Transfer/i).test($(this).text())
			}).focus();
		}
		//Heist Autoform
		if (on_page('module=Heist') && nn == 'center') {
			$('input[name="bullets"]').val('50');
			$('select[name="gun"]').val('real');
			$('input[name="driver"]').focus();
		}
		//Mail
		//redirect
		if (on_page('module=Mail') && nn == 'center'){
			if ($('font:eq(0)').text().indexOf('Deleted') != -1) {
				setTimeout(function () {
					window.history.back()
				}, 1000);
			}
		}
		//Inbox
		if (on_page('action=inbox') && nn == 'center'){
			//save unread msg and msg ids
			var msg = $('td[style="cursor:pointer;cursor:hand"]').length;
			var unreadmsg = $('tr.color2').length;
			var id = [];
			for(var i=0;i<msg;i++){ //find first open spot
				id[i] = $('a[href*="showMsg"]:eq('+i+')').attr('href').split('?')[1].match(/\d+/g);
				setV('msgids', id.join(',')); //join and save values
			}
			var unreadid = [];
			for(var a=0;a<unreadmsg;a++){ //find first open spot
				unreadid[a] = $('tr.color2 > td:eq(1) > a').attr('href').split('?')[1].match(/\d+/g);
				setV('unread', unreadid.join(',')); //join and save values
			}
			//delete and reply icons
			var num = 1;
			$('tr[class*="color"]').each(function() {
				//$(this).children('td:eq(0)').text('jottem');
				var id = $(this).children('td:eq(1)').children('a').attr('href').split('?')[1].match(/\d+/g)[0];
				$(this).children('td:eq(0)').append(
					$('<a>').attr('href', 'BeO/webroot/index.php?module=Mail&action=delMsg&iId='+id+'&iParty=2').html(
						$('<img />').attr({src: 'https://raw.github.com/OmertaBeyond/OBv2/master/images/delete.png', title: 'Delete', class: 'inboxImg'})
					)
				);
				if ($(this).children('td:eq(2)').children('a').length) { //add reply icon
					$(this).children('td:eq(0)').append(
						$('<a>').attr('href', 'BeO/webroot/index.php?module=Mail&action=sendMsg&iReply='+id).html(
							$('<img />').attr({src: 'https://raw.github.com/OmertaBeyond/OBv2/master/images/reply.png', title: 'Reply', class: 'inboxImg'})
						)
					);
				}
				if (num < 11) { //add msg hotkeys
					var title = $(this).children('td:eq(1)').children();
					title.html('['+(num == 10 ? 0 : num)+'] '+title.html())
					title.attr('accesskey', (num == 10 ? 0 : num));
					num++;
				}
			});
			//hotkeys for system delete
			var keys = ['-', '=', '[', ']', ';', '\''];
			var selectors = $('td[align="right"][colspan="100%"] > a');
			for (i = -1; ++i < selectors.length;) {
				$('td[align="right"][colspan="100%"] > a:eq('+i+')').attr({accesskey: keys[i], title: 'Hotkey: '+keys[i]});
			}
			//select all button
			$('td[align="right"][colspan="100%"]').prepend(
				$('<span>').css('float', 'left').append(
					$('<input />').attr({type: 'button', value: '(Un)Select All'}).click(function() {
						$('[name="selective[]"]').each(function() {
    						$(this).prop('checked', !$(this).prop('checked'));
						})
					})
				)
			);
			//add custom system delete
			function delMsg(name) {
				$('tr[class*="color"]').each(function() {
					var tr = $(this);
					var title = tr.find('td:eq(1)').text().replace(/\s/g, '').replace(/(\[\d+\])/g, '');
					var thismsgid = tr.find('td:eq(1)').find('a').attr('href').split('iMsgId=')[1];
					if(title==name) {
						GM_xmlhttpRequest({ //grab data from xml
							method: 'GET',
							url: 'http://'+document.location.hostname+'/BeO/webroot/index.php?module=Mail&action=delMsg&iId='+thismsgid+'&iParty=2',
							onload: function(response) {
								var errormsg = response.responseText.split('<font color="red">')[1];
								errormsg = errormsg.split('</font>')[0];
								errormsg.replace(/\t/g, '');
								$('font[color="red"]').text(name+' messages deleted.');
							}
						});
						tr.hide();
						tr.next().hide();
					}
				});
			}
			$('td[align="right"][colspan="100%"] > a:eq(0)').before($('<br />'));
			$('td[align="right"][colspan="100%"]').append(
				$('<br />'),
				$('<span>').text('Delete System: '),
				$('<span>').css('cursor', 'pointer').text('Super Lottery').on('click', function() {
					delMsg('Omerta Super Lottery')
				}),
				$('<span>').text(' | '),
				$('<span>').css('cursor', 'pointer').text('Target not found').click(function() {
					delMsg('Target not found')
				}),
				$('<span>').text(' | '),
				$('<span>').css('cursor', 'pointer').text('Target found').click(function() {
					delMsg('Target found')
				}),
				$('<span>').text(' | '),
				$('<span>').css('cursor', 'pointer').text('Promoted').click(function() {
					delMsg('Promoted')
				})
			)
		}
		//Outbox
		if (on_page('action=outbox') && nn == 'center'){
			setTimeout(function () {
				$('a[href*="showSentMsg"]').each(function() {
					var id = $(this).attr('href').split('?')[1].match(/\d+/g)[0];
					$(this).parent().prepend(
						$('<a>').attr('href', 'BeO/webroot/index.php?module=Mail&action=delMsg&iId='+id+'&iParty=1').html(
							$('<img />').attr({src: GM_getResourceURL('delete'), title: 'Delete', class: 'inboxImg'})
						)
					);
				});
			}, 0);
		}
		//Show message
		if (on_page('action=showMsg') && nn == 'center') {
			var id = wlh.split('iMsgId=')[1].match(/\d+/g)[0];
			var ids = getV('msgids', '').split(',');
			for(i = 0;i<ids.length;i++){
				if (ids[i] == id) {
					var nonext = (i==0)?'visibility:hidden; ':'';
					var noprev = (i==ids.length-1)?'visibility:hidden; ':'';
					var next = ids[i-1];
					var prev = ids[i+1];
				}
			}
			//check unread msg and grab obay bullets
			var unread = getV('unread', '').split(',');
			for (var x = 0; x < unread.length; ++x) {
				if (unread[x] != '' && unread[x] == id) { //msg is unread
					var msgTyp = $('tr.tableitem').text().split('Type:')[1].split('Sent:')[0];
					var arr = $('table.thinline > tbody > tr:eq(7) > td').html().split(' ');
					var bulletmsg = new RegExp('Obay bid succesful');
					if (bulletmsg.test(msgTyp)) { //grab obay bullets from message
						setV('obaybul', (getV('obaybul', 0) + parseInt(arr[2], 10)));
					}
					// resave unread msg's, without our msg
					var str = '';
					for (var y = 0; y < unread.length; ++y) {
						if (unread[y] != '' && unread[y] != id) {
							str += ','+unread[y];
						}
					}
					setV('unread', str.substr(1));
					x = unread.length; // not needed to continue because we found our id
				}
			}
			//add previous and next arrows
			setTimeout(function () {
				$('table.thinline > tbody > tr > td.tableheader:eq(1)').append(
					$('<span>').css({'float': 'right', 'padding-top': '2px'}).append(
						$('<img>').attr({title: 'Previous', class: 'inboxImg', src: GM_getResourceURL('prev')}) //.css(noprev)
					).append(
						$('<img>').attr({title: 'Next', class: 'inboxImg', src: GM_getResourceURL('next')}) //.css(nonext)
					)
				);
			}, 0);
			//replace reply and delete links
			var linkz = $('table.thinline > tbody > tr:eq(9) > td > a');
			if (linkz.length == 1) {
				setTimeout(function () {
					$('table.thinline > tbody > tr:eq(9) > td > a').html(
						$('<img />').attr({src: GM_getResourceURL('delete'), title: 'Delete ([)', class: 'inboxImg'})
					).attr('accesskey', '[');
				}, 0);
			} else {
				setTimeout(function () {
					$('table.thinline > tbody > tr:eq(9) > td > a:first').html(
						$('<img />').attr({src: GM_getResourceURL('delete'), title: 'Delete ([)', class: 'inboxImg'})
					).attr('accesskey', '[');
					$('table.thinline > tbody > tr:eq(9) > td > a:last').html(
						$('<img />').attr({src: GM_getResourceURL('reply'), title: 'Reply (])', class: 'inboxImg'})
					).attr('accesskey', ']');
				}, 0);
			}
		}
		//focus on text area
		if (on_page('iReply=') && nn == 'center') {
			$('textarea').focus();
		}
		//redirect on send message
		if (on_page('action=sendMsg') && nn == 'b') {//needs testing
			if ($('font:eq(0)').text().indexOf('Message sent to') != -1) {
				setTimeout(function () {
					$('a')[0].click();
				}, 1000);
			}
		}
		//look its me
		if ((on_page('users_online') && nn == 'center') || (on_page('allusers.php') && nn == 'div') || (on_page('global_stats')) && nn == 'center') {
			var nick = getV('nick', '');
			if (nick !== '') {
				$('a[class!="link"]').each(function() {
					if ($(this).text() == nick || $(this).text() == nick + '+') {
						$(this).html('<span style="color:green;font-weight:bold;">' + $(this).html() + '</span>');
					}
				});
			}
		}
//---------------- Bank ----------------
		if (on_page('/bank.php') && nn == 'center') {
			//auto reload after transfer
			if ($('center').html().search('<table') == -1) { 
				setTimeout(function () {
					window.location.reload();
				}, 1000);
			}
			// Add amount of interest next to %
			if($('table.thinline:eq(1) > tbody > tr:eq(1) > td:eq(1)').length) { // check for banked money
				var money = $('table.thinline:eq(1) > tbody > tr:eq(1) > td:eq(1)').text();
				var rx = $('table.thinline:eq(1) > tbody > tr:eq(3) > td:eq(1)').text(); // get recieved amount
				var tmp = 1 * rx.replace(/\D/g, '') - 1 * money.replace(/\D/g, ''); // calculate interest
				$('table.thinline:eq(1) > tbody > tr:eq(2) > td:eq(1)').html($('table.thinline:eq(1) > tbody > tr:eq(2) > td:eq(1)').text()+' &rarr; ($'+commafy(tmp)+')');
				setTimeout(function() {
					setV('interest', tmp);
				}, 0);

				// Interest reminder
				var seconds = 0;
				seconds = (seconds + (parseInt($('span:eq(14)').html().split(' hours')[0], 10) * 3600));
				seconds = (seconds + (parseInt($('span:eq(14)').html().split(' hours')[1].split(' minutes')[0], 10) * 60));
				seconds = (seconds + parseInt($('span:eq(14)').html().split(' minutes')[1].split(' seconds')[0], 10));
				setTimeout(function() {
					setV('banktleft', (time() + seconds));
				}, 0);
			}
			// Calculators
			// !!!!!!!will make this "more" jQuery later..!!!!!!
			var func1 = 'javascript: var amt=this.value.replace(/\\D/g,\'\'); if(amt){ get = document.getElementById(\''; //put ID here
			var func2 = '\'); if(get){ tmp = \'\'+Math.round(amt'; //put factor here
			var func3 = '); str =\'\'; while(tmp > 0){ if(str!=\'\'){ while(str.length % 4 !=3 ){ str = \'0\' + str;};';
			func3 += 'str = \',\' + str;};dec = (tmp % 1000)+\'\';str = dec + str;tmp = Math.floor(tmp/1000);};';
			func3 += 'get.textContent = \'$\' + str}; };';
			var func_switch = '* (amt >= 1000000 ? (amt >= 3000000 ? (amt >= 6000000 ? (amt >= 10000000 ? (amt >= 15000000 ? ';
			func_switch += '(amt >= 21000000 ? (amt >= 27000000 ? (amt >= 35000000 ? 1.01 : 1.015) : 1.02) : 1.025 ) : 1.03) : 1.035)';
			func_switch += ' : 1.04) : 1.045) : 1.05 )';

			var tbl = '<tr><td class="tableheader" colspan="4">Calculators</td></tr>';
			tbl += '<tr><td align="left" width="33%">You send:</td>';
			tbl += '<td align="left" width="13%"><input name="amount" type="text" value="" onKeyUp="' + func1 + 'get' + func2 + '*0.9' + func3 + '" size="15" maxlength="11" /></td>';
			tbl += '<td align="left" width="28%">User gets:</td><td align="center" id="get">$0</td></tr>';
			tbl += '<tr><td align="left" width="33%">You want:</td>';
			tbl += '<td align="left" width="13%"><input name="amount" type="text" value="" onKeyUp="' + func1 + 'give' + func2 + '/0.9' + func3 + '" size="15" maxlength="11" /></td>';
			tbl += '<td align="left" width="28%">User sends:</td><td align="center" id="give">$0</td></tr>';
			tbl += '<tr><td align="left" width="33%">You put into bank:</td>';
			tbl += '<td align="left" width="13%"><input name="amount" type="text" value="" onKeyUp="' + func1 + 'int' + func2 + func_switch + func3 + '" size="15" maxlength="11" /></td>';
			tbl += '<td align="left" width="28%">You will receive:</td><td align="center" id="int">$0</td></tr>';

			if($('td[width="33%"]:eq(2)').length) {
				$('td[width="33%"]:eq(2)').append(
					$('<br />'),
					$('<table>').attr({class: 'thinline', width: '100%', align: 'center', rules: 'none'}).html(tbl)
				)
			}
			// m/k usage
			var inputs = $('input[name="amount"], input#amount');
			inputs.each(function() {
				$(this).keydown(function(event) {
					var symcode = event.which;
					if(symcode == 75){
						$(this).val($(this).val() + "000");
					}
					if(symcode == 77){
						$(this).val($(this).val() + "000000");
					}
					$(this).val($(this).val().replace(/k|m/g,""));
					return (symcode == 75 || symcode == 77)?false:true;
				});
			});
		}
//---------------- All users ----------------
		if (on_page('/allusers.php') && nn == 'div') {
			//add pagenumber
			var page = $.urlParam('start');
			page = (page/15)+1;
			$('a[href*="/allusers.php"]:eq(2)').before($('<p>').html('Page: '+page));
			
			//edit show/hide dead link
			var dead = $.urlParam('dead');
			if(dead != null) {
				var url = document.location.hash.replace('#', '');
				var hs = (dead == 'HIDE') ? 'SHOW' : 'HIDE';
				$('a[href*="/allusers.php?dead="]').attr('href', url.replace(dead, hs));
			}
		}
	}, true);
}
//---------------- Game Menu ----------------
if (document.getElementById('game_menu') !== null) {
	document.getElementById('game_menu').addEventListener('DOMNodeInserted', function(event) {
		if (event.target.nodeType != 1) {
			return false;
		}
		if ($(event.target).attr('data-beyond-menu-fired') !== undefined) {
			return false;
		}

		$(event.target).attr('data-beyond-menu-fired', 'true');

		var wlh = window.location.hash;
		var nn  = event.target.tagName.toLowerCase();
		var nid  = event.target.getAttribute('id');
		
		//Change allusers link
		if(nn == 'div' && nid == 'game_menu_alerts') {
			$('a[href*="/allusers.php"]').attr('href', '/allusers.php?start=0&order=lastrank&sort=DESC&dead=HIDE');
		}
	}, true);
}

$('input[name="email"]').focus();

// Replace Omerta's favicon
$('<link rel="shortcut icon" type="image/x-icon"/>').appendTo('head').attr('href', GM_getResourceURL('favicon'));

// Replace Omerta's logo
$('#game_header_left').children('img').attr('src', GM_getResourceURL('logo'));
