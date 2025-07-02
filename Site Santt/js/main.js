var IS_PROD = true;
var langStr = '/pt';
var staticPath = 'https://static.rfstat.com/renderforest/';
var CURRENT_LANGUAGE = 'pt';
var AVAILABLE_LANGUAGES = ["en","pt","es","de","fr","ar","jp","tr","ru"];
var RF_COOKIE_USER_META_KEY = "__rf_user_meta";
var RF_COOKIE_META_INFO = "__rf_meta_info";
var CURRENT_HOST = 'https://www.renderforest.com';
var SITE_MAKER_API_PATH = 'https://site-maker-api.renderforest.com/api/v1';
var LOGO_MAKER_API_PATH = 'https://logo-maker-api.renderforest.com/api/v1';
var LOGO_MAKER_API_HOST = 'https://logo-maker-api.renderforest.com';
var VIDEO_API_PATH = 'https://video-api.renderforest.com/api/v1';
var AI_IMAGE_API_PATH = 'https://ai-image-api.renderforest.com/api/v1';
var LOGO_MAKER_SUGGESTION_API_HOST = 'https://logo-suggestion.renderforest.com';
var LOGO_MAKER_SUGGESTION_API_PATH= 'https://logo-suggestion.renderforest.com/api/v1';
var MOCKUP_MAKER_API_PATH = 'https://gm-api.renderforest.com/api/v1/mockup-maker';
var RECOMMENDATION_API_PATH = 'https://engine.renderforest.com/api/v1';
var CREDIT_MANAGER_API_PATH = 'https://credit-manager.renderforest.com/api/v1';
var GRAPHIC_MAKER_API_PATH = 'https://gm-api.renderforest.com/api/v1/graphic-maker';
var GRAPHIC_MAKER_EXPORTER_API_PATH = 'https://gm-exporter.renderforest.com/api/v1/graphic-maker';
var GROWTHBOOK_API_HOST = 'https://cdn.growthbook.io';
var GROWTHBOOK_CLIENT_KEY = 'sdk-ijxAfs7rewOH1dyR';
var WEB_PATH = 'https://www.renderforest.com';
var API_RENDER_HOST = 'https://api.renderforest.com/api/v1';
var FILE_UPLOAD_PATH = '//user-media-upload.renderforest.com/api/v3';
var CURRENCY_SYMBOLS = {"USD":"$","AMD":"֏","EUR":"€","RUB":"₽","BRL":"R$","CNY":"¥","INR":"₹","JPY":"¥","MXN":"Mex$","PLN":"zł","CHF":"CHF","TRY":"₺","GBP":"£"};
var CURRENT_CUSTOM_CURRENCY = "BRL";
var CURRENT_COUNTRY='BR';
var GOOGLE_CLIENT_ID = '720565468126-fob7jcnecgkdouicdlesjlt1kubg3uk6.apps.googleusercontent.com';
var GM_GIPHY_API_KEY = 'QhWCYO15KcCNRmIMolStdjinT2362yne';
var DROPBOX_APP_KEY = 'wlldepjyuly96ar';
var GOOGLE_DEVELOPER_KEY = 'AIzaSyD0ro3mObI32CsU5oBP476jMqYO-5JN9Zg';
var FACEBOOK_CLIENT_ID = '738134836291464';
var ASSET_KEY='';
var URL_WITHOUT_SEARCH='/website-maker/new/lang/preview-project/ai-preset/f023026e';

var showVideoHighDemandMessage = false;
var topMessages = {};

function addListenerMulti(el, evN, l) {
  var es = evN.split(' ');
  for (var i = 0, iLen = es.length; i < iLen; i++) {
    el.addEventListener(es[i], l, {once: true});
  }
}

var langStr = '/pt';
var loginPageUrl = langStr + '/signin';

function getCsrfAndCallCb(cb) {
  var http = new XMLHttpRequest();
  var url = "/csrf";
  http.open("GET", url, true);
  http.setRequestHeader("Content-type", "application/json;charset=UTF-8");
  http.setRequestHeader("x-requested-with", "XMLHttpRequest");
  http.onreadystatechange = function() {
    if(http.readyState == 4) {
      if(http.status == 200) {
        var parsedData = JSON.parse(http.responseText);
        return cb(parsedData.token);
      } else {
        var warnMsg = JSON.parse(http.responseText);
        alert(warnMsg.message || 'Algo deu errado');
      }
    }
  }
  http.send();
}

