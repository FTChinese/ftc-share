var Share = (function (Delegate) {
	'use strict';

	Delegate = 'default' in Delegate ? Delegate['default'] : Delegate;

	var socialUrls = {
		wechat: {
			name: "微信",
			url: "http://www.ftchinese.com/m/corp/qrshare.html?title={{title}}&url={{url}}&ccode=2C1A1408"
		},
		weibo: {
			name: "微博",
			url: "http://service.weibo.com/share/share.php?&appkey=4221537403&url={{url}}&title=【{{title}}】{{summary}}&ralateUid=1698233740&source=FT中文网&sourceUrl=http://www.ftchinese.com/&content=utf8&ccode=2G139005"
		},
		linkedin: {
			name: "领英",
			url: "http://www.linkedin.com/shareArticle?mini=true&url={{url}}&title={{title}}&summary={{summary}}&source=FT中文网"
		},
		facebook: {
			name: "Facebook",
			url: "http://www.facebook.com/sharer.php?u={{url}}"
		},
		twitter: {
			name: "Twitter",
			url: "https://twitter.com/intent/tweet?url={{url}}&amp;text=【{{title}}】{{summary}}&amp;via=FTChinese"
		}
	};

	function getOgContent(metaEl) {
		if (!(metaEl instanceof HTMLElement)) {
			metaEl = document.querySelector(metaEl);
		}
		return metaEl.hasAttribute('content') ? metaEl.getAttribute('content') : '';
	}

	// Get page meta content statically. Should not put this inside the `Share` object in order to reduce DOM traverse.
	var fallbackConfig = {
		links: ['wechat', 'weibo', 'linkedin', 'facebook', 'twitter'],

		url: window.location.href || '',
		summary: getOgContent('meta[property="og:description"]'),
		title: getOgContent('meta[property="og:title"]')
	};

	function Share (rootEl, config) {
		var oShare = this;
		var openWindows = {};

		function init() {
			if (!rootEl) {
				rootEl = document.body;
			} else if (!(rootEl instanceof HTMLElement)) {
				rootEl = document.querySelector(rootEl);
			}

			// const rootDelegate = new DomDelegate(rootEl);
			var rootDelegate = new Delegate(rootEl);
			
			rootDelegate.on('click', 'a', handleClick);
			rootEl.setAttribute('data-o-share--js', '');

			oShare.rootDomDelegate = rootDelegate;
			oShare.rootEl = rootEl;

			if (rootEl.children.length === 0) {
				if (!config) {
					config = {};
					config.links = rootEl.hasAttribute('data-o-share-links') ? rootEl.getAttribute('data-o-share-links').split(' ') : fallbackConfig.links;
					config.url = rootEl.getAttribute('data-o-share-url') || fallbackConfig.url;
					config.title = rootEl.getAttribute('data-o-share-title') || fallbackConfig.title;
					config.summary = rootEl.getAttribute('data-o-share-summary') || fallbackConfig.summary;
				}
				render();
			}
		}

		function render() {
			var ulElement = document.createElement('ul');

			for (var i = 0; i < config.links.length; i++) {
				var link = config.links[i];
				var linkName = socialUrls[link].name;
				
				var liElement = document.createElement('li');
				//liElement.classList.add('o-share__action', 'o-share__' + link);
				liElement.className = 'o-share__action o-share__' + link;
				
				var aElement = document.createElement('a');

				aElement.href = generateSocialUrl(link);
				aElement.setAttribute('title', '分享到'+linkName);
				aElement.setAttribute('target', '_blank');
				
				var iElement = document.createElement('i');
				iElement.innerHTML = linkName;
				aElement.appendChild(iElement);

				liElement.appendChild(aElement);
				ulElement.appendChild(liElement);
			}
			oShare.rootEl.appendChild(ulElement);
		}

		function handleClick(e, target) {
			e.preventDefault();
			shareSocial(target.href);
		}

		function shareSocial(url) {
			if (url) {
				if (openWindows[url] && !openWindows[url].closed) {
					openWindows[url].focus();
				} else {
					openWindows[url] = window.open(url, '', 'width=646,height=436');
				}
			}
		}

		function generateSocialUrl (socialNetwork) {
			var templateUrl = socialUrls[socialNetwork].url;
			templateUrl = templateUrl.replace('{{url}}', encodeURIComponent(config.url))
				.replace('{{title}}', encodeURIComponent(config.title))
				.replace('{{summary}}', encodeURIComponent(config.summary));

			return templateUrl;
		}

		init();
	}

	Share.prototype.destroy = function() {
		var this$1 = this;

		this.rootDomDelegate.destroy();

		for (var i = 0; i < this.rootEl.children; i++) {
			this$1.rootEl.removeChild(this$1.rootEl.chidlren[i]);
		}

		this.rootEl.removeAttribute('data-o-share--js');
		this.rootEl = undefined;
	};

	Share.init = function(el) {
		var shareInstances = [];

		if (!el) {
			el =document.body;
		} else if (!el instanceof HTMLElement) {
			el = document.querySelector(el);
		}

		var shareElements = el.querySelectorAll('[data-o-component=o-share]');

		for (var i = 0; i < shareElements.length; i++) {
			shareInstances.push(new Share(shareElements[i]));

		}

		return shareInstances;
	};

	return Share;

}(domDelegate.Delegate));
//# sourceMappingURL=ftc-share.js.map