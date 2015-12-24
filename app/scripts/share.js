define('share', function() {
	console.log(define.amd);
	var socialUrls = {
		wechat: {
			name: "微信",
			url: "http://www.ftchinese.com/m/corp/qrshare.html?title={{title}}&url={{url}}&ccode=2C1A1408"
		},
		weibo: {
			name: "微博",
			url: "http://service.weibo.com/share/share.php?&appkey=4221537403&url={{url}}&title=【{{title}}】{{summary}}&ralateUid=1698233740&source=FT中文网&sourceUrl=http://www.ftchinese.com/&content=utf8&searchPic=false&ccode=2G139005"
		},
		linkedin: {
			name: "LinkedIn",
			url: "http://www.linkedin.com/shareArticle?mini=true&url={{url}}&title={{title}}&summary={{summary}}&source=FT中文网"
		},
		defaultSocialList: ['wechat', 'weibo', 'linkedin']
	};

	/*
	  *@object Share used as prototype
	  */
	var Share = {
		init: function(rootEl, socialList, config) {
			this.rootEl = rootEl;
			this.socials = socialList;
			this.config = config;
	//If `networks` and `config` were passed in the wrong order:
			for (var i = 1; i < arguments.length; i++) {
				if (Array.isArray(arguments[i])) {
					this.socials = arguments[i];
				} else {
					this.config = arguments[i];
				}
			}
			if (!this.rootEl) {
				this.rootEl = document.body;
			} 
			if (!(this.rootEl instanceof HTMLElement)) {
				this.rootEl = document.querySelector(rootEl);
			}
	//Try if there is a `data-o-share-links` attribute on the `rootEl`
			try {
				var hasShareAttr = this.rootEl.hasAttribute('data-link-list');
			} catch(e) {
				console.log(e.message);
			}
	//If there is `data-o-share-links`, then split the attribute value into an array...
			if (!this.socials && hasShareAttr) {
				this.socials = this.rootEl.getAttribute('data-share-links').split(' ') || [];
			}
	//else, use `defaultNetworks`:
			if (!this.socials && !hasShareAttr) {
				this.socials = socialUrls.defaultSocialList;
			}
	//If `config` param does not exist, get the share url content from tags.
			if (!this.config) {
				this.config = {};
				this.config.url = window.location.href || '';
				this.config.title = this.getTitle();
				this.config.summary = this.getDescription();
			}
			this.render();
		},

		render: function() {
			var ulElement = document.createElement('ul');

			for (var i = 0; i < this.socials.length; i++) {
				var social = this.socials[i];
				var socialName = socialUrls[social].name;
				var url = this.generateSocialUrl(social);

				var liElement = document.createElement('li');
				
				var aElement = document.createElement('a');
				aElement.classList.add('share-link');
				aElement.classList.add('share-' + social);
				aElement.href = url;
				aElement.target = '_blank';

				var iElement = document.createElement('i');
				iElement.classList.add('icon-social-' + social);

				var spanElement = document.createElement('span')
				
				var socialText = document.createTextNode(socialName);
				spanElement.appendChild(socialText);

				aElement.appendChild(iElement);
				aElement.appendChild(spanElement);
				liElement.appendChild(aElement);
				ulElement.appendChild(liElement);
			}

			try {
				this.rootEl.appendChild(ulElement);
			} catch(e) {
				console.log(e.message);
			}
		},

		generateSocialUrl: function(social) {
			var templateUrl = socialUrls[social].url;
			templateUrl = templateUrl.replace('{{url}}', encodeURIComponent(this.config.url))
				.replace('{{title}}', encodeURIComponent(this.config.title))
				.replace('{{summary}}', encodeURIComponent(this.config.summary));
			return templateUrl;
		},

		getDescription: function() {
			var descElement = document.querySelector('meta[property="og:description"]');
			if (descElement) {
				return descElement.hasAttribute('content') ? descElement.getAttribute('content') : '';
			}
			return '';
		},

		getTitle: function() {
			var titleElement = document.querySelector('title');
			if (titleElement) {
	//`innerText` for IE
				var titleText = (titleElement.textContent !== undefined) ? titleElement.textContent : titleElement.innerText;
				return titleText.split('-')[0].trim();
			}
			return '';
		}
	};	
	return Share;
});

