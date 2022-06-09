import Settings from 'models/Settings';

describe('models/Settings', () => {

  function mockAuthClient(baseUrl) {
    const authClient = {
      options: {},
      http: {
        setRequestHeader: () => {}
      },
      getIssuerOrigin: () => baseUrl
    };
    return authClient;
  }

  describe('baseUrl', () => {
    it('cannot create settings without a baseUrl', () => {
      const fn = () => {
        return new Settings();
      };
      expect(fn).toThrowError('"baseUrl" is a required widget parameter');
    });
    it('accepts a baseUrl option and sets it in the model', () => {
      const baseUrl = 'http://foo';
      const settings = new Settings({ baseUrl });
      expect(settings.get('baseUrl')).toBe(baseUrl);
    });
    it('baseUrl can be inferred from issuer option', () => {
      const baseUrl = 'http://foo';
      const issuer = `${baseUrl}/oauth2/default`;
      const settings = new Settings({ issuer });
      expect(settings.get('baseUrl')).toBe(baseUrl);
    });
    it('baseUrl can be inferred from authClient issuer', () => {
      const baseUrl = 'http://foo';
      const authClient = mockAuthClient(baseUrl);
      const settings = new Settings({ authClient });
      expect(settings.get('baseUrl')).toBe(baseUrl);
    });
  });

  describe('authClient', () => {
    let testContext;
    beforeEach(() => {
      const baseUrl = 'http://foo';
      const authClient = mockAuthClient(baseUrl);
      testContext = {
        authClient,
        baseUrl
      };
    });

    it('can create settings without an authClient', () => {
      const { baseUrl } = testContext;
      const fn = () => {
        return new Settings({ baseUrl });
      };
      expect(fn).not.toThrow();
    });
    it('accepts an authClient option and sets it in the model', () => {
      const { authClient } = testContext;
      const settings = new Settings({ authClient });
      expect(settings.get('authClient')).toBe(authClient);
    });
    it('exposes authClient on the getAuthClient() method', () => {
      const { authClient } = testContext;
      const settings = new Settings({ authClient });
      expect(settings.getAuthClient()).toBe(authClient);
    });
    it('can set authClient using the setAuthClient() method', () => {
      const { authClient, baseUrl } = testContext;
      const settings = new Settings({ baseUrl });
      settings.setAuthClient(authClient);
      expect(settings.getAuthClient()).toBe(authClient);
      expect(settings.get('authClient')).toBe(authClient);
    });
  });

  describe('languageCode', () => {
    const setup = (mock=[], options) => {
      const spy = jest.spyOn(navigator, 'languages', 'get').mockImplementation(() => mock);
      const config = {baseUrl: 'http://foo', ...options};
      const settings = new Settings(config);
      return { spy, settings };
    };

    it('defaults to `en` when navigator returns empty array', () => {
      const { spy, settings } = setup([]);
      expect(settings.get('languageCode')).toEqual('en');
      expect(spy).toHaveBeenCalled();
    });

    it('returns `fr` when navigator returns `fr-FR`', () => {
      const { spy, settings } = setup(['fr-FR']);
      expect(settings.get('languageCode')).toEqual('fr');
      expect(spy).toHaveBeenCalled();
    });

    it('returns `fr` when navigator returns `fr`', () => {
      const { spy, settings } = setup(['fr']);
      expect(settings.get('languageCode')).toEqual('fr');
      expect(spy).toHaveBeenCalled();
    });

    it('returns `fr` when navigator returns `FR`', () => {
      const { spy, settings } = setup(['FR']);
      expect(settings.get('languageCode')).toEqual('fr');
      expect(spy).toHaveBeenCalled();
    });

    it('returns `fr` when navigator returns `FR-FR`', () => {
      const { spy, settings } = setup(['FR-FR']);
      expect(settings.get('languageCode')).toEqual('fr');
      expect(spy).toHaveBeenCalled();
    });

    it('returns configured language (via string)', () => {
      const { spy, settings } = setup(['en-US'], {language: 'fr'});
      expect(settings.get('languageCode')).toEqual('fr');
      expect(spy).toHaveBeenCalled();
    });

    it('returns configured language (via function)', () => {
      const { spy, settings } = setup(['en-US'], {language: () => 'fr'});
      expect(settings.get('languageCode')).toEqual('fr');
      expect(spy).toHaveBeenCalled();
    });

    it('returns unlisted configured language (via string)', () => {
      const { spy, settings } = setup(['en-US'], {language: 'fr-FR'});
      expect(settings.get('languageCode')).toEqual('fr-FR');
      expect(spy).toHaveBeenCalled();
    });

    // TODO: OKTA-491150 - special case, explicitly test Dutch (nl)
    it('special case: returns `nl-NL` when navigator returns `nl`', () => {
      const { spy, settings } = setup(['nl']);
      expect(settings.get('languageCode')).toEqual('nl-NL');
      expect(spy).toHaveBeenCalled();
    });

    // TODO: OKTA-491150 - special case, explicitly test Portuguese (pt)
    it('special case: returns `pt-BR` when navigator returns `pt`', () => {
      const { spy, settings } = setup(['pt']);
      expect(settings.get('languageCode')).toEqual('pt-BR');
      expect(spy).toHaveBeenCalled();
    });
  });
});