// check if there is ajaxLogin, use that one. if no, redirect.
function processLoginResult(err, url, isNewUser) {
  if (err) {
    if (typeof window.ajaxLogin === 'function') {
      window.ajaxLogin(err);
    } else {
      window.location = loginPageUrl;
    }
    return;
  }

  if (isNewUser && typeof setDataLayerData === 'function') {
    setDataLayerData({
      "event": "sign_up",
      "sign_up_type": "google_auto_login"
    });
  }

  if (typeof window.ajaxLogin === 'function') {
    window.ajaxLogin();
  } else {
    window.location = url;
  }
}

function signupByCredentials (credential) {
  return function (subscriberCsrf) {
    var http = new XMLHttpRequest();
    var url = 'https://www.renderforest.com/signin/google/callback';
    var returnUrl = window.location.href;
    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    http.setRequestHeader("x-requested-with", "XMLHttpRequest");
    http.setRequestHeader("x-csrf-token", subscriberCsrf);

    var body = { credential, returnUrl };
    http.onreadystatechange = function() {
      if(http.readyState == 4 && (http.status == 200 || http.status == 400)) {
        if(http.status == 200) {
          var parsedData = JSON.parse(http.responseText);
          if (parsedData && parsedData.data && parsedData.data.redirectUrl ) {
            processLoginResult(null, parsedData.data.redirectUrl, parsedData.data.isNewUser);
          } else {
            processLoginResult(http.responseText, loginPageUrl);
          }
          return;
        } else {
          processLoginResult(http.responseText, loginPageUrl);
        }
      }
    }
    http.send(JSON.stringify(body));
  }
}

function handleCredentialResponse (payload) {
    return getCsrfAndCallCb(signupByCredentials(payload.credential));
}

window.onload = function () {
  if (typeof google !== 'undefined') {
    google.accounts.id.initialize({
      client_id: '720565468126-fob7jcnecgkdouicdlesjlt1kubg3uk6.apps.googleusercontent.com',
      login_uri: 'https://www.renderforest.com/signin/google/callback',
      callback: handleCredentialResponse,
      prompt_parent_id: 'google_prompt',
      cancel_on_tap_outside: true
    });
  }
}

var oneTapTimeout = null;
var hideOneTapLogin = false;

function initGoogleOneTapLogin (timeoutSec) {
  var _timeoutSec = timeoutSec || 0;
  oneTapTimeout = setTimeout(function(){
    if (typeof google === 'undefined') {
      return;
    }
    if (hideOneTapLogin) {
      return;
    }
    google.accounts.id.prompt();
  }, _timeoutSec * 1000);
}

function removeGoogleOneTapLogin () {
  hideOneTapLogin = true;
  if (oneTapTimeout) {
    clearTimeout(oneTapTimeout);
  }
  var googleOneTapLoginPrompt = document.getElementById('google_prompt');
  if (googleOneTapLoginPrompt) {
    googleOneTapLoginPrompt.classList.add('hidden');
  }
}

function loadJsScript(url, async = false) {
  return new Promise((resolve, reject) => {
    try {
      // load the script
      var script = document.createElement("script");
      script.src = url;
      if (async) {
        script.async = true;
      }
      script.type = 'text/javascript';
      script.addEventListener('load', () => {
        return resolve();
      });
      script.addEventListener('error', () => {
        return reject({ message: `Failed to load the script ${url}`});
      });
      document.body.appendChild(script);
    } catch(err) {
      return reject({ message: `something went wrong`});
    }
  });
}

function loadCssStyles(url) {
  return new Promise((resolve, reject) => {
    var style = document.createElement("link");
    style.href = url;
    style.type = 'text/css';
    style.rel = 'stylesheet';
    style.addEventListener('load', () => {
        return resolve();
    });
    style.addEventListener('error', () => {
      return reject({message: `Failed to load the style ${url}`});
    });
    document.head.appendChild(style);
  });
}

