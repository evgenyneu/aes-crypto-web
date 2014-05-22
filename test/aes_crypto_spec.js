(function() {
  'use strict';

  describe('AES Crypto', function() {
    it('ecrypts', function(){
      var result = aesCrypto.encrypt('Some text 日本', 'My password 日本');
      expect(result.indexOf('AESCryptoV10')).toEqual(0);
    });

    it('descrypts', function(){
      var result = aesCrypto.decrypt('AESCryptoV108f46e2fb15f50e9c170442ec5ec70e6fcded6378b13f1a659f0eb65e8eddb2335de8e76be90b2f0a', 'test');
      expect(result).toEqual('My Test Message 日本');
    });

    it('encrypts and decypts', function(){
      var ecrypted = aesCrypto.encrypt('Some text 日本', 'My password 日本');
      var decrypted = aesCrypto.decrypt(ecrypted, 'My password 日本');
      expect(decrypted).toEqual('Some text 日本');
    });
  });

})(this);