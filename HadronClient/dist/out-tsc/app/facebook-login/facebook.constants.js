var FacebookConstants = (function () {
    function FacebookConstants() {
    }
    return FacebookConstants;
}());
export { FacebookConstants };
FacebookConstants.FACEBOOK_CONFIGURATION = {
    appId: '380793868955124',
    cookie: false,
    xfbml: true,
    version: 'v2.8'
};
FacebookConstants.FACEBOOK_SCOPE = {
    scope: 'email'
};
FacebookConstants.FACEBOOK_API_URL = '/me?fields=email';
//Facebook connection statuss
FacebookConstants.CONNECTED = 'connected';
FacebookConstants.UNAUTHORIZED = 'not_authorized';
//# sourceMappingURL=C:/Clone/tsc/Hadron/HadronClient/src/app/facebook-login/facebook.constants.js.map