function determineRFApp () {
  var rfApp = false;
  var rfApps = ["RenderForest App","RenderForest iOS App","RenderForest Android App"];
  var userAgent = navigator.userAgent || null;

  if (userAgent && rfApps) {
    rfApps.map(agent => {
      if (!rfApp && userAgent.includes(agent)) {
       rfApp = true;
      }
    });
  }
  return rfApp;
}
var __isRfApp = determineRFApp();

var langStr = "/pt";
window.ga = window.ga||function(){};

var avatarGradientList = [
  '130deg, #DFD7FD 10%, #5870AC 90%',
  '130deg, #E3ECFF 10%, #87A6EB 85%',
  '135deg, #F6F4FF -45%, #7F6AFF 205%',
  '330deg, #E8A7FF 5%, #F0E3FF 85%',
  '150deg, #FFD1D1 10%, #FEA4BF 90%',
  '130deg, #C2F4E5 10%, #7BE0E7 90%',
  '135deg, #DBE6FC -45%, #DFDEFA 90%',
  '130deg, #F9FAFF -10%, #B7C4E7 90%',
  '145deg, #D2FABC 15%, #4FC470 95%',
  '145deg, #FFE999 10%, #EDCD4B 105%',
  '135deg, #FFE0C9 15%, #FAADA0 90%',
  '130deg, #DDE4FF 0%, #74F3FB 185%'
];

var createFakeAvatarImg = function (path) {
  var img = new Image();
  img.src = path;
  img.onerror = function () {
    if (typeof window.getCurrentUserMeta === 'function' && typeof window.initUserInfo === 'function') {
      window.getCurrentUserMeta(window.initUserInfo, true);
    }
  }
};

function handleAuthUserNavigation() {
  document.addEventListener("click", function (e) {
    var target = e.target.closest('[data-auth-href]');
    if (target) {
      var _href = target.getAttribute("data-auth-href");
      if (_href) {
        e.preventDefault();
        window.location.href = _href;
      }
    }
  });
}

function handleAuthUserUrls () {
  if (window.URL_WITHOUT_SEARCH === '/') {
    window.location.href = window.langStr + '/home/main/for-you';
  }
  handleAuthUserNavigation();
}

var getAvatarBackground = function(avatar) {
  var avatarFilePath = avatar.filePath1x;
  if (avatarFilePath) {
    createFakeAvatarImg(avatarFilePath);
    return "url('" + avatarFilePath + "')";
  } else {
    var avatarIconIndex = avatar.iconIndex;
    var avatarColorIndex = avatar.colorIndex;
    return "url('https://cdn.renderforest.com/website/media/avatars/avater_" + avatarIconIndex + "_38x38.svg'), linear-gradient(" + avatarGradientList[avatarColorIndex] + ")";
  }
};

var setRandomProfileThumb = function(userMeta) {
  if(userMeta.avatar) {
    var avatarBackground = getAvatarBackground(userMeta.avatar);
    var avatarList = document.querySelectorAll('.user-icon');
    avatarList.forEach(function (avatar) {
      avatar.style.setProperty('--user-bg', avatarBackground);
    });
  }
};

function getCookie(cName) {
  var name = cName + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function updateCookiesFromBk (cb) {
  var http = new XMLHttpRequest();
  var url = "/profile/update-cookies";
  http.open("GET", url, true);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.setRequestHeader("x-requested-with", "XMLHttpRequest");
  http.onreadystatechange = function() {
      if (http.readyState == 4) {
          if (http.status == 200) {
            if (cb && typeof cb === 'function') {
              cb();
            }
          } else {
            console.log('error cannot update cookies');
          }
      }
  }
  http.send();
}

var mouseMoved = false;
window.needLoadCustomOffers = true;
function checkActivePromo (userMeta) {
  var rfCookiePromoCodeKey = "__rf_pd";
  var promoString = getCookie(rfCookiePromoCodeKey);
  if (!userMeta || !userMeta.tariffPlans || userMeta.tariffPlans.length === 0) {
    if (typeof loadPromoScripts === 'function') {
      if (promoString) {
        promoData = JSON.parse(promoString);
        window.needLoadCustomOffers = false;
        function func () {
          if (!mouseMoved) {
            mouseMoved = true;
            window.removeEventListener('mousemove', func);
            window.removeEventListener('touchstart', func);
            var __currentIsRfApp = typeof determineRFApp === 'function' ? determineRFApp() : false;
            if (!__currentIsRfApp) {
              return loadPromoScripts(promoData, userMeta);
            }
          }
        }
        window.addEventListener('mousemove', func);
        window.addEventListener('touchstart', func);
      }
    }
  }
}

var announcementMouseMoved = false;
window.needLoadAnnouncement = true;
function checkActiveAnnouncement () {
  if (typeof loadAnnouncementScripts === 'function') {
    var __currentIsRfApp = typeof determineRFApp === 'function' ? determineRFApp() : false;
    if (!__currentIsRfApp) {
      window.needLoadAnnouncement = false;
      return loadAnnouncementScripts();
    }
    function csFunc () {
      if (!announcementMouseMoved) {
        announcementMouseMoved = true;
        window.removeEventListener('mousemove', csFunc);
        window.removeEventListener('touchstart', csFunc);
      }
    }
    window.addEventListener('mousemove', csFunc);
    window.addEventListener('touchstart', csFunc);
  }
}

var tryCount = 0;
function getCurrentUserFromCookie(cb, isForceUpdate) {
  var _isForceUpdate = isForceUpdate || false;
  var rfCookieUserMetaKey = "__rf_user_meta";
  var userMetaString = getCookie(rfCookieUserMetaKey);

  // CHECKED, user is not logged in.
  if (userMetaString === null) {
    cb(null, null);
    return;
  }

  if (userMetaString && !_isForceUpdate) {
    try {
      var _userMeta = JSON.parse(userMetaString);
      cb(null, _userMeta);
      return;
    } catch (error) {
      cb(error, null);
      return;
    }
    return;
  }

  // NO COOKIE EXIST, WE NEED TO CHECK API
  if (_isForceUpdate || userMetaString === '') {
    // on COOKIE disabled try only 2 times and set not logged in user
    if (tryCount > 1) {
      cb(null, null);
      return;
    }
    tryCount ++;
    updateCookiesFromBk(function() {
      getCurrentUserFromCookie(cb);
    });
    return;
  }
}

function runOnlyOnce(fn) {
  var cbs = [];
  var isRunning = false;

  return function(cb, isForceUpdate) {
    cbs.push(cb);
    if (isRunning) {
      return;
    }
    isRunning = true;
    fn(function (error, value) {
      isRunning = false;
      cbs.map(function (_cb) { _cb(error, value) });
      cbs = [];
    }, isForceUpdate);
  }
}

var getCurrentUserMeta = runOnlyOnce(getCurrentUserFromCookie);

function drawPricingButton (userMeta) {
  if (userMeta.tariffPlans.length && !userMeta.tariffPlans.includes(29)) {
    var pricingButtonLink = document.getElementById('pricingButtonLink');
    if (pricingButtonLink) {
      var pricingButtonText = pricingButtonLink.dataset.userText;
      pricingButtonLink.innerHTML = pricingButtonText;
    }
  }

  if (userMeta.subUserId) {
    var pricingButton = document.getElementById('pricingButton');
    if (pricingButton) {
      pricingButton.style.display = 'none';
    }
  }
}

function loadAndShowMigrate (migrateData, tariffPlansIds) {
    if (typeof window.loadJsScript === 'function') {
      var url = '/javascripts/migrate.js';
      return window.loadJsScript(url)
        .then(() => {
          return window.getMigrateModalDataAndDraw(migrateData, tariffPlansIds);
        })
        .catch(err => {
          console.log(err);
        });
    }
}

function showMigrate (migrateData, tariffPlansIds) {
  setTimeout(function() {
    if (typeof window.loadAndShowMigrate === 'function') {
      loadAndShowMigrate(migrateData, tariffPlansIds);
    }
  }, 3500);
}

function cutEmailText(email, maxLength) {
  var tempEmail = "noemail@rf.com";
  if (!email || email.endsWith(tempEmail) ) {
    return '';
  }
  if (email.length > maxLength) {
    var lastCount = email.indexOf('@');
    var endPart = email.slice(lastCount, email.length);
    var startPart = maxLength - endPart.length;
    return email.substr(0, startPart + 1) + '...' + endPart;
  }
  return email;
}

function setDataLayerData (data) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(data);
}

function setIdentToDataLayerData (ident) {
  return setDataLayerData({ userId: ident });
}

function initUserInfo (error, userMeta) {
  if (error) {
    console.log('initUserInfo: error', {error});
  }

  var anonymMenu = document.getElementById('header-anonym-menu');
  window.__userMeta = userMeta;
  if (userMeta) {
    handleAuthUserUrls();
    var userMenu = document.getElementById('header-user-menu');
    var userName = document.querySelectorAll('.name-text');
    var userEmail = document.querySelectorAll('.mail-text');
    var viewAccounts = document.querySelectorAll('.view-account');

    var isSubAccount = !!userMeta.subUserId;
    if (isSubAccount && viewAccounts && viewAccounts.length > 0) {
      viewAccounts.forEach(function(viewAccount){
        viewAccount.style.display = "none";
      });
    }

    if (anonymMenu && userMenu && userName) {
      anonymMenu.style.display = "none";
      userMenu.style.display = "flex";
      var userFirstName = userMeta.first_name || userMeta.name || userMeta.id;
      var userLastName = userMeta.last_name || '';
      var userFullName = userFirstName + (userLastName ? ' ' + userLastName : '');
      userName.forEach(function(name){
        name.innerHTML = userFullName;
      });
      setRandomProfileThumb(userMeta);
    }
    if (anonymMenu && userMenu && userName) {
      userEmail.forEach(function(email){
        if(email.classList.contains('dropped')){
          email.innerHTML = cutEmailText(userMeta.email, 27);
        } else {
          email.innerHTML = cutEmailText(userMeta.email, 21);
        }
      });
    }
    drawPricingButton(userMeta);

    if (userMeta.migrateData && !isSubAccount) {
      showMigrate(userMeta.migrateData, userMeta.tariffPlans);
    }

    if (userMeta.ident) {
      setIdentToDataLayerData(userMeta.ident);
    }
    checkActivePromo(userMeta);
    checkActiveAnnouncement();
  } else {
    if (anonymMenu) {
      anonymMenu.style.display = "flex";
    }
    if (typeof window.initGoogleOneTapLogin === 'function') {
      initGoogleOneTapLogin(30);
    }
    checkActivePromo(null);
    checkActiveAnnouncement();
  }
}
getCurrentUserMeta(initUserInfo);

function updateMetaCookiesAndUpdateUserMeta () {
  if (typeof window.getCurrentUserMeta === 'function' && typeof window.initUserInfo === 'function') {
    if (window.tryCount > 0) {
      window.tryCount = 0;
    }
    window.getCurrentUserMeta(window.initUserInfo, true);
  }
}

function getTypesFromUrl (url) {
  var keys = ["rfp","irclickid"] || [];
  return keys.filter(function (k) { return url.includes(k + '=') });
}

function updateBkCookies (body) {
  return function(err, token) {
    if (err) {
      console.log('err');
      return;
    }
    var http = new XMLHttpRequest();
    var url = langStr + "/trjpaf";

    http.open("POST", url, true);
    http.setRequestHeader("Content-type", "application/json;charset=UTF-8");
    http.setRequestHeader("x-requested-with", "XMLHttpRequest");
    http.setRequestHeader("x-csrf-token", token);

    http.onreadystatechange = function() {
        if (http.readyState == 4) {
            if (http.status == 200) {
              return;
            } else {
              console.log('error cannot update cookies');
            }
        }
    }
    http.send(JSON.stringify(body));
  }
}

function getTokenAndCallCallback(cb) {
  var http = new XMLHttpRequest();
  var url = "/csrf";

  http.open("GET", url, true);
  http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  http.setRequestHeader("x-requested-with", "XMLHttpRequest");

  http.onreadystatechange = function() {
    if(http.readyState == 4) {
      if(http.status == 200) {
        var parsedData = JSON.parse(http.responseText);
        return cb(null, parsedData.token);
      } else {
        return cb('something went wrong', null);
      }
    }
  }
  http.send();
}

function checkUrlAndPrepareIfNeeded () {
  var href = (window && window.location && window.location.href ) || null;

  if (!href) {
     return;
  }
  var _types = getTypesFromUrl(href);

  if (_types.length === 0) {
    return;
  }

  var body = { url: href, types: _types};
  return getTokenAndCallCallback(updateBkCookies(body));
}

checkUrlAndPrepareIfNeeded();

var isEditor = true;

var startedCustomOfferLoad = false;
var startedCommonJsLoad = false;
var commonLoaded = false;
var cbs = [];

function callCbs () {
  return cbs.map(function (_cb) {
    return _cb();
  });
}
function loadCommonJs (cb) {
  if (typeof window.loadJsScript === 'function') {
    var url = 'https://cdn.renderforest.com/common/custom-offers/1.0.30/bundle.min.js';
    cbs.push(cb);

    if (startedCommonJsLoad) {
      return;
    }

    if (commonLoaded) {
     return callCbs();
    }

    startedCommonJsLoad = true;
    return window.loadJsScript(url)
      .then(() => {
        startedCommonJsLoad = false;
        commonLoaded = true;
        return callCbs();
      })
      .catch(err => {
        console.log(err);
      });
  }
}

function callOfferFn (payload) {
  if (window.isEditor) {
    if (typeof window.loadIconCustomUpgradeOffer === 'function') {
      return window.loadIconCustomUpgradeOffer(payload);
    }
  } else {
    if (typeof window.loadCustomUpgradeOffer === 'function') {
      return window.loadCustomUpgradeOffer(payload, false, 'badgeRoot');
    }
  }
}

function callFreeOfferFn (payload) {
  if (window.isEditor) {
    if (typeof window.loadIconCustomUpgradeOffer === 'function') {
      return window.loadIconCustomOfferForFree(payload);
    }
  } else {
    if (typeof window.loadCustomUpgradeOffer === 'function') {
      return window.loadUpgradeOfferForFree(payload, false, 'badgeRoot');
    }
  }
}

function callFreeTariffPlanOfferFn (payload) {
  if (payload.tariffPlanId === 30) {
    if (window.isEditor) {
      if (typeof window.loadLimitedLiteOfferBtnForEditors === 'function') {
        return window.loadLimitedLiteOfferBtnForEditors(payload);
      }
    } else {
      if (typeof window.loadLimitedLiteOffer === 'function') {
        return window.loadLimitedLiteOffer(payload, false, 'badgeRoot');
      }
    }
  }
}

function showTrialButton (offerId) {
  var freeTrialItem = document.querySelector('.free-trial-link');
  if (freeTrialItem) {
    var LinkText = "Ativar Teste Gratuito";
    var link = "/pt/offers/" + offerId;
    freeTrialItem.innerHTML = "<a " + "class='user-menu__link'" + "href='" + link +  "'>" + LinkText + "</a>";
    freeTrialItem.style.display= 'block';
  }
}

function loadAndShowCustomOffer (offerData) {
  function _cb () {
    return callOfferFn(offerData);
  }
  return loadCommonJs(_cb);
}

function loadAndShowUserFreeOffer (offerData) {
  function _cb () {
    return callFreeOfferFn(offerData);
  }
  return loadCommonJs(_cb);
}

function loadAndShowUserFreeTariffPlanOffer (offerData) {
  function _cb () {
    return callFreeTariffPlanOfferFn(offerData);
  }
  return loadCommonJs(_cb);
}

function getOfferDataAndCheckOffers (error, userMeta) {
  if (error) {
      console.log('loadAndShowCustomOffer: error', {error});
    }
    if (!userMeta) {
      return;
    }
  if (userMeta.userOffer && userMeta.userOffer.id && userMeta.userOffer.type) {
    if (userMeta.userOffer.type === 'free_trial_subscription') {
      showTrialButton(userMeta.userOffer.id);
    }
    if (userMeta.userOffer.type === 'custom_upgrade_discount') {
      loadAndShowCustomOffer(userMeta.userOffer);
    }
  }
  if (userMeta.userFreeTariffPlanOffer) {
    loadAndShowUserFreeTariffPlanOffer(userMeta.userFreeTariffPlanOffer);
  }
  if (userMeta.userFreeOffer) {
    loadAndShowUserFreeOffer(userMeta.userFreeOffer);
  }
}

function drawOfferIfNeeded () {
  if (!document) {
    return;
  }

  if (typeof window.getCurrentUserMeta !== 'function') {
    return;
  }
  addListenerMulti(document, 'mousemove touchmove', function(){
    if (!startedCustomOfferLoad) {
      return window.getCurrentUserMeta(getOfferDataAndCheckOffers);
    }
  });
}
drawOfferIfNeeded();

var startedGracePeriodLoad = false;

function loadAndCallJsFunction (gradePeriodData) {
  if (typeof window.loadJsScript === 'function') {
    var url = 'https://cdn.renderforest.com/common/custom-offers/1.0.30/bundle.min.js';
    startedGracePeriodLoad = true;
    return window.loadJsScript(url)
      .then(() => {
        if (typeof window.loadGracePeriodPopup === 'function') {
          var payload = {
            title: gradePeriodData.title,
            buttonUrl: window.langStr + '/profile/subscription/' + gradePeriodData.id + '/update-billing'
          };
          return window.loadGracePeriodPopup(payload);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
}

function loadAndCallYooKassaConfirmation (data) {
  if (typeof window.loadJsScript === 'function') {
    var url = 'https://cdn.renderforest.com/common/custom-offers/1.0.30/bundle.min.js';
    startedGracePeriodLoad = true;
    return window.loadJsScript(url)
      .then(() => {
        if (typeof window.loadYooKassaPaymentConfirmationPopup === 'function') {
          return window.loadYooKassaPaymentConfirmationPopup(data);
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
}

function getGracePeriodDataAndCheck (error, userMeta) {
  if (error) {
      console.log('loadAndCallJsFunction: error', {error});
    }
    if (!userMeta) {
      return;
    }
  if (userMeta.tariffInPaddleGracePeriod && userMeta.tariffInPaddleGracePeriod.id) {
    loadAndCallJsFunction(userMeta.tariffInPaddleGracePeriod);
  }
  if (userMeta.yooKassaPaymentConfirmationData) {
    loadAndCallYooKassaConfirmation(userMeta.yooKassaPaymentConfirmationData);
  }
}

function drawGracePeriodPopupIfNeeded () {
  if (!document || typeof window.getCurrentUserMeta !== 'function') {
    return;
  }
  addListenerMulti(document, 'mousemove touchmove', function(){
    if (!startedGracePeriodLoad) {
      return window.getCurrentUserMeta(getGracePeriodDataAndCheck);
    }
  });
}
drawGracePeriodPopupIfNeeded();

window.__brazeInitDelay = 5;
window.BRAZE_SDK_API_KEY = "d5a44f40-441c-4217-8675-e57ccd8d1a1a";
window.BRAZE_SDK_ENDPOINT = "sdk.fra-02.braze.eu";
window.BRAZE_PAGE_VIEW_URLS = ["/business-name-generator","/logo-maker"];

window.startedBrazeLoad = window.startedBrazeLoad || false;
function loadBraze () {
  if (typeof window.loadJsScript === 'function') {
    var url = '/javascripts/braze.1.0.4.js';
    window.startedBrazeLoad = true;
    return window.loadJsScript(url)
      .then(() => {
        if (typeof window.initBraze === 'function') {
          return window.initBraze();
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
}

if (typeof window.addListenerMulti === 'function') {
  window.addListenerMulti(document, 'mousemove touchmove', function(){
    if (!startedBrazeLoad) {
      return loadBraze();
    }
  });
}

window.sendBrazeCustomEvent = function(payload, retryCount) {
  var _retryCount = retryCount || 0;
  if (window.isBrazeInitialized) {
    if (window.braze && window.braze.logCustomEvent) {
      window.braze.logCustomEvent(payload.eventName, payload.eventData);
    }
  } else {
    if(_retryCount > 3) {
      return;
    }
    setTimeout(function(){
      window.sendBrazeCustomEvent(payload, _retryCount+1);
    }, 2000);
  }